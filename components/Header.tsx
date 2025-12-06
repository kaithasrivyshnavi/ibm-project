import React from 'react';
import { ScanEye, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 flex justify-between items-center border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          <ScanEye className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Real<span className="text-blue-400">Or</span>AI
          </h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide">DIGITAL FORENSICS ENGINE</p>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>Gemini 2.5 Flash Powered</span>
        </div>
      </div>
    </header>
  );
};