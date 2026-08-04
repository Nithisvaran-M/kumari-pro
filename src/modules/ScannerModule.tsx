import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Search, Bug, Terminal, FileWarning, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Finding {
  type: string;
  description: string;
  severity: string;
}

const ScannerModule: React.FC = () => {
  const [input, setInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<{
    severity: 'CLEAN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    findings: Finding[];
    score: number;
  } | null>(null);

  const scanSignatures = () => {
    setIsScanning(true);
    setResults(null);
    
    setTimeout(() => {
      const findings: Finding[] = [];
      let score = 0;

      // Real-time signature detection simulation
      const signatures = [
        { pattern: /eval\(.*base64_decode/i, type: 'Obfuscated PHP', desc: 'Possible web shell payload detected.', sev: 'HIGH', impact: 20 },
        { pattern: /powershell.*-nop.*-w hidden/i, type: 'Stealth PowerShell', desc: 'Hidden PowerShell execution command found.', sev: 'CRITICAL', impact: 35 },
        { pattern: /nc -e \/bin\/sh/i, type: 'Reverse Shell', desc: 'Netcat reverse shell signature matched.', sev: 'CRITICAL', impact: 40 },
        { pattern: /System\.Reflection\.Assembly::Load/i, type: 'Process Injection', desc: 'In-memory assembly loading detected.', sev: 'HIGH', impact: 25 },
        { pattern: /0x4D, 0x5A/i, type: 'PE Header', desc: 'Executable magic bytes found in text/binary.', sev: 'MEDIUM', impact: 10 },
        { pattern: /localStorage\.setItem\(['"]password['"]/i, type: 'Credential Theft', desc: 'Storing sensitive data in localStorage.', sev: 'MEDIUM', impact: 15 },
        { pattern: /fetch\(.*http:\/\/attacker\.com/i, type: 'C2 Connection', desc: 'Suspicious remote fetch to known exfiltration domain.', sev: 'HIGH', impact: 30 },
      ];

      signatures.forEach(sig => {
        if (sig.pattern.test(input)) {
          findings.push({ type: sig.type, description: sig.desc, severity: sig.sev });
          score += sig.impact;
        }
      });

      let severity: 'CLEAN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'CLEAN';
      if (score > 60) severity = 'CRITICAL';
      else if (score > 40) severity = 'HIGH';
      else if (score > 20) severity = 'MEDIUM';
      else if (score > 0) severity = 'LOW';

      setResults({ severity, findings, score });
      setIsScanning(false);
      if (severity === 'CLEAN') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#3b82f6', '#10b981']
        });
      }
    }, 1500);
  };

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'CLEAN': return 'text-green-500';
      case 'LOW': return 'text-blue-500';
      case 'MEDIUM': return 'text-yellow-500';
      case 'HIGH': return 'text-orange-500';
      case 'CRITICAL': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Shield className="text-red-500" /> THREAT SCANNER
        </h2>
        <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Heuristic & Signature Behavioral Analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
              <Terminal size={14} className="text-red-500" />
              <span className="text-[10px] text-red-500/50 uppercase font-black tracking-widest">Input Payload / Code Snippet</span>
            </div>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste code or suspicious strings here for analysis..."
              className="w-full h-80 bg-[#080808] border border-red-900/30 rounded-2xl p-8 pt-12 text-gray-300 font-mono focus:outline-none focus:border-red-500/50 resize-none"
            />
          </div>

          <button 
            onClick={scanSignatures}
            disabled={!input || isScanning}
            className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] flex items-center justify-center gap-2"
          >
            {isScanning ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                SCANNING BITSTREAM...
              </>
            ) : (
              <>
                <Search size={20} /> INITIALIZE HEURISTIC SCAN
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-[#080808] border border-red-900/30 overflow-hidden h-full flex flex-col">
            <div className="px-6 py-4 border-b border-red-900/30 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug size={18} className="text-red-500" />
                <span className="font-bold text-sm uppercase tracking-widest">Analysis Report</span>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {!results && !isScanning && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <FileWarning size={48} className="mb-4" />
                  <p className="text-sm italic">Ready to analyze incoming data stream for malicious signatures.</p>
                </div>
              )}

              {isScanning && (
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
                  ))}
                </div>
              )}

              {results && (
                <div className="space-y-6">
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className={`text-4xl font-black mb-1 ${getSeverityColor(results.severity)}`}>
                      {results.severity}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Risk Assessment Level</div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] text-gray-600 font-bold uppercase tracking-widest border-b border-white/5 pb-2 flex justify-between">
                      <span>Detailed Findings</span>
                      <span>{results.findings.length} Matches</span>
                    </h4>
                    {results.findings.length > 0 ? (
                      results.findings.map((f, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-3 rounded-lg bg-red-500/5 border border-red-500/10"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle size={14} className={getSeverityColor(f.severity)} />
                            <span className="text-xs font-bold text-gray-200">{f.type}</span>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded border ${getSeverityColor(f.severity)} border-current ml-auto`}>
                              {f.severity}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 leading-tight">{f.description}</p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-green-500/5 border border-green-500/10 rounded-lg text-green-500">
                        <CheckCircle size={20} />
                        <div>
                          <div className="text-xs font-bold">No malicious signatures detected</div>
                          <p className="text-[10px] opacity-70 italic">Payload appears to be structurally safe.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-red-900/30 bg-white/5">
              <button className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                <Eye size={12} /> View Detailed Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerModule;
