# written_answers.md

## Q1 — Routing Logic

**What rules does the router use?**  
My router classifies queries using keyword intent detection, query length, and structure.

- **Greeting** → if query contains greetings like *hi, hello, hey, good morning*  
- **Complex** → if query contains troubleshooting or conceptual terms such as:
  - error, failed, issue, why, explain, troubleshoot
  - workflow, permissions, integrations
  - multiple intents joined by **“and”**
  - more than ~12 words  
- **Simple** → factual or direct lookup queries (default)

**Why draw the boundary here?**  
Simple queries usually require direct factual retrieval (e.g., pricing, inviting team members).  
Complex queries require reasoning across documentation and context (e.g., troubleshooting or explaining workflows).  

Routing complex queries to a larger model improves accuracy while keeping costs low for straightforward queries.

**Example misclassification**  
Query: *“good orning”*  
This was classified as **simple** instead of greeting because the greeting detector uses exact substring matching and missed the typo.

**How would I improve it without using an LLM?**  
- Add fuzzy matching (Levenshtein distance) to detect misspelled greetings.  
- Expand keyword synonyms (e.g., cost → pricing).  
- Log misclassified queries and refine keyword rules iteratively.  

---

## Q2 — Retrieval Failures

One failure occurred with the query:

**“How do workflows help teams collaborate?”**

**What happened:**  
The retriever returned chunks describing workflow setup steps instead of collaboration benefits.

**Why retrieval failed:**  
Vector similarity matched keywords like *workflow* and *states*, but missed the intent behind “collaborate.” The documentation mainly explains configuration rather than teamwork outcomes.

**Another realistic failure case:**  
Query: *“Can viewers edit tasks?”*  
Some retrieved chunks described permissions broadly but did not explicitly state viewer limitations, resulting in vague answers.

**Root cause:**  
- Embeddings favor lexical similarity over nuanced intent.  
- Overlapping language between workflow and permissions sections creates noise.

**What would fix it?**
1. Query expansion (collaborate → teamwork, assignments, automation).  
2. Metadata filtering to prioritize role-related chunks.  
3. Lightweight re-ranking using keyword scoring.

These improvements would increase relevance without requiring heavier models.

---

## Q3 — Cost and Scale

Assuming the system handles **5,000 queries/day**:

### Routing distribution (observed)
- 70% simple → llama-3.1-8b  
- 30% complex → llama-3.3-70b  

### Estimated token usage

**Simple queries**  
~450 tokens per request  
3500 × 450 ≈ **1.58M tokens/day**

**Complex queries**  
~900 tokens per request  
1500 × 900 ≈ **1.35M tokens/day**

**Total ≈ 2.9M tokens/day**

### Biggest cost driver
Complex queries use nearly the same total tokens as simple ones despite being fewer. The large model is the main cost driver.

### Highest-ROI cost reduction
Reduce context size before prompting.  
Limiting retrieved chunks from 5 → 3 and trimming long passages could reduce token usage by ~25% without harming accuracy.

### Optimization I would avoid
I would not remove the large model for complex queries. This would reduce cost but significantly degrade troubleshooting and conceptual answers, lowering user trust.

---

## Q4 — What Is Broken

The most significant limitation is **dependence on documentation coverage**.

If documentation lacks explicit guidance (e.g., task syncing issues), the system cannot provide actionable help and must return a fallback response.

I shipped with this limitation because the project prioritized **hallucination prevention and factual accuracy**. Providing unverified advice could mislead users. However, this creates a usability gap: real support systems must still guide users when documentation is incomplete.

**If I had more time, the single best fix would be:**

Implement a **tiered fallback response strategy**:

1. Provide related troubleshooting steps from nearby topics.  
2. Offer safe best-practice suggestions.  
3. Provide clear escalation steps (support contact, logs to collect).  

This would maintain factual integrity while improving real-world usefulness.

---

## AI Usage

I used an AI assistant (ChatGPT) during development as a debugging partner and technical reference, similar to using documentation or StackOverflow. It helped clarify architecture decisions, debug errors, and improve reliability. All implementation decisions, testing, and final validation were completed manually.

Below are the exact prompts used.

### Architecture & Setup
> Help me design a RAG-based support chatbot using Node.js and documentation PDFs.  
> Explain a scalable folder structure for retrieval, routing, evaluation, and memory.

### Retrieval & Search
> How do I chunk documents and generate embeddings for semantic search?  
> Why might cosine similarity retrieval return irrelevant chunks?

### Routing Logic
> How can I classify queries as simple vs complex without using an LLM?  
> What keywords indicate conceptual vs FAQ-style questions?

### Conversation Memory
> How can I maintain conversation history while minimizing token usage?  
> What is a simple way to store short-term chat memory in Node.js?

### Prompt & Hallucination Control
> Help me write a prompt that forces answers to use only provided context.  
> How can I return a fallback message when the answer is not in context?

### Evaluation Harness
> How do I build an evaluation harness with pass/fail test cases?  
> What queries detect hallucinations or unsupported features?

### Debugging & Reliability
> Why am I getting Groq rate limit errors and how should I retry safely?  
> How do I fix undefined errors in my evaluation script?

### Deployment & Production Issues
> Why does Vercel show “require is not defined in ES module scope”?  
> How do I deploy an Express backend using Vercel serverless functions?  
> Why am I getting 404 errors after deployment?

### Documentation & Submission
> Help me write a clear README and strong written answers for evaluation.

### Responsible Use
- Used for debugging and technical clarification  
- Used to understand design tradeoffs and best practices  
- Final architecture, evaluation logic, and safeguards were implemented and tested independently  

AI assistance accelerated development, but system behavior, reliability decisions, and testing reflect my own implementation work.