"use client";

import { useState, useEffect } from "react";
import AuthToastHandler from "./components/AuthToastHandler";
import ResumeAnalyzer from "./components/ResumeAnalyzer";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingTexts = ["Coding Interview", "Technical Interview", "AI Interview"];
    const currentText = typingTexts[currentTextIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText.length < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.substring(0, displayText.length + 1));
      }, 100);
    } else if (!isDeleting && displayText.length === currentText.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.substring(0, displayText.length - 1));
      }, 50);
    } else if (isDeleting && displayText.length === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
      }, 100);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTextIndex]);

  return (
    <>
      <AuthToastHandler />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-black dark:via-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section 
        className="relative min-h-[85vh] overflow-hidden px-4 py-8 sm:px-6 sm:py-12 md:px-12 md:py-16 lg:px-24 lg:py-20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Interactive Animated Background */}
        <div className="absolute inset-0">
          {/* Dynamic gradient that follows mouse */}
          <div 
            className="absolute h-64 w-64 rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-3xl transition-all duration-700 ease-out dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 sm:h-80 sm:w-80 md:h-96 md:w-96"
            style={{
              left: `${mousePosition.x / 30}px`,
              top: `${mousePosition.y / 30}px`,
              transform: isHovered ? 'scale(1.2)' : 'scale(1)',
            }}
          />
          
          {/* Floating orbs - smaller on mobile */}
          <div className="absolute top-10 left-4 h-48 w-48 animate-pulse rounded-full bg-blue-400/20 blur-3xl sm:top-20 sm:left-10 sm:h-64 sm:w-64 md:h-72 md:w-72" style={{ animationDuration: '4s' }} />
          <div className="absolute top-20 right-4 h-56 w-56 animate-pulse rounded-full bg-purple-400/20 blur-3xl sm:top-40 sm:right-10 sm:h-80 sm:w-80 md:h-96 md:w-96" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          <div className="absolute bottom-10 left-1/4 h-52 w-52 animate-pulse rounded-full bg-pink-400/15 blur-3xl sm:bottom-20 sm:left-1/3 sm:h-64 sm:w-64 md:h-80 md:w-80" style={{ animationDuration: '5s', animationDelay: '2s' }} />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* Left Column - Text Content */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Badge with glow effect */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-gradient-to-r from-blue-50/80 to-purple-50/80 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-blue-700 backdrop-blur-sm shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 dark:border-blue-800/50 dark:from-blue-950/30 dark:to-purple-950/30 dark:text-blue-400">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-full w-full rounded-full bg-blue-500" />
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                  AI-Powered Interview Practice
                </span>
              </div>

              {/* Animated Headline */}
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block">Ace Your Next</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-blue-400">
                  {displayText || "Coding Interview"}
                  <span className="animate-pulse">|</span>
                </span>
          </h1>

              {/* Subheadline */}
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg md:text-xl max-w-2xl mx-auto lg:mx-0">
                Practice with AI interviewers, get instant feedback, and improve your coding skills. 
                Join a meeting and let AI guide you through real interview scenarios.
              </p>

              {/* Interactive Stats */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                {[
                  { number: "10K+", label: "Interviews" },
                  { number: "95%", label: "Success Rate" },
                  { number: "24/7", label: "Available" },
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="group cursor-pointer rounded-xl sm:rounded-2xl border border-slate-200/50 bg-white/60 p-3 sm:p-4 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-blue-300 hover:bg-white/80 hover:shadow-lg hover:shadow-blue-500/20 dark:border-slate-800/50 dark:bg-slate-900/60 dark:hover:border-blue-600 flex-1 sm:flex-none"
                  >
                    <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button className="group relative w-full sm:w-auto overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-lg shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/60">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Interview
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 blur-xl transition-opacity group-hover:opacity-50" />
                </button>
                <button className="group w-full sm:w-auto rounded-xl sm:rounded-2xl border-2 border-slate-300 bg-white/80 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-slate-700 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:bg-white hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-blue-600 dark:hover:bg-slate-900">
                  <span className="flex items-center justify-center gap-2">
                    Watch Demo
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column - Interactive Visual Elements */}
            <div className="relative mt-8 lg:mt-0">
              {/* Floating Code Card */}
              <div className="group relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -right-2 -top-2 sm:-right-4 sm:-top-4 h-full w-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 opacity-20 blur-xl transition-all duration-500 group-hover:opacity-30 group-hover:blur-2xl" />
                <div className="relative rounded-xl sm:rounded-2xl border border-slate-200/50 bg-white/80 p-4 sm:p-6 backdrop-blur-sm shadow-2xl transition-all duration-500 hover:scale-105 dark:border-slate-800/50 dark:bg-slate-900/80">
                  <div className="mb-3 sm:mb-4 flex items-center gap-2">
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500" />
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-500" />
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500" />
                    <span className="ml-2 sm:ml-4 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">interview.ts</span>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 font-mono text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600 dark:text-purple-400">function</span>
                      <span className="text-blue-600 dark:text-blue-400">solve</span>
                      <span className="text-slate-700 dark:text-slate-300">()</span>
                      <span className="text-slate-700 dark:text-slate-300">{`{`}</span>
                    </div>
                    <div className="ml-3 sm:ml-4 text-green-600 dark:text-green-400">
                      return <span className="text-pink-600 dark:text-pink-400">&quot;Perfect!&quot;</span>;
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">{`}`}</div>
                  </div>
                </div>
              </div>

              {/* Floating Interview Cards - only show on larger screens */}
              <div className="hidden md:absolute md:left-0 lg:-left-8 md:top-1/2 md:-translate-y-1/2">
                <div className="rounded-lg sm:rounded-xl border border-slate-200/50 bg-white/90 p-3 sm:p-4 shadow-xl backdrop-blur-sm transition-all duration-700 hover:scale-110 hover:rotate-3 dark:border-slate-800/50 dark:bg-slate-900/90">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">AI Interviewer</div>
                      <div className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">Ready to start</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:absolute md:-bottom-4 md:right-0 lg:-bottom-8 lg:-right-8">
                <div className="rounded-lg sm:rounded-xl border border-slate-200/50 bg-white/90 p-3 sm:p-4 shadow-xl backdrop-blur-sm transition-all duration-700 hover:scale-110 hover:-rotate-3 dark:border-slate-800/50 dark:bg-slate-900/90">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Feedback Ready</div>
                      <div className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">Instant results</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 sm:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Three simple steps to interview success
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/50 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-blue-700">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                Join a Meeting
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Connect instantly with our AI interviewer. No scheduling, no waiting—just click and start practicing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/50 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-blue-700">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                AI Conducts Test
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Experience realistic coding challenges and technical questions tailored to your skill level and target role.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/50 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-blue-700">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                Get Feedback
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Receive detailed feedback on your performance, code quality, problem-solving approach, and areas for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-20 sm:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-6 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
                Practice Makes Perfect
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Build confidence through repeated practice with AI interviewers that adapt to your skill level. 
                Get instant feedback on your coding solutions, problem-solving approach, and communication skills.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time coding challenges",
                  "Personalized interview scenarios",
                  "Detailed performance analytics",
                  "Improvement recommendations",
                  "Platform-specific practice (LeetCode, HackerRank, etc.)",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-3xl border border-slate-200/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-12 backdrop-blur-sm dark:border-slate-800/50">
                <div className="space-y-4">
                  <div className="h-4 w-3/4 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600" />
                  <div className="h-4 w-full rounded-lg bg-gradient-to-r from-purple-400 to-purple-600" />
                  <div className="h-4 w-5/6 rounded-lg bg-gradient-to-r from-pink-400 to-pink-600" />
                  <div className="mt-8 h-32 rounded-lg bg-slate-200/50 dark:bg-slate-800/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Analyzer Section */}
      <section className="px-6 py-20 sm:px-12 lg:px-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-black dark:via-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Analyze Your Resume
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Upload your resume PDF and get AI-powered insights about your skills, experience, and areas for improvement
            </p>
          </div>
          <ResumeAnalyzer />
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100 px-6 py-20 sm:px-12 lg:px-24 dark:from-black dark:via-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Ready to Level Up?
          </h2>
          <p className="mb-12 text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
            Join thousands of developers who are acing their interviews with InterviewAI
          </p>
          
          {/* Feature List */}
          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            {[
              "Practice unlimited interviews",
              "Get detailed feedback",
              "Track your progress",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-900 dark:text-white">{feature}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/60 sm:w-auto">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Free Trial
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
            <button className="w-full rounded-2xl border-2 border-slate-300 bg-white/80 px-8 py-4 text-lg font-semibold text-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:hover:border-slate-600 dark:hover:bg-slate-800 sm:w-auto">
              Schedule a Demo
            </button>
          </div>
          
          {/* Disclaimer */}
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 px-6 py-12 dark:border-slate-800/50">
        <div className="mx-auto max-w-7xl text-center text-slate-600 dark:text-slate-400">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Nova AI</p>
          <p className="mt-2">Practice. Improve. Succeed.</p>
        </div>
      </footer>
    </div>
    </>
  );
}
