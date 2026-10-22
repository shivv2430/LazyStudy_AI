import React from 'react';
import { ShieldCheck, HardDrive, Cpu, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';

export default function PrivacySection() {
  const points = [
    {
      icon: ShieldCheck,
      title: 'Zero Third-Party Cloud Uploads',
      description:
        'When operating in local inference mode, your notes are processed directly by your machine’s Ollama instance. Your raw text is not sent to external proprietary cloud APIs.',
    },
    {
      icon: DollarSign,
      title: 'Zero Per-Request API Costs',
      description:
        'Open-weight models run on your existing CPU/GPU. There are no monthly subscriptions, usage quotas, or surprise credit-card billing tiers.',
    },
    {
      icon: RefreshCw,
      title: 'Swappable Open-Weight Models',
      description:
        'Switch between Qwen 2.5, Gemma 2, or Llama 3.2 simply by changing an environment variable (`OLLAMA_MODEL`)—no frontend re-compilation required.',
    },
    {
      icon: HardDrive,
      title: 'True Offline Capability (With Caveats)',
      description:
        'Once you download your chosen model via Ollama (e.g. `ollama pull qwen2.5:3b`), the inference engine operates entirely without an internet connection.',
    },
  ];

  return (
    <section id="privacy" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-paper-300">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-study-primary">
          Privacy & Engineering Rationale
        </div>
        <h2 className="text-3xl font-serif font-bold text-navy-950">
          Why Local Open-Weight AI Matters for Students
        </h2>
        <p className="text-sm text-navy-600 leading-relaxed">
          Students often paste private essay drafts, proprietary university slides, or unpublished research into AI tools. We believe that study assistants should operate locally by default.
        </p>
      </div>

      {/* Grid of 4 architectural commitments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {points.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-paper-300 p-6 shadow-subtle flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-paper-200 text-study-primary flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-navy-900">{p.title}</h3>
                <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">{p.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Honest Limitations & Hardware Requirements Callout */}
      <div className="p-6 bg-paper-200/60 rounded-2xl border border-paper-300 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-navy-900">
          <AlertCircle className="w-4 h-4 text-study-primary" />
          Honest Technical Constraints & System Requirements
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-navy-700 leading-relaxed">
          <div className="p-3 bg-white rounded-lg border border-paper-300">
            <span className="font-semibold text-navy-900 block mb-1">RAM & Disk Space</span>
            Running <code className="text-study-primary font-mono">qwen2.5:3b</code> requires approximately 2GB disk storage and 4GB free RAM. On older laptops, <code className="text-study-primary font-mono">qwen2.5:1.5b</code> is recommended.
          </div>
          <div className="p-3 bg-white rounded-lg border border-paper-300">
            <span className="font-semibold text-navy-900 block mb-1">Inference Latency</span>
            Unlike commercial clusters, consumer laptop CPUs typically take 3 to 15 seconds to synthesize and stream a full multi-part quiz or revision plan.
          </div>
          <div className="p-3 bg-white rounded-lg border border-paper-300">
            <span className="font-semibold text-navy-900 block mb-1">Prerequisite Setup</span>
            Ollama must be installed and running on your host OS. If Ollama is not active, LazyStudy AI provides an explicit Demo Mode fallback so the UI remains testable.
          </div>
        </div>
      </div>
    </section>
  );
}
