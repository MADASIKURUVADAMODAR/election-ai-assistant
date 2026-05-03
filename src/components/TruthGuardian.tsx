"use client";

import React, { memo } from "react";
import { Search, ShieldCheck, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTruthGuardian } from "@/hooks/useTruthGuardian";
import { TruthSkeleton } from "./LoadingSkeleton";

/**
 * Component for the Truth Guardian rumor verification interface.
 * Uses the useTruthGuardian hook for logic abstraction.
 */
const TruthGuardian = memo(() => {
  const { 
    rumorQuery, 
    setRumorQuery, 
    isVerifying, 
    verificationResult, 
    handleVerifyRumor 
  } = useTruthGuardian();

  const getVerdictStyles = (status: string) => {
    switch (status) {
      case "FACT":
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          text: "text-emerald-400",
          icon: <ShieldCheck size={28} className="text-emerald-400" />,
          label: "VERIFIED FACT"
        };
      case "MISLEADING":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          text: "text-amber-400",
          icon: <AlertTriangle size={28} className="text-amber-400" />,
          label: "MISLEADING"
        };
      case "MYTH":
      case "ERROR":
        return {
          bg: "bg-rose-500/10",
          border: "border-rose-500/30",
          text: "text-rose-400",
          icon: <XCircle size={28} className="text-rose-400" />,
          label: "DEBUNKED MYTH"
        };
      default:
        return {
          bg: "bg-slate-800/50",
          border: "border-slate-700",
          text: "text-slate-400",
          icon: <Search size={28} />,
          label: "UNKNOWN"
        };
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 pb-20">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-4 text-purple-400 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
           <ShieldCheck size={32} aria-hidden="true" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
          The Truth Guardian
        </h2>
        <p className="text-slate-400 mt-3 text-lg">
          Verify election rumors instantly against the official Election Commission source of truth.
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 pl-6 rounded-full flex flex-col sm:flex-row items-center shadow-2xl focus-within:border-purple-500/50 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all">
        <Search className="text-slate-400 hidden sm:block shrink-0" size={24} aria-hidden="true" />
        <input 
          type="text" 
          placeholder="e.g., 'Election in Bangalore is postponed to Sunday'"
          className="w-full bg-transparent border-none text-slate-200 outline-none p-4 placeholder:text-slate-500 text-lg"
          value={rumorQuery}
          onChange={(e) => setRumorQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleVerifyRumor()}
          aria-label="Enter election rumor to verify"
        />
        <button
          aria-label="Scan rumor for truth verification"
          onClick={handleVerifyRumor}
          disabled={isVerifying || !rumorQuery.trim()}
          className="w-full sm:w-auto mt-2 sm:mt-0 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-medium rounded-full shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <Loader2 size={20} className="animate-spin" aria-hidden="true" />
              <span>Analyzing...</span>
            </>
          ) : (
            'Scan for Truth'
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isVerifying && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="mt-6"
          >
            <TruthSkeleton />
          </motion.div>
        )}

        {verificationResult && !isVerifying && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="mt-6"
          >
            {(() => {
              const styles = getVerdictStyles(verificationResult.status);
              return (
                <div className={`relative overflow-hidden rounded-3xl border ${styles.border} ${styles.bg} backdrop-blur-md p-8 shadow-2xl`}>
                   <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                     <div className={`w-16 h-16 rounded-2xl ${styles.bg} flex items-center justify-center shrink-0 border ${styles.border}`}>
                       {styles.icon}
                     </div>
                     
                     <div className="flex-1">
                       <div className="flex items-center justify-between mb-2">
                         <span className={`text-xs font-bold uppercase tracking-[0.2em] ${styles.text}`}>{styles.label}</span>
                         <div className="flex items-center gap-2">
                           <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">AI Reliability</span>
                           <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <div 
                               className={`h-full ${styles.bg.replace('/10', '')} transition-all duration-1000`} 
                               style={{ width: `${verificationResult.reliabilityScore}%` }} 
                             />
                           </div>
                           <span className={`text-xs font-bold ${styles.text}`}>{verificationResult.reliabilityScore}%</span>
                         </div>
                       </div>
                       <p className="text-xl font-medium text-slate-100 leading-snug">
                         {verificationResult.explanation}
                       </p>
                     </div>
                     
                     {verificationResult.link && (
                       <a 
                         href={verificationResult.link} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/10 flex items-center gap-2 shrink-0 group"
                       >
                         Source <Search size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                       </a>
                     )}
                   </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

TruthGuardian.displayName = "TruthGuardian";

export default TruthGuardian;
