import React, { useState } from 'react';
import {
  CalendarCheck,
  Clock,
  CheckSquare,
  Square,
  Copy,
  Check,
  AlertTriangle,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';

export default function RevisionPlan({ revisionPlan, metadata }) {
  const plan = revisionPlan || {};
  const sessions = plan.sessions || [];
  const keyDefinitions = plan.keyDefinitions || [];

  // Track completed task IDs
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [copied, setCopied] = useState(false);

  // Calculate total tasks and progress
  const allTaskIds = sessions.flatMap((s) => (s.tasks || []).map((t) => t.id));
  const totalTasks = allTaskIds.length;
  const completedCount = allTaskIds.filter((id) => completedTasks.has(id)).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const toggleTask = (taskId) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const handleCopyPlan = () => {
    let text = `# ${plan.title || 'Revision Plan'}\n`;
    text += `Estimated Time: ~${plan.totalEstimatedMinutes || 60} mins\n\n`;

    text += `## Key Definitions\n`;
    keyDefinitions.forEach((d) => {
      text += `- **${d.term}:** ${d.definition}\n`;
    });

    text += `\n## Study Sessions\n`;
    sessions.forEach((s) => {
      text += `\n### ${s.sessionTitle} (~${s.durationMinutes} mins)\nObjective: ${s.objective}\n`;
      (s.tasks || []).forEach((t) => {
        const mark = completedTasks.has(t.id) ? '[x]' : '[ ]';
        text += `- ${mark} ${t.task}\n`;
      });
    });

    text += `\n---\nDisclaimer: ${plan.disclaimer || 'Suggested study pacing only.'}\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!sessions.length && !keyDefinitions.length) {
    return (
      <div className="p-8 text-center text-navy-500 bg-white rounded-xl border border-paper-300">
        No revision plan generated. Please provide more detailed notes.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-paper-300">
        <div>
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-study-primary" />
            {plan.title || 'Structured Revision Strategy'}
          </h2>
          <p className="text-xs text-navy-500 mt-0.5 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              ~{plan.totalEstimatedMinutes || 75} mins total
            </span>
            <span>•</span>
            <span>{sessions.length} focused sessions</span>
          </p>
        </div>

        <button
          onClick={handleCopyPlan}
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
              <span>Copy Checklist</span>
            </>
          )}
        </button>
      </div>

      {/* Progress & Disclaimer Box */}
      <div className="bg-white p-5 rounded-xl border border-paper-300 shadow-subtle space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-navy-700 font-medium mb-1.5">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-study-primary" />
              Checklist Progress
            </span>
            <span>
              {completedCount} of {totalTasks} tasks completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-paper-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-study-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold">Academic Notice:</strong>{' '}
            {plan.disclaimer ||
              'This revision plan is an automated study suggestion based strictly on your uploaded notes, not a guarantee of exam performance.'}
          </p>
        </div>
      </div>

      {/* KEY DEFINITIONS REPOSITORY */}
      {keyDefinitions.length > 0 && (
        <div className="bg-white rounded-xl border border-paper-300 p-6 shadow-subtle">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-study-primary mb-4 flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            Core Definitions & Key Terminology
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {keyDefinitions.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-paper-100 rounded-lg border border-paper-300 hover:border-study-border transition-colors"
              >
                <div className="text-xs font-bold text-navy-900 mb-1">{item.term}</div>
                <div className="text-xs text-navy-700 leading-relaxed">{item.definition}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SESSIONS & CHECKLISTS */}
      <div className="space-y-4">
        {sessions.map((session, sIdx) => {
          const sessionTasks = session.tasks || [];
          const sessionCompleted = sessionTasks.filter((t) => completedTasks.has(t.id)).length;
          const isSessionAllDone = sessionTasks.length > 0 && sessionCompleted === sessionTasks.length;

          return (
            <div
              key={session.id || sIdx}
              className={`bg-white rounded-xl border p-6 transition-all ${
                isSessionAllDone ? 'border-emerald-300 bg-emerald-50/20' : 'border-paper-300 shadow-subtle'
              }`}
            >
              {/* Session Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-paper-200">
                <div>
                  <h4 className="text-base font-semibold text-navy-900">{session.sessionTitle}</h4>
                  <p className="text-xs text-navy-500 mt-0.5">Objective: {session.objective}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-paper-200 text-navy-700 font-medium">
                    <Clock className="w-3 h-3" />
                    {session.durationMinutes} mins
                  </span>
                  {isSessionAllDone && (
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2.5 py-1 rounded-md">
                      Session Completed
                    </span>
                  )}
                </div>
              </div>

              {/* Checklist items */}
              <div className="space-y-2.5">
                {sessionTasks.map((task) => {
                  const isChecked = completedTasks.has(task.id);
                  return (
                    <label
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`cursor-pointer p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                        isChecked
                          ? 'bg-paper-100/60 border-paper-200 text-navy-500 line-through'
                          : 'bg-white border-paper-300 hover:bg-paper-100/50 text-navy-800'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 shrink-0 text-navy-600 focus:outline-none"
                        aria-label={isChecked ? 'Mark task incomplete' : 'Mark task complete'}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-navy-400" />
                        )}
                      </button>
                      <span className="text-xs sm:text-sm leading-relaxed">{task.task}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
