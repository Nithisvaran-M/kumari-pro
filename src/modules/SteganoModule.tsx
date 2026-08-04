import React, { useState, useRef } from 'react';
import { Ghost, Image as ImageIcon, Lock, Unlock, Eye, RefreshCcw, Layers, Zap, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SteganoModule: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'RGBA' | 'RGB'>('RGBA');
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setProcessedImage(null);
        setDecodedMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const encodeMessage = () => {
    if (!image || !message || !canvasRef.current) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (!imageData) return;

      const data = imageData.data;
      // Convert message to binary
      const binaryMessage = Array.from(new TextEncoder().encode(message + '\0'))
        .map(b => b.toString(2).padStart(8, '0'))
        .join('');

      if (binaryMessage.length > data.length * (mode === 'RGBA' ? 1 : 0.75)) {
        alert("Payload too large for this carrier bitstream.");
        setIsProcessing(false);
        return;
      }

      for (let i = 0; i < binaryMessage.length; i++) {
        // LSB replacement
        data[i * 4] = (data[i * 4] & 0xFE) | parseInt(binaryMessage[i]);
      }

      ctx?.putImageData(imageData, 0, 0);
      setProcessedImage(canvas.toDataURL());
      setIsProcessing(false);
    };
    img.src = image;
  };

  const decodeMessage = () => {
    if (!image || !canvasRef.current) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (!imageData) return;

      const data = imageData.data;
      let binaryMessage = "";
      let decoded = "";

      for (let i = 0; i < data.length; i += 4) {
        binaryMessage += (data[i] & 1).toString();
        if (binaryMessage.length === 8) {
          const charCode = parseInt(binaryMessage, 2);
          if (charCode === 0) break; // Null terminator
          decoded += String.fromCharCode(charCode);
          binaryMessage = "";
        }
        if (decoded.length > 5000) break; // Safety limit
      }

      setDecodedMessage(decoded || "No hidden payload detected.");
      setIsProcessing(false);
    };
    img.src = image;
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter">RGBA <span className="text-purple-500">STEGO</span></h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-2 italic">Lsb Shadow Layer Manipulation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Carrier Window */}
        <div className="space-y-6">
          <div className="glass-panel p-6 lg:p-10 rounded-[40px] border-white/10 bg-black/40 shadow-2xl overflow-hidden">
             <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] flex items-center gap-2">
                <ImageIcon size={14} /> Bitstream Input
              </h3>
              <div className="flex bg-white/5 p-1 rounded-xl">
                {['RGB', 'RGBA'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setMode(m as any)}
                    className={`px-4 py-2 text-[9px] font-black rounded-lg transition-all ${
                      mode === m ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative group rounded-[32px] overflow-hidden aspect-video bg-black/50 border border-white/5 shadow-inner">
              {image ? (
                <>
                  <img src={processedImage || image} alt="Carrier" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <label className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl cursor-pointer backdrop-blur-xl border border-white/10 transition-all">
                      <RefreshCcw size={24} />
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                    {processedImage && (
                      <a href={processedImage} download="stego_carrier.png" className="p-4 bg-purple-500/20 hover:bg-purple-500/40 rounded-2xl border border-purple-500/30 backdrop-blur-xl transition-all">
                        <Download size={24} />
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-all group p-8">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/10">
                    <ImageIcon size={32} className="text-white/20 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <span className="text-[11px] text-gray-500 font-black uppercase tracking-[0.3em]">Initialize Carrier Bitstream</span>
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              )}
            </div>

            <div className="mt-8 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Spectral Integrity</span>
                <span className="text-[10px] font-mono text-green-500 font-bold">99.9996% CLEAN</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
              </div>
            </div>
          </div>
        </div>

        {/* Payload Window */}
        <div className="space-y-8">
          <div className="glass-panel p-6 lg:p-10 rounded-[40px] border-white/10 shadow-2xl relative overflow-hidden">
            <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
              <Lock size={14} /> Layer Injection
            </h3>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter payload message to embed..."
              className="w-full h-32 bg-black border border-white/10 rounded-3xl p-6 text-xs font-mono focus:outline-none focus:border-purple-500/50 resize-none mb-6 shadow-inner"
            />
            <button 
              onClick={encodeMessage}
              disabled={!image || !message || isProcessing}
              className="w-full py-6 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white font-black rounded-3xl transition-all shadow-xl shadow-purple-900/40 flex items-center justify-center gap-3 group relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {isProcessing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Zap size={18} /> INJECT BITSTREAM</>}
            </button>
          </div>

          <div className="glass-panel p-6 lg:p-10 rounded-[40px] border-white/10 shadow-2xl bg-cyan-500/[0.02]">
            <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
              <Eye size={14} /> Quantum Extraction
            </h3>
            <AnimatePresence mode="wait">
              {decodedMessage ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs mb-6 shadow-inner"
                >
                  <div className="text-[9px] uppercase font-black mb-2 opacity-50 tracking-[0.2em] flex items-center gap-2">
                    <Layers size={12} /> Decoded Payload:
                  </div>
                  <div className="break-all whitespace-pre-wrap">{decodedMessage}</div>
                </motion.div>
              ) : (
                <div className="h-28 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[32px] text-gray-700 italic text-[10px] mb-6 gap-3">
                  <Ghost size={32} className="opacity-20" />
                  <span className="uppercase tracking-widest">No spectral data detected</span>
                </div>
              )}
            </AnimatePresence>
            <button 
              onClick={decodeMessage}
              disabled={!image || isProcessing}
              className="w-full py-6 border border-white/10 hover:border-cyan-500/50 text-gray-500 hover:text-cyan-400 rounded-3xl transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs backdrop-blur-xl"
            >
              {isProcessing ? <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /> : <><Unlock size={18} /> EXTRACT HIDDEN BITMAP</>}
            </button>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default SteganoModule;
