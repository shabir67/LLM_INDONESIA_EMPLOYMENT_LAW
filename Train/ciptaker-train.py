import os
import math
import torch
import argparse

from accelerate import Accelerator

from transformers import (
    TrainingArguments,
    AutoModelForCausalLM,
    AutoTokenizer,
    set_seed,
)
from peft import (
    LoraConfig,
    get_peft_model,
)
from datasets import load_from_disk
from trl import SFTTrainer

seed = 42
set_seed(seed)

def create_peft_config():
    """
    Create Parameter-Efficient Fine-Tuning config for your model
    :param modules: Names of the modules to apply Lora to
    """
    target_modules = [
        "q_proj",
        "v_proj",
    ]

    config = LoraConfig(
        r=128,
        lora_alpha=256,  # -> 2*r
        target_modules=target_modules,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM"
    )

    return config


def print_trainable_parameters(model):
    """
    Prints the number of trainable parameters in the model.
    """
    trainable_params = 0
    all_param = 0
    for _, param in model.named_parameters():
        all_param += param.numel()
        if param.requires_grad:
            trainable_params += param.numel()
    print(
        f"trainable params: {trainable_params} || all params: {all_param} || trainable%: {100 * trainable_params / all_param}"
    )


def train(model, tokenizer, train_data, output_dir, max_seq_length):
    if torch.cuda.device_count() > 1:  # If more than 1 GPU
        model.is_parallelizable = True
        model.model_parallel = True

    # 1 - Enabling gradient checkpointing to reduce memory usage during fine-tuning
    # model.enable_input_require_grads()  # required for gradient checkpointing
    # model.gradient_checkpointing_enable()

    # 2 - Using the prepare_model_for_kbit_training method from PEFT
    # model = prepare_model_for_kbit_training(model)

    # Create PEFT config for these modules and wrap the model to PEFT
    peft_config = create_peft_config()
    model = get_peft_model(model, peft_config)
    # Print information about the percentage of trainable parameters
    print_trainable_parameters(model)

    accelerator = Accelerator()
    # Training parameters
    trainer = accelerator.prepare(
        SFTTrainer(
            model=model,
            train_dataset=train_data,
            dataset_text_field = "text",
            max_seq_length=max_seq_length,
            tokenizer=tokenizer,
            packing=False,
            args=TrainingArguments(
                per_device_train_batch_size=1,
                gradient_accumulation_steps=4,
                #warmup_steps=0.03,
                save_steps=300,
                num_train_epochs=24,
                learning_rate=2e-5,
                bf16=True,
                logging_steps=5,
                output_dir=output_dir,
                report_to="wandb",
            ),
        )
    )

    model.config.use_cache = (
        False  # re-enable for inference to speed up predictions for similar inputs
    )

    do_train = True

    if do_train:
        print("*** Training ***")
        train_result = trainer.train()
        metrics = train_result.metrics
        trainer.log_metrics("train", metrics)
        trainer.save_metrics("train", metrics)
        trainer.save_state()

    do_eval = False

    if do_eval:
        print("*** Evaluate ***")
        metrics = trainer.evaluate()
        try:
            perplexity = math.exp(metrics["eval_loss"])
        except OverflowError:
            perplexity = float("inf")
        metrics["perplexity"] = perplexity

        trainer.log_metrics("eval", metrics)
        trainer.save_metrics("eval", metrics)

    print("Saving last checkpoint of the model...")
    os.makedirs(output_dir, exist_ok=True)
    trainer.save_model(output_dir)

    # Free memory for merging weights
    del model
    del trainer
    torch.cuda.empty_cache()


def load_model(model_name):
    n_gpus = torch.cuda.device_count()
    device_map = "auto"
    max_memory = {i: f"{24000}MB" for i in range(n_gpus)}

    if os.environ.get("LOCAL_RANK") is not None:
        local_rank = int(os.environ.get("LOCAL_RANK", "0"))
        device_map = {"": local_rank}
        max_memory = {"": max_memory[local_rank]}

    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        device_map=device_map,
        max_memory=max_memory,
        torch_dtype=torch.bfloat16,
        use_cache=False,
        attn_implementation="flash_attention_2",
    )

    tokenizer = AutoTokenizer.from_pretrained(
        model_name,
        #model_max_length=32768,
        #pad_to_multiple_of=8192,
    )

    tokenizer.padding_side = "right"
    tokenizer.pad_token = tokenizer.eos_token
    model.config.pad_token_id = tokenizer.pad_token_id

    special_tokens_dict = dict()
    special_tokens_dict["pad_token"] = tokenizer.eos_token
    special_tokens_dict["eos_token"] = tokenizer.eos_token
    special_tokens_dict["bos_token"] = tokenizer.bos_token
    special_tokens_dict["unk_token"] = tokenizer.unk_token

    tokenizer.add_special_tokens(special_tokens_dict)

    return model, tokenizer


parser = argparse.ArgumentParser()
parser.add_argument(
    "--output_dir", help="path to the output directory", required=True, type=str
)
parser.add_argument(
    "--dataset_dir",
    help="path to the train dataset directory",
    default=None,
    type=str,
)
args = parser.parse_args()

os.environ["WANDB_PROJECT"] = "MistralCiptaker_v0.2_SFT"
os.environ["WANDB_LOG_MODEL"] = "false"
os.environ["WANDB_WATCH"] = "false"

if __name__ == "__main__":
    max_length = 8192
    base_model_id = "sarahlintang/mistral-indo-7b"
    model, tokenizer = load_model(base_model_id)

    train_dataset = load_from_disk(args.dataset_dir)
    train(model, tokenizer, train_dataset, args.output_dir, max_length)