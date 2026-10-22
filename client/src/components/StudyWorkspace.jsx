import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Layers,
  HelpCircle,
  CalendarCheck,
  UploadCloud,
  FileText,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Terminal,
  Cpu,
  CheckCircle,
  X,
  FileCode,
} from 'lucide-react';
import SmartSummary from './StudyTools/SmartSummary';
import Flashcards from './StudyTools/Flashcards';
import PracticeQuiz from './StudyTools/PracticeQuiz';
import RevisionPlan from './StudyTools/RevisionPlan';
import {
  generateSummary,
  generateFlashcards,
  generateQuiz,
  generateRevision,
  uploadNotesFile,
} from '../services/api';
import { SAMPLE_NOTES } from '../utils/sampleNotes';

export default function StudyWorkspace({
  ollamaStatus,
  demoMode,
  setDemoMode,
  onOpenOllamaModal,
}) {
  const [notes, setNotes] = useState('');
  const [activeTool, setActiveTool] = useState('summary'); // 'summary' | 'flashcards' | 'quiz' | 'revision'
  const [difficulty, setDifficulty] = useState('standard'); // 'beginner' | 'standard' | 'advanced'
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorInfo, setErrorInfo] = useState(null);
  const [results, setResults] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const fileInputRef = useRef(null);

  // Character and word counts
  const charCount = notes.length;
  const wordCount = notes.trim() ? notes.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTimeMin = Math.ceil(wordCount / 200);

  // Tool metadata definitions
  const tools = [
    {
      id: 'summary',
      name: 'Smart Summary',
      icon: BookOpen,
      desc: 'Concise, hierarchical takeaways and definitions',
    },
    {
      id: 'flashcards',
      name: 'Flashcard Maker',
      icon: Layers,
      desc: 'Active recall Q&A pairs with flip view',
    },
    {
      id: 'quiz',
      name: 'Practice Quiz',
      icon: HelpCircle,
      desc: 'Multiple-choice questions with answer rationale',
    },
    {
      id: 'revision',
      name: 'Revision Plan',
      icon: CalendarCheck,
      desc: 'Actionable study sessions and checklist',
    },
  ];

  // Load a sample note
  const handleLoadSample = (sample) => {
    setNotes(sample.content);
    setUploadedFileName(null);
    setErrorInfo(null);
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 250 * 1024) {
      setErrorInfo({
        message: 'File size exceeds 250KB limit. Please upload a smaller chapter or text file.',
      });
      return;
    }

    try {
      const data = await uploadNotesFile(file);
      setNotes(data.text);
      setUploadedFileName(file.name);
      setErrorInfo(null);
    } catch (err) {
      setErrorInfo({
        message: err.message || 'Failed to read uploaded file',
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Clear workspace
  const handleReset = () => {
    if (notes && !window.confirm('Clear all notes and generated results?')) return;
    setNotes('');
    setResults(null);
    setErrorInfo(null);
    setUploadedFileName(null);
  };

  // Run AI Generation
  const handleGenerate = async () => {
    if (!notes.trim()) {
      setErrorInfo({
        message: 'Please paste or upload study notes before generating.',
      });
      return;
    }

    if (notes.trim().length < 25) {
      setErrorInfo({
        message: 'Notes are too brief (minimum 25 characters). Please provide more context to learn from.',
      });
      return;
    }

    setLoading(true);
    setErrorInfo(null);

    // Subtle progressive loading status text
    const activeToolObj = tools.find((t) => t.id === activeTool);
    setLoadingStep(`Processing notes for ${activeToolObj?.name}...`);

    try {
      let res;
      const payload = {
        notes,
        difficulty,
        demoMode,
        model: ollamaStatus?.activeModel || 'qwen2.5:3b',
      };

      if (activeTool === 'summary') {
        res = await generateSummary(payload);
        setResults({ type: 'summary', data: res.summary, metadata: res.metadata });
      } else if (activeTool === 'flashcards') {
        res = await generateFlashcards(payload);
        setResults({ type: 'flashcards', data: res.flashcards, metadata: res.metadata });
      } else if (activeTool === 'quiz') {
        res = await generateQuiz(payload);
        setResults({ type: 'quiz', data: res.quiz, metadata: res.metadata });
      } else if (activeTool === 'revision') {
        res = await generateRevision(payload);
        setResults({ type: 'revision', data: res.revisionPlan, metadata: res.metadata });
      }
    } catch (err) {
      console.error('Generation failed:', err);
      setErrorInfo({
        message: err.message,
        ollamaOffline: err.ollamaOffline,
        instructions: err.instructions,
      });
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <section id="workspace" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Workspace Header Title & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-paper-200 border border-paper-300 text-navy-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-study-primary" />
            Study Workspace
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 tracking-tight">
            Turn Raw Notes Into Active Learning
          </h2>
          <p className="text-sm text-navy-600 mt-1">
            Choose your notes, pick a study tool, and run local inference with complete privacy.
          </p>
        </div>

        {/* Demo Mode Toggle & Ollama Indicator */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-paper-300 shadow-subtle">
          <div className="flex items-center gap-2 pr-3 border-r border-paper-200">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                ollamaStatus?.running ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="text-xs font-medium text-navy-800">
              {ollamaStatus?.running ? (
                `Ollama Connected (${ollamaStatus.activeModel})`
              ) : (
                <button
                  type="button"
                  onClick={onOpenOllamaModal}
                  className="hover:text-study-primary underline decoration-dotted text-left"
                  title="Click for connection instructions"
                >
                  Ollama Offline
                </button>
              )}
            </span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-paper-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-study-primary relative"></div>
            <span className="text-xs font-medium text-navy-700">Demo Mode</span>
          </label>
        </div>
      </div>

      {/* Main Grid: Input Column & Output Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input & Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-paper-300 p-6 shadow-card space-y-5">
            {/* Sample Notes Shortcut Chips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Quick Load Academic Samples:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_NOTES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleLoadSample(sample)}
                    className="text-xs px-2.5 py-1 rounded-md bg-paper-100 hover:bg-paper-200 text-navy-700 border border-paper-300 transition-colors"
                  >
                    {sample.tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Note Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="notes-input" className="text-xs font-semibold text-navy-800">
                  Paste or Type Your Notes:
                </label>
                {uploadedFileName && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <FileCode className="w-3 h-3" />
                    {uploadedFileName}
                    <button
                      onClick={() => setUploadedFileName(null)}
                      className="ml-1 text-emerald-900 hover:text-emerald-950"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <textarea
                id="notes-input"
                rows={10}
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  if (errorInfo) setErrorInfo(null);
                }}
                placeholder="Paste your lecture notes, textbook chapters, or review outlines here (e.g. key concepts, formulas, definitions)..."
                className="w-full p-4 rounded-xl border border-paper-300 focus:border-study-primary focus:ring-1 focus:ring-study-primary text-sm font-sans leading-relaxed text-navy-900 placeholder:text-navy-400 bg-paper-50 resize-y transition-all"
              />

              {/* Counters & File Upload Bar */}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-navy-500">
                <div className="flex items-center gap-3">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{charCount} characters</span>
                  {wordCount > 0 && (
                    <>
                      <span>•</span>
                      <span>~{readingTimeMin} min read</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.md,.text"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-navy-700 bg-paper-200 hover:bg-paper-300 rounded-lg transition-colors border border-paper-300"
                    title="Upload .txt or .md notes file (max 250KB)"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-navy-600" />
                    <span>Upload .txt/.md</span>
                  </label>

                  {notes && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-navy-500 hover:text-navy-900 transition-colors"
                      title="Clear notes"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tool Selection Tabs */}
            <div>
              <label className="text-xs font-semibold text-navy-800 block mb-2">
                Choose Study Tool:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {tools.map((t) => {
                  const Icon = t.icon;
                  const isSelected = activeTool === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTool(t.id)}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-study-light border-study-secondary text-navy-950 ring-1 ring-study-secondary shadow-xs'
                          : 'bg-paper-50 border-paper-300 text-navy-700 hover:bg-paper-100 hover:border-paper-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon
                          className={`w-4 h-4 ${
                            isSelected ? 'text-study-primary' : 'text-navy-500'
                          }`}
                        />
                        <span className="text-xs font-bold">{t.name}</span>
                      </div>
                      <p className="text-[11px] text-navy-500 leading-snug line-clamp-1">{t.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Depth / Difficulty Selector */}
            <div>
              <label htmlFor="difficulty-select" className="text-xs font-semibold text-navy-800 block mb-2">
                Depth / Target Level:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'beginner', label: 'Foundational', sub: 'Clear, plain terms' },
                  { id: 'standard', label: 'Standard', sub: 'Balanced academic' },
                  { id: 'advanced', label: 'Exam Focus', sub: 'Deep analysis' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDifficulty(d.id)}
                    className={`py-2 px-3 text-center rounded-lg border text-xs transition-colors ${
                      difficulty === d.id
                        ? 'bg-navy-900 border-navy-900 text-white font-medium shadow-xs'
                        : 'bg-paper-100 border-paper-300 text-navy-700 hover:bg-paper-200'
                    }`}
                  >
                    <div className="font-semibold">{d.label}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{d.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading || !notes.trim()}
                className="w-full py-3.5 px-6 rounded-xl font-medium text-sm text-white bg-study-primary hover:bg-study-secondary active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-subtle flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{loadingStep || 'Generating study material...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate {tools.find((t) => t.id === activeTool)?.name}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="p-4 bg-paper-200/50 rounded-xl border border-paper-300 text-xs text-navy-600 flex items-start gap-2.5">
            <Cpu className="w-4 h-4 text-study-primary shrink-0 mt-0.5" />
            <p>
              <strong>Local-First Guarantee:</strong> When connected to Ollama, all inference runs directly on your hardware. Notes are never sent to third-party cloud APIs.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Results Display or Empty State */}
        <div className="lg:col-span-7">
          {/* Error Banner */}
          {errorInfo && (
            <div className="mb-6 p-5 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 space-y-3 animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-900">
                    {errorInfo.ollamaOffline ? 'Ollama Is Offline' : 'Action Required'}
                  </h4>
                  <p className="text-xs text-rose-800 mt-1 leading-relaxed">{errorInfo.message}</p>
                </div>
              </div>

              {errorInfo.instructions && (
                <div className="p-3 bg-white/80 rounded-lg border border-rose-200 text-xs text-rose-900 font-mono">
                  {errorInfo.instructions}
                </div>
              )}

              {errorInfo.ollamaOffline && !demoMode && (
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setDemoMode(true);
                      setErrorInfo(null);
                    }}
                    className="px-3.5 py-1.5 bg-rose-900 text-white rounded-lg text-xs font-semibold hover:bg-rose-800 transition-colors"
                  >
                    Switch to Demo Mode (Simulate Local AI)
                  </button>
                  <button
                    onClick={onOpenOllamaModal}
                    className="px-3.5 py-1.5 bg-white border border-rose-300 text-rose-900 rounded-lg text-xs font-medium hover:bg-rose-100 transition-colors"
                  >
                    View Ollama Setup Guide
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="p-12 text-center bg-white rounded-2xl border border-paper-300 shadow-card space-y-4 animate-fadeIn">
              <div className="w-12 h-12 border-3 border-study-primary/20 border-t-study-primary rounded-full animate-spin mx-auto" />
              <div>
                <h3 className="text-base font-semibold text-navy-900">
                  Synthesizing with {demoMode ? 'Local Simulation' : ollamaStatus?.activeModel || 'Ollama'}
                </h3>
                <p className="text-xs text-navy-500 mt-1 max-w-sm mx-auto">
                  Local open-weight models take a few seconds to organize and generate structured outputs without relying on cloud APIs.
                </p>
              </div>
            </div>
          )}

          {/* Active Results Display */}
          {!loading && results && (
            <div className="bg-white rounded-2xl border border-paper-300 p-6 sm:p-8 shadow-card">
              {results.type === 'summary' && (
                <SmartSummary summary={results.data} metadata={results.metadata} onReset={handleReset} />
              )}
              {results.type === 'flashcards' && (
                <Flashcards flashcards={results.data} metadata={results.metadata} />
              )}
              {results.type === 'quiz' && (
                <PracticeQuiz quiz={results.data} metadata={results.metadata} />
              )}
              {results.type === 'revision' && (
                <RevisionPlan revisionPlan={results.data} metadata={results.metadata} />
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && !results && !errorInfo && (
            <div className="p-12 sm:p-16 text-center bg-white/70 rounded-2xl border border-dashed border-paper-300 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-paper-200 text-study-primary mx-auto flex items-center justify-center">
                <FileText className="w-7 h-7 text-navy-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">Your Study Material Appears Here</h3>
                <p className="text-xs text-navy-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Paste notes or pick an academic sample on the left, then select a tool like Smart Summary, Flashcards, Quiz, or Revision Plan to begin.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
