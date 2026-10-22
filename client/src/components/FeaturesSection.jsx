import React from 'react';
import { BookOpen, Layers, HelpCircle, CalendarCheck, Check, ArrowRight } from 'lucide-react';

export default function FeaturesSection() {
  const featureList = [
    {
      id: 'summary',
      name: 'Smart Summary',
      icon: BookOpen,
      headline: 'Distill lengthy chapters into clean concept hierarchies',
      description:
        'Converts messy lecture notes or textbook transcripts into structured summaries with overviews, core definitions, and bulleted takeaways. Grounded strictly in your notes with zero invented facts.',
      highlights: [
        'Preserves formulas, technical definitions, and real examples',
        'Organized markdown hierarchy ready to export',
        'Includes self-check recall prompts at the bottom',
      ],
    },
    {
      id: 'flashcards',
      name: 'Flashcard Maker',
      icon: Layers,
      headline: 'Active recall cards with intuitive flip and shuffle mechanics',
      description:
        'Generates atomic question-and-answer pairs focused on single concepts. Flip cards to test yourself, mark mastered items, or switch to grid view for a comprehensive glance before tests.',
      highlights: [
        'Single concept focus prevents cognitive overload',
        'Interactive keyboard shortcuts (Space to flip, arrows to navigate)',
        'Track mastered cards and shuffle order on demand',
      ],
    },
    {
      id: 'quiz',
      name: 'Practice Quiz',
      icon: HelpCircle,
      headline: 'Multiple-choice questions with instant answer rationales',
      description:
        'Validates comprehension with 4-choice questions. The app never reveals the answer prematurely. After you submit, it displays why the correct choice is right and highlights where common traps lie.',
      highlights: [
        '4 plausible options derived from your supplied context',
        'Detailed explanations explaining the underlying mechanism',
        'End-of-quiz score breakdown with one-click retake',
      ],
    },
    {
      id: 'revision',
      name: 'Quick Revision Plan',
      icon: CalendarCheck,
      headline: 'Spaced review sessions with an interactive checklist',
      description:
        'Breaks dense topics into manageable study blocks (e.g. 25-35 minutes each). Check off items as you study to maintain momentum, accompanied by an explicit disclaimer that this is a suggested guide.',
      highlights: [
        'Extracts a glossary of core definitions to memorize',
        'Clear checklist items with instant completion tracking',
        'Estimates total study time to plan your study sessions',
      ],
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-paper-300">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-study-primary">
          Core Capabilities
        </div>
        <h2 className="text-3xl font-serif font-bold text-navy-950">
          Four Purpose-Built Tools for Real Learning
        </h2>
        <p className="text-sm text-navy-600 leading-relaxed">
          Each tool is engineered to support cognitive science principles like active recall and spaced revision, rather than generating filler text.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featureList.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.id}
              className="bg-white rounded-2xl border border-paper-300 p-8 shadow-subtle hover:border-study-border transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-study-light text-study-primary flex items-center justify-center border border-study-border">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-navy-400">
                    {f.name}
                  </span>
                  <h3 className="text-lg font-bold text-navy-900 mt-1">{f.headline}</h3>
                </div>
                <p className="text-sm text-navy-700 leading-relaxed">{f.description}</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-paper-200">
                {f.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-navy-600">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
