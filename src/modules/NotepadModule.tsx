import React, { useState, useEffect } from 'react';
import { Save, Trash2, FileText, Copy, Clock, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotepadModule: React.FC = () => {
  const [note, setNote] = useState('');
  const [history, setHistory] = useState<{id: number, text: string, date: string}[]>([]);

  // Use Cookie/LocalStorage for non-BD storage
  useEffect(() => {
    const saved = localStorage.getItem('kumari_notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setHistory(parsed);
      } catch (e) {
        console.error("Failed to load notes");
      }
    }
  }, []);

  const saveNote = () => {
    if (!note.trim()) return;
    const newNote = {
      id: Date.now(),
      text: note,
      date: new Date().toLocaleString()
    };
    const newHistory = [newNote, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('kumari_notes', JSON.stringify(newHistory));
    setNote('');
  };

  const deleteNote = (id: number) => {
    const newHistory = history.filter(n => n.id !== id);
    setHistory(newHistory);
    localStorage.setItem('kumari_notes', JSON.stringify(newHistory));
  };

  const copyNote = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter flex items-center gap-3 italic">
            SCRATCHPAD
          </h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">Local Ephemeral Storage</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setNote('')}
            className="p-3 glass-panel rounded-xl text-gray-400 hover:text-white transition-all"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative glass-panel rounded-3xl overflow-hidden p-1">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Start writing technical notes..."
              className="w-full h-[400px] bg-transparent p-8 text-gray-200 font-mono text-sm focus:outline-none resize-none"
            />
            <div className="absolute bottom-6 right-6">
              <button
                onClick={saveNote}
                disabled={!note.trim()}
                className="px-6 py-3 bg-white text-black font-black rounded-xl flex items-center gap-2 hover:bg-cyan-500 transition-all disabled:opacity-30 disabled:grayscale group"
              >
                <Save size={18} /> SAVE TO BUFFER
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] text-gray-500 font-black tracking-[0.3em] uppercase flex items-center gap-2 px-2">
            <Clock size={12} /> Buffer History
          </h3>
          
          <div className="space-y-4 max-h-[420px] overflow-y-auto custom-scrollbar pr-2">
            <AnimatePresence>
              {history.length === 0 ? (
                <div className="text-center py-10 opacity-20 italic text-xs">No active buffers</div>
              ) : (
                history.map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-panel p-5 rounded-2xl group relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[8px] text-cyan-500 font-bold tracking-widest">{n.date}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => copyNote(n.text)}
                          className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg"
                        >
                          <Copy size={14} />
                        </button>
                        <button 
                          onClick={() => deleteNote(n.id)}
                          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed font-mono">
                      {n.text}
                    </p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl bg-cyan-500/5 border-cyan-500/10">
            <div className="flex items-center gap-3 mb-3 text-cyan-500">
              <FileText size={20} />
              <span className="text-xs font-black tracking-widest uppercase italic">Privacy Note</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed italic">
              These notes are stored locally in your browser's LocalStorage. They never leave your device and will persist until you clear your browser data or delete them manually.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotepadModule;
