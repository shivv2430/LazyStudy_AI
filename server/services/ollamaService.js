/**
 * Ollama Local Inference Service
 * Handles communication with the locally running Ollama instance.
 */

const DEFAULT_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:3b';

/**
 * Checks whether Ollama is reachable and lists installed models.
 */
export async function checkOllamaHealth(host = DEFAULT_HOST) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(`${host}/api/tags`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        running: false,
        host,
        error: `Ollama returned HTTP ${res.status}: ${res.statusText}`,
        models: [],
        activeModel: DEFAULT_MODEL,
      };
    }

    const data = await res.json();
    const models = (data.models || []).map((m) => m.name);

    return {
      running: true,
      host,
      models,
      activeModel: DEFAULT_MODEL,
      modelInstalled: models.some((m) => m.startsWith(DEFAULT_MODEL.split(':')[0])),
    };
  } catch (err) {
    clearTimeout(timeoutId);
    let msg = 'Ollama service is not running or unreachable on ' + host;
    if (err.name === 'AbortError') {
      msg = 'Connection to Ollama timed out (service may be frozen or blocked)';
    } else if (err.code === 'ECONNREFUSED' || err.message?.includes('fetch failed')) {
      msg = 'Connection refused. Ensure `ollama serve` is running.';
    }

    return {
      running: false,
      host,
      error: msg,
      models: [],
      activeModel: DEFAULT_MODEL,
      modelInstalled: false,
    };
  }
}

/**
 * Sends a generation request to the local Ollama instance.
 */
export async function generateWithOllama({
  prompt,
  systemInstruction,
  model = DEFAULT_MODEL,
  format = undefined,
  temperature = 0.3,
  host = DEFAULT_HOST,
}) {
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout for local models

  try {
    const payload = {
      model,
      prompt,
      system: systemInstruction,
      stream: false,
      options: {
        temperature,
      },
    };

    if (format === 'json') {
      payload.format = 'json';
    }

    const res = await fetch(`${host}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Ollama request failed [HTTP ${res.status}]: ${errText || res.statusText}`);
    }

    const data = await res.json();
    const responseText = data.response;
    const durationMs = Date.now() - startTime;

    return {
      content: responseText,
      modelUsed: data.model || model,
      processingTimeMs: durationMs,
      isDemo: false,
      totalDurationNs: data.total_duration,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Local inference timed out after 120s. Try using a smaller model like qwen2.5:1.5b or gemma2:2b.`);
    }
    throw err;
  }
}

/**
 * Parses JSON response safely, handling markdown code fences if present.
 */
export function extractAndParseJSON(rawText) {
  if (typeof rawText !== 'string') {
    return rawText;
  }

  // Remove potential ```json ... ``` wrappers
  let cleaned = rawText.trim();
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }

  // Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch (e1) {
    // Try finding the first '{' or '[' and last '}' or ']'
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    let startIdx = -1;
    let endIdx = -1;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIdx = firstBrace;
      endIdx = cleaned.lastIndexOf('}');
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
      endIdx = cleaned.lastIndexOf(']');
    }

    if (startIdx !== -1 && endIdx > startIdx) {
      const sliced = cleaned.substring(startIdx, endIdx + 1);
      try {
        return JSON.parse(sliced);
      } catch (e2) {
        throw new Error(`Failed to parse AI model response as structured JSON: ${e2.message}. Raw output snippet: ${cleaned.substring(0, 150)}...`);
      }
    }

    throw new Error(`Model did not output valid JSON. Raw output: ${cleaned.substring(0, 150)}...`);
  }
}

/**
 * Intelligent Mock/Demo generator for testing when Ollama is offline.
 * Clearly tagged with isDemo: true so the app never deceives the user.
 */
export function generateDemoFallback(toolType, notes, difficulty = 'standard') {
  const cleanNotes = notes.trim();
  const lines = cleanNotes.split('\n').filter((l) => l.trim().length > 0);
  const words = cleanNotes.split(/\s+/).slice(0, 100);
  const titleHint = lines[0] ? lines[0].replace(/^[#*-]+\s*/, '').slice(0, 50) : 'Study Material';

  if (toolType === 'summary') {
    return {
      content: `## Overview\nThis material covers foundational principles and applications related to **${titleHint}**. Key mechanisms, practical relationships, and core definitions are synthesized below based on your provided study notes.\n\n## Key Takeaways\n- **Primary Focus:** Systematic understanding of ${titleHint} without unnecessary overhead.\n- **Essential Process:** Core relationships emphasize progressive learning and retention.\n- **Application:** Concepts are structured for efficient active recall and quick revision.\n- **Synthesis:** Key definitions correlate directly with common exam question patterns.\n\n## Core Concepts & Definitions\n- **Foundational Concept:** Fundamental principles extracted from line 1 of your notes.\n- **Operational Dynamics:** How the constituent factors interact in context.\n- **Critical Constraints:** Boundary conditions, exceptions, or specific parameters noted.\n\n## Detailed Breakdown\n- **Structure & Framework:** Notes demonstrate an organized conceptual hierarchy from basic principles to specific examples.\n- **Key Mechanisms:** Highlights the causal links and logical steps described in the source text.\n- **Practical Significance:** Emphasizes real-world relevance and typical review examination prompts.\n\n## Summary Checklist\n- [ ] Can you define the primary term without looking at the notes?\n- [ ] Can you explain the 3 main mechanisms in your own words?\n- [ ] Are all critical formulas/dates committed to memory?`,
      modelUsed: 'demo-mode (simulated)',
      isDemo: true,
      processingTimeMs: 450,
    };
  }

  if (toolType === 'flashcards') {
    return {
      content: JSON.stringify({
        flashcards: [
          {
            id: 1,
            concept: 'Primary Definition',
            question: `What is the core definition of "${titleHint}"?`,
            answer: `Based on your notes, it represents the central topic and foundational principle being studied.`,
          },
          {
            id: 2,
            concept: 'Key Characteristic',
            question: `What is a primary characteristic or mechanism highlighted in the material?`,
            answer: `It operates through systematic relationships and structured rules outlined in the provided text.`,
          },
          {
            id: 3,
            concept: 'Significance',
            question: `Why is this topic critical for revision and exams?`,
            answer: `Understanding these principles enables direct problem-solving and accurate conceptual recall.`,
          },
          {
            id: 4,
            concept: 'Application',
            question: `How does the material suggest applying these principles?`,
            answer: `By breaking down complex relationships into atomic steps and validating each stage.`,
          },
          {
            id: 5,
            concept: 'Distinction',
            question: `What distinguishes this concept from closely related ideas?`,
            answer: `Its specific boundary conditions, operational definitions, and context outlined in the notes.`,
          },
          {
            id: 6,
            concept: 'Review Recall',
            question: `What is the most common pitfall to avoid when answering questions on this topic?`,
            answer: `Confusing secondary symptoms with root causes, or skipping baseline definitions.`,
          },
        ],
      }),
      modelUsed: 'demo-mode (simulated)',
      isDemo: true,
      processingTimeMs: 500,
    };
  }

  if (toolType === 'quiz') {
    return {
      content: JSON.stringify({
        title: `Practice Quiz: ${titleHint}`,
        questions: [
          {
            id: 1,
            question: `According to the provided notes, what is the central theme of ${titleHint}?`,
            options: [
              `The foundational concepts and primary mechanisms of ${titleHint}`,
              `An unrelated secondary historical development`,
              `A random arbitrary hypothesis without evidence`,
              `A completely obsolete superseded framework`,
            ],
            correctIndex: 0,
            explanation: `Option A accurately captures the primary subject matter described in your notes.`,
          },
          {
            id: 2,
            question: `Which of the following best represents the relationship between the components discussed?`,
            options: [
              `Components operate independently without interaction`,
              `Components interact in a structured, causal manner to achieve the observed outcome`,
              `Component order is completely inverted in all practical cases`,
              `No reliable relationship can ever be inferred`,
            ],
            correctIndex: 1,
            explanation: `The material highlights structured causal interactions between key elements.`,
          },
          {
            id: 3,
            question: `What is the recommended approach when reviewing this material for an assessment?`,
            options: [
              `Passive reading without taking any notes`,
              `Memorizing arbitrary sentences without context`,
              `Active recall of definitions, mechanisms, and checklist verification`,
              `Skipping the core principles and focusing only on edge cases`,
            ],
            correctIndex: 2,
            explanation: `Active recall and checking key terms is the proven study methodology supported by LazyStudy AI.`,
          },
          {
            id: 4,
            question: `Why are boundary conditions and constraints significant in this topic?`,
            options: [
              `They ensure principles are not mistakenly applied outside valid contexts`,
              `They have no actual practical bearing on results`,
              `They solely exist for historical curiosity`,
              `They can be safely ignored under standard exam conditions`,
            ],
            correctIndex: 0,
            explanation: `Boundary conditions define where principles hold true and prevent common misconceptions.`,
          },
        ],
      }),
      modelUsed: 'demo-mode (simulated)',
      isDemo: true,
      processingTimeMs: 480,
    };
  }

  if (toolType === 'revision') {
    return {
      content: JSON.stringify({
        title: `Revision Strategy: ${titleHint}`,
        totalEstimatedMinutes: 75,
        disclaimer:
          'This revision plan is an automated study suggestion based strictly on your uploaded notes. Adjust pacing to suit your syllabus and individual needs.',
        keyDefinitions: [
          {
            term: titleHint || 'Core Subject',
            definition: 'The primary conceptual focus established in your notes.',
          },
          {
            term: 'Underlying Mechanism',
            definition: 'The logical process or sequence that explains how results occur.',
          },
          {
            term: 'Critical Constraint',
            definition: 'The limitation or condition under which the primary rule applies.',
          },
          {
            term: 'Synthesis Metric',
            definition: 'The measure used to evaluate complete comprehension of the topic.',
          },
        ],
        sessions: [
          {
            id: 1,
            sessionTitle: 'Session 1: Foundational Recall & Terminology',
            durationMinutes: 25,
            objective: 'Master key definitions and ensure zero terminology confusion',
            tasks: [
              { id: 't1-1', task: `Read through core definitions for ${titleHint}` },
              { id: 't1-2', task: 'Write down key terms from memory without looking' },
              { id: 't1-3', task: 'Check off flashcard set 1 to verify active recall' },
            ],
          },
          {
            id: 2,
            sessionTitle: 'Session 2: Mechanism Deep-Dive & Relationships',
            durationMinutes: 30,
            objective: 'Understand how individual parts interact and resolve causal chains',
            tasks: [
              { id: 't2-1', task: 'Sketch a simple diagram or flowchart of the process' },
              { id: 't2-2', task: 'Identify 2 potential exam questions regarding mechanisms' },
              { id: 't2-3', task: 'Attempt practice quiz questions without notes' },
            ],
          },
          {
            id: 3,
            sessionTitle: 'Session 3: Exam Readiness & Weak-Spot Review',
            durationMinutes: 20,
            objective: 'Consolidate takeaways and clarify any missed quiz questions',
            tasks: [
              { id: 't3-1', task: 'Review explanations for any incorrect quiz options' },
              { id: 't3-2', task: 'Perform quick 5-minute self-explanation aloud' },
              { id: 't3-3', task: 'Final checklist audit before exam day' },
            ],
          },
        ],
      }),
      modelUsed: 'demo-mode (simulated)',
      isDemo: true,
      processingTimeMs: 460,
    };
  }

  throw new Error(`Unknown tool type: ${toolType}`);
}
