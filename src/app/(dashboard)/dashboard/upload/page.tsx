"use client"

import { useState } from "react"
import { ResumeUploadModal } from "@/components/resume-upload-modal"
import { ResumeDisplay } from "@/components/resume-display"

export default function UploadPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Resume</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Upload or update your resume for interviews.</p>
          </div>
          <ResumeDisplay 
            onUploadNew={() => setIsModalOpen(true)} 
            refreshKey={refreshKey}
          />
          <ResumeUploadModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>
      </div>
    </div>
  )
}
