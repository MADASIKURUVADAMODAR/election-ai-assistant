import { useState, useCallback } from "react";
import { verifyRumor, VerificationResult } from "@/app/actions/verifyRumor";

/**
 * Custom hook for the Truth Guardian rumor verification logic.
 * @returns {Object} State and handlers for rumor verification.
 */
export const useTruthGuardian = () => {
  const [rumorQuery, setRumorQuery] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  /**
   * Handlers for verifying a rumor query.
   */
  const handleVerifyRumor = useCallback(async () => {
    if (!rumorQuery.trim()) return;
    
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      const result = await verifyRumor(rumorQuery);
      setVerificationResult(result);
      return true;
    } catch (error) {
      console.error("Verification failed:", error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [rumorQuery]);

  return {
    rumorQuery,
    setRumorQuery,
    isVerifying,
    verificationResult,
    handleVerifyRumor,
  };
};
