"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <footer ref={ref} className="bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Pritika Shukla. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com/shukla_pritika"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              Twitter
            </a>

            <a
              href="https://www.linkedin.com/in/pritika-shukla-967350234"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              LinkedIn
            </a>

            <a
              href="https://github.com/Pritika-Shukla"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              GitHub
            </a>

            <a
              href="mailto:pritikashukla21@gmail.com"
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              Email
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}