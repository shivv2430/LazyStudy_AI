import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Menu, X, Cpu, ExternalLink } from 'lucide-react';

export default function Navbar({ ollamaStatus, onOpenOllamaModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-paper-100/90 backdrop-blur-md border-b border-paper-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-study-primary text-white flex items-center justify-center shadow-xs group-hover:bg-study-secondary transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-navy-900 tracking-tight block leading-tight">
              LazyStudy AI
            </span>
            <span className="text-[10px] text-navy-500 font-medium tracking-wider uppercase block">
              Local-First Assistant
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-navy-700">
          <a href="#workspace" className="hover:text-study-primary transition-colors">
            Workspace
          </a>
          <a href="#features" className="hover:text-study-primary transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-study-primary transition-colors">
            How It Works
          </a>
          <a href="#privacy" className="hover:text-study-primary transition-colors">
            Privacy & Architecture
          </a>
        </nav>

        {/* Status Pill & Action */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenOllamaModal}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium bg-white hover:bg-paper-200 border-paper-300 text-navy-800 transition-colors shadow-2xs"
            title="Inspect local Ollama inference status"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                ollamaStatus?.running ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{ollamaStatus?.running ? 'Local AI Active' : 'Ollama Setup'}</span>
          </button>

          <a
            href="#workspace"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-study-primary text-white hover:bg-study-secondary transition-colors shadow-subtle"
          >
            Start Studying
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-navy-700 hover:text-navy-950 rounded-lg hover:bg-paper-200"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-paper-300 bg-white px-4 py-4 space-y-3">
          <a
            href="#workspace"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-navy-800 hover:text-study-primary"
          >
            Workspace
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-navy-800 hover:text-study-primary"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-navy-800 hover:text-study-primary"
          >
            How It Works
          </a>
          <a
            href="#privacy"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-navy-800 hover:text-study-primary"
          >
            Privacy & Architecture
          </a>
          <div className="pt-2 border-t border-paper-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOllamaModal();
              }}
              className="w-full text-left py-2 px-3 text-xs bg-paper-100 rounded-lg text-navy-800 font-medium"
            >
              Status: {ollamaStatus?.running ? 'Ollama Online' : 'Ollama Offline (Click for setup)'}
            </button>
            <a
              href="#workspace"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-study-primary text-white"
            >
              Start Studying
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
