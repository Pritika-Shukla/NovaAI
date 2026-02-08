"use client"

import { useState, useEffect } from "react"
import { ResumeUploadModal } from "@/components/resume-upload-modal"
import { ResumeDisplay } from "@/components/resume-display"

export default function UploadPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [hasResume, setHasResume] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkResume = async () => {
      try {
        const response = await fetch("/api/upload", {
          credentials: "include",
        })
        const data = await response.json()
        const resumeExists = !!data.resume
        setHasResume(resumeExists)
      } catch (error) {
        console.error("Error checking resume:", error)
        setHasResume(false)
      } finally {
        setLoading(false)
      }
    }
    checkResume()
  }, [refreshKey])

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1)
    setHasResume(true)
    setIsModalOpen(false)
  }

  return (
    <div className="flex-1 min-h-0 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl shrink-0 space-y-4 sm:space-y-6">
          {loading ? (
            <p className="text-muted-foreground text-center">Loading...</p>
          ) : hasResume ? (
            <>
              <ResumeDisplay
                onUploadNew={() => setIsModalOpen(true)}
                refreshKey={refreshKey}
              />
              <ResumeUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUploadSuccess={handleUploadSuccess}
              />
            </>
          ) : (
            <ResumeUploadModal
              embedded
              isOpen={true}
              onClose={() => {}}
              onUploadSuccess={handleUploadSuccess}
            />
          )}
      </div>
    </div>
  )
}
