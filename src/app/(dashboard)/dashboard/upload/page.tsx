"use client"

import { ResumeUploadModal } from "@/components/resume-upload-modal"

export default function UploadPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Resume</h1>
            <p className="text-muted-foreground mt-1">Upload or update your resume for interviews.</p>
          </div>
          <ResumeUploadModal isOpen={true} onClose={() => {}} />
        </div>
      </div>
    </div>
  )
}
