# RAG-AGENT

## ✨ Key Features

### 📄 Document Intelligence
- **Multi-format Support**: Upload documents (PDF, DOCX, TXT, MD)
- **Instant Summarization**: Receive AI-generated summaries upon upload
- **Contextual Q&A**: Ask questions based on uploaded content
- **Smart Extraction**: Advanced text processing and chunking

### 🔍 Hybrid Document + Web Search
When you ask a question after uploading a document:

1. 🎯 **Document Context**: Locates relevant snippets in your uploaded documents
2. 🌐 **Real-time Web Search**: Performs live web search for current information
3. 🧠 **Intelligent Synthesis**: Returns a comprehensive 3-part response:
   - 🔗 Relevant web links with summaries
   - 📄 Matching document excerpts
   - 💡 AI-generated answer combining both sources

### 🌐 Website Summarization
- **URL Analysis**: Paste any URL for instant content summarization
- **Structured Output**: Clear, organized summaries with key points
- **Content Extraction**: Smart parsing of web content

### 💬 Smart Chat (Advanced Mode)
- **Enhanced Capabilities**: Outperforms standard chatbots in real-world scenarios
- **Real-time Information**: Access to current events, people, and concepts
- **Context Awareness**: Maintains conversation flow and memory
- **Multi-source Responses**: Combines web search with AI reasoning

### 🧠 Persistent Memory System
- **Conversation Storage**: All chats saved in Supabase database
- **Thread Management**: Create and continue multiple conversation threads
- **Document Persistence**: Uploaded documents remain accessible across sessions
- **Search History**: Track and revisit previous queries

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 (React) | Modern, responsive UI with server-side rendering |
| **Backend** | Flask (Python) | High-performance async API with CORS support |
| **Database** | Supabase (PostgreSQL) | Real-time database with built-in auth |
| **AI Engine** | OpenAI GPT-4 / Google Gemini | Advanced language model integration |
| **Web Search** | Serper API / NewsAPI | Real-time web search capabilities |
| **Vector Store** | FAISS / Sentence Transformers | Efficient document embedding storage |
| **Deployment** | Vercel + Cloud Platforms | Scalable, global deployment |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn
- Git

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Likhith623/advanced-rag-agent.git
cd advanced-rag-agent
```

### 2️⃣ Backend Setup (Flask)
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section)

# Start the backend server
python main.py
```

### 3️⃣ Frontend Setup (Next.js)
```bash
# Navigate to frontend directory (new terminal)
cd front_end

# Install dependencies
npm install
# or
yarn install

# Create environment file
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Start the development server
npm run dev
# or
yarn dev
```

### 4️⃣ Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

---

## 🔐 Environment Variables

### Backend `.env`
```env
# Database
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# AI APIs
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_google_gemini_key

# Web Search
SERPER_API_KEY=your_serper_api_key
NEWS_API_KEY=your_newsapi_key

# Application
DEBUG=true
LOG_LEVEL=info
PORT=8080
```

### Frontend `.env.local`
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application
NEXT_PUBLIC_APP_NAME=Advanced RAG Agent
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 🔑 Getting API Keys

<details>
<summary>Click to expand API key setup instructions</summary>

**Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy URL and anon key from Settings > API

**OpenAI**
1. Visit [platform.openai.com](https://platform.openai.com)
2. Create account and add billing
3. Generate API key in API Keys section

**Google Gemini**
1. Go to [ai.google.dev](https://ai.google.dev)
2. Get API key for Gemini Pro

**Serper (Web Search)**
1. Visit [serper.dev](https://serper.dev)
2. Sign up for free tier
3. Copy API key from dashboard

**NewsAPI**
1. Go to [newsapi.org](https://newsapi.org)
2. Register for free account
3. Get your API key

</details>

---

## 📂 Project Structure

```
advanced-rag-agent/
├── 📁 front_end/              # Next.js frontend
│   ├── 📁 app/                # App Router (Next.js 13+)
│   │   ├── 📄 layout.js       # Root layout
│   │   ├── 📄 page.js         # Main chat interface
│   │   └── 📄 globals.css     # Global styles
│   ├── 📁 components/         # React components
│   ├── 📁 lib/                # Utility libraries
│   ├── 📄 package.json        # Node dependencies
│   ├── 📄 next.config.mjs     # Next.js configuration
│   └── 📄 .env.local.example  # Environment template
├── 📄 main.py                 # Flask backend entry point
├── 📄 requirements.txt        # Python dependencies
├── 📁 uploads/                # File upload directory
├── 📄 comprehensive_news_knowledge.txt # Knowledge base
├── 📄 .env.example            # Environment template
├── 📄 .gitignore             # Git ignore rules
├── 📄 README.md              # This file
└── 📄 LICENSE                # MIT License
```

---

## 🎯 Usage Examples

### Document Upload and Query
```python
# 1. Upload a research paper
POST /upload
- file: research_paper.pdf
- conversation_id: conv_123

# 2. Ask questions about the document
POST /api/news
{
  "query": "What are the main findings in this research?",
  "user_email": "user@example.com",
  "conversation_id": "conv_123"
}

# Response includes:
# - Document context from uploaded PDF
# - Related web search results
# - AI-synthesized answer
```

### Web-Only Search
```python
POST /api/news
{
  "query": "latest developments in quantum computing",
  "user_email": "user@example.com"
}
```

### URL Summarization
```python
POST /api/news
{
  "query": "https://example.com/article",
  "user_email": "user@example.com"
}
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd front_end
vercel --prod

# Set environment variables in Vercel dashboard
```

### Backend (Railway/Render/Heroku)
```bash
# For Railway
railway login
railway init
railway up

# For Render
# Connect your GitHub repo and deploy

# For Google Cloud Run
gcloud run deploy advanced-rag-agent \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Docker Deployment
```dockerfile
# Dockerfile for backend
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["python", "main.py"]
```

---

## 🧪 Testing

### Backend Health Check
```bash
curl http://localhost:8080/health
```

### Frontend Development
```bash
cd front_end
npm run test        # Run unit tests
npm run build       # Production build
npm run lint        # Code linting
```

---

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **Python**: Follow PEP 8, use Black formatter
- **JavaScript**: Follow ESLint rules, use Prettier
- **Commits**: Use conventional commit messages

---


## 🐛 Troubleshooting

<details>
<summary>Common Issues and Solutions</summary>

**Backend won't start**
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check environment variables
cat .env
```

**Frontend build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

**Database connection issues**
- Verify Supabase URL and key
- Check network connectivity
- Ensure database is not paused

**File upload issues**
- Check file size limits
- Verify supported file formats
- Ensure uploads/ directory exists

</details>

---


## 👨‍💻 Author

**Likhith Vasireddy**
- GitHub: [@Likhith623](https://github.com/Likhith623)


---


<div align="center">

**⭐ Star this repository if you find it helpful!**
