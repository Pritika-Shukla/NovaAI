"use client"

import type React from "react"
import { supabase } from "@/lib/supabase/client"
import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, File, X } from "lucide-react"

interface ResumeUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResumeUploadModal({ isOpen, onClose }: ResumeUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload =async ()=>{
  if(!file) return
  console.log("uploading file", file)
}

  if (!isOpen) {
    return null
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Update Your Resume</CardTitle>
        <CardDescription>
          Upload or update your resume for interview preparation
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          {file ? (
            <div className="space-y-3">
              <File className="w-10 h-10 mx-auto text-primary" />
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                <X className="w-4 h-4 mr-2" /> Remove
              </Button>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
              <p className="mt-2">Drag & drop or select a file</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                variant="outline"
    
                className="mt-3"
              >
                Select File
              </Button>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleUpload}
          >
            Upload Resume
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
