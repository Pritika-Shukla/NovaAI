export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-black dark:via-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 sm:px-12 lg:px-24">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-blue-50/50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800/50 dark:bg-blue-950/30 dark:text-blue-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              AI-Powered Interview Practice
            </div>

            {/* Main Headline */}
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
              Ace Your Next
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-blue-400">
                Coding Interview
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-slate-600 dark:text-slate-300 sm:text-2xl">
              Practice with AI interviewers, get instant feedback, and improve your coding skills. 
              Join a meeting and let AI guide you through real interview scenarios.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/60 sm:w-auto">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Interview
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
              <button className="w-full rounded-2xl border-2 border-slate-300 bg-white/80 px-8 py-4 text-lg font-semibold text-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900 sm:w-auto">
                Watch Demo
              </button>
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
  );
}
