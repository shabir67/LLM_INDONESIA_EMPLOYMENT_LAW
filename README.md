# LLM_INDONESIA_EMPLOYMENT_LAW

## Beta Demo
![ezgif-2-0c6c76e073](https://github.com/user-attachments/assets/9490d98f-56b2-46ca-9348-a51ae2c20893)

## Train:
- Raw dataset (PDF): [RUU Cipta Kerja](https://ekon.go.id/source/info_sektoral/RUU%20Cipta%20Kerja.pdf)
- RAG model: "llama3.1"
- Model base: "sarahlintang/mistral-indo-7b"

## FE
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
## BE
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
### Fine-tune:
- BLEU: 0.6164010763168335
- ROUGE: 0.7134693037488239
- Perplexity: 1.0561115741729736# LLM_INDONESIA_EMPLOYMENT_LAW
