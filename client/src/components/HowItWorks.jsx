import React from 'react';
import { FileEdit, Sliders, CheckCircle, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Add your notes',
      icon: FileEdit,
      description:
        'Paste your lecture notes, textbook passages, or code comments directly into the workspace, or upload a .txt or .md document up to 250KB.',
    },
    {
      num: '02',
      title: 'Choose a study tool',
      icon: Sliders,
      description:
        'Select whether you need a quick concept overview, memorization flashcards, an active quiz, or an actionable multi-session revision checklist.',
    },
    {
      num: '03',
      title: 'Review your results',
      icon: CheckCircle,
      description:
        'Engage with your generated material immediately: flip flashcards, attempt quiz questions, check off revision milestones, or copy formatted markdown.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-paper-300">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-study-primary">
          Workflow
        </div>
        <h2 className="text-3xl font-serif font-bold text-navy-950">How LazyStudy AI Works</h2>
        <p className="text-sm text-navy-600 leading-relaxed">
          Three simple steps to transition from passive note collecting to focused active learning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="bg-white rounded-2xl border border-paper-300 p-8 shadow-subtle relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-serif font-bold text-paper-400">{s.num}</span>
                  <div className="w-10 h-10 rounded-xl bg-paper-200 text-study-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-navy-900 mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">{s.description}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-paper-100 flex items-center gap-1.5 text-xs text-study-primary font-medium">
                <span>Step {s.num}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
