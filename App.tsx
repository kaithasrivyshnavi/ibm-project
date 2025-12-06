import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ResultsView } from './components/ResultsView';
import { analyzeImage, fileToBase64 } from './services/geminiService';
import { AnalysisResult } from './types';
import { History, Image as ImageIcon, Loader2, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clean up object URL on unmount or change
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageSelected = async (file: File) => {
    setError(null);
    setResult(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    setIsAnalyzing(true);
    
    // Smooth scroll to results
    window.scrollTo({ top: 300, behavior: 'smooth' });

    try {
      const base64 = await fileToBase64(file);
      const analysis = await analyzeImage(base64, file.type);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the image. Please try again or use a clearer image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black selection:bg-blue-500/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 animate-gradient-x">
            Is it Real or AI?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Upload any image to uncover its origin. Our deep learning engine analyzes sub-pixel patterns, lighting inconsistencies, and anatomical correctness to detect synthetic media.
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-3xl mx-auto mb-16">
          {!previewUrl ? (
            <UploadZone onImageSelected={handleImageSelected} isAnalyzing={isAnalyzing} />
          ) : (
             <div className="relative group rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-black">
                {/* Image Preview */}
                <div className="relative h-96 w-full flex items-center justify-center bg-slate-900">
                   <img 
                    src={previewUrl} 
                    alt="Analyzed subject" 
                    className="max-h-full max-w-full object-contain" 
                   />
                   
                   {/* Scanning Effect Overlay */}
                   {isAnalyzing && (
                     <div className="absolute inset-0 z-10 pointer-events-none">
                        <div className="scan-line"></div>
                        <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
                     </div>
                   )}
                </div>

                {/* Reset Button */}
                {!isAnalyzing && (
                  <button 
                    onClick={handleReset}
                    className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-800 text-white px-4 py-2 rounded-lg backdrop-blur text-sm font-medium border border-slate-700 transition-colors"
                  >
                    Analyze New Image
                  </button>
                )}
             </div>
          )}
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="text-center py-12 animate-pulse space-y-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
            <h3 className="text-xl font-medium text-blue-400">Processing Visual Data...</h3>
            <p className="text-slate-500">Checking texture patterns, lighting physics, and artifacts.</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl text-center mb-12">
            <p>{error}</p>
            <button 
              onClick={handleReset}
              className="mt-4 text-sm underline hover:text-red-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Section */}
        {result && previewUrl && (
          <ResultsView result={result} imageUrl={previewUrl} />
        )}

        {/* Feature Highlights (Only show when empty) */}
        {!previewUrl && !isAnalyzing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            <div className="glass-panel p-6 rounded-xl border-t-2 border-t-blue-500/50">
              <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <ImageIcon className="text-blue-400 w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Pixel Analysis</h3>
              <p className="text-slate-400 text-sm">
                Detects unnatural noise patterns and upscaling artifacts common in GANs and Diffusion models.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-xl border-t-2 border-t-purple-500/50">
              <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <History className="text-purple-400 w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Physics Consistency</h3>
              <p className="text-slate-400 text-sm">
                Checks for lighting errors, shadow direction mismatch, and impossible reflections.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-xl border-t-2 border-t-emerald-500/50">
              <div className="bg-emerald-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BrainCircuit className="text-emerald-400 w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Anatomical Logic</h3>
              <p className="text-slate-400 text-sm">
                Identifies common AI failures like malformed hands, extra fingers, or asymmetrical facial features.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;