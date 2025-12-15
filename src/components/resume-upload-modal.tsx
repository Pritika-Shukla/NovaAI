"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, File, X, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

interface ResumeUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResumeUploadModal({ isOpen, onClose }: ResumeUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

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

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload resume")
      }

      toast.success("Resume uploaded successfully!")
      setFile(null)
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload resume"
      toast.error(errorMessage)
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

const inputRef = useRef<HTMLInputElement>(null)
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
                ref={inputRef}
              />
              <Button
                variant="outline"
                onClick={() => inputRef.current?.click()}
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
            disabled={!file || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Resume"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
