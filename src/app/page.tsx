"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Brain, Zap, CheckCircle2, Video, FileText, BarChart3, Users, Star, PlayCircle, Upload, MessageSquare } from "lucide-react"
import { useEffect, useState, Suspense } from "react"
import { LandingNavbar } from "@/components/LandingNavbar"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

function PageContent() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Handle OAuth callback code if present (fallback in case Supabase redirects here)
    const code = searchParams.get('code')
    if (code) {
      // Redirect to the auth callback route to handle the code exchange
      const next = searchParams.get('next') || '/dashboard'
      router.replace(`/auth/callback?code=${code}&next=${next}`)
      return
    }

    const frameId = requestAnimationFrame(() => {
      setMounted(true)
    })
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      cancelAnimationFrame(frameId)
      subscription.unsubscribe()
    }
  }, [searchParams, router])

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/signup")
    }
  }

  return (
    <>
    <LandingNavbar />
    <section className="relative min-h-[90vh] overflow-hidden bg-background sm:min-h-screen">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, oklch(0.3 0 0) 1px, transparent 1px),
              linear-gradient(to bottom, oklch(0.3 0 0) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Accent glow effect */}
      <div
        className="absolute -right-20 top-0 h-[300px] w-[300px] rounded-full opacity-30 blur-3xl sm:right-0 sm:h-[500px] sm:w-[500px] md:h-[600px] md:w-[600px]"
        style={{
          background: "radial-gradient(circle, oklch(0.45 0.15 250) 0%, transparent 70%)",
        }}
      />

      <div className="container relative mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Left column - Main content */}
          <div className="flex flex-col justify-center space-y-6 sm:space-y-8">
            {/* Badge */}
            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-all duration-700 sm:px-4 sm:py-2 sm:text-sm ${
                mounted ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              }`}
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>AI-Powered Interview Mastery</span>
            </div>

            {/* Main headline */}
            <div className="space-y-3 sm:space-y-4">
              <h1
                className={`text-balance text-3xl font-bold leading-[1.1] tracking-tight text-foreground transition-all duration-700 delay-100 sm:text-4xl md:text-5xl lg:text-6xl ${
                  mounted ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                }`}
              >
                Stop{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">guessing.</span>
                  <span
                    className="absolute bottom-1 left-0 h-2 w-full bg-primary/30 sm:bottom-2 sm:h-3"
                    style={{ transform: "skewY(-1deg)" }}
                  />
                </span>
                <br />
                Start{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  dominating
                </span>{" "}
                interviews.
              </h1>

              <p
                className={`text-pretty text-sm leading-relaxed text-muted-foreground transition-all duration-700 delay-200 sm:text-base md:text-lg ${
                  mounted ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                }`}
              >
                Real-time AI feedback on your answers. Personalized coaching that adapts to your style. Interview
                simulation so realistic, you&apos;ll forget it&apos;s practice.
              </p>
            </div>

            {/* CTA buttons */}
            <div
              className={`flex flex-col gap-3 transition-all duration-700 delay-300 sm:flex-row sm:gap-4 ${
                mounted ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              }`}
            >
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="group h-12 px-6 text-base bg-primary text-primary-foreground hover:bg-primary/90 sm:h-14 sm:px-8 sm:text-lg"
              >
                Start practicing free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="h-12 px-6 text-base border-primary/30 bg-primary/5 hover:bg-primary/10 sm:h-14 sm:px-8 sm:text-lg"
              >
                Watch demo
              </Button>
            </div>

            {/* Stats */}
           
          </div>

          {/* Right column - Feature cards */}
          <div
            className={`flex flex-col justify-center gap-3 transition-all duration-700 delay-500 sm:gap-4 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {/* Card 1 */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 sm:rounded-2xl sm:p-6">
              <div className="absolute right-0 top-0 h-24 w-24 bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-0 sm:h-32 sm:w-32" />
              <div className="relative flex items-start gap-3 sm:gap-4">
                <div className="rounded-lg bg-primary/10 p-2 sm:rounded-xl sm:p-3">
                  <Brain className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <div className="flex-1 space-y-1 sm:space-y-2">
                  <h3 className="font-semibold text-base text-card-foreground sm:text-lg">Real-time AI Analysis</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    Get instant feedback on communication, technical accuracy, and body language as you practice
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 sm:rounded-2xl sm:p-6">
              <div className="absolute right-0 top-0 h-24 w-24 bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-0 sm:h-32 sm:w-32" />
              <div className="relative flex items-start gap-3 sm:gap-4">
                <div className="rounded-lg bg-primary/10 p-2 sm:rounded-xl sm:p-3">
                  <Zap className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <div className="flex-1 space-y-1 sm:space-y-2">
                  <h3 className="font-semibold text-base text-card-foreground sm:text-lg">Adaptive Learning Path</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    AI identifies your weak spots and creates custom scenarios to strengthen them
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 sm:rounded-2xl sm:p-6">
              <div className="absolute right-0 top-0 h-24 w-24 bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-0 sm:h-32 sm:w-32" />
              <div className="relative flex items-start gap-3 sm:gap-4">
                <div className="rounded-lg bg-primary/10 p-2 sm:rounded-xl sm:p-3">
                  <CheckCircle2 className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <div className="flex-1 space-y-1 sm:space-y-2">
                  <h3 className="font-semibold text-base text-card-foreground sm:text-lg">Industry-Specific Prep</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    Tech, finance, consulting—practice with questions from your actual target companies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
    </section>

    {/* How It Works Section */}
    <section className="relative py-16 sm:py-20 md:py-24 bg-background">
      <div className="container relative mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2
            className={`text-3xl font-bold text-foreground transition-all duration-700 sm:text-4xl md:text-5xl ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            How It Works
          </h2>
          <p
            className={`mt-4 text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            Get interview-ready in three simple steps
          </p>
        </div>

        <div className="grid gap-8 sm:gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
          {/* Step 1 */}
          <div
            className={`group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 sm:rounded-2xl sm:p-8 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="absolute right-0 top-0 h-24 w-24 bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-0 sm:h-32 sm:w-32" />
            <div className="relative">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Upload className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
              </div>
              <div className="mb-2 text-xs font-semibold text-primary sm:text-sm">Step 1</div>
              <h3 className="mb-3 text-lg font-semibold text-card-foreground sm:text-xl">Upload Your Resume</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Upload your resume and let our AI analyze your experience, skills, and background to personalize your practice sessions.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 sm:rounded-2xl sm:p-8 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="absolute right-0 top-0 h-24 w-24 bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-0 sm:h-32 sm:w-32" />
            <div className="relative">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Video className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
              </div>
              <div className="mb-2 text-xs font-semibold text-primary sm:text-sm">Step 2</div>
              <h3 className="mb-3 text-lg font-semibold text-card-foreground sm:text-xl">Practice with AI</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Engage in realistic interview simulations. Get real-time feedback on your answers, communication style, and technical accuracy.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className={`group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 sm:rounded-2xl sm:p-8 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="absolute right-0 top-0 h-24 w-24 bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-0 sm:h-32 sm:w-32" />
            <div className="relative">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <BarChart3 className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
              </div>
              <div className="mb-2 text-xs font-semibold text-primary sm:text-sm">Step 3</div>
              <h3 className="mb-3 text-lg font-semibold text-card-foreground sm:text-xl">Review & Improve</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Access detailed performance reports, identify areas for improvement, and track your progress over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Final CTA Section */}
    <section className="relative py-16 sm:py-20 md:py-24 bg-background border-t border-border">
      <div className="container relative mx-auto px-4">
        <div
          className={`relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-8 text-center sm:rounded-3xl sm:p-12 md:p-16 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="absolute right-0 top-0 h-64 w-64 bg-primary/10 blur-3xl sm:h-96 sm:w-96" />
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="mb-8 text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Join thousands of job seekers who are already practicing with AI and landing their dream jobs.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="group h-12 px-6 text-base bg-primary text-primary-foreground hover:bg-primary/90 sm:h-14 sm:px-8 sm:text-lg"
              >
                Start practicing free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="h-12 px-6 text-base border-primary/30 bg-primary/5 hover:bg-primary/10 sm:h-14 sm:px-8 sm:text-lg"
              >
                Watch demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default function Page() {
  return (
    <Suspense fallback={
      <>
        <LandingNavbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </>
    }>
      <PageContent />
    </Suspense>
  )
}
