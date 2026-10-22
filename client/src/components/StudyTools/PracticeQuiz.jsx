import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronRight,
  Award,
  AlertCircle,
  Info,
} from 'lucide-react';

export default function PracticeQuiz({ quiz, metadata }) {
  const questions = quiz?.questions || [];
  const quizTitle = quiz?.title || 'Practice Assessment';

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIdx]: { selected: number, isCorrect: boolean } }
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIdx] || {};
  const isLastQuestion = currentIdx === questions.length - 1;

  const handleSelectOption = (optIdx) => {
    if (submitted) return; // Prevent changing after submit
    setSelectedOption(optIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || submitted) return;

    const isCorrect = selectedOption === currentQ.correctIndex;
    setUserAnswers((prev) => ({
      ...prev,
      [currentIdx]: {
        selected: selectedOption,
        isCorrect,
      },
    }));
    setSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizFinished(true);
    } else {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setSubmitted(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setSubmitted(false);
    setUserAnswers({});
    setQuizFinished(false);
  };

  if (!questions.length) {
    return (
      <div className="p-8 text-center text-navy-500 bg-white rounded-xl border border-paper-300">
        No quiz questions generated. Please check your notes and try again.
      </div>
    );
  }

  // Calculate final score
  const totalCorrect = Object.values(userAnswers).filter((a) => a.isCorrect).length;
  const scorePercent = Math.round((totalCorrect / questions.length) * 100);

  // OPTION LETTERS
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-paper-300">
        <div>
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-study-primary" />
            {quizTitle}
          </h2>
          <p className="text-xs text-navy-500 mt-0.5">
            {questions.length} multiple choice questions • Active knowledge testing
          </p>
        </div>

        {!quizFinished && (
          <span className="text-xs font-semibold px-3 py-1 bg-study-light text-study-primary rounded-full border border-study-border">
            Question {currentIdx + 1} of {questions.length}
          </span>
        )}
      </div>

      {metadata?.isDemo && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Demo Simulation Mode:</span> Quiz questions are simulated based on your notes for offline UI validation.
          </div>
        </div>
      )}

      {/* QUIZ COMPLETION SUMMARY SCREEN */}
      {quizFinished ? (
        <div className="bg-white rounded-2xl border border-paper-300 p-8 sm:p-10 shadow-subtle text-center max-w-xl mx-auto space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-study-light text-study-primary mx-auto flex items-center justify-center border-2 border-study-border">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-navy-900">Quiz Completed!</h3>
            <p className="text-sm text-navy-600 mt-1">Here is how well you retained the material</p>
          </div>

          <div className="p-6 bg-paper-100 rounded-xl border border-paper-300 inline-block w-full">
            <div className="text-4xl font-extrabold text-navy-900 mb-1">
              {totalCorrect} / {questions.length}
            </div>
            <div className="text-sm font-semibold text-study-primary">
              {scorePercent}% Accuracy
            </div>
            <p className="text-xs text-navy-500 mt-2">
              {scorePercent >= 80
                ? 'Excellent mastery! You have grasped the core mechanisms thoroughly.'
                : scorePercent >= 60
                ? 'Good effort! Review the detailed explanations below to strengthen edge cases.'
                : 'Consider reviewing the Smart Summary again before attempting another round.'}
            </p>
          </div>

          {/* Breakdown list */}
          <div className="text-left space-y-4 pt-4 border-t border-paper-200">
            <h4 className="text-sm font-semibold text-navy-900">Question Summary Review:</h4>
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const ans = userAnswers[idx];
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border text-xs ${
                      ans?.isCorrect
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50/50 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="flex items-start gap-2 font-medium mb-1">
                      {ans?.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <span>
                        Q{idx + 1}: {q.question}
                      </span>
                    </div>
                    <p className="ml-6 text-navy-600 text-[11px] leading-relaxed">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleRestartQuiz}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-study-primary text-white text-sm font-medium rounded-xl hover:bg-study-secondary transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE QUESTION CARD */
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-paper-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-study-primary transition-all duration-300"
              style={{ width: `${Math.round(((currentIdx + 1) / questions.length) * 100)}%` }}
            />
          </div>

          <div className="bg-white rounded-2xl border border-paper-300 p-6 sm:p-8 shadow-card">
            {/* Question Text */}
            <h3 className="text-lg sm:text-xl font-medium text-navy-900 leading-snug mb-6">
              <span className="text-study-primary font-bold mr-2">Q{currentIdx + 1}.</span>
              {currentQ.question}
            </h3>

            {/* 4 Answer Options */}
            <div className="space-y-3" role="radiogroup" aria-label="Answer options">
              {(currentQ.options || []).map((optionText, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrect = currentQ.correctIndex === optIdx;

                // Color styling depending on whether user submitted
                let buttonStyle = 'bg-paper-100 hover:bg-paper-200/80 border-paper-300 text-navy-800';
                if (!submitted && isSelected) {
                  buttonStyle = 'bg-study-light border-study-secondary text-study-primary font-medium';
                } else if (submitted) {
                  if (isCorrect) {
                    buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium';
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = 'bg-rose-50 border-rose-400 text-rose-950';
                  } else {
                    buttonStyle = 'bg-paper-100/50 border-paper-200 text-navy-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={submitted}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 ${buttonStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                        isSelected && !submitted
                          ? 'bg-study-primary text-white border-study-primary'
                          : submitted && isCorrect
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : submitted && isSelected && !isCorrect
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white border-paper-300 text-navy-600'
                      }`}
                    >
                      {optionLetters[optIdx]}
                    </span>
                    <span className="text-sm leading-relaxed grow">{optionText}</span>

                    {/* Submission state icon indicators */}
                    {submitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {submitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Callout (Revealed ONLY after submission) */}
            {submitted && (
              <div
                className={`mt-6 p-4 rounded-xl border text-sm leading-relaxed animate-fadeIn ${
                  selectedOption === currentQ.correctIndex
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-paper-200/80 border-paper-300 text-navy-800'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider mb-1.5 text-navy-700">
                  <Info className="w-4 h-4 text-study-primary" />
                  Explanation
                </div>
                <p className="text-xs sm:text-sm text-navy-800">{currentQ.explanation}</p>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="mt-8 pt-4 border-t border-paper-200 flex items-center justify-between">
              <span className="text-xs text-navy-500">
                {!submitted ? 'Select an answer to submit' : 'Review explanation and continue'}
              </span>

              {!submitted ? (
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-5 py-2.5 bg-study-primary text-white text-sm font-medium rounded-xl hover:bg-study-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-navy-900 text-white text-sm font-medium rounded-xl hover:bg-navy-800 transition-colors"
                >
                  <span>{isLastQuestion ? 'View Results' : 'Next Question'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
