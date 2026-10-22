import React from 'react';
import { BookOpen, Heart, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-paper-300 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-navy-600">
        {/* Brand & Mission */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-study-primary text-white flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-navy-900">LazyStudy AI</span>
            <span className="mx-2 text-paper-400">|</span>
            <span>Your notes. Less effort. More learning.</span>
          </div>
        </div>

        {/* Hacktoberfest Tag */}
        <div className="text-center sm:text-right space-y-1">
          <p className="flex items-center justify-center sm:justify-end gap-1 text-navy-700">
            <span>Built for Hacktoberfest Open-Source AI Challenge</span>
            <span className="text-study-primary font-medium">(Week 3: Slow and Steady)</span>
          </p>
          <p className="text-[11px] text-navy-400">
            Open-weight inference powered by Ollama • Zero telemetry • MIT License
          </p>
        </div>
      </div>
    </footer>
  );
}
