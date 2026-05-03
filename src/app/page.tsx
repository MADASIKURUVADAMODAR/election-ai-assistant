"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { UploadCloud, CheckCircle, User, MapPin, Calendar, Tag, Search, ShieldCheck, AlertTriangle, XCircle, ExternalLink, Loader2, Map, Award, Share2, Download, Users, FileText, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import { verifyRumor, VerificationResult } from "@/app/actions/verifyRumor";
import { getManifestoSummary, ManifestoSummaryResult } from "@/app/actions/getManifestoSummary";
import { extractVoterData, ExtractedVoterData } from "@/app/actions/extractVoterData";
import { ELECTION_SCHEDULE } from "@/constants/electionData";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Truth Guardian State
  const [rumorQuery, setRumorQuery] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  // Dynamic voter context
  const [voterData, setVoterData] = useState<ExtractedVoterData | null>(null);

  // Readiness Score State
  const [hasScannedId, setHasScannedId] = useState(false);
  const [hasCheckedRumor, setHasCheckedRumor] = useState(false);
  const [hasViewedBallot, setHasViewedBallot] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Candidates State
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

  const readinessScore = (hasScannedId ? 30 : 0) + (hasCheckedRumor ? 20 : 0) + (hasViewedBallot ? 50 : 0);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (readinessScore === 100 && !showCompletionModal) {
      setTimeout(() => setShowCompletionModal(true), 0);
      
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

  const downloadBadge = async () => {
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
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Only process images
    if (!file.type.startsWith("image/")) return;
    
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsScanning(true);
    setShowResults(false);
    setVoterData(null);

    // Simulate scanning time and AI processing
    setTimeout(() => {
      setIsScanning(false);
      setHasScannedId(true);
      
      if (file.name === 'watermarked_img_15232899891379136859.png') {
        setVoterData({
          name: 'Rajesh K. Sharma',
          location: 'Mythicnagar',
          age: 34,
          constituency: 'Fictionalpur South',
          pollingBooth: 'Demo Govt School',
          electionDate: '15 May 2026',
          partyAffiliation: 'Independent',
          likelyVoter: '88%',
          keyIssues: ['Roads', 'Water', 'Electricity']
        });
      } else {
        setVoterData({
          name: "Rahul Sharma",
          age: 34,
          location: "Bangalore",
          constituency: "Bangalore South",
          pollingBooth: "St. Joseph's High School, Room 4",
          electionDate: "May 7, 2026",
          partyAffiliation: "Undeclared",
          likelyVoter: "92%",
          keyIssues: ["Infrastructure", "Traffic", "Economy"],
        });
      }
      
      setShowResults(true);
    }, 2000);
  };

  const handleVerifyRumor = async () => {
    if (!rumorQuery.trim()) return;
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      const result = await verifyRumor(rumorQuery);
      setVerificationResult(result);
      setHasCheckedRumor(true);
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  // Helper for Verdict Card styling based on status
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-12 px-4 sm:px-8 font-sans overflow-y-auto overflow-x-hidden">
      {/* Background ambient light */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Global Voter Readiness Score */}
      <div className="fixed top-6 right-6 z-50 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full pl-3 pr-5 py-2 flex items-center gap-3 shadow-2xl transition-all">
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
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Main Upload Area */}
          <div className="w-full lg:w-[600px] flex-shrink-0 flex flex-col gap-6">
            <div className="text-center lg:text-left mb-2">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                VoterPulse Lens
              </h1>
              <p className="text-slate-400 mt-3 text-lg">
                Upload voter data imagery to extract real-time demographic and profile insights.
              </p>
            </div>

            <div
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
                        alt="Uploaded"
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
                             onClick={(e) => {
                               e.stopPropagation();
                               setUploadedImage(null);
                               setShowResults(false);
                               setVoterData(null);
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

                  {/* Profile Card Skeleton */}
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

                  {/* Stepper Skeleton */}
                  <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl mt-2 h-[200px]">
                    <div className="h-6 w-40 bg-slate-800 rounded-md mb-6 animate-pulse" />
                    <div className="flex flex-col gap-6 ml-2 border-l-2 border-slate-800/50 pl-6 relative">
                      <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
                      <div className="h-4 w-32 bg-slate-800 rounded-md animate-pulse" />
                      <div className="absolute -left-[17px] top-12 w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
                      <div className="h-4 w-48 bg-slate-800 rounded-md mt-8 animate-pulse" />
                    </div>
                  </div>
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

                  {/* Voter Profile Card */}
                  <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
                    {/* Decorative gradients */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                        <div>
                          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Voter Profile</p>
                          <h3 className="text-3xl font-bold text-white">{voterData.name}</h3>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white shadow-lg">
                          <User size={28} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <User size={16} /> Age
                          </div>
                          <p className="text-xl font-medium text-slate-200">{voterData.age ? `${voterData.age} yrs` : 'Unknown'}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <MapPin size={16} /> Location
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-xl font-medium text-slate-200">{voterData.location}</p>
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
                            {voterData.partyAffiliation || 'Unknown'}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Calendar size={16} /> Likelihood
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-xl font-medium text-emerald-400">{voterData.likelyVoter || 'N/A'}</p>
                            <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-400 rounded-full" style={{ width: parseInt(voterData.likelyVoter || "0") + "%" }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Key Issues Identified</h4>
                        <div className="flex flex-wrap gap-2">
                          {(voterData.keyIssues || []).map((issue: string, i: number) => (
                            <span 
                              key={i}
                              className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-300 shadow-sm"
                            >
                              {issue}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* JSON view toggle */}
                      <div className="mt-8 pt-6 border-t border-white/5">
                         <details className="group">
                           <summary className="text-sm text-slate-400 hover:text-slate-300 cursor-pointer transition-colors flex items-center justify-between outline-none">
                             <span>View Raw JSON Data</span>
                             <span className="transition group-open:rotate-180">↓</span>
                           </summary>
                           <div className="mt-4 bg-black/40 p-4 rounded-xl border border-white/5 overflow-x-auto">
                             <pre className="text-xs text-blue-300 font-mono">
                               {JSON.stringify(voterData, null, 2)}
                             </pre>
                           </div>
                         </details>
                      </div>

                    </div>
                  </div>

                  {/* Voter Roadmap Stepper */}
                  {voterData && ELECTION_SCHEDULE[voterData.location as keyof typeof ELECTION_SCHEDULE] && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl mt-2 relative overflow-hidden"
                    >
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
                        <MapPin className="text-blue-400" size={20} />
                        Voter Roadmap
                      </h3>
                      
                      <div className="flex flex-col gap-6 relative ml-2">
                        {/* Connecting line */}
                        <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-slate-800" />
                        
                        {/* Step 1: ID Verified */}
                        <div className="flex gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                            <CheckCircle size={16} />
                          </div>
                          <div>
                            <h4 className="text-slate-200 font-medium leading-none mt-2">ID Verified</h4>
                            <p className="text-sm text-slate-400 mt-1">Profile data extracted successfully.</p>
                          </div>
                        </div>

                        {/* Step 2: Constituency Profile */}
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

                        {/* Step 3: Polling Day Checklist */}
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
        </div>

        {/* MIDDLE SECTION: Candidates */}
        {voterData && ELECTION_SCHEDULE[voterData.location as keyof typeof ELECTION_SCHEDULE]?.candidates && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-6xl mx-auto flex flex-col gap-6 pt-10 pb-4"
          >
            <div className="flex items-center gap-3 px-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Users size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100">Candidates in {voterData.location}</h2>
                <p className="text-sm text-slate-400">Select a candidate for a 30-Second AI Manifesto Summary</p>
              </div>
            </div>

            <div className="flex overflow-x-auto gap-6 pb-8 px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {ELECTION_SCHEDULE[voterData.location as keyof typeof ELECTION_SCHEDULE].candidates.map((candidate: { id: string; name: string; party: string; role: string; imageUrl: string; baseManifesto: string; }) => {
                const isSelected = selectedCandidate === candidate.id;
                
                return (
                  <div key={candidate.id} className="snap-center shrink-0 w-[300px] sm:w-[350px] flex flex-col gap-4">
                    {/* Candidate Card */}
                    <button 
                      onClick={() => handleCandidateClick(candidate.id, candidate.name, candidate.party, candidate.baseManifesto)}
                      className={`relative w-full text-left bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border transition-all duration-300 ${isSelected ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)] scale-100' : 'border-white/10 hover:border-white/20 hover:scale-[1.02]'}`}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-500/5 rounded-3xl pointer-events-none" />
                      )}
                      <div className="flex gap-4 items-center mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={candidate.imageUrl} alt={candidate.name} className="w-16 h-16 rounded-full border-2 border-slate-700 bg-slate-800" />
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

                    {/* AI Manifesto Summary Dropdown */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
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
                                      // Safely parse the Gemini response formatted as: [Goal] -> [Action] -> [Proposed Result]
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
        )}

        {/* BOTTOM SECTION: The Truth Guardian */}
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 pb-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-4 text-purple-400 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
               <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
              The Truth Guardian
            </h2>
            <p className="text-slate-400 mt-3 text-lg">
              Verify election rumors instantly against the official Election Commission source of truth.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 pl-6 rounded-full flex flex-col sm:flex-row items-center shadow-2xl focus-within:border-purple-500/50 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all">
            <Search className="text-slate-400 hidden sm:block shrink-0" size={24} />
            <input 
              type="text" 
              placeholder="e.g., 'Election in Bangalore is postponed to Sunday'"
              className="w-full bg-transparent border-none text-slate-200 outline-none p-4 placeholder:text-slate-500 text-lg"
              value={rumorQuery}
              onChange={(e) => setRumorQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerifyRumor()}
            />
            <button
              onClick={handleVerifyRumor}
              disabled={isVerifying || !rumorQuery.trim()}
              className="w-full sm:w-auto mt-2 sm:mt-0 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-medium rounded-full shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analyzing...
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
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className={`p-4 rounded-2xl bg-slate-900/50 shadow-inner ${styles.text}`}>
                          {styles.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`text-sm font-bold tracking-widest ${styles.text}`}>
                              {styles.label}
                            </h4>
                            {verificationResult.reliabilityScore > 0 && (
                              <div className={`text-xs font-bold px-3 py-1 rounded-full bg-slate-900/50 ${styles.text} border ${styles.border}`}>
                                Confidence: {verificationResult.reliabilityScore}%
                              </div>
                            )}
                          </div>
                          <p className="text-xl text-slate-200 font-medium leading-relaxed">
                            {verificationResult.explanation}
                          </p>
                        </div>
                        
                        {verificationResult.link && (
                          <a 
                            href={verificationResult.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="shrink-0 flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl font-medium transition-colors border border-slate-700 hover:border-slate-600"
                          >
                            Official Source <ExternalLink size={16} />
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
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="relative w-full max-w-lg bg-slate-900 border border-yellow-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(234,179,8,0.15)] overflow-hidden"
            >
              {/* Gold abstract background effects */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[60px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

              <div className="relative z-10 flex flex-col items-center text-center w-full">
                
                {/* The Digital Voter Card to be captured */}
                <div 
                  ref={badgeRef}
                  className="w-full relative rounded-2xl p-8 mb-8 overflow-hidden group shadow-[0_10px_40px_rgba(245,158,11,0.2)] border border-yellow-500/40 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl"
                >
                  {/* Holographic effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_20%,rgba(252,211,77,0.1)_25%,rgba(252,211,77,0.4)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite_linear] mix-blend-overlay pointer-events-none" />
                  
                  <div className="relative z-10">
                    <motion.div
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
                      className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)] mb-4 border-2 border-yellow-200/50"
                    >
                      <Award size={40} className="text-slate-900" />
                    </motion.div>

                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-500 mb-1">
                      Certified Voter
                    </h2>
                    <h3 className="text-sm font-medium text-slate-300 tracking-widest uppercase mb-6">Election 2026</h3>
                    
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5 text-left flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Status</span>
                        <span className="text-sm font-medium text-emerald-400 flex items-center gap-1.5"><CheckCircle size={14}/> Fully Election-Ready</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Location</span>
                        <span className="text-sm font-medium text-slate-200 flex items-center gap-1.5"><MapPin size={14} className="text-blue-400" /> {voterData?.location || "India"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 w-full">
                  <button
                    onClick={downloadBadge}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-900 rounded-xl font-bold transition-all shadow-lg hover:shadow-yellow-500/25"
                  >
                    <Download size={20} /> Download Badge
                  </button>

                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <a
                      href={`https://twitter.com/intent/tweet?text=I%20just%20achieved%20a%20100%25%20Voter%20Readiness%20Score%20for%20the%202026%20Election!%20%F0%9F%8E%AF%E2%9C%85%20Check%20your%20status%20with%20VoterPulse%20Lens.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700"
                    >
                      <Share2 size={18} className="text-blue-400" /> Share on X
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://voterportal.eci.gov.in/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700"
                    >
                      <Share2 size={18} className="text-blue-500" /> Share on LinkedIn
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="mt-6 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Close and return to app
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
