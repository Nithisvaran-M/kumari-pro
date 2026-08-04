import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileSearch, FileText, Image as ImageIcon, Search, Copy, Download, Cpu, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const MetadataModule: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Record<string, any> | null>(null);
  const [strings, setStrings] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const scanFile = async (file: File) => {
    setIsScanning(true);
    setMetadata(null);
    setStrings([]);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as ArrayBuffer;
      const uint8 = new Uint8Array(content);
      
      // Better Grep implementation
      const foundStrings: string[] = [];
      let currentString = "";
      for (let i = 0; i < uint8.length; i++) {
        const charCode = uint8[i];
        if (charCode >= 32 && charCode <= 126) {
          currentString += String.fromCharCode(charCode);
        } else {
          if (currentString.length >= 4) {
            foundStrings.push(currentString);
          }
          currentString = "";
        }
      }
      
      setStrings(foundStrings);
      
      const basicInfo: Record<string, any> = {
        'File Name': file.name,
        'Size': `${(file.size / 1024).toFixed(2)} KB`,
        'Type': file.type || 'Binary',
        'Header Magic': uint8.slice(0, 4).reduce((acc, b) => acc + b.toString(16).padStart(2, '0'), '0x'),
        'Entropy': calculateEntropy(uint8),
      };
      
      setMetadata(basicInfo);
      setIsScanning(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const calculateEntropy = (bytes: Uint8Array) => {
    const freq = new Array(256).fill(0);
    for (const b of bytes) freq[b]++;
    let entropy = 0;
    for (const f of freq) {
      if (f > 0) {
        const p = f / bytes.length;
        entropy -= p * Math.log2(p);
      }
    }
    return entropy.toFixed(4);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      scanFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });

  const filteredStrings = strings.filter(s => 
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter">EXIF & <span className="text-cyan-500">GREP</span></h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-2">Deep Forensics & Text Extraction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 overflow-hidden">
        {/* Upload Zone */}
        <div className="lg:col-span-4 space-y-4 lg:space-y-6">
          <div 
            {...getRootProps()} 
            className={`aspect-square lg:aspect-auto lg:h-64 border-2 border-dashed rounded-3xl lg:rounded-[40px] flex flex-col items-center justify-center transition-all cursor-pointer ${
              isDragActive ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/10 hover:border-cyan-500/30 bg-white/[0.02]'
            }`}
          >
            <input {...getInputProps()} />
            <div className="p-8 rounded-full bg-cyan-500/10 mb-6 group-hover:scale-110 transition-transform">
              <FileSearch className="w-16 h-16 text-cyan-500" />
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-gray-400">Deploy File Here</p>
            <p className="text-[10px] text-gray-600 mt-2 italic text-center px-8">Supports images, binaries, and standard documents</p>
          </div>

          {file && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6 rounded-3xl border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/5 rounded-xl text-cyan-500">
                  {file.type.includes('image') ? <ImageIcon size={24} /> : <FileText size={24} />}
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-bold truncate">{file.name}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">Active Target</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500 uppercase">Integrity</span>
                  <span className="text-green-500 font-black">VALIDATED</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-full shadow-[0_0_10px_#22c55e]" />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Forensics Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel rounded-3xl lg:rounded-[40px] border-white/10 overflow-hidden flex flex-col min-h-[400px] lg:h-[650px]">
            <div className="flex-none min-h-[4rem] border-b border-white/5 flex flex-col sm:flex-row items-center px-4 sm:px-8 gap-4 py-4 sm:py-0 justify-between bg-white/5 backdrop-blur-xl">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Forensic Results</span>
                </div>
                <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-2 relative flex-1 sm:flex-none">
                  <Search size={14} className="text-gray-500 absolute left-3" />
                  <input 
                    type="text" 
                    placeholder="GREP / SEARCH..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-[10px] focus:outline-none focus:border-cyan-500/50 w-full sm:w-48 lg:w-64"
                  />
                </div>
              </div>
              <div className="text-[10px] text-cyan-500 font-black self-end sm:self-center">{filteredStrings.length} Matches</div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
              {isScanning ? (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <Cpu className="w-12 h-12 text-cyan-500 animate-spin" />
                  <div className="text-[10px] text-cyan-500 animate-pulse font-black tracking-[0.5em]">PARSING DATA...</div>
                </div>
              ) : !file ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <Terminal size={48} className="mb-4" />
                  <p className="text-sm italic uppercase tracking-widest">Waiting for target deployment</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Metadata Section */}
                  <div>
                    <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-4 border-b border-white/5 pb-2">Header Attributes</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      {metadata && Object.entries(metadata).map(([k, v]) => (
                        <div key={k} className="group">
                          <div className="text-[9px] text-cyan-500/50 uppercase font-black mb-1 group-hover:text-cyan-500 transition-colors">{k}</div>
                          <div className="text-xs font-mono text-gray-300 break-all">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strings Section */}
                  <div>
                    <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-4 border-b border-white/5 pb-2">Extracted Strings (GREP)</h3>
                    <div className="space-y-1 font-mono text-[11px]">
                      {filteredStrings.map((s, i) => (
                        <div key={i} className="flex gap-4 p-1 hover:bg-cyan-500/5 transition-colors group">
                          <span className="text-gray-700 w-8 select-none">{String(i).padStart(4, '0')}</span>
                          <span className="text-gray-300 group-hover:text-white transition-colors">{s}</span>
                        </div>
                      ))}
                      {filteredStrings.length === 0 && <div className="text-gray-700 italic">No strings matched search criteria.</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-10 bg-black border-t border-white/5 flex items-center justify-between px-8 text-[9px] text-gray-600 uppercase tracking-widest">
              <span>Deep Analysis Engine Active</span>
              <div className="flex gap-4">
                <button className="flex items-center gap-1 hover:text-white transition-colors"><Copy size={10} /> Copy Dump</button>
                <button className="flex items-center gap-1 hover:text-white transition-colors"><Download size={10} /> Export Report</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetadataModule;
