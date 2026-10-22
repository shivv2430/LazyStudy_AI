/**
 * LazyStudy AI - Frontend API Service Layer
 * Clean, decoupled communication with backend server and seamless client fallback
 */

const API_BASE = '/api';

/**
 * Checks system and Ollama connectivity
 */
export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      ollama: { running: false, error: 'Static host or local backend offline' },
      recommendedModels: [],
      activeModel: 'qwen2.5:3b',
    };
  }
}

/**
 * Uploads a text/markdown file for instant note population
 */
export async function uploadNotesFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/study/upload`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fall back to client-side FileReader if hosted statically
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      resolve({
        success: true,
        filename: file.name,
        text,
        wordCount,
        charCount: text.length,
      });
    };
    reader.onerror = () => reject(new Error('Failed to read file client-side'));
    reader.readAsText(file);
  });
}

/**
 * Client-side simulation fallback when deployed on static hosting without local backend
 */
function generateClientFallback(endpoint, notes) {
  const lines = notes.trim().split('\n').filter((l) => l.trim().length > 0);
  const titleHint = lines[0] ? lines[0].replace(/^[#*-]+\s*/, '').slice(0, 50) : 'Study Material';

  if (endpoint === 'summary') {
    return {
      success: true,
      summary: `## Overview\nThis material covers foundational principles and applications related to **${titleHint}**. Key mechanisms, practical relationships, and core definitions are synthesized below based on your provided study notes.\n\n## Key Takeaways\n- **Primary Focus:** Systematic understanding of ${titleHint} without unnecessary overhead.\n- **Essential Process:** Core relationships emphasize progressive learning and retention.\n- **Application:** Concepts are structured for efficient active recall and quick revision.\n- **Synthesis:** Key definitions correlate directly with common exam question patterns.\n\n## Core Concepts & Definitions\n- **Foundational Concept:** Fundamental principles extracted from line 1 of your notes.\n- **Operational Dynamics:** How the constituent factors interact in context.\n- **Critical Constraints:** Boundary conditions, exceptions, or specific parameters noted.\n\n## Detailed Breakdown\n- **Structure & Framework:** Notes demonstrate an organized conceptual hierarchy from basic principles to specific examples.\n- **Key Mechanisms:** Highlights the causal links and logical steps described in the source text.\n- **Practical Significance:** Emphasizes real-world relevance and typical review examination prompts.\n\n## Summary Checklist\n- [ ] Can you define the primary term without looking at the notes?\n- [ ] Can you explain the 3 main mechanisms in your own words?\n- [ ] Are all critical formulas/dates committed to memory?`,
      metadata: { modelUsed: 'demo-mode (deployed preview)', isDemo: true, processingTimeMs: 400 },
    };
  }

  if (endpoint === 'flashcards') {
    return {
      success: true,
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
      metadata: { modelUsed: 'demo-mode (deployed preview)', isDemo: true, processingTimeMs: 450 },
    };
  }

  if (endpoint === 'quiz') {
    return {
      success: true,
      quiz: {
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
      },
      metadata: { modelUsed: 'demo-mode (deployed preview)', isDemo: true, processingTimeMs: 420 },
    };
  }

  if (endpoint === 'revision') {
    return {
      success: true,
      revisionPlan: {
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
      },
      metadata: { modelUsed: 'demo-mode (deployed preview)', isDemo: true, processingTimeMs: 440 },
    };
  }

  throw new Error(`Unknown endpoint: ${endpoint}`);
}

/**
 * Common POST request handler with fallback for static deployments
 */
async function postStudyTask(endpoint, payload) {
  try {
    const res = await fetch(`${API_BASE}/study/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.ollamaOffline && payload.demoMode) {
        return generateClientFallback(endpoint, payload.notes);
      }
      const error = new Error(data.error || data.message || `Request failed with status ${res.status}`);
      error.ollamaOffline = data.ollamaOffline;
      error.instructions = data.instructions;
      throw error;
    }

    return data;
  } catch (err) {
    // If backend is not reached (e.g. static GitHub Pages host) or demoMode requested
    if (payload.demoMode || err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
      return generateClientFallback(endpoint, payload.notes);
    }
    throw err;
  }
}

export async function generateSummary({ notes, difficulty, demoMode, model }) {
  return postStudyTask('summary', { notes, difficulty, demoMode, model });
}

export async function generateFlashcards({ notes, difficulty, demoMode, model }) {
  return postStudyTask('flashcards', { notes, difficulty, demoMode, model });
}

export async function generateQuiz({ notes, difficulty, demoMode, model }) {
  return postStudyTask('quiz', { notes, difficulty, demoMode, model });
}

export async function generateRevision({ notes, difficulty, demoMode, model }) {
  return postStudyTask('revision', { notes, difficulty, demoMode, model });
}
