"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface AnalysisResult {
  fullName?: string;
  skills?: string[] | string;
  experience?: number;
  techStack?: string[] | string;
  projectSummaries?: string[] | string;
  education?: string;
  weakAreas?: string[] | string;
  estimatedSeniority?: string;
  rawResponse?: string;
}

export default function InterviewPage() {
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
    const fileInput = document.getElementById("resume-file") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-black dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
            Interview Preparation
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Upload your resume to get AI-powered insights and prepare for your interview
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8 rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-900/80 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
            Upload & Analyze Resume
          </h2>
          
          <div className="space-y-4">
            <div>
              <label
                htmlFor="resume-file"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Upload Resume (PDF)
              </label>
              <input
                id="resume-file"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300 dark:text-slate-400"
                disabled={isUploading || isAnalyzing}
              />
              {file && !isUploading && !isAnalyzing && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {(isUploading || isAnalyzing) && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{isUploading ? "Extracting text from PDF..." : "Analyzing resume with AI..."}</span>
              </div>
            )}

            {(file || analysisResult) && !isUploading && !isAnalyzing && (
              <button
                onClick={handleReset}
                className="rounded-lg border-2 border-slate-300 bg-white/80 px-6 py-3 font-semibold text-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:hover:border-slate-600 dark:hover:bg-slate-800"
              >
                Upload Another Resume
              </button>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-900/80 sm:p-8">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
              Analysis Results
            </h2>

            <div className="space-y-6">
              {/* Basic Info Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {analysisResult.fullName && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                    <h4 className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-300">
                      Full Name
                    </h4>
                    <p className="text-blue-700 dark:text-blue-400">{analysisResult.fullName}</p>
                  </div>
                )}

                {analysisResult.estimatedSeniority && (
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
                    <h4 className="mb-1 text-sm font-semibold text-purple-900 dark:text-purple-300">
                      Seniority Level
                    </h4>
                    <p className="capitalize text-purple-700 dark:text-purple-400">
                      {analysisResult.estimatedSeniority}
                    </p>
                  </div>
                )}

                {analysisResult.experience !== undefined && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                    <h4 className="mb-1 text-sm font-semibold text-green-900 dark:text-green-300">
                      Experience
                    </h4>
                    <p className="text-green-700 dark:text-green-400">
                      {analysisResult.experience} years
                    </p>
                  </div>
                )}

                {analysisResult.education && (
                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
                    <h4 className="mb-1 text-sm font-semibold text-orange-900 dark:text-orange-300">
                      Education
                    </h4>
                    <p className="text-orange-700 dark:text-orange-400">
                      {analysisResult.education}
                    </p>
                  </div>
                )}
              </div>

              {/* Skills */}
              {analysisResult.skills && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <h4 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(analysisResult.skills) ? (
                      analysisResult.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {analysisResult.skills}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              {analysisResult.techStack && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <h4 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(analysisResult.techStack) ? (
                      analysisResult.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                        {analysisResult.techStack}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Project Summaries */}
              {analysisResult.projectSummaries && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <h4 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                    Project Summaries
                  </h4>
                  <ul className="space-y-2">
                    {Array.isArray(analysisResult.projectSummaries) ? (
                      analysisResult.projectSummaries.map((project, index) => (
                        <li
                          key={index}
                          className="list-inside list-disc text-sm text-slate-600 dark:text-slate-400"
                        >
                          {project}
                        </li>
                      ))
                    ) : (
                      <li className="list-inside list-disc text-sm text-slate-600 dark:text-slate-400">
                        {analysisResult.projectSummaries}
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Weak Areas */}
              {analysisResult.weakAreas && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <h4 className="mb-3 text-lg font-semibold text-red-900 dark:text-red-300">
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-1">
                    {Array.isArray(analysisResult.weakAreas) ? (
                      analysisResult.weakAreas.map((area, index) => (
                        <li
                          key={index}
                          className="list-inside list-disc text-sm text-red-700 dark:text-red-400"
                        >
                          {area}
                        </li>
                      ))
                    ) : (
                      <li className="list-inside list-disc text-sm text-red-700 dark:text-red-400">
                        {analysisResult.weakAreas}
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Raw Response */}
              {analysisResult.rawResponse && (
                <details className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-white">
                    View Raw AI Response
                  </summary>
                  <div className="mt-3 rounded-lg bg-white p-4 dark:bg-slate-900">
                    <pre className="whitespace-pre-wrap text-xs text-slate-700 dark:text-slate-300 overflow-x-auto">
                      {analysisResult.rawResponse}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

