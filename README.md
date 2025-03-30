
# Sentinel Scan
The AI-Powered Content Moderation System is a next-generation, intelligent moderation tool designed to scan and evaluate text, images, and videos before they are uploaded. Using advanced machine learning (ML), natural language processing (NLP), and generative AI, the system ensures that harmful content never goes live, providing a safe and compliant digital environment.


## Installation

Frontend setup   
```sh
cd frontend
npm install 
npm run dev
```
Backend setup
```sh
## Inside Root directory

pip install fastapi uvicorn transformers langchain-google-genai 
pip install langchain-community langchain-huggingface google-generativeai 
pip install pillow python-dotenv  chromadb
pip install pydantic google-genai  langchain_google_genai    
  
```
## 🔹 How It Works  

![frame1](https://github.com/anmolyadav-dev/CleanFeed/blob/main/assets/Frame%201.png?raw=true)

The **AI-Powered Content Moderation System** operates through a structured pipeline that processes and evaluates text, images, and videos before they are uploaded.  

### 1️⃣ Frontend (React.js, Next.js, Tailwind CSS)  
- Users submit content through a web interface.  
- Requests are sent to the **backend** for processing.  

### 2️⃣ Backend (FastAPI, Python)  
- Receives content and forwards it to the **LLM (Large Language Model)** for analysis.  
- Handles communication between the **frontend, database, and models**.  

### 3️⃣ LLM & Specialized Models  
- The system breaks down content into **text, image, and video data**.  
- Each data type is processed using a specialized **LLM**:  
  - 📹 **Video LLM** (for video moderation)  
  - 📝 **Text LLM** (for textual analysis)  
  - 🖼️ **Image LLM** (for image evaluation)  
- **Text Transformation** ensures content is refined before further evaluation.  

### 4️⃣ Database (ChromaDB) & Guidelines  
- The processed data is stored in **ChromaDB**, enabling **similarity searches** for moderation consistency.  
- **Guidelines** (from YouTube, Instagram, X, etc.) are used to fine-tune moderation rules.  
- **Web scraping technologies** (`Selenium`, `BeautifulSoup`) help keep guidelines up to date.  

### 5️⃣ Fine-Tuned Model (Llama, Gemini, Unslloth)  
- The system leverages **fine-tuned models** for improved accuracy in detecting harmful content.  
- Uses **similarity search** to compare new content with flagged data.  

### 6️⃣ Feedback System  
- Generates a **structured output** based on moderation results.  
- Provides insights back to the frontend, allowing users to adjust content before posting.  

This modular approach ensures **real-time, AI-driven moderation** while allowing for **continuous improvement** and adaptation to evolving content policies. 🚀  

![flowchart](https://github.com/anmolyadav-dev/CleanFeed/blob/main/assets/flowchart2.png?raw=true)
## Authors

- [Anmol](https://www.github.com/anmolyadav-dev)
- [Aryan](https://github.com/Booriboorizaimon)
- [Himanshu](https://github.com/Himanshuu2125)
- [Harsh](https://github.com/harsh-a-323)


