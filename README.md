# ClearPath AI Support Assistant

This project is a production-style Retrieval Augmented Generation (RAG) support chatbot built for the ClearPath product. It answers user questions using official documentation, routes queries intelligently, prevents hallucinations, and maintains conversational context.

The system is designed to be reliable, cost-efficient, and scalable.

---

## Overview

The chatbot:

- Answers ClearPath support questions using documentation
- Uses intelligent routing to select the appropriate LLM
- Retrieves relevant context using vector search
- Maintains conversation memory across turns
- Prevents hallucinations for unsupported features
- Includes an evaluation harness for automated testing

---

## Tech Stack

### Backend

- Node.js + Express
- Groq LLM API
- Vector retrieval (RAG pipeline)
- Custom routing & evaluation logic

### Frontend

- React (chat interface)
- Fetch API for backend communication

### Deployment

- Frontend: Vercel
- Backend: Render / Railway / Vercel serverless functions

---

## Groq Models Used

The router selects models based on query complexity:

### llama-3.1-8b-instant

Used for simple queries.

- Fast response time
- Cost efficient

### llama-3.3-70b-versatile

Used for complex queries.

- Better reasoning
- Handles troubleshooting and multi-step questions

---

## Environment Configuration

Create a `.env` file inside the **backend** folder:

```
GROQ_API_KEY=your_groq_api_key_here
```

---

## How to Run the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/clearpath-chatbot.git
cd clearpath-chatbot
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Load documentation into vector store

Start the server:

```bash
node server.js
```

Then open in browser:

```
http://localhost:5000/load
```

This parses PDFs and prepares retrieval embeddings.

### 4. Start backend server

If not already running:

```bash
node server.js
```

Server runs at:

```
http://localhost:5000
```

### 5. Install frontend dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 6. Start React frontend

```bash
npm start
```

Open:

```
http://localhost:3000
```

The chatbot UI will now connect to the backend.

---

## API Endpoints

### Chat

```
GET /chat?q=your_question&session=session_id
```

### Vector Search

```
GET /search?q=your_question
```

### Load Documents

```
GET /load
```

---

## Bonus Challenges Implemented

### Conversation Memory

The chatbot maintains short-term memory across turns.

**Implementation**

- Stores user & bot messages per session
- Injects the last 4 turns into the prompt
- Improves follow-up understanding
- Controls token cost

**Example**

- User: How do I invite team members?
- User: What roles can I assign?
- → The bot understands context without repeating information.

### Evaluation Harness

An automated evaluation suite tests correctness and hallucination safety.

Run evaluation:

```bash
cd backend
node eval/runEval.js
```

The harness verifies:

- factual accuracy
- hallucination prevention
- unknown feature handling
- troubleshooting answers

Example output:

```
Passed: 10/10
```

### Hallucination Prevention Layer

The system blocks unsupported or fictional features such as:

- cryptocurrency payments
- Mars mission
- quantum AI engine
- task syncing issues (not documented)
- developer code requests

Instead it returns:

> The documentation does not mention this feature.  
> Please contact support for confirmation.

### Intelligent Query Routing

Queries are classified as:

- **Greeting** → instant response
- **Simple** → small model
- **Complex** → large model

This improves accuracy while reducing cost.

### Planned Deployment (Vercel)

**Frontend**

- Deploy React app on Vercel

**Backend**

- Deploy Express API as serverless functions
- Store environment variables securely
- Update frontend API base URL

---

## Testing the System

### Greeting

```
hi
```

### Simple Queries

- How do I invite team members?
- What roles can I assign?
- Tell me about pricing
- Is my data secure?

### Complex Queries

- Explain workflows and permissions
- How do I migrate from Jira and manage roles?
- I cannot log in

### Memory Test

- How do I invite team members?
- What roles can I assign?

### Hallucination Safety

- Does Clearpath support crypto?
- Tell me about Clearpath Mars mission
- Why are my tasks not syncing?

---

## Known Issues & Limitations

### 1. Limited to Documentation Coverage

If the documentation does not contain an answer, the bot cannot provide actionable guidance.

### 2. Retrieval Sensitivity

Vector retrieval may occasionally return partially relevant chunks when documentation sections overlap.

### 3. Rate Limits (Groq Free Tier)

Heavy testing may trigger rate limits. The system includes retry logic, but high-volume usage may require upgrading the API tier.

### 4. Short-Term Memory Only

The system retains recent context but does not maintain long-term user history.

---

## Project Design Priorities

This system was designed to:

- prevent hallucinations
- maintain factual accuracy
- provide production-grade reliability
- optimize cost and latency
- ensure safe fallback responses

---

## Author

**Harshita Hirawat**  
BSc Computer Science, BITS Pilani  
AI & Full Stack Developer