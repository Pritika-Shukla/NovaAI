"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface AnalysisResult {
  fullName?: string;
  skills?: string[];
  experience?: number;
  techStack?: string[];
  projectSummaries?: string[];
  education?: string;
  weakAreas?: string[];
  estimatedSeniority?: string;
  rawResponse?: string;
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      setFile(selectedFile);
      setAnalysisResult(null);
      setExtractedText("");

      // Automatically start upload and analysis
      await processResume(selectedFile);
    }
  };

  const processResume = async (fileToProcess: File) => {
    setIsUploading(true);
    const toastId = toast.loading("Extracting text from PDF...");

    try {
      // Step 1: Upload and extract text
      const formData = new FormData();
      formData.append("file", fileToProcess);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Failed to upload file");
      }

      const uploadData = await uploadResponse.json();
      const text = typeof uploadData.text === 'string' ? uploadData.text : String(uploadData.text || '');
      if (!text) {
        throw new Error("No text extracted from PDF");
      }
      setExtractedText(text);

      // Step 2: Automatically analyze the extracted text
      toast.loading("Analyzing resume with AI...", { id: toastId });
      setIsUploading(false);
      setIsAnalyzing(true);

      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText: text }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.error || "Failed to analyze resume");
      }

      const analyzeData = await analyzeResponse.json();
      setAnalysisResult(analyzeData);
      toast.success("Resume analyzed successfully!", { id: toastId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process resume";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setExtractedText("");
    setAnalysisResult(null);
    // Reset file input
    const fileInput = document.getElementById("resume-file") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-6 sm:p-8 backdrop-blur-sm shadow-xl dark:border-slate-800/50 dark:bg-slate-900/80">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Resume Analyzer
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Upload your resume PDF to extract information and get AI-powered analysis
        </p>

        {/* File Upload Section */}
        <div className="space-y-4 mb-6">
          <div>
            <label
              htmlFor="resume-file"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Upload Resume (PDF)
            </label>
            <div className="flex flex-col gap-3">
              <input
                id="resume-file"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300 dark:text-slate-400"
                disabled={isUploading || isAnalyzing}
              />
              {(isUploading || isAnalyzing) && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{isUploading ? "Extracting text from PDF..." : "Analyzing resume with AI..."}</span>
                </div>
              )}
            </div>
            {file && !isUploading && !isAnalyzing && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Selected: {file.name}
              </p>
            )}
          </div>

          {(file || analysisResult) && !isUploading && !isAnalyzing && (
            <button
              onClick={handleReset}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 underline"
            >
              Upload Another Resume
            </button>
          )}
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Analysis Results
            </h3>

            {/* Raw AI Response */}
            {analysisResult.rawResponse && (
              <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Full AI Response
                </h4>
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 overflow-x-auto leading-relaxed">
                    {analysisResult.rawResponse}
                  </pre>
                </div>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {analysisResult.fullName && (
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                    Full Name
                  </h4>
                  <p className="text-blue-700 dark:text-blue-400">{analysisResult.fullName}</p>
                </div>
              )}

              {analysisResult.estimatedSeniority && (
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-1">
                    Seniority Level
                  </h4>
                  <p className="text-purple-700 dark:text-purple-400 capitalize">
                    {analysisResult.estimatedSeniority}
                  </p>
                </div>
              )}

              {analysisResult.experience !== undefined && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <h4 className="text-sm font-semibold text-green-900 dark:text-green-300 mb-1">
                    Experience
                  </h4>
                  <p className="text-green-700 dark:text-green-400">
                    {analysisResult.experience} years
                  </p>
                </div>
              )}

              {analysisResult.education && (
                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-300 mb-1">
                    Education
                  </h4>
                  <p className="text-orange-700 dark:text-orange-400">
                    {analysisResult.education}
                  </p>
                </div>
              )}
            </div>

            {analysisResult.skills && analysisResult.skills.length > 0 && (
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(analysisResult.skills) ? (
                    analysisResult.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
                      {analysisResult.skills}
                    </span>
                  )}
                </div>
              </div>
            )}

            {analysisResult.techStack && analysisResult.techStack.length > 0 && (
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(analysisResult.techStack) ? (
                    analysisResult.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm">
                      {analysisResult.techStack}
                    </span>
                  )}
                </div>
              </div>
            )}

            {analysisResult.projectSummaries && analysisResult.projectSummaries.length > 0 && (
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Project Summaries
                </h4>
                <ul className="space-y-2">
                  {Array.isArray(analysisResult.projectSummaries) ? (
                    analysisResult.projectSummaries.map((project, index) => (
                      <li
                        key={index}
                        className="text-sm text-slate-600 dark:text-slate-400 list-disc list-inside"
                      >
                        {project}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
                      {analysisResult.projectSummaries}
                    </li>
                  )}
                </ul>
              </div>
            )}

            {analysisResult.weakAreas && analysisResult.weakAreas.length > 0 && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <h4 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">
                  Areas for Improvement
                </h4>
                <ul className="space-y-1">
                  {Array.isArray(analysisResult.weakAreas) ? (
                    analysisResult.weakAreas.map((area, index) => (
                      <li
                        key={index}
                        className="text-sm text-red-700 dark:text-red-400 list-disc list-inside"
                      >
                        {area}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-red-700 dark:text-red-400 list-disc list-inside">
                      {analysisResult.weakAreas}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

