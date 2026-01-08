"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { File, Download, Trash2, Upload, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import type { Resume, ResumeDisplayProps } from "@/types"

export function ResumeDisplay({ onUploadNew, refreshKey }: ResumeDisplayProps) {
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  const fetchResume = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/upload", {
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch resume")
      }

      setResume(data.resume)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch resume"
      console.error("Fetch error:", error)
      // Don't show error toast if no resume exists
      if (!errorMessage.includes("No resume found")) {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResume()
  }, [refreshKey])

  const handleDelete = async () => {
    if (!resume) return

    if (!confirm("Are you sure you want to delete your resume? This action cannot be undone.")) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete resume")
      }

      toast.success("Resume deleted successfully!")
      setResume(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete resume"
      toast.error(errorMessage)
      console.error("Delete error:", error)
    } finally {
      setDeleting(false)
    }
  }

  const handleDownload = () => {
    if (!resume?.downloadUrl) {
      toast.error("Download URL not available")
      return
    }

    const link = document.createElement("a")
    link.href = resume.downloadUrl
    link.download = resume.file_name
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!resume) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Resume Uploaded</CardTitle>
          <CardDescription>
            Upload your resume to get started with interview preparation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onUploadNew} className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Upload Resume
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Resume</CardTitle>
        <CardDescription>
          Manage your uploaded resume
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <File className="w-10 h-10 text-primary" />
          <div className="flex-1">
            <p className="font-medium">{resume.file_name}</p>
            {resume.updated_at && (
              <p className="text-sm text-muted-foreground">
                Updated: {new Date(resume.updated_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>
          <Button
            onClick={onUploadNew}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload New
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

