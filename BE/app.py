import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, GenerationConfig
from flask import Flask, request, jsonify
import threading
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer  # Assuming this is used for embeddings
import pdfplumber

# Load model and tokenizer
model_id = "Willy030125/CiptakerLM-v1"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)
sentence_transformer = SentenceTransformer('all-MiniLM-L6-v2')  # Assuming this model for sentence embeddings

# Load the PDF content
pdf_path = "../Data/Bab IV UU Ketenagakerjaan.pdf"
with pdfplumber.open(pdf_path) as pdf:
    CONTEXT = ""
    for page in pdf.pages:
        CONTEXT += page.extract_text()

# Cosine similarity threshold
THRESHOLD = 0.5

# Function to create the instruction prompt
def create_instruction(instruction):
    return f"### Human: {instruction} ### Assistant: "

# Function to generate text from the model
def generate(
    instruction,
    max_new_tokens=2048,
    temperature=0.1,
    top_p=0.95,
    top_k=40,
    num_beams=4,
    **kwargs
):
    prompt = create_instruction(instruction)
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(
        inputs.input_ids,
        max_new_tokens=max_new_tokens,
        temperature=temperature,
        top_p=top_p,
        top_k=top_k,
        num_beams=num_beams,
        **kwargs
    )
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return generated_text

# Method to answer a query based on cosine similarity
def answer_query(question: str) -> str:
    """
    Answer the question based on similarity with the PDF content.
    """
    question_emb = sentence_transformer.encode([question])
    context_emb = sentence_transformer.encode([CONTEXT])

    similarity_score = cosine_similarity(question_emb, context_emb)[0][0]

    if similarity_score < THRESHOLD:
        return "Maaf tapi untuk percakapan ini saya hanya bisa menjawab pertanyaan terkait UU cipta kerja!"

    # Generate answer from the model
    answer = generate(question)
    return answer

# Initialize Flask app
app = Flask(__name__)

@app.route("/generate", methods=["POST"])
def generate_text():
    try:
        input_data = request.json
        prompt = input_data.get("prompt", "")
        generated_output = generate(prompt)
        return jsonify({"generated_text": generated_output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/answer", methods=["POST"])
def answer_text():
    try:
        input_data = request.json
        question = input_data.get("question", "")
        answer = answer_query(question)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def run_flask():
    app.run(host='0.0.0.0', port=5000, use_reloader=False)

# Start Flask in a background thread
if __name__ == "__main__":
    flask_thread = threading.Thread(target=run_flask)
    flask_thread.start()
