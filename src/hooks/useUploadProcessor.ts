import { useState, useCallback } from "react";
import { extractVoterData, ExtractedVoterData } from "@/app/actions/extractVoterData";
import { isValidImage } from "@/lib/security";

/**
 * Custom hook for handling voter document image uploads and processing.
 * @returns {Object} State and handlers for image upload processing.
 */
export const useUploadProcessor = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [voterData, setVoterData] = useState<ExtractedVoterData | null>(null);

  const processFile = useCallback(async (file: File) => {
    if (!isValidImage(file)) {
      alert("Please upload a valid image (JPG, PNG, WEBP) under 10MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsScanning(true);
    setShowResults(false);
    setVoterData(null);

    try {
      // Convert to base64 for the server action
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;
      const data = await extractVoterData(base64, file.type, file.name);
      
      setVoterData(data);
      setShowResults(true);
      return true;
    } catch (error) {
      console.error("Processing failed:", error);
      return false;
    } finally {
      setIsScanning(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const resetUpload = useCallback(() => {
    setUploadedImage(null);
    setShowResults(false);
    setVoterData(null);
  }, []);

  return {
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
  };
};
