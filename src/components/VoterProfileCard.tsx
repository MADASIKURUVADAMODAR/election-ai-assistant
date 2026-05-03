import React, { memo } from "react";
import { User, MapPin, Tag, Calendar, Map, CheckCircle } from "lucide-react";
import { ExtractedVoterData } from "@/app/actions/extractVoterData";

interface VoterProfileCardProps {
  data: ExtractedVoterData;
}

/**
 * Component to display extracted voter profile information.
 * Memoized to prevent unnecessary re-renders.
 */
const VoterProfileCard = memo(({ data }: VoterProfileCardProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
          <div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Voter Profile</p>
            <h3 className="text-3xl font-bold text-white">{data.name}</h3>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <User size={28} aria-hidden="true" />
            <span className="sr-only">Voter Icon</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <User size={16} /> Age
            </div>
            <p className="text-xl font-medium text-slate-200">{data.age ? `${data.age} yrs` : 'Unknown'}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <MapPin size={16} /> Location
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xl font-medium text-slate-200">{data.location}</p>
              <div className="text-blue-400">
                <Map size={16} />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Tag size={16} /> Affiliation
            </div>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 mt-1">
              {data.partyAffiliation || 'Unknown'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Calendar size={16} /> Likelihood
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xl font-medium text-emerald-400">{data.likelyVoter || 'N/A'}</p>
              <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: parseInt(data.likelyVoter || "0") + "%" }} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Key Issues Identified</h4>
          <div className="flex flex-wrap gap-2">
            {(data.keyIssues || []).map((issue: string, i: number) => (
              <span 
                key={i}
                className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-300 shadow-sm"
              >
                {issue}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5">
           <details className="group">
             <summary className="text-sm text-slate-400 hover:text-slate-300 cursor-pointer transition-colors flex items-center justify-between outline-none">
               <span>View Raw JSON Data</span>
               <span className="transition group-open:rotate-180">↓</span>
             </summary>
             <div className="mt-4 bg-black/40 p-4 rounded-xl border border-white/5 overflow-x-auto">
               <pre className="text-xs text-blue-300 font-mono">
                 {JSON.stringify(data, null, 2)}
               </pre>
             </div>
           </details>
        </div>
      </div>
    </div>
  );
});

VoterProfileCard.displayName = "VoterProfileCard";

export default VoterProfileCard;
