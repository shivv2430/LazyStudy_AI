import React from 'react';
import { ArrowRight, CheckCircle2, Shield, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-16 pb-12 sm:pt-24 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-paper-200 border border-paper-300 text-navy-800">
          <span className="w-1.5 h-1.5 rounded-full bg-study-primary" />
          <span>Hacktoberfest Open-Source AI Challenge • Slow & Steady</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-navy-950 tracking-tight leading-[1.15]">
          Study smarter.{' '}
          <span className="text-study-primary underline decoration-paper-300 decoration-wavy underline-offset-8">
            Spend less time organizing.
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl text-navy-700 leading-relaxed font-sans max-w-2xl mx-auto">
          Your notes. Less effort. More learning. Transform unorganized lecture notes and textbooks into structured summaries, active-recall flashcards, practice quizzes, and revision plans—processed 100% locally on your machine.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#workspace"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-white bg-study-primary hover:bg-study-secondary transition-all shadow-subtle hover:shadow-card"
          >
            <span>Start studying</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-navy-800 bg-white hover:bg-paper-200 border border-paper-300 transition-colors shadow-2xs"
          >
            <span>See how it works</span>
          </a>
        </div>

        {/* Honest Trust Badges (No fake stats) */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-navy-600">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-study-primary" />
            No API Keys or Subscriptions
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-study-primary" />
            Private Local Inference (Ollama)
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-study-primary" />
            Open-Weight Models (Qwen & Gemma)
          </span>
        </div>
      </div>

      {/* Compact Preview of Study Workspace */}
      <div className="mt-12 sm:mt-16 max-w-4xl mx-auto bg-white rounded-2xl border border-paper-300 shadow-elevated p-4 sm:p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-paper-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-300" />
            <div className="w-3 h-3 rounded-full bg-amber-300" />
            <div className="w-3 h-3 rounded-full bg-emerald-300" />
            <span className="ml-2 text-xs font-mono text-navy-400">workspace_preview.jsx</span>
          </div>
          <span className="text-[11px] font-medium text-study-primary bg-study-light px-2.5 py-0.5 rounded-full border border-study-border">
            Local Ollama Inference
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {/* Mock Input Side */}
          <div className="p-4 bg-paper-100 rounded-xl border border-paper-300 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-navy-600">
              <span>Raw Lecture Notes (Input)</span>
              <span>384 words</span>
            </div>
            <p className="text-xs text-navy-700 font-mono leading-relaxed bg-white p-3 rounded-lg border border-paper-200 line-clamp-5">
              Cellular respiration is the metabolic pathway through which cells break down glucose to produce ATP, carbon dioxide, and water. Stages: 1. Glycolysis (cytoplasm, anaerobic, net 2 ATP). 2. Krebs cycle (matrix). 3. ETC & oxidative phosphorylation (cristae, 30-32 ATP)...
            </p>
            <div className="flex gap-1.5 text-[10px] text-navy-500">
              <span className="bg-white px-2 py-0.5 rounded border border-paper-300">Smart Summary</span>
              <span className="bg-study-primary text-white px-2 py-0.5 rounded font-medium">Flashcards</span>
              <span className="bg-white px-2 py-0.5 rounded border border-paper-300">Practice Quiz</span>
            </div>
          </div>

          {/* Mock Output Side */}
          <div className="p-4 bg-paper-50 rounded-xl border border-study-border/60 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-navy-800">
              <span className="flex items-center gap-1.5 text-study-primary">
                <Layers className="w-3.5 h-3.5" />
                Active Recall Card 1 of 8
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Ready</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-paper-300 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-study-primary uppercase tracking-wider block">
                Prompt:
              </span>
              <p className="text-xs font-serif text-navy-900 font-medium">
                Where does glycolysis take place and does it require oxygen?
              </p>
              <div className="pt-2 border-t border-paper-200 mt-2">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Recall:
                </span>
                <p className="text-xs text-navy-700">
                  Cytoplasm (cytosol). It is anaerobic and does not require oxygen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
