import React, { useRef, useState } from 'react';
import { Upload, ImageIcon, ScanLine, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  onImageSelected: (file: File) => void;
  isAnalyzing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const validateAndProcess = (file: File) => {
    if (isAnalyzing) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    onImageSelected(file);
  };

  return (
    <div 
      className={`
        relative w-full h-80 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer overflow-hidden group
        ${isDragging 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-slate-700 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
        }
        ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
        <div className={`p-4 rounded-full mb-4 transition-transform duration-300 ${isDragging ? 'bg-blue-500/20 scale-110' : 'bg-slate-700/50 group-hover:scale-105'}`}>
          {isAnalyzing ? (
             <ScanLine className="w-10 h-10 text-blue-400 animate-pulse" />
          ) : (
             <Upload className={`w-10 h-10 ${isDragging ? 'text-blue-400' : 'text-slate-400'}`} />
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">
          {isAnalyzing ? 'Analyzing Image Structure...' : 'Upload Image for Analysis'}
        </h3>
        
        <p className="text-slate-400 max-w-sm">
          {isAnalyzing 
            ? 'Our AI is scanning for pixel irregularities and artifacts.' 
            : 'Drag & drop an image here, or click to browse. Supports JPG, PNG, WEBP.'
          }
        </p>
      </div>

      {/* Decorative background grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
        style={{
            backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
            backgroundSize: '24px 24px'
        }}
      ></div>
    </div>
  );
};