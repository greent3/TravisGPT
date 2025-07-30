# TravisGPT — Full Stack OpenAI Chatbot

Full-stack RAG-supplemented chatbot application powered by FastAPI (backend), React + Vite + MUI (frontend), and the OpenAI API.

---

## 📦 Project Structure

<pre lang="md">```
├── backend/ # FAST API Backend  
│  ├── server.py  
│  ├── api/  
│  ├── chroma/ # vector DB generated on startup  
│  ├── collection  
│  ├── requirements.txt  
│  ├── .env.example  
│  ├── dockerfile  
│  └── ...  
├── frontend/ # React frontend (Vite + MUI)  
│  ├── src/  
│  ├── .env.example  
│  ├── dockerfile  
│  ├── vite.config.js  
│  └── ...  
├── docker-compose.yml # Runs both frontend and backend
``` </pre>

## 🚀 Quick Start

### 1. Clone the Repository

git clone <https://github.com/greent3/travisgpt.git>  
  
cd travisgpt

### 2. Add your own env variables to .env.example files and rename to .env

### 3. Generate the images, and run the app

docker compose up --build
