import React, { useState } from 'react';
import { X, Terminal, Check, Copy, RefreshCw, Cpu, ExternalLink } from 'lucide-react';
import { fetchHealth } from '../services/api';

export default function OllamaStatusModal({ isOpen, onClose, ollamaStatus, onRefreshStatus }) {
  const [copiedCmd, setCopiedCmd] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(''), 2000);
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await onRefreshStatus();
    setRefreshing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-paper-300 shadow-elevated w-full max-w-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-paper-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-study-light text-study-primary flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-900">Local AI Inference Setup</h3>
              <p className="text-xs text-navy-500">Ollama configuration & open-weight model guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-navy-400 hover:text-navy-900 rounded-lg hover:bg-paper-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Status Box */}
          <div
            className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
              ollamaStatus?.running
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                <span
                  className={`w-2 h-2 rounded-full ${
                    ollamaStatus?.running ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                Status: {ollamaStatus?.running ? 'Ollama is Active' : 'Ollama Not Detected'}
              </div>
              <p className="text-xs mt-1 leading-relaxed">
                {ollamaStatus?.running
                  ? `Connected to ${ollamaStatus.host || 'http://127.0.0.1:11434'}. Active model: ${ollamaStatus.activeModel}. Installed models: ${(ollamaStatus.models || []).join(', ') || 'None detected yet'}.`
                  : 'LazyStudy AI cannot reach the Ollama daemon on http://127.0.0.1:11434. Follow the setup commands below.'}
              </p>
            </div>

            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg bg-white/80 hover:bg-white text-navy-700 text-xs shrink-0 flex items-center gap-1 border border-paper-300"
              title="Test connection again"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Setup Steps for macOS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-500">
              macOS Quickstart Commands
            </h4>

            {/* Command 1 */}
            <div className="bg-paper-100 p-3 rounded-lg border border-paper-300 space-y-1">
              <span className="text-[11px] font-semibold text-navy-700 block">
                1. Install Ollama via Homebrew (or download from ollama.com):
              </span>
              <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded border border-paper-200 font-mono text-xs text-navy-900">
                <span>brew install ollama</span>
                <button
                  onClick={() => copyToClipboard('brew install ollama')}
                  className="text-navy-400 hover:text-navy-900 p-1"
                >
                  {copiedCmd === 'brew install ollama' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Command 2 */}
            <div className="bg-paper-100 p-3 rounded-lg border border-paper-300 space-y-1">
              <span className="text-[11px] font-semibold text-navy-700 block">
                2. Pull and run recommended model (Qwen 2.5 3B, ~1.9GB):
              </span>
              <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded border border-paper-200 font-mono text-xs text-navy-900">
                <span>ollama run qwen2.5:3b</span>
                <button
                  onClick={() => copyToClipboard('ollama run qwen2.5:3b')}
                  className="text-navy-400 hover:text-navy-900 p-1"
                >
                  {copiedCmd === 'ollama run qwen2.5:3b' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Alternative lightweight */}
            <div className="bg-paper-100 p-3 rounded-lg border border-paper-300 space-y-1">
              <span className="text-[11px] font-semibold text-navy-700 block">
                3. Low-RAM alternative (Qwen 2.5 1.5B, ~1.0GB):
              </span>
              <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded border border-paper-200 font-mono text-xs text-navy-900">
                <span>ollama run qwen2.5:1.5b</span>
                <button
                  onClick={() => copyToClipboard('ollama run qwen2.5:1.5b')}
                  className="text-navy-400 hover:text-navy-900 p-1"
                >
                  {copiedCmd === 'ollama run qwen2.5:1.5b' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-paper-100 border-t border-paper-200 flex items-center justify-between">
          <a
            href="https://ollama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-study-primary hover:underline font-medium"
          >
            <span>Visit Ollama Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-semibold hover:bg-navy-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
