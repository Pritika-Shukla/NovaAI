"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Update Your Resume</CardTitle>
        <CardDescription>Upload or update your resume for interview preparation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Resume Info */}
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Current Resume</p>
          <p className="text-sm font-medium text-foreground">resume_2024.pdf</p>
          <p className="text-xs text-muted-foreground mt-1">Uploaded 2 days ago</p>
        </div>

        {/* File Upload */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          {file ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <File className="w-12 h-12 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Drag your resume here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <Label htmlFor="file-input" asChild>
                <Button variant="outline" type="button">
                  Select File
                </Button>
              </Label>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" disabled={!file}>
            Upload Resume
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
