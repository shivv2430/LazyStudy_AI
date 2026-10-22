import { Router } from 'express';
import { checkOllamaHealth } from '../services/ollamaService.js';

const router = Router();

const RECOMMENDED_MODELS = [
  {
    name: 'qwen2.5:3b',
    recommended: true,
    size: '1.9 GB',
    ram: '4 GB RAM',
    description: 'Best balanced open-weight model for academic summaries, structured reasoning, and JSON generation on laptops.',
    pullCommand: 'ollama run qwen2.5:3b',
    license: 'Qwen Research License (Open-weight)',
  },
  {
    name: 'qwen2.5:1.5b',
    recommended: false,
    size: '1.0 GB',
    ram: '2.5 GB RAM',
    description: 'Ultra-lightweight model for older machines or low-RAM environments.',
    pullCommand: 'ollama run qwen2.5:1.5b',
    license: 'Qwen Research License (Open-weight)',
  },
  {
    name: 'gemma2:2b',
    recommended: false,
    size: '1.6 GB',
    ram: '3 GB RAM',
    description: 'Google open model with high quality writing and reasoning capabilities.',
    pullCommand: 'ollama run gemma2:2b',
    license: 'Gemma Terms of Use (Open-weight)',
  },
  {
    name: 'llama3.2:3b',
    recommended: false,
    size: '2.0 GB',
    ram: '4 GB RAM',
    description: 'Meta lightweight model optimized for edge devices and fast reasoning.',
    pullCommand: 'ollama run llama3.2:3b',
    license: 'Llama 3.2 Community License',
  },
];

router.get('/health', async (req, res) => {
  try {
    const health = await checkOllamaHealth();
    res.json({
      status: 'ok',
      serverTime: new Date().toISOString(),
      ollama: health,
      recommendedModels: RECOMMENDED_MODELS,
      activeModel: process.env.OLLAMA_MODEL || 'qwen2.5:3b',
      host: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

router.get('/models', async (req, res) => {
  try {
    const health = await checkOllamaHealth();
    res.json({
      installed: health.models || [],
      recommended: RECOMMENDED_MODELS,
      activeModel: process.env.OLLAMA_MODEL || 'qwen2.5:3b',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

export default router;
