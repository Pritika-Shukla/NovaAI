"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Brain, Zap, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function Page() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
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
                simulation so realistic, you'll forget it's practice.
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
                className="group h-12 px-6 text-base bg-primary text-primary-foreground hover:bg-primary/90 sm:h-14 sm:px-8 sm:text-lg"
              >
                Start practicing free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 text-base border-primary/30 bg-primary/5 hover:bg-primary/10 sm:h-14 sm:px-8 sm:text-lg"
              >
                Watch demo
              </Button>
            </div>

            {/* Stats */}
            <div
              className={`grid grid-cols-3 gap-3 pt-6 transition-all duration-700 delay-400 sm:gap-4 sm:pt-8 ${
                mounted ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              }`}
            >
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary sm:text-3xl">92%</div>
                <div className="text-xs text-muted-foreground sm:text-sm">Success rate</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary sm:text-3xl">50K+</div>
                <div className="text-xs text-muted-foreground sm:text-sm">Interviews</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground sm:text-3xl">4.9★</div>
                <div className="text-xs text-muted-foreground sm:text-sm">Rating</div>
              </div>
            </div>
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
  )
}
