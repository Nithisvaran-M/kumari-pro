import React, { useState, useEffect } from 'react';
import { Cpu, Plus, Trash2, ArrowDown, Save, Code, Zap } from 'lucide-react';
import { Reorder } from 'framer-motion';

type StepType = 'BASE64_ENCODE' | 'BASE64_DECODE' | 'ROT13' | 'XOR' | 'REVERSE' | 'HEX_ENCODE' | 'HEX_DECODE' | 'UPPERCASE' | 'LOWERCASE';

interface Step {
  id: string;
  type: StepType;
  params?: Record<string, any>;
}

const CustomAlgoModule: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [xorKey, setXorKey] = useState('secret');
  const [mode, setMode] = useState<'visual' | 'script'>('visual');
  const [script, setScript] = useState(`// Custom Crypto Function
// Input 'data' is the string to process
function encrypt(data) {
  const secret = "QUANTUM";
  return data.split('')
    .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ secret.charCodeAt(i % secret.length)))
    .reverse()
    .join('');
}

return encrypt(data);`);

  const stepOptions: { type: StepType; label: string; desc: string }[] = [
    { type: 'BASE64_ENCODE', label: 'Base64 Encode', desc: 'Convert to Base64 format' },
    { type: 'BASE64_DECODE', label: 'Base64 Decode', desc: 'Restore from Base64' },
    { type: 'ROT13', label: 'ROT13', desc: 'Rotate characters by 13 positions' },
    { type: 'XOR', label: 'XOR Cipher', desc: 'Bitwise XOR with a key' },
    { type: 'REVERSE', label: 'Reverse', desc: 'Flip the entire string' },
    { type: 'HEX_ENCODE', label: 'Hex Encode', desc: 'Convert to Hexadecimal' },
    { type: 'HEX_DECODE', label: 'Hex Decode', desc: 'Restore from Hex' },
    { type: 'UPPERCASE', label: 'Uppercase', desc: 'Convert all to uppercase' },
  ];

  const addStep = (type: StepType) => {
    setSteps([...steps, { id: Math.random().toString(36).substr(2, 9), type }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const rot13 = (str: string) => {
    return str.replace(/[a-zA-Z]/g, (c) => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
    });
  };

  const xor = (str: string, key: string) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  };

  const executePipeline = () => {
    if (mode === 'visual') {
      let current = input;
      try {
        steps.forEach(step => {
          switch (step.type) {
            case 'BASE64_ENCODE': current = btoa(unescape(encodeURIComponent(current))); break;
            case 'BASE64_DECODE': current = decodeURIComponent(escape(atob(current))); break;
            case 'ROT13': current = rot13(current); break;
            case 'REVERSE': current = current.split('').reverse().join(''); break;
            case 'UPPERCASE': current = current.toUpperCase(); break;
            case 'LOWERCASE': current = current.toLowerCase(); break;
            case 'XOR': current = xor(current, xorKey); break;
            case 'HEX_ENCODE': 
              current = current.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''); 
              break;
            case 'HEX_DECODE':
              const hexes = current.match(/.{1,2}/g) || [];
              current = hexes.map(h => String.fromCharCode(parseInt(h, 16))).join('');
              break;
          }
        });
        setOutput(current);
      } catch (e) {
        setOutput('PIPELINE ERROR: Invalid operation sequence or content encoding.');
      }
    } else {
      try {
        const userFunc = new Function('data', script);
        const result = userFunc(input);
        setOutput(result !== undefined ? String(result) : "Script returned no output");
      } catch (e: any) {
        setOutput('SCRIPT ERROR: ' + e.message);
      }
    }
  };

  useEffect(() => {
    if (input) executePipeline();
  }, [steps, input, xorKey, mode, script]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Cpu className="text-orange-500" /> ALGO FORGE
          </h2>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Design Custom Cryptographic Pipelines</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold transition-all">
            <Save size={14} /> SAVE ALGORITHM
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black rounded-lg text-xs font-bold transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            <Code size={14} /> EXPORT SCRIPT
          </button>
        </div>
      </div>

      <div className="flex p-1 bg-black border border-orange-900/30 rounded-xl w-fit mb-6">
        <button 
          onClick={() => setMode('visual')}
          className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'visual' ? 'bg-orange-500 text-black' : 'text-gray-500'}`}
        >
          VISUAL PIPELINE
        </button>
        <button 
          onClick={() => setMode('script')}
          className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'script' ? 'bg-orange-500 text-black' : 'text-gray-500'}`}
        >
          SCRIPT FORGE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-3 space-y-4">
          {mode === 'visual' ? (
            <div className="p-6 rounded-3xl bg-[#080808] border border-orange-900/30 overflow-hidden">
              <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Plus size={14} /> Operations
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {stepOptions.map(opt => (
                  <button
                    key={opt.type}
                    onClick={() => addStep(opt.type)}
                    className="text-left p-3 rounded-xl bg-white/5 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/30 transition-all group"
                  >
                    <div className="text-[10px] font-bold group-hover:text-orange-400 transition-colors uppercase">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-orange-500/5 border border-orange-500/20">
              <h3 className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mb-4">Script Info</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed italic">
                Input variable: <code className="text-orange-400 font-bold">data</code>
              </p>
            </div>
          )}
          
          {mode === 'visual' && steps.some(s => s.type === 'XOR') && (
            <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20">
              <label className="text-[10px] text-orange-500/70 font-bold uppercase mb-2 block">XOR Master Key</label>
              <input 
                value={xorKey}
                onChange={(e) => setXorKey(e.target.value)}
                className="w-full bg-black border border-orange-900/50 rounded-lg p-2 text-xs text-orange-400 focus:outline-none focus:border-orange-500"
              />
            </div>
          )}
        </div>

        {/* Builder Area */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl lg:rounded-[40px] bg-[#080808] border border-orange-900/30 flex flex-col min-h-[300px] lg:h-[600px] overflow-hidden">
            {mode === 'visual' ? (
              <>
                <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6 flex items-center justify-between shrink-0">
                  <span>Pipeline</span>
                  <span className="text-orange-500">{steps.length} Steps</span>
                </h3>
                
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {steps.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20 border-2 border-dashed border-white/5 rounded-2xl p-8">
                      <Cpu size={48} className="mb-4" />
                      <p className="text-xs uppercase tracking-widest italic">Sequence Empty</p>
                    </div>
                  ) : (
                    <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="space-y-4 pb-4">
                      {steps.map((step, index) => (
                        <Reorder.Item key={step.id} value={step}>
                          <div className="relative group">
                            {index > 0 && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-orange-900/40 z-10">
                                <ArrowDown size={14} />
                              </div>
                            )}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group-hover:border-orange-500/30 transition-all cursor-grab active:cursor-grabbing">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-[10px] font-bold">
                                  {index + 1}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">{step.type.replace('_', ' ')}</span>
                              </div>
                              <button 
                                onClick={() => removeStep(step.id)}
                                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4 shrink-0">JS Engine Editor</h3>
                <textarea 
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="flex-1 bg-black border border-white/10 rounded-2xl p-6 text-[11px] font-mono text-cyan-400 focus:outline-none focus:border-orange-500/50 resize-none shadow-inner"
                  spellCheck={false}
                />
              </div>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl lg:rounded-[40px] bg-[#080808] border border-orange-900/30 flex flex-col min-h-[400px] lg:h-[600px] overflow-hidden shadow-2xl">
            <div className="shrink-0 mb-6">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-3 px-2">Original Payload</label>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Data..."
                className="w-full h-32 bg-black/50 border border-white/5 rounded-2xl p-4 text-[11px] font-mono focus:outline-none focus:border-orange-500/50 resize-none shadow-inner"
              />
            </div>
            
            <div className="flex-1 flex flex-col overflow-hidden pt-4 border-t border-white/5">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-3 px-2">Transformation Output</label>
              <div className="flex-1 w-full bg-black border border-orange-500/10 rounded-2xl p-4 text-[11px] font-mono text-orange-400 overflow-auto break-all shadow-inner">
                {output || <span className="text-gray-800 italic">Waiting...</span>}
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-orange-500/[0.03] border border-orange-500/10 shrink-0">
              <div className="flex items-center gap-2 text-orange-500 font-bold text-[9px] mb-2 uppercase tracking-widest">
                <Zap size={12} /> Execution Status
              </div>
              <p className="text-[9px] text-gray-600 leading-relaxed italic">
                Complexity: {mode === 'visual' ? steps.length * 2.5 : 'Scripted'} Nodes Active.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlgoModule;
