import React, { useState } from 'react';
import { Copy, Check, Download, BookOpen, Sparkles, AlertCircle } from 'lucide-react';

export default function SmartSummary({ summary, metadata, onReset }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = 'lazystudy-summary.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Convert raw markdown headings and bullets into clean semantic HTML sections
  const renderFormattedSummary = (text) => {
    const sections = text.split(/\n(?=##\s+)/);

    return sections.map((sec, idx) => {
      const trimmed = sec.trim();
      const firstLineEnd = trimmed.indexOf('\n');
      const headerLine = firstLineEnd !== -1 ? trimmed.slice(0, firstLineEnd) : trimmed;
      const bodyText = firstLineEnd !== -1 ? trimmed.slice(firstLineEnd + 1).trim() : '';

      const title = headerLine.replace(/^##\s+/, '').trim();

      if (title.toLowerCase().includes('overview')) {
        return (
          <div key={idx} className="mb-6 p-5 bg-paper-200/60 rounded-xl border border-paper-300">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-study-primary mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {title}
            </h3>
            <p className="text-navy-800 leading-relaxed text-base">{bodyText}</p>
          </div>
        );
      }

      if (title.toLowerCase().includes('key takeaway') || title.toLowerCase().includes('takeaway')) {
        const bullets = bodyText.split(/\n[-*]\s+/).filter(Boolean);
        return (
          <div key={idx} className="mb-6 p-5 bg-study-light/50 rounded-xl border border-study-border/60">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-study-secondary mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {title}
            </h3>
            <ul className="space-y-2.5">
              {bullets.map((b, bIdx) => (
                <li key={bIdx} className="flex items-start gap-2.5 text-navy-800 text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-study-primary mt-2 shrink-0" />
                  <span>{b.replace(/^[-*]\s*/, '')}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      // Default section
      const lines = bodyText.split('\n');
      return (
        <div key={idx} className="mb-6 pb-6 border-b border-paper-300 last:border-b-0">
          <h3 className="text-lg font-semibold text-navy-900 mb-3">{title}</h3>
          <div className="space-y-2 text-navy-800 text-sm leading-relaxed">
            {lines.map((line, lIdx) => {
              const cleanLine = line.trim();
              if (!cleanLine) return null;
              if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 ml-1">
                    <span className="text-navy-400 mt-1">•</span>
                    <span>{cleanLine.replace(/^[-*]\s+/, '')}</span>
                  </div>
                );
              }
              if (cleanLine.startsWith('- [ ]') || cleanLine.startsWith('- [x]')) {
                return (
                  <div key={lIdx} className="flex items-center gap-2.5 py-1 text-navy-700">
                    <input type="checkbox" readOnly className="rounded text-study-primary focus:ring-0" />
                    <span>{cleanLine.replace(/^-\s*\[[ x]\]\s*/, '')}</span>
                  </div>
                );
              }
              return <p key={lIdx}>{cleanLine}</p>;
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-paper-300">
        <div>
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-study-primary" />
            Smart Academic Summary
          </h2>
          <p className="text-xs text-navy-500 mt-0.5">
            Grounded strictly in your supplied notes • {metadata?.modelUsed || 'local model'}
            {metadata?.processingTimeMs && ` • ${(metadata.processingTimeMs / 1000).toFixed(2)}s`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-navy-700 bg-white border border-paper-300 rounded-lg hover:bg-paper-200 transition-colors"
            title="Copy summary text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-navy-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-navy-700 bg-white border border-paper-300 rounded-lg hover:bg-paper-200 transition-colors"
            title="Download markdown file"
          >
            <Download className="w-3.5 h-3.5 text-navy-500" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {metadata?.isDemo && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Demo Simulation Mode:</span> This result was generated in demo mode for fast testing. To run real local AI inference with complete privacy, install Ollama and run <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-950 font-mono">ollama run qwen2.5:3b</code>.
          </div>
        </div>
      )}

      {/* Summary Body */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-paper-300 shadow-subtle">
        {renderFormattedSummary(summary)}
      </div>
    </div>
  );
}
