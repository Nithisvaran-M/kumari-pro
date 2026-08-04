import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileSearch, Cpu, Ghost, Activity, ArrowRight, Zap, Target, Globe } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const stats = [
    { label: 'Security Score', value: '98%', icon: Shield, color: 'text-green-500' },
    { label: 'Active Encryptions', value: '1,284', icon: Lock, color: 'text-cyan-500' },
    { label: 'Threats Blocked', value: '42', icon: Target, color: 'text-red-500' },
    { label: 'Network Node', value: 'Global-01', icon: Globe, color: 'text-purple-500' },
  ];

  const features = [
    {
      id: 'metadata',
      title: 'Deep Metadata Engine',
      desc: 'Extract EXIF, XMP, and hidden strings from any file type.',
      icon: FileSearch,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-cyan-500/30'
    },
    {
      id: 'crypto',
      title: 'Cipher Suite',
      desc: 'Industry standard AES, RSA, and modern encoding tools.',
      icon: Lock,
      gradient: 'from-purple-500/20 to-blue-500/20',
      border: 'border-blue-500/30'
    },
    {
      id: 'custom-algo',
      title: 'Algo Forge',
      desc: 'Design your own encryption algorithms with visual blocks.',
      icon: Cpu,
      gradient: 'from-orange-500/20 to-red-500/20',
      border: 'border-orange-500/30'
    },
    {
      id: 'stegano',
      title: 'Shadow Crypt',
      desc: 'Advanced steganography to hide data within carrier files.',
      icon: Ghost,
      gradient: 'from-gray-500/20 to-zinc-500/20',
      border: 'border-zinc-500/30'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <section className="relative p-8 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-transparent border border-cyan-500/20 overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Shield size={200} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-4">
            <Zap size={14} /> SYSTEM VERSION 3.0.0 STABLE
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
            THE NEXT GEN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              CYBER DEFENSE
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl text-lg mb-8">
            Kumari Pro X provides an unparalleled suite of tools for metadata extraction, 
            universal cryptography, and malware analysis. Engineered for the future of digital security.
          </p>
          <button 
            onClick={() => setActiveTab('scanner')}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all flex items-center gap-2 group shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            INITIALIZE SECURITY SCAN <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg bg-black/40 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">{stat.label}</div>
              <div className="text-2xl font-black">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveTab(feature.id)}
            className={`cursor-pointer p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} border ${feature.border} group transition-all`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-black/40 text-cyan-400">
                <feature.icon size={28} />
              </div>
              <ArrowRight className="text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold mb-2 tracking-tight">{feature.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom Status */}
      <div className="p-6 rounded-2xl bg-[#080808] border border-cyan-900/30 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h3 className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
            <Activity size={18} /> LIVE THREAT INTELLIGENCE
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>IP 192.168.1.104 attempting unauthorized handshake... [BLOCKED]</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              <span>Suspicious entropy detected in incoming payload... [ANALYZING]</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-[10px] text-gray-600 uppercase">Uptime</div>
            <div className="text-sm font-mono">142:54:12</div>
          </div>
          <div className="text-right border-l border-cyan-900/30 pl-4">
            <div className="text-[10px] text-gray-600 uppercase">Latency</div>
            <div className="text-sm font-mono text-cyan-500">2ms</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
