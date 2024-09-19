# LLM_Ciptaker (Final Project NLP Indonesia AI)

## Beta Demo
![ezgif-2-0c6c76e073](https://github.com/user-attachments/assets/9490d98f-56b2-46ca-9348-a51ae2c20893)

## Data Source:
- Raw dataset (PDF): [RUU Cipta Kerja](https://ekon.go.id/source/info_sektoral/RUU%20Cipta%20Kerja.pdf)
- QA-Generated pairs: <a href="https://github.com/Willy030125/LLM_Ciptaker/blob/main/Notebook/Ciptaker-sft-data-preparation.ipynb">SFT data prep Notebook</a>

## Train Fine-Tune LLM (with LoRA) (shout out to @Willy030125):
- Model base: "sarahlintang/mistral-indo-7b"
- Fine Tuned model: https://huggingface.co/Willy030125/CiptakerLM-v1

## Retrieval Augmented Generation (RAG) testing:
- RAG model: "llama3.1"
- Embedding model: "nomic-embed-text"
- RAG library: LangChain with Unstructured PDF Loader
- Notebook: <a href="https://github.com/Willy030125/LLM_Ciptaker/blob/main/Notebook/Ciptaker-llama-RAG-langchain-unstructured.ipynb">here</a>

## Frontend
- Pre-requisites: Node version v20.17.0

### Quick Run:
```bash
cd FE
npm install
npm start
```
### Full Deployment:
#### Auto: Recreate the repo for FE files and host on Vercel.
#### Manual:
```bash
cd FE
npm install -g serve
serve -s build
```
## Backend
To run the backend:
```bash
cd BE
python app.py
```
If hosted on a different PC, you may need a public IP or tunneling.
Read more about tunneling here:
- [Ngrok - Getting Started](https://ngrok.com/docs/getting-started/)

## Notebook
- Ready to be run on Google Colab.
To localize the pip freeze for each notebook, paste it into requirements.txt.
For the complete guide (recommended to use Conda):
- [Setting up a Conda environment in less than 5 minutes](https://medium.com/swlh/setting-up-a-conda-environment-in-less-than-5-minutes-e64d8fc338e4)

## Evaluation
### RAG:
- Cosine similarity: 0.40
### Fine-Tuning LLM:
- Perplexity: 1.0561115741729736
- ROUGE: 0.7134693037488239
- BLEU: 0.6164010763168335
