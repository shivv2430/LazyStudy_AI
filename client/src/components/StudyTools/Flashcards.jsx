import React, { useState, useEffect } from 'react';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shuffle,
  CheckCircle2,
  Copy,
  Check,
  LayoutGrid,
  Maximize2,
  AlertCircle,
} from 'lucide-react';

export default function Flashcards({ flashcards = [], metadata }) {
  const [cards, setCards] = useState(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState(new Set());
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'grid'
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
  }, [flashcards]);

  const currentCard = cards[currentIndex] || {};
  const isMastered = masteredIds.has(currentCard.id || currentIndex);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const toggleMastered = (id) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const handleCopyAll = () => {
    const text = cards
      .map((c, i) => `Card ${i + 1} [${c.concept || 'General'}]\nQ: ${c.question}\nA: ${c.answer}\n`)
      .join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcut listener for space/arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode !== 'single') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length, viewMode]);

  if (!cards.length) {
    return (
      <div className="p-8 text-center text-navy-500 bg-white rounded-xl border border-paper-300">
        No flashcards generated. Please check your notes input.
      </div>
    );
  }

  const masteredCount = masteredIds.size;
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-paper-300">
        <div>
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-study-primary" />
            Active Recall Flashcards
          </h2>
          <p className="text-xs text-navy-500 mt-0.5">
            {cards.length} cards generated • {masteredCount} marked as mastered
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-paper-200 p-0.5 rounded-lg border border-paper-300">
            <button
              onClick={() => setViewMode('single')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'single' ? 'bg-white text-navy-900 shadow-xs' : 'text-navy-600 hover:text-navy-900'
              }`}
              title="Single Card Focus"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-white text-navy-900 shadow-xs' : 'text-navy-600 hover:text-navy-900'
              }`}
              title="Grid View (All Cards)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-navy-700 bg-white border border-paper-300 rounded-lg hover:bg-paper-200 transition-colors"
            title="Shuffle deck"
          >
            <Shuffle className="w-3.5 h-3.5 text-navy-500" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          <button
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-navy-700 bg-white border border-paper-300 rounded-lg hover:bg-paper-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-navy-500" />
                <span>Copy Deck</span>
              </>
            )}
          </button>
        </div>
      </div>

      {metadata?.isDemo && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Demo Simulation Mode:</span> Flashcards are generated in demo mode for quick testing without waiting on Ollama.
          </div>
        </div>
      )}

      {/* SINGLE CARD INTERACTIVE MODE */}
      {viewMode === 'single' ? (
        <div className="max-w-xl mx-auto space-y-4">
          {/* Progress Tracker */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-navy-600">
              <span className="font-medium">
                Card {currentIndex + 1} of {cards.length}
              </span>
              <span className="text-navy-400">
                Tip: Press <kbd className="px-1.5 py-0.5 bg-paper-200 border border-paper-300 rounded text-navy-700 font-mono text-[10px]">Space</kbd> to flip, <kbd className="px-1.5 py-0.5 bg-paper-200 border border-paper-300 rounded text-navy-700 font-mono text-[10px]">← / →</kbd> to navigate
              </span>
            </div>
            <div className="w-full h-1.5 bg-paper-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-study-primary transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Flashcard Box */}
          <div
            onClick={handleFlip}
            className="cursor-pointer group relative min-h-[300px] sm:min-h-[340px] bg-white rounded-2xl border-2 border-paper-300 hover:border-study-accent/60 shadow-card hover:shadow-elevated transition-all p-8 flex flex-col justify-between"
          >
            {/* Card Header Tag */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-study-light text-study-primary border border-study-border">
                {currentCard.concept || 'Concept'}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMastered(currentCard.id || currentIndex);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  isMastered
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-navy-500 hover:text-navy-800 bg-paper-200/50 hover:bg-paper-200'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isMastered ? 'text-emerald-600' : 'text-navy-400'}`} />
                {isMastered ? 'Mastered' : 'Mark Mastered'}
              </button>
            </div>

            {/* Card Content (Question or Answer) */}
            <div className="my-auto py-6 text-center">
              {!isFlipped ? (
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-400 block mb-3">
                    Question (Prompt)
                  </span>
                  <p className="text-xl sm:text-2xl font-serif text-navy-900 leading-snug">
                    {currentCard.question}
                  </p>
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 block mb-3">
                    Answer (Recall)
                  </span>
                  <p className="text-base sm:text-lg text-navy-800 leading-relaxed font-sans">
                    {currentCard.answer}
                  </p>
                </div>
              )}
            </div>

            {/* Card Footer Hint */}
            <div className="flex items-center justify-center gap-1 text-xs text-navy-400 group-hover:text-study-secondary transition-colors">
              <RotateCw className="w-3.5 h-3.5" />
              <span>{!isFlipped ? 'Click card or press Space to reveal answer' : 'Click to see question again'}</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-navy-800 bg-white border border-paper-300 rounded-xl hover:bg-paper-200 disabled:opacity-40 disabled:hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={handleFlip}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-study-primary hover:text-study-secondary transition-colors"
            >
              Flip Card
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-study-primary rounded-xl hover:bg-study-secondary disabled:opacity-40 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* GRID VIEW (ALL CARDS AT ONCE) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, idx) => {
            const mastered = masteredIds.has(card.id || idx);
            return (
              <div
                key={card.id || idx}
                className="bg-white rounded-xl border border-paper-300 p-5 shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-medium text-study-primary bg-study-light px-2 py-0.5 rounded-full">
                      {card.concept || `Card ${idx + 1}`}
                    </span>
                    <button
                      onClick={() => toggleMastered(card.id || idx)}
                      className={`text-xs p-1 rounded hover:bg-paper-200 ${
                        mastered ? 'text-emerald-600' : 'text-navy-400'
                      }`}
                      title={mastered ? 'Marked as Mastered' : 'Mark as Mastered'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="text-sm font-semibold text-navy-900 mb-2">{card.question}</h4>
                </div>

                <div className="mt-4 pt-3 border-t border-paper-200 bg-paper-100/60 -mx-5 -mb-5 p-4 rounded-b-xl">
                  <span className="text-[10px] uppercase font-semibold text-navy-500 block mb-1">Answer</span>
                  <p className="text-xs text-navy-800 leading-relaxed">{card.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
