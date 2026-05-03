"use client";

import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, FileText, ChevronRight } from "lucide-react";
import { getManifestoSummary, ManifestoSummaryResult } from "@/app/actions/getManifestoSummary";

interface Candidate {
  id: string;
  name: string;
  party: string;
  role: string;
  imageUrl: string;
  baseManifesto: string;
}

interface CandidateSectionProps {
  location: string;
  candidates: Candidate[];
}

/**
 * Component to display candidates and their AI-generated manifesto summaries.
 */
const CandidateSection = memo(({ location, candidates }: CandidateSectionProps) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isFetchingManifesto, setIsFetchingManifesto] = useState(false);
  const [manifestoResult, setManifestoResult] = useState<ManifestoSummaryResult | null>(null);

  const handleCandidateClick = async (candidateId: string, name: string, party: string, baseManifesto: string) => {
    if (selectedCandidate === candidateId) {
      setSelectedCandidate(null);
      setManifestoResult(null);
      return;
    }
    
    setSelectedCandidate(candidateId);
    setIsFetchingManifesto(true);
    setManifestoResult(null);
    
    try {
      const result = await getManifestoSummary(name, party, baseManifesto);
      setManifestoResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingManifesto(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="w-full max-w-6xl mx-auto flex flex-col gap-6 pt-10 pb-4"
    >
      <div className="flex items-center gap-3 px-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
          <Users size={20} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Candidates in {location}</h2>
          <p className="text-sm text-slate-400">Select a candidate for a 30-Second AI Manifesto Summary</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-6 pb-8 px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {candidates.map((candidate) => {
          const isSelected = selectedCandidate === candidate.id;
          
          return (
            <div key={candidate.id} className="snap-center shrink-0 w-[300px] sm:w-[350px] flex flex-col gap-4">
              <button 
                onClick={() => handleCandidateClick(candidate.id, candidate.name, candidate.party, candidate.baseManifesto)}
                className={`relative w-full text-left bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border transition-all duration-300 ${isSelected ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)] scale-100' : 'border-white/10 hover:border-white/20 hover:scale-[1.02]'}`}
                aria-expanded={isSelected}
                aria-controls={`manifesto-${candidate.id}`}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-blue-500/5 rounded-3xl pointer-events-none" />
                )}
                <div className="flex gap-4 items-center mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={candidate.imageUrl} alt={`Portrait of candidate ${candidate.name}`} className="w-16 h-16 rounded-full border-2 border-slate-700 bg-slate-800" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 leading-tight">{candidate.name}</h3>
                    <p className="text-sm text-slate-400">{candidate.party}</p>
                    <span className={`inline-block mt-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-medium ${candidate.role === 'Incumbent' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      {candidate.role}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1"><FileText size={14} /> AI Analysis</span>
                  <ChevronRight size={16} className={`transition-transform duration-300 ${isSelected ? 'rotate-90 text-blue-400' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    id={`manifesto-${candidate.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-900/80 border border-blue-500/20 rounded-2xl p-5 shadow-lg relative">
                      <div className="absolute -top-2 left-8 w-4 h-4 bg-slate-900 border-l border-t border-blue-500/20 rotate-45" />
                      
                      {isFetchingManifesto ? (
                        <div className="flex flex-col gap-3">
                          {[1, 2, 3].map((skeletonIdx) => (
                            <div key={skeletonIdx} className="bg-slate-950/50 rounded-xl p-3 border border-white/5 animate-pulse">
                              <div className="h-3 w-1/3 bg-blue-500/20 rounded-md mb-2" />
                              <div className="h-4 w-full bg-slate-800 rounded-md mb-1" />
                              <div className="h-4 w-2/3 bg-slate-800 rounded-md" />
                            </div>
                          ))}
                        </div>
                      ) : manifestoResult ? (
                        <div className="flex flex-col gap-4">
                          {manifestoResult.error ? (
                            <p className="text-sm text-rose-400">{manifestoResult.error}</p>
                          ) : (
                            <div className="flex flex-col gap-3">
                              {manifestoResult.summary.map((point: string, idx: number) => {
                                const parts = point.split('->').map(p => p.trim());
                                const goal = parts[0]?.replace(/\[Goal\]/i, '').trim();
                                const action = parts[1]?.replace(/\[Action\]/i, '').trim();
                                const result = parts[2]?.replace(/\[Proposed Result\]/i, '').trim();
                                
                                return (
                                  <div key={idx} className="bg-slate-950/50 rounded-xl p-3 border border-white/5">
                                    <div className="text-xs font-bold text-blue-400 mb-1">{goal || point}</div>
                                    {action && result && (
                                      <div className="text-sm text-slate-300 leading-relaxed">
                                        <span className="text-slate-400">{action}</span> <span className="text-slate-600 mx-1">→</span> <span className="text-emerald-400/90">{result}</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
});

CandidateSection.displayName = "CandidateSection";

export default CandidateSection;
