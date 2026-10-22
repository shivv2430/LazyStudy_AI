# LazyStudy AI

> **Your notes. Less effort. More learning.**  
> A lightweight, local-first AI study assistant built with open-weight models for the Hacktoberfest Open-Source AI Challenge (Week 3: Slow and Steady).

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available%20Online-indigo?style=for-the-badge&logo=githubpages&logoColor=white)](https://shivv2430.github.io/LazyStudy_AI/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-navy?style=for-the-badge&logo=github&logoColor=white)](https://github.com/shivv2430/LazyStudy_AI)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

🌐 **Live Deployment URL:** [https://shivv2430.github.io/LazyStudy_AI/](https://shivv2430.github.io/LazyStudy_AI/)  
*(Includes instant Demo Mode simulation so reviewers and students can explore all four study tools directly in their browser without installing anything).*

---

## 1. Project Overview

Students frequently spend more hours copying, formatting, and reorganizing their study material than actually engaging in active learning. Existing commercial AI tools often demand expensive recurring subscriptions, gatekeep features behind proprietary API quotas, and transmit private student notes—including unpublished dissertations, assignment drafts, and lecture slides—to remote corporate servers.

**LazyStudy AI** is an open-source, human-centered study companion designed by students, for students. It automates repetitive study preparation by converting unorganized notes into:
1. **Smart Summaries** — Crisp overviews, definitions, and hierarchical markdown bullet points.
2. **Active Recall Flashcards** — Interactive 3D flip cards with self-testing and progress tracking.
3. **Practice Quizzes** — 4-choice multiple-choice questions with post-submission answer rationales.
4. **Quick Revision Plans** — Spaced study sessions with an actionable interactive checklist.

Inference is driven locally via **Ollama**, ensuring complete privacy, zero per-token API charges, and full control over which open-weight model runs on your computer.

---

## 2. Key Features

- **Local-First Privacy:** Notes travel from the browser to your local backend and directly to your local Ollama runner on `127.0.0.1:11434`. No external cloud AI API keys required.
- **Academic Aesthetic:** Calm, distraction-free warm off-white palette (`#FAF8F5`) with deep navy text, readable typography, subtle borders, and zero intrusive animations.
- **Smart Summarization:** Preserves exact terminology, formulas, and causal relationships without hallucinating facts outside your notes.
- **Interactive Flashcards:** Spacebar/click 3D flip card mechanics, arrow-key navigation, card shuffling, mastered progress indicators, and an optional grid view.
- **Practice Quizzes:** 4-option multiple-choice testing that prevents answer spoiling until submitted, followed by detailed explanations of why the correct option holds.
- **Revision Checklists:** Structured into bite-sized study blocks with estimated minutes, core definition tables, and interactive checkmarks.
- **File Upload Support:** Upload `.txt` and `.md` lecture note files (up to 250KB) with instant character and word count calculations.
- **Offline / Demo Mode Toggle:** If you are testing the interface on a machine before downloading a model, a clearly labeled demo mode provides simulated generation so you can explore the UX immediately.
- **Swappable Open-Weight Models:** Change between `qwen2.5:3b`, `gemma2:2b`, or `llama3.2:3b` in `.env` without recompiling the application.

---

## 3. Screenshots

<!-- Screenshots captured during local verification -->
| Study Workspace & Note Input | Smart Summary & Active Flashcards |
| :---: | :---: |
| ![Workspace Preview](https://raw.githubusercontent.com/placeholder/lazystudy-preview1.png) *(Workspace note input and tool selector)* | ![Flashcards Preview](https://raw.githubusercontent.com/placeholder/lazystudy-preview2.png) *(Interactive active-recall 3D flip card)* |

| Practice Quiz with Explanations | Structured Revision Plan Checklist |
| :---: | :---: |
| ![Quiz Preview](https://raw.githubusercontent.com/placeholder/lazystudy-preview3.png) *(Multiple choice options and instant rationale)* | ![Revision Plan Preview](https://raw.githubusercontent.com/placeholder/lazystudy-preview4.png) *(Spaced sessions with interactive completion)* |

---

## 4. Technology Stack

### Frontend:
- **React 18** — Component-driven reactive UI.
- **Vite** — High-speed modern bundler and dev server.
- **Tailwind CSS v3** — Consistent academic design tokens and utility styling.
- **Lucide React** — Minimal, unified icon set.

### Backend:
- **Node.js (v18+) & Express.js** — Lightweight local API gateway.
- **Multer** — In-memory validation for text/markdown uploads.
- **CORS & Dotenv** — Environment configuration and local proxy routing.

### AI Engine:
- **Ollama** — Local open-weight model daemon.
- **Default Recommended Model:** `qwen2.5:3b` (Alibaba Cloud open-weight instruction model; excellent reasoning and strict JSON schema adherence).
- **Alternative Models:** `qwen2.5:1.5b` (ultra-low RAM), `gemma2:2b` (Google open model), `llama3.2:3b` (Meta open-weight model).

---

## 5. Architecture Overview

```
                        ┌──────────────────────────────────────────────┐
                        │              Browser (Client)                │
                        │  React 18 + Vite + Tailwind CSS + Lucide     │
                        └──────────────────────┬───────────────────────┘
                                               │
                                      HTTP /api proxy (:3000 -> :5001)
                                               │
                                               ▼
                        ┌──────────────────────────────────────────────┐
                        │          Local Backend (Express API)         │
                        │  - /api/health                               │
                        │  - /api/study/summary                        │
                        │  - /api/study/flashcards                     │
                        │  - /api/study/quiz                           │
                        │  - /api/study/revision                       │
                        │  - /api/study/upload                         │
                        └──────────────────────┬───────────────────────┘
                                               │
                                       Local HTTP (:11434)
                                               │
                                               ▼
                        ┌──────────────────────────────────────────────┐
                        │            Ollama Local Runner               │
                        │  - Host: 127.0.0.1:11434                     │
                        │  - Model: qwen2.5:3b (or custom model)       │
                        │  - Hardware: On-device CPU/GPU / Metal       │
                        └──────────────────────────────────────────────┘
```

- **Separation of Concerns:** The browser never speaks directly to Ollama. The Node.js backend manages prompt formatting, response validation, code-fence stripping, and JSON parsing.
- **Privacy Boundary:** Server logging is privacy-conscious and does not echo user notes into terminal logs or error traces.

---

## 6. Prerequisites

1. **Node.js:** v18.0.0 or higher (`node -v`)
2. **npm:** v9.0.0 or higher (`npm -v`)
3. **Ollama:** Installed locally on your operating system ([ollama.com](https://ollama.com))

---

## 7. Ollama Installation & Model Setup (macOS)

### Step 1: Install Ollama
On macOS, install via Homebrew:
```bash
brew install ollama
```
*Or download the native macOS app installer from [ollama.com/download](https://ollama.com/download).*

### Step 2: Download and Run the Recommended Model
We recommend **Qwen 2.5 3B** for the best balance of speed, formatting adherence, and memory usage:
```bash
ollama run qwen2.5:3b
```
*(Approx. 1.9 GB download; requires ~4 GB RAM).*

#### Alternative Models for Different Hardware:
- **Low RAM (<8GB system RAM):**
  ```bash
  ollama run qwen2.5:1.5b
  ```
  *(Approx. 1.0 GB download; requires ~2.5 GB RAM).*
- **High Quality Prose & Reasoning:**
  ```bash
  ollama run gemma2:2b
  ```
  *(Approx. 1.6 GB download; requires ~3 GB RAM).*
- **Meta Llama 3.2:**
  ```bash
  ollama run llama3.2:3b
  ```

Once the model has downloaded and you see the interactive prompt, you can press `Ctrl + D` to exit the CLI chat. The Ollama service will remain running in the background.

To verify Ollama is responding:
```bash
curl http://127.0.0.1:11434/api/tags
```

---

## 8. Installation & Quickstart

Clone the repository and enter the directory:
```bash
git clone https://github.com/your-username/lazystudy-ai.git
cd lazystudy-ai
```

### 1. Install All Dependencies
```bash
npm run install:all
```
*(This installs root, backend `server`, and frontend `client` packages).*

### 2. Environment Configuration
Copy the sample environment file into `server/.env`:
```bash
cp .env.example server/.env
```
Default configuration:
```env
PORT=5001
OLLAMA_HOST=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:3b
NODE_ENV=development
```

### 3. Start the Backend Server
In your first terminal tab:
```bash
npm run server
```
Backend will start on `http://localhost:5001`.

### 4. Start the Frontend Client
In your second terminal tab:
```bash
npm run client
```
Frontend will start on `http://localhost:3000`. Open your browser and navigate to `http://localhost:3000`.

---

## 9. Troubleshooting

### 1. "Ollama is not running locally on your computer" (503 Error)
- **Cause:** The Ollama daemon is stopped or blocked by a firewall.
- **Fix:** Run `ollama serve` in your terminal or launch the Ollama macOS menu bar app.
- **Quick Test:** Toggle "Demo Mode" in the top right of the LazyStudy AI workspace to preview full functionality with simulated local data while your model downloads.

### 2. "Local inference timed out after 120s"
- **Cause:** Using an excessively large model (e.g. 14B or 70B) on a CPU with limited compute.
- **Fix:** Update your `server/.env` to use a lighter model like `OLLAMA_MODEL=qwen2.5:1.5b` or `gemma2:2b` and restart the backend.

### 3. Port 5001 or 3000 in use
- **Fix:** Change `PORT=5002` in `server/.env` and adjust the proxy target in `client/vite.config.js`.

---

## 10. Privacy & Technical Limitations

- **Honest Local Guarantee:** When Ollama is running and Demo Mode is disabled, 100% of the inference is computed locally on your machine.
- **No Analytics / Telemetry:** The application contains zero Google Analytics, tracking pixels, or third-party cookies.
- **Context Window Limits:** Local open-weight models have finite context lengths. For optimal results, notes should be between 100 and 6,000 words (single chapters or lectures). Maximum upload size is restricted to 250KB.
- **Inference Speed:** Depending on your machine's CPU/GPU (Apple Silicon M-series vs. older Intel processors), generating a detailed quiz or plan can take 3 to 15 seconds.

---

## 11. Open-Source AI Challenge Context

This project was built for **Hacktoberfest Open-Source AI Challenge Week 3: Slow and Steady**, which highlights:
- **Sustainable AI:** Prioritizing efficient, small open-weight models (1.5B–3B parameters) over compute-heavy mega-models.
- **Decentralization:** Demonstrating that students can perform high-utility academic synthesis on standard laptops without paying API tollgates.
- **Model Choice Freedom:** Users are never locked into a single proprietary provider; models can be swapped instantaneously via standard Ollama tags.

---

## 12. Future Roadmap

- [ ] Export flashcards to Anki package format (`.apkg`).
- [ ] Export summaries directly to Notion or Obsidian via Markdown frontmatter.
- [ ] Multi-document synthesis across multiple lecture note files.
- [ ] Audio note transcription using local `whisper.cpp`.

---

## 13. License

- **Application Code:** Licensed under the [MIT License](LICENSE).
- **AI Models:** Each local model downloaded through Ollama has its own separate open-weight license and terms:
  - **Qwen 2.5:** Qwen Research License (Open-weight commercial and research permissions)
  - **Gemma 2:** Google Gemma Terms of Use
  - **Llama 3.2:** Meta Llama 3.2 Community License
