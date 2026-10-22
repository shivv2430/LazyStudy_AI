import { Router } from 'express';
import multer from 'multer';
import {
  generateWithOllama,
  extractAndParseJSON,
  checkOllamaHealth,
  generateDemoFallback,
} from '../services/ollamaService.js';
import { buildSummaryPrompt } from '../prompts/summaryPrompt.js';
import { buildFlashcardPrompt } from '../prompts/flashcardPrompt.js';
import { buildQuizPrompt } from '../prompts/quizPrompt.js';
import { buildRevisionPrompt } from '../prompts/revisionPrompt.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 250 * 1024 }, // 250 KB max to fit local context
});

/**
 * Validates note text input.
 */
function validateNotesInput(notes) {
  if (!notes || typeof notes !== 'string') {
    return { valid: false, error: 'Please enter or upload some study notes to process.' };
  }
  const trimmed = notes.trim();
  if (trimmed.length < 25) {
    return { valid: false, error: 'Your notes are too brief (minimum 25 characters). Please provide a little more context.' };
  }
  if (trimmed.length > 40000) {
    return {
      valid: false,
      error: 'Your notes are too lengthy for local processing (maximum 40,000 characters). Please split them into smaller sections or chapters for best results.',
    };
  }
  return { valid: true, notes: trimmed };
}

/**
 * Helper to execute tool with Ollama or demo fallback.
 */
async function executeStudyTool({ toolType, promptBuilder, notes, difficulty, demoMode, model, format }) {
  // If demo mode is explicitly active, run simulated generation
  if (demoMode) {
    const simulated = generateDemoFallback(toolType, notes, difficulty);
    let parsed = simulated.content;
    if (format === 'json') {
      parsed = extractAndParseJSON(simulated.content);
    }
    return {
      data: parsed,
      metadata: {
        modelUsed: simulated.modelUsed,
        isDemo: true,
        processingTimeMs: simulated.processingTimeMs,
      },
    };
  }

  // Check Ollama connectivity
  const health = await checkOllamaHealth();
  if (!health.running) {
    throw {
      statusCode: 503,
      ollamaOffline: true,
      message: 'Ollama is not running locally on your computer.',
      instructions: 'Start Ollama by running `ollama serve` in your terminal or opening the Ollama application, then pull a model with `ollama run qwen2.5:3b`. You can also toggle "Demo Mode" in the workspace header to test the UI without Ollama.',
    };
  }

  const { systemInstruction, userPrompt } = promptBuilder(notes, difficulty);
  const targetModel = model || process.env.OLLAMA_MODEL || 'qwen2.5:3b';

  const rawResult = await generateWithOllama({
    prompt: userPrompt,
    systemInstruction,
    model: targetModel,
    format,
  });

  let parsedData = rawResult.content;
  if (format === 'json') {
    parsedData = extractAndParseJSON(rawResult.content);
  }

  return {
    data: parsedData,
    metadata: {
      modelUsed: rawResult.modelUsed,
      isDemo: false,
      processingTimeMs: rawResult.processingTimeMs,
    },
  };
}

// 1. SMART SUMMARY
router.post('/summary', async (req, res) => {
  try {
    const { notes, difficulty = 'standard', demoMode = false, model } = req.body;
    const validation = validateNotesInput(notes);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const result = await executeStudyTool({
      toolType: 'summary',
      promptBuilder: buildSummaryPrompt,
      notes: validation.notes,
      difficulty,
      demoMode,
      model,
      format: undefined,
    });

    res.json({
      success: true,
      summary: result.data,
      metadata: result.metadata,
    });
  } catch (err) {
    console.error('Error generating summary:', err.message || err);
    res.status(err.statusCode || 500).json({
      error: err.message || 'Failed to generate summary',
      ollamaOffline: !!err.ollamaOffline,
      instructions: err.instructions,
    });
  }
});

// 2. FLASHCARD MAKER
router.post('/flashcards', async (req, res) => {
  try {
    const { notes, difficulty = 'standard', demoMode = false, model } = req.body;
    const validation = validateNotesInput(notes);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const result = await executeStudyTool({
      toolType: 'flashcards',
      promptBuilder: buildFlashcardPrompt,
      notes: validation.notes,
      difficulty,
      demoMode,
      model,
      format: 'json',
    });

    const flashcards = result.data.flashcards || result.data || [];
    res.json({
      success: true,
      flashcards,
      metadata: result.metadata,
    });
  } catch (err) {
    console.error('Error generating flashcards:', err.message || err);
    res.status(err.statusCode || 500).json({
      error: err.message || 'Failed to generate flashcards',
      ollamaOffline: !!err.ollamaOffline,
      instructions: err.instructions,
    });
  }
});

// 3. PRACTICE QUIZ
router.post('/quiz', async (req, res) => {
  try {
    const { notes, difficulty = 'standard', demoMode = false, model } = req.body;
    const validation = validateNotesInput(notes);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const result = await executeStudyTool({
      toolType: 'quiz',
      promptBuilder: buildQuizPrompt,
      notes: validation.notes,
      difficulty,
      demoMode,
      model,
      format: 'json',
    });

    res.json({
      success: true,
      quiz: result.data,
      metadata: result.metadata,
    });
  } catch (err) {
    console.error('Error generating quiz:', err.message || err);
    res.status(err.statusCode || 500).json({
      error: err.message || 'Failed to generate practice quiz',
      ollamaOffline: !!err.ollamaOffline,
      instructions: err.instructions,
    });
  }
});

// 4. REVISION PLAN
router.post('/revision', async (req, res) => {
  try {
    const { notes, difficulty = 'standard', demoMode = false, model } = req.body;
    const validation = validateNotesInput(notes);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const result = await executeStudyTool({
      toolType: 'revision',
      promptBuilder: buildRevisionPrompt,
      notes: validation.notes,
      difficulty,
      demoMode,
      model,
      format: 'json',
    });

    res.json({
      success: true,
      revisionPlan: result.data,
      metadata: result.metadata,
    });
  } catch (err) {
    console.error('Error generating revision plan:', err.message || err);
    res.status(err.statusCode || 500).json({
      error: err.message || 'Failed to generate revision plan',
      ollamaOffline: !!err.ollamaOffline,
      instructions: err.instructions,
    });
  }
});

// FILE UPLOAD FOR NOTES (.txt, .md)
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const originalName = req.file.originalname || '';
    const extension = originalName.split('.').pop().toLowerCase();
    const allowedExtensions = ['txt', 'md', 'markdown', 'text', 'json'];

    if (!allowedExtensions.includes(extension)) {
      return res.status(400).json({
        error: `Unsupported file type (.${extension}). Please upload plain text (.txt) or markdown (.md) notes.`,
      });
    }

    const textContent = req.file.buffer.toString('utf-8');
    const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
    const charCount = textContent.length;

    res.json({
      success: true,
      filename: originalName,
      text: textContent,
      wordCount,
      charCount,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read file: ' + err.message });
  }
});

export default router;
