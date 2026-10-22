import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StudyWorkspace from './components/StudyWorkspace';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import PrivacySection from './components/PrivacySection';
import Footer from './components/Footer';
import OllamaStatusModal from './components/OllamaStatusModal';
import { fetchHealth } from './services/api';

export default function App() {
  const [ollamaStatus, setOllamaStatus] = useState({
    running: false,
    models: [],
    activeModel: 'qwen2.5:3b',
    host: 'http://127.0.0.1:11434',
  });
  const [demoMode, setDemoMode] = useState(true); // Default to demo simulation if Ollama isn't started yet
  const [isOllamaModalOpen, setIsOllamaModalOpen] = useState(false);

  const checkStatus = async () => {
    try {
      const data = await fetchHealth();
      if (data?.ollama) {
        setOllamaStatus({
          running: !!data.ollama.running,
          models: data.ollama.models || [],
          activeModel: data.activeModel || 'qwen2.5:3b',
          host: data.host || 'http://127.0.0.1:11434',
        });
        // If Ollama is running, turn demo mode off by default so real local inference is used!
        if (data.ollama.running) {
          setDemoMode(false);
        }
      }
    } catch (e) {
      console.warn('Backend or Ollama check failed:', e);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-paper-100 text-navy-900 font-sans selection:bg-study-light selection:text-study-primary">
      <Navbar
        ollamaStatus={ollamaStatus}
        onOpenOllamaModal={() => setIsOllamaModalOpen(true)}
      />

      <main className="grow">
        <Hero />
        <StudyWorkspace
          ollamaStatus={ollamaStatus}
          demoMode={demoMode}
          setDemoMode={setDemoMode}
          onOpenOllamaModal={() => setIsOllamaModalOpen(true)}
        />
        <FeaturesSection />
        <HowItWorks />
        <PrivacySection />
      </main>

      <Footer />

      <OllamaStatusModal
        isOpen={isOllamaModalOpen}
        onClose={() => setIsOllamaModalOpen(false)}
        ollamaStatus={ollamaStatus}
        onRefreshStatus={checkStatus}
      />
    </div>
  );
}
