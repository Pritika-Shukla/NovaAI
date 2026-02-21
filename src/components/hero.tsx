"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const avatars = [
  "/professional-headshot-1.png",
  "/professional-headshot-2.png",
  "/professional-headshot-3.png",
  "/professional-headshot-4.png",
  "/professional-headshot-5.png",
]

const textRevealVariants = {
  hidden: { y: "100%" },
  visible: (i: number) => ({
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: i * 0.1,
    },
  }),
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24  overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 pointer-events-none" />

      {/* Subtle radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">

        {/* Headline with text mask animation */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 pt-24"
          style={{ fontFamily: "var(--font-cal-sans), sans-serif" }}
        >
          <span className="block overflow-hidden">
            <motion.span className="block" variants={textRevealVariants} initial="hidden" animate="visible" custom={0}>
             Start dominating interviews.
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block text-zinc-500"
              variants={textRevealVariants}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              Like a pro.
            </motion.span>
          </span>
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Practice with an AI interviewer tailored to your resume. Get real-time feedback, performance insights, and the confidence to nail your next technical interview.
        </motion.p>

        <div className="py-12 w-full max-w-full mx-auto px-1 sm:px-2">
          {/* Video Demo Section - wrapped in background panel */}
          <section className="relative w-full max-w-[100rem] mx-auto">
            {/* Background panel wrapping the video */}
            <div className="relative rounded-2xl bg-zinc-900/90 border border-zinc-800/80 shadow-2xl py-4 px-3 sm:px-4 md:px-6 lg:px-8">
              {/* Outer glow */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-zinc-600/20 via-transparent to-transparent blur-xl opacity-50 pointer-events-none" aria-hidden />
              {/* Video container with gradient border */}
              <div className="relative">
                <div className="relative w-full max-w-[90rem] mx-auto">
                  {/* Gradient border effect */}
                  <div className="relative rounded-2xl p-px bg-gradient-to-b from-zinc-500/40 via-zinc-600/20 to-zinc-800/40 shadow-[0_0_40px_-12px_rgba(0,0,0,0.5)]">
                    {/* Inner frame */}
                    <div className="relative overflow-hidden rounded-2xl bg-zinc-950/95 backdrop-blur-sm">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" aria-hidden />
                      <div className="w-full aspect-video max-h-[70vh] md:max-h-[75vh] overflow-hidden rounded-2xl">
                        <video
                          src="/demo.mp4"
                          autoPlay
                          muted
                          loop
                          className="w-full h-full object-contain"
                          playsInline
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-950/80 to-transparent pointer-events-none" aria-hidden />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
