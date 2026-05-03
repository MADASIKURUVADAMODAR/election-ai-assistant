"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle, MapPin, Calendar, ExternalLink, Map, Award, Share2, Download } from "lucide-react";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";

// Actions & Data
import { ELECTION_SCHEDULE } from "@/constants/electionData";

// Hooks
import { useUploadProcessor } from "@/hooks/useUploadProcessor";

// Components
import ErrorBoundary from "@/components/ErrorBoundary";
import VoterProfileCard from "@/components/VoterProfileCard";
import TruthGuardian from "@/components/TruthGuardian";
import CandidateSection from "@/components/CandidateSection";
import { ProfileSkeleton, RoadmapSkeleton } from "@/components/LoadingSkeleton";

/**
 * Main Landing Page for Election AI Assistant.
 * Optimized for accessibility, performance, and engineering maturity.
 */
export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  
  // Custom hooks for complex logic
  const {
    isDragging,
    uploadedImage,
    isScanning,
    showResults,
    voterData,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    processFile,
    resetUpload,
  } = useUploadProcessor();

  // Local readiness state
  const [hasScannedId, setHasScannedId] = useState(false);
  const [hasCheckedRumor, setHasCheckedRumor] = useState(false);
  const [hasViewedBallot, setHasViewedBallot] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Sync scan status
  useEffect(() => {
    if (voterData) setHasScannedId(true);
  }, [voterData]);

  // Derived readiness score
  const readinessScore = useMemo(() => 
    (hasScannedId ? 30 : 0) + (hasCheckedRumor ? 20 : 0) + (hasViewedBallot ? 50 : 0),
    [hasScannedId, hasCheckedRumor, hasViewedBallot]
  );

  // Completion effect
  useEffect(() => {
    if (readinessScore === 100 && !showCompletionModal) {
      setShowCompletionModal(true);
      
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#fbbf24', '#f59e0b', '#d97706'],
          zIndex: 1000
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#fbbf24', '#f59e0b', '#d97706'],
          zIndex: 1000
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [readinessScore, showCompletionModal]);

  const downloadBadge = useCallback(async () => {
    if (!badgeRef.current) return;
    try {
      const canvas = await html2canvas(badgeRef.current, {
        backgroundColor: null,
        scale: 2
      });
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "Certified_Voter_Badge.png";
      link.href = url;
      link.click();
    } catch (err) {
      console.error("Failed to download badge", err);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-12 px-4 sm:px-8 font-sans overflow-y-auto overflow-x-hidden">
        {/* Background ambient light */}
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" aria-hidden="true" />

        {/* Global Voter Readiness Score */}
        <div 
          role="status" 
          aria-label={`Current Voter Readiness Score: ${readinessScore}%`}
          className="fixed top-6 right-6 z-50 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full pl-3 pr-5 py-2 flex items-center gap-3 shadow-2xl transition-all"
        >
          <div className="w-10 h-10 rounded-full border-[3px] border-emerald-400 bg-emerald-500/10 flex items-center justify-center text-sm font-bold text-emerald-400">
            {readinessScore}%
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold leading-tight">Voter Status</span>
            <span className="text-sm font-bold text-slate-200 leading-tight">Readiness Score</span>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-6xl flex flex-col gap-20 mt-8">
          
          {/* TOP SECTION: VoterPulse Lens */}
          <section className="flex flex-col lg:flex-row gap-8 items-start justify-center" aria-labelledby="lens-heading">
            {/* Main Upload Area */}
            <div className="w-full lg:w-[600px] flex-shrink-0 flex flex-col gap-6">
              <div className="text-center lg:text-left mb-2">
                <h1 id="lens-heading" className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                  VoterPulse Lens
                </h1>
                <p className="text-slate-400 mt-3 text-lg">
                  Upload voter data imagery to extract real-time demographic and profile insights.
                </p>
              </div>

              <div
                role="button"
                aria-label="Upload voter document image"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                className={`relative rounded-3xl overflow-hidden transition-all duration-300 ease-out bg-white/5 backdrop-blur-xl border-2 border-dashed ${
                  isDragging ? "border-blue-400 bg-white/10 scale-[1.02]" : "border-slate-600/50 hover:border-slate-500"
                } ${isScanning ? "border-blue-500/80 shadow-[0_0_30px_rgba(59,130,246,0.3)]" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isScanning && !uploadedImage && fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div className="h-[400px] w-full relative flex flex-col items-center justify-center p-8 cursor-pointer">
                  
                  {!uploadedImage && (
                    <div className="flex flex-col items-center text-center pointer-events-none">
                      <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                        <UploadCloud size={40} />
                      </div>
                      <h3 className="text-2xl font-semibold text-slate-200 mb-2">Drag & Drop Image</h3>
                      <p className="text-slate-400 max-w-xs">
                        or click to browse from your device. Supported formats: JPG, PNG, WEBP.
                      </p>
                    </div>
                  )}

                  {uploadedImage && (
                    <div className="absolute inset-0 w-full h-full p-4">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={uploadedImage}
                          alt="Uploaded Voter Document for AI Analysis"
                          className={`w-full h-full object-cover transition-all duration-700 ${isScanning ? 'brightness-50 grayscale-[50%]' : 'brightness-100'}`}
                        />
                        
                        {/* Scanning Animation */}
                        {isScanning && (
                          <motion.div
                            className="absolute inset-x-0 h-1 bg-blue-400 shadow-[0_0_20px_4px_rgba(96,165,250,0.8)] z-10"
                            initial={{ top: "0%" }}
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ 
                              duration: 2, 
                              ease: "linear",
                              repeat: Infinity 
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-400/0 via-blue-400/50 to-blue-400/0 h-24 -translate-y-12 blur-sm pointer-events-none" />
                          </motion.div>
                        )}

                        {/* Reset Button overlay */}
                        {!isScanning && (
                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                             <button 
                               aria-label="Upload a different voter document"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 resetUpload();
                               }}
                               className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors border border-white/20 cursor-pointer"
                             >
                               Upload New Image
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {isScanning && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/80 px-6 py-3 rounded-full border border-slate-700/50 backdrop-blur-md">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                      <span className="text-blue-300 font-medium tracking-wide text-sm uppercase">Analyzing Profile...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results Side Panel */}
            <div className="w-full lg:w-[450px] min-h-[400px]">
              <AnimatePresence mode="wait">
                {isScanning && (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-4 mt-8 lg:mt-0"
                  >
                    <div className="flex items-center gap-3 mb-2 opacity-50">
                      <div className="w-6 h-6 rounded-full bg-slate-800 animate-pulse" />
                      <div className="h-6 w-48 bg-slate-800 rounded-md animate-pulse" />
                    </div>
                    <ProfileSkeleton />
                    <RoadmapSkeleton />
                  </motion.div>
                )}
                {showResults && voterData && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="flex flex-col gap-4 mt-8 lg:mt-0"
                  >
                    <div className="flex items-center gap-3 text-emerald-400 mb-2">
                      <CheckCircle size={24} />
                      <h2 className="text-xl font-semibold">Extraction Complete</h2>
                    </div>

                    <VoterProfileCard data={voterData} />

                    {/* Voter Roadmap Stepper */}
                    {voterData && ELECTION_SCHEDULE[voterData.location as keyof typeof ELECTION_SCHEDULE] && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl mt-2 relative overflow-hidden"
                      >
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
                          <MapPin className="text-blue-400" size={20} aria-hidden="true" />
                          Voter Roadmap
                        </h3>
                        
                        <div className="flex flex-col gap-6 relative ml-2">
                          <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-slate-800" />
                          
                          <div className="flex gap-4 relative z-10">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                              <CheckCircle size={16} />
                            </div>
                            <div>
                              <h4 className="text-slate-200 font-medium leading-none mt-2">ID Verified</h4>
                              <p className="text-sm text-slate-400 mt-1">Profile data extracted successfully.</p>
                            </div>
                          </div>

                          <div className="flex gap-4 relative z-10">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] shrink-0">
                              <Map size={16} />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-blue-300 font-medium leading-none mt-2">Constituency Profile</h4>
                              <div className="mt-3 bg-slate-900/50 p-4 rounded-xl border border-blue-500/20 w-full">
                                <p className="text-sm text-slate-300"><span className="text-slate-500">Location:</span> {voterData.location}</p>
                                {voterData.constituency && <p className="text-sm text-slate-300 mt-1"><span className="text-slate-500">Constituency:</span> {voterData.constituency}</p>}
                                {voterData.pollingBooth && <p className="text-sm text-slate-300 mt-1"><span className="text-slate-500">Polling Booth:</span> {voterData.pollingBooth}</p>}
                                <p className="text-sm text-slate-300 mt-1"><span className="text-slate-500">Phase:</span> {ELECTION_SCHEDULE[voterData.location as keyof typeof ELECTION_SCHEDULE].phase}</p>
                                <p className="text-sm text-slate-300 mt-1"><span className="text-slate-500">Date:</span> {voterData.electionDate || ELECTION_SCHEDULE[voterData.location as keyof typeof ELECTION_SCHEDULE].date}</p>
                                <a href={ELECTION_SCHEDULE[voterData.location as keyof typeof ELECTION_SCHEDULE].link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 mt-3 inline-flex items-center gap-1">
                                  Official Voter Portal <ExternalLink size={12} />
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4 relative z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 transition-colors ${hasViewedBallot ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                              {hasViewedBallot ? <CheckCircle size={16} /> : <Calendar size={16} />}
                            </div>
                            <div>
                              <h4 className={`font-medium leading-none mt-2 ${hasViewedBallot ? 'text-slate-200' : 'text-slate-400'}`}>Polling Day Checklist</h4>
                              {!hasViewedBallot ? (
                                <button 
                                  onClick={() => setHasViewedBallot(true)}
                                  className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white text-xs font-semibold rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2"
                                >
                                  View Ballot Sim (+50%)
                                </button>
                              ) : (
                                <p className="text-sm text-emerald-400 mt-2 font-medium">Ballot Simulator Completed!</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* MIDDLE SECTION: Candidates */}
          {voterData && ELECTION_SCHEDULE[voterData.location as keyof typeof ELECTION_SCHEDULE]?.candidates && (
            <CandidateSection 
              location={voterData.location} 
              candidates={ELECTION_SCHEDULE[voterData.location as keyof typeof ELECTION_SCHEDULE].candidates} 
            />
          )}

          {/* BOTTOM SECTION: The Truth Guardian */}
          <TruthGuardian />

        </div>

        {/* Completion Modal */}
        <AnimatePresence>
          {showCompletionModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-[0_0_50px_rgba(16,185,129,0.2)] text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
                
                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <Award size={48} />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">You're Ready!</h2>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                  Congratulations! You've completed all pre-voting milestones. You are now a <strong>Certified Informed Voter</strong>.
                </p>

                <div className="flex flex-col gap-4">
                  <div 
                    ref={badgeRef}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-3xl p-6 mb-4 flex flex-col items-center gap-4 shadow-inner"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400">
                      <Award size={32} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Official Certification</p>
                      <p className="text-xl font-bold text-white">Verified Voter 2026</p>
                      <p className="text-xs text-slate-400 mt-1">Authorized by VoterPulse AI</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={downloadBadge}
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all border border-white/10"
                    >
                      <Download size={20} /> Badge
                    </button>
                    <button className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      <Share2 size={20} /> Share
                    </button>
                  </div>

                  <button 
                    onClick={() => setShowCompletionModal(false)}
                    className="mt-4 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
                  >
                    Continue Exploring
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </ErrorBoundary>
  );
}
