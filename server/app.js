import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoute from './routes/healthRoute.js';
import studyRoute from './routes/studyRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Privacy-aware request logging (never logs user note payloads)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', healthRoute);
app.use('/api/study', studyRoute);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'LazyStudy AI Backend',
    description: 'Local AI inference gateway for student productivity',
    status: 'running',
    docs: '/api/health',
  });
});

// Privacy-conscious error handler (prevents private notes from being echoed in errors)
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected server error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🎓 LazyStudy AI Server running on http://localhost:${PORT}`);
  console.log(`⚙️  Target Ollama Host: ${process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'}`);
  console.log(`🧠 Configured Model:  ${process.env.OLLAMA_MODEL || 'qwen2.5:3b'}`);
  console.log(`🔒 Local-First Privacy: Zero cloud tracking or external API keys`);
  console.log(`===============================================`);
});

export default app;
