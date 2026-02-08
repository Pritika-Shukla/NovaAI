"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, File, X, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import type { ResumeUploadModalProps } from "@/types"

export function ResumeUploadModal({ isOpen, onClose, onUploadSuccess, embedded = false }: ResumeUploadModalProps) {
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
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload resume")
      }

      toast.success("Resume uploaded successfully!")
      setFile(null)
      if (!embedded) onClose()
      onUploadSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload resume"
      toast.error(errorMessage)
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  const inputRef = useRef<HTMLInputElement>(null)

  const cardContent = (
    <Card className={embedded ? "w-full max-w-2xl mx-auto" : "max-w-md w-full"}>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Update Your Resume</CardTitle>
        <CardDescription className="text-sm">
          Upload or update your resume for interview preparation
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center ${
            dragActive ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          {file ? (
            <div className="space-y-3">
              <File className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-primary" />
              <p className="font-medium text-sm sm:text-base break-words">{file.name}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <Button variant="outline" size="sm" onClick={() => setFile(null)} className="text-xs sm:text-sm">
                <X className="w-4 h-4 mr-2" /> Remove
              </Button>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm sm:text-base">Drag & drop or select a file</p>
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
                className="mt-3 text-sm sm:text-base"
              >
                Select File
              </Button>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            className="flex-1 text-sm sm:text-base"
            onClick={() => (embedded ? setFile(null) : onClose())}
          >
            {embedded ? "Clear" : "Cancel"}
          </Button>
          <Button
            className="flex-1 text-sm sm:text-base"
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

  if (embedded) {
    return <div className="w-full">{cardContent}</div>
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div onClick={(e) => e.stopPropagation()} role="presentation">
        {cardContent}
      </div>
    </div>
  )
}
