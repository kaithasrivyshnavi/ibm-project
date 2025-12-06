import React from 'react';
import { AnalysisResult, Classification } from '../types';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { AlertTriangle, CheckCircle2, HelpCircle, Microscope, BrainCircuit } from 'lucide-react';

interface ResultsViewProps {
  result: AnalysisResult;
  imageUrl: string;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, imageUrl }) => {
  const isReal = result.classification === Classification.REAL;
  const isAi = result.classification === Classification.AI;

  const chartData = [
    { subject: 'Texture', A: result.metrics.textureQuality, fullMark: 100 },
    { subject: 'Lighting', A: result.metrics.lightingConsistency, fullMark: 100 },
    { subject: 'Anatomy', A: result.metrics.anatomicalCorrectness, fullMark: 100 },
    { subject: 'Logic', A: result.metrics.backgroundLogic, fullMark: 100 },
    { subject: 'Noise', A: result.metrics.noisePattern, fullMark: 100 },
  ];

  const confidenceData = [
    { name: 'Confidence', value: result.confidenceScore },
    { name: 'Uncertainty', value: 100 - result.confidenceScore }
  ];

  const getStatusColor = () => {
    if (isReal) return 'text-green-400 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]';
    if (isAi) return 'text-purple-400 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]';
    return 'text-yellow-400 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]';
  };

  const getStatusBg = () => {
    if (isReal) return 'bg-green-500/10';
    if (isAi) return 'bg-purple-500/10';
    return 'bg-yellow-500/10';
  };

  return (
    <div className="w-full animate-fade-in space-y-8">
      
      {/* Main Verdict Card */}
      <div className={`relative w-full overflow-hidden rounded-2xl border ${getStatusColor()} ${getStatusBg()} p-8 flex flex-col md:flex-row items-center justify-between gap-8`}>
        <div className="flex-1 z-10">
          <div className="flex items-center gap-3 mb-2">
            {isReal && <CheckCircle2 className="w-8 h-8 text-green-400" />}
            {isAi && <BrainCircuit className="w-8 h-8 text-purple-400" />}
            {!isReal && !isAi && <HelpCircle className="w-8 h-8 text-yellow-400" />}
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
              {result.classification}
            </h2>
          </div>
          <p className="text-lg text-slate-300 font-light leading-relaxed">
            {result.summary}
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center z-10">
          <div className="text-4xl font-bold font-mono">
            {result.confidenceScore}%
          </div>
          <div className="text-xs uppercase tracking-widest text-slate-400 mt-1">Confidence Score</div>
        </div>

        {/* Decorative background glow */}
        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[80px] opacity-20 ${isReal ? 'bg-green-500' : isAi ? 'bg-purple-500' : 'bg-yellow-500'}`}></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Metric Analysis (Radar Chart) */}
        <div className="glass-panel rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
            <Microscope className="w-5 h-5 text-blue-400" />
            Forensic Metrics
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke={isReal ? "#4ade80" : "#a855f7"}
                  strokeWidth={3}
                  fill={isReal ? "#4ade80" : "#a855f7"}
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-slate-500 text-sm mt-2">Higher scores indicate higher likelihood of being natural/real.</p>
        </div>

        {/* Detailed Reasoning */}
        <div className="glass-panel rounded-xl p-6 border border-slate-700 flex flex-col">
          <h3 className="text-xl font-semibold mb-4 text-white">Detailed Analysis</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                {result.detailedReasoning}
              </p>
            </div>
            
            {result.detectedArtifacts.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Detected Artifacts</h4>
                <div className="flex flex-wrap gap-2">
                  {result.detectedArtifacts.map((artifact, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {artifact}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};