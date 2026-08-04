import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { Copy, RefreshCw, Eye, EyeOff, ShieldCheck, Zap, Sparkles, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CryptoModule: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [key, setKey] = useState('');
  const [method, setMethod] = useState('AES');
  const [isEncrypt, setIsEncrypt] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [entropy, setEntropy] = useState(0);
  const [magicMode, setMagicMode] = useState(false);

  const methods = ['AES', 'DES', 'TripleDES', 'Rabbit', 'RC4', 'Base64', 'Hex', 'MD5', 'SHA256', 'SHA512', 'SHA3'];

  // Advanced Magic Auto-Decryption Logic
  useEffect(() => {
    if (magicMode && input) {
      const cleanInput = input.trim();
      
      // Base64 Check
      if (/^[a-zA-Z0-9+/]*={0,2}$/.test(cleanInput) && cleanInput.length > 4) {
        try {
          const decoded = atob(cleanInput);
          if (/[\x20-\x7E\s]/.test(decoded) && decoded.length > 2) {
            setMethod('Base64');
            setIsEncrypt(false);
            setOutput(decoded);
            return;
          }
        } catch(e) {}
      }

      // Hex Check
      const hexClean = cleanInput.replace(/\s/g, '');
      if (/^[0-9a-fA-F]+$/.test(hexClean) && hexClean.length % 2 === 0) {
        try {
          let str = '';
          for (let i = 0; i < hexClean.length; i += 2) {
            const charCode = parseInt(hexClean.substr(i, 2), 16);
            if (charCode < 32 || charCode > 126) throw new Error("Binary");
            str += String.fromCharCode(charCode);
          }
          if (str.length > 2) {
            setMethod('Hex');
            setIsEncrypt(false);
            setOutput(str);
            return;
          }
        } catch(e) {}
      }

      // Binary Check
      const binaryClean = cleanInput.replace(/\s/g, '');
      if (/^[01]+$/.test(binaryClean) && binaryClean.length % 8 === 0) {
        try {
          let str = '';
          for (let i = 0; i < binaryClean.length; i += 8) {
            str += String.fromCharCode(parseInt(binaryClean.substr(i, 8), 2));
          }
          if (str.length > 1) {
            setMethod('Base64'); // Using as placeholder or add Binary method
            setOutput("Binary Decoded: " + str);
            return;
          }
        } catch(e) {}
      }
    }
  }, [input, magicMode]);

  const calculateEntropy = (str: string) => {
    if (!str) return 0;
    const len = str.length;
    const frequencies: Record<string, number> = {};
    for (let char of str) {
      frequencies[char] = (frequencies[char] || 0) + 1;
    }
    return Object.values(frequencies).reduce((sum, f) => {
      const p = f / len;
      return sum - p * Math.log2(p);
    }, 0);
  };

  useEffect(() => {
    setEntropy(calculateEntropy(input));
  }, [input]);

  const process = () => {
    try {
      if (method === 'Base64') {
        if (isEncrypt) setOutput(btoa(input));
        else setOutput(atob(input));
        return;
      }
      if (method === 'Hex') {
        if (isEncrypt) setOutput(input.split('').map(c => c.charCodeAt(0).toString(16)).join(' '));
        else setOutput(input.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join(''));
        return;
      }
      if (method.startsWith('SHA') || method === 'MD5') {
        setOutput((CryptoJS as any)[method](input).toString());
        return;
      }

      if (!key) {
        alert('Security Key Required');
        return;
      }

      if (isEncrypt) {
        const encrypted = (CryptoJS as any)[method].encrypt(input, key);
        setOutput(encrypted.toString());
      } else {
        const decrypted = (CryptoJS as any)[method].decrypt(input, key);
        const result = decrypted.toString(CryptoJS.enc.Utf8);
        if (!result) throw new Error("Invalid Key");
        setOutput(result);
      }
    } catch (e) {
      setOutput('DECRYPTION FAILED: Invalid Ciphertext or Key Sequence');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-5xl font-black tracking-tighter italic flex items-center gap-4">
            CIPHER <span className="text-cyan-500">CORE</span>
          </h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mt-2 font-bold px-1">Universal Cryptographic Engine</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
          <button 
            onClick={() => setIsEncrypt(true)}
            className={`px-8 py-3 text-xs font-black rounded-xl transition-all ${isEncrypt ? 'bg-white text-black shadow-xl shadow-white/10' : 'text-gray-500 hover:text-white'}`}
          >
            ENCRYPT
          </button>
          <button 
            onClick={() => setIsEncrypt(false)}
            className={`px-8 py-3 text-xs font-black rounded-xl transition-all ${!isEncrypt ? 'bg-white text-black shadow-xl shadow-white/10' : 'text-gray-500 hover:text-white'}`}
          >
            DECRYPT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Input Side */}
        <div className="lg:col-span-7 space-y-4 lg:space-y-6">
          <div className="relative group">
            <div className="absolute top-6 left-8 flex items-center gap-3 z-10 pointer-events-none">
              <Zap size={14} className="text-cyan-500" />
              <span className="text-[10px] text-cyan-500/50 uppercase font-black tracking-[0.2em]">Source Stream</span>
            </div>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste raw content here..."
              className="w-full h-48 lg:h-72 bg-white/[0.02] border border-white/5 rounded-3xl lg:rounded-[40px] p-8 lg:p-12 pt-16 lg:pt-20 text-gray-200 font-mono text-sm focus:outline-none focus:border-cyan-500/30 transition-all resize-none shadow-2xl"
            />
          </div>

          <div className="relative">
             <div className="absolute top-6 left-8 flex items-center gap-3 z-10 pointer-events-none">
              <ShieldCheck size={14} className="text-green-500" />
              <span className="text-[10px] text-green-500/50 uppercase font-black tracking-[0.2em]">Processed Result</span>
            </div>
            <div className="absolute top-6 right-8 flex items-center gap-2 z-20">
              <button 
                onClick={copyToClipboard}
                className="p-2 lg:p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <Copy size={16} />
              </button>
              <button 
                onClick={() => setOutput('')}
                className="p-2 lg:p-3 bg-white/5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-white/10 transition-all"
              >
                <RefreshCw size={16} />
              </button>
            </div>
            <div className="w-full h-48 lg:h-72 bg-black border border-green-500/20 rounded-3xl lg:rounded-[40px] p-8 lg:p-12 pt-16 lg:pt-20 text-green-400 font-mono text-sm overflow-auto break-all shadow-inner">
              <AnimatePresence mode="wait">
                <motion.div
                  key={output}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-pre-wrap"
                >
                  {output || <span className="opacity-10 italic">Awaiting sequence execution...</span>}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Controls Side */}
        <div className="lg:col-span-5 space-y-6 lg:space-y-8">
          <div className="glass-panel p-6 lg:p-8 rounded-3xl lg:rounded-[40px] border-white/10 shadow-2xl space-y-6 lg:space-y-8">
            <div className="flex justify-between items-center mb-2 px-2">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Algorithm</label>
              <button 
                onClick={() => setMagicMode(!magicMode)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black transition-all ${magicMode ? 'bg-cyan-500 text-black shadow-[0_0_10px_#06b6d4]' : 'bg-white/5 text-gray-500'}`}
              >
                <Wand2 size={10} /> MAGIC AUTO
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {methods.map(m => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`px-4 py-3 rounded-xl text-[10px] font-black transition-all border ${
                    method === m ? 'bg-cyan-500 border-cyan-400 text-black shadow-lg shadow-cyan-500/20' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {['AES', 'DES', 'TripleDES', 'Rabbit', 'RC4'].includes(method) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] block mb-4 px-2">Secret Identity Key</label>
                <div className="relative">
                  <input 
                    type={showKey ? 'text' : 'password'}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter security key..."
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 pr-14 text-sm focus:outline-none focus:border-cyan-500/50 text-cyan-400"
                  />
                  <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>
            )}

            <button 
              onClick={process}
              className="w-full py-6 bg-white hover:bg-cyan-500 text-black font-black rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite] pointer-events-none" />
              <Sparkles size={20} />
              <span className="tracking-widest">INITIALIZE {isEncrypt ? 'ENCRYPTION' : 'DECRYPTION'}</span>
            </button>
          </div>

          <div className="glass-panel p-8 rounded-[40px] border-white/5 bg-cyan-500/[0.02]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] text-gray-500 font-black tracking-widest uppercase">Stream Entropy</span>
              <span className={`text-xs font-black font-mono ${entropy > 4 ? 'text-cyan-400' : 'text-yellow-500'}`}>
                {entropy.toFixed(4)} <span className="text-[8px] font-normal opacity-50 ml-1">BITS/CHAR</span>
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(entropy / 8) * 100}%` }}
                className={`h-full rounded-full ${entropy > 4 ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-yellow-500'}`}
              />
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default CryptoModule;
