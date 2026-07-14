import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import StrengthMeter from './components/StrengthMeter';
import HashLab from './components/HashLab';
import BreachChecker from './components/BreachChecker';
import Generator from './components/Generator';
import EncryptionLab from './components/EncryptionLab';

export default function App() {
  const [activeTab, setActiveTab] = useState('strength');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode} activeTab={activeTab} setActiveTab={setActiveTab}>
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">Security Modules</h2>
        
        {activeTab === 'strength' && <StrengthMeter />}
        {activeTab === 'hash' && <HashLab />}
        {activeTab === 'breach' && <BreachChecker />}
        {activeTab === 'generator' && <Generator />}
        {activeTab === 'encryption' && <EncryptionLab />}
      </main>
    </Layout>
  );
}