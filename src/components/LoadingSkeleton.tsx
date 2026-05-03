import React from "react";

/**
 * Reusable Loading Skeleton components for better perceived performance.
 */
export const ProfileSkeleton = () => (
  <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
    <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
      <div className="flex flex-col gap-3">
        <div className="h-4 w-24 bg-slate-800 rounded-md animate-pulse" />
        <div className="h-8 w-40 bg-slate-800 rounded-md animate-pulse" />
      </div>
      <div className="w-14 h-14 bg-slate-800 rounded-2xl animate-pulse" />
    </div>
    
    <div className="grid grid-cols-2 gap-6 mb-8">
      <div className="flex flex-col gap-3">
        <div className="h-4 w-16 bg-slate-800 rounded-md animate-pulse" />
        <div className="h-6 w-20 bg-slate-800 rounded-md animate-pulse" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-4 w-16 bg-slate-800 rounded-md animate-pulse" />
        <div className="h-6 w-24 bg-slate-800 rounded-md animate-pulse" />
      </div>
    </div>
    
    <div className="flex flex-col gap-3">
      <div className="h-4 w-32 bg-slate-800 rounded-md animate-pulse" />
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-slate-800 rounded-lg animate-pulse" />
        <div className="h-8 w-24 bg-slate-800 rounded-lg animate-pulse" />
        <div className="h-8 w-16 bg-slate-800 rounded-lg animate-pulse" />
      </div>
    </div>
  </div>
);

export const RoadmapSkeleton = () => (
  <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl mt-2 h-[200px]">
    <div className="h-6 w-40 bg-slate-800 rounded-md mb-6 animate-pulse" />
    <div className="flex flex-col gap-6 ml-2 border-l-2 border-slate-800/50 pl-6 relative">
      <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
      <div className="h-4 w-32 bg-slate-800 rounded-md animate-pulse" />
      <div className="absolute -left-[17px] top-12 w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
      <div className="h-4 w-48 bg-slate-800 rounded-md mt-8 animate-pulse" />
    </div>
  </div>
);

export const TruthSkeleton = () => (
  <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/50 backdrop-blur-md p-8 shadow-2xl animate-pulse">
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-700 shrink-0" />
      
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-32 bg-slate-700 rounded-md" />
          <div className="h-6 w-24 bg-slate-700 rounded-full" />
        </div>
        <div className="h-6 w-full bg-slate-700 rounded-md mb-2" />
        <div className="h-6 w-3/4 bg-slate-700 rounded-md" />
      </div>
      
      <div className="h-12 w-32 bg-slate-700 rounded-xl shrink-0" />
    </div>
  </div>
);
