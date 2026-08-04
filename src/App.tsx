import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  FileSearch, 
  Cpu, 
  Ghost, 
  FileText,
  X,
  GripHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MetadataModule from './modules/MetadataModule';
import CryptoModule from './modules/CryptoModule';
import CustomAlgoModule from './modules/CustomAlgoModule';
import SteganoModule from './modules/SteganoModule';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('metadata');
  const [showNotepad, setShowNotepad] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const savedNote = localStorage.getItem('kumari_quick_note');
    if (savedNote) setNote(savedNote);
  }, []);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    localStorage.setItem('kumari_quick_note', e.target.value);
  };

  const navItems = [
    { id: 'metadata', icon: FileSearch, label: 'EXIF & GREP' },
    { id: 'crypto', icon: Lock, label: 'CIPHER' },
    { id: 'custom-algo', icon: Cpu, label: 'FORGE' },
    { id: 'stegano', icon: Ghost, label: 'RGBA STEGO' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-cyan-500/50 overflow-hidden relative">
      {/* HUD Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0a192f_0%,#050505_100%)] opacity-50" />
        <svg width="100%" height="100%" className="opacity-10">
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="cyan" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Side HUD Nav */}
      <nav className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 group/nav">
        {navItems.map((item) => (
          <div key={item.id} className="relative flex items-center">
            <button
              onClick={() => setActiveTab(item.id)}
              className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 border shadow-lg ${
                activeTab === item.id 
                  ? 'bg-cyan-500 border-cyan-400 text-black scale-110 shadow-[0_0_20px_rgba(6,182,212,0.4)] z-10' 
                  : 'bg-black/80 border-white/10 text-gray-500 hover:border-cyan-500/50 hover:text-cyan-400 hover:scale-105'
              }`}
            >
              <item.icon className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
            </button>
            <div className={`absolute left-full ml-4 px-3 py-1.5 bg-cyan-500 text-black text-[10px] font-black rounded shadow-xl pointer-events-none transition-all duration-300 uppercase tracking-[0.2em] whitespace-nowrap ${
              activeTab === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              {item.label}
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-500 rotate-45" />
            </div>
          </div>
        ))}
        
        <div className="h-[1px] w-full bg-white/10 my-1 sm:my-2" />
        
        <button
          onClick={() => setShowNotepad(!showNotepad)}
          className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all border ${
            showNotepad ? 'bg-white text-black border-white' : 'bg-black/60 border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <FileText className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
        </button>
      </nav>

      {/* Floating Notepad Window */}
      <AnimatePresence>
        {showNotepad && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            drag
            dragMomentum={false}
            className="fixed z-[100] w-72 sm:w-80 h-80 sm:h-96 bg-[#080808]/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ left: 'clamp(20px, 80%, calc(100% - 350px))', top: '100px' }}
          >
            <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-2">
                <GripHorizontal size={14} className="text-gray-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Scratchpad</span>
              </div>
              <button onClick={() => setShowNotepad(false)} className="text-gray-500 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <textarea
              value={note}
              onChange={handleNoteChange}
              placeholder="System notes..."
              className="flex-1 bg-transparent p-4 text-xs font-mono text-cyan-400 focus:outline-none resize-none"
            />
            <div className="p-2 border-t border-white/5 text-[8px] text-gray-600 text-center uppercase tracking-tighter">
              AUTO-SAVED TO LOCAL BUFFER
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="ml-14 sm:ml-24 min-h-screen flex flex-col relative z-10">
        <header className="h-20 sm:h-24 flex items-center justify-between px-4 sm:px-12 shrink-0">
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              <span className="text-cyan-500">KUMARI</span> <span className="text-white/20">PRO</span>
            </h1>
            <div className="flex gap-4 mt-1">
              <div className="text-[9px] text-cyan-500/50 uppercase tracking-[0.3em]">Module: {activeTab}</div>
              <div className="text-[9px] text-green-500/50 uppercase tracking-[0.3em]">Identity: CIA_QUANTUM</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Live Terminal</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-12 pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto"
            >
              {activeTab === 'metadata' && <MetadataModule />}
              {activeTab === 'crypto' && <CryptoModule />}
              {activeTab === 'custom-algo' && <CustomAlgoModule />}
              {activeTab === 'stegano' && <SteganoModule />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* CRT Scanline */}
      <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
};

export default App;
