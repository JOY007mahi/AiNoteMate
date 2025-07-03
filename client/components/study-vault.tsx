"use client"

import React, { useState, useCallback, useEffect } from "react"
import {
  Upload,
  FileText,
  ImageIcon,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Calendar,
  Search,
  Grid3X3,
  List,
  Plus,
  Trash2,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface StudyMaterial {
  _id: string
  filename: string
  fileType: "pdf" | "image"
  dateUploaded: string
  summary: string
  fileUrl: string
  category?: string
  thumbnailUrl?: string
}

interface StudyVaultProps {
  onNavigateBack?: () => void
}

export function StudyVault({ onNavigateBack }: StudyVaultProps) {
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch("http://localhost:5000/study-materials")
        const data = await res.json()
        setMaterials(data)
      } catch (err) {
        console.error("Error fetching study materials:", err)
      }
    }

    fetchMaterials()
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileUpload(files)
  }, [])

  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true)

    for (const file of files) {
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        const formData = new FormData()
        formData.append("file", file)

        try {
          const response = await fetch("http://localhost:5000/upload-study-material", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) throw new Error("Upload failed")

          const newMaterial: StudyMaterial = await response.json()
          setMaterials((prev) => [newMaterial, ...prev])
        } catch (error) {
          console.error("Upload error:", error)
          alert("Something went wrong while uploading the file.")
        }
      }
    }

    setIsUploading(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFileUpload(files)
  }

  const toggleCardExpansion = (id: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev)
      newSet.has(id) ? newSet.delete(id) : newSet.add(id)
      return newSet
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    try {
      const res = await fetch(`http://localhost:5000/study-materials/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setMaterials((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete material.");
    }
  };

  const filteredMaterials = materials.filter(
    (material) =>
      material.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.summary.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getFileIcon = (fileType: "pdf" | "image") =>
    fileType === "pdf" ? (
      <FileText className="h-6 w-6 text-red-500" />
    ) : (
      <ImageIcon className="h-6 w-6 text-blue-500" />
    )

  const getFileTypeColor = (fileType: "pdf" | "image") =>
    fileType === "pdf"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-blue-100 text-blue-700 border-blue-200"

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-10 w-full">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onNavigateBack && (
                <Button variant="ghost" onClick={onNavigateBack} className="text-orange-600 hover:bg-orange-100">
                  ← Back to Notes
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  📚 Study Vault
                </h1>
                <p className="text-gray-600 mt-1">Organize and access your study materials with AI-powered insights</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-white/70 border-orange-200 focus:border-orange-400"
                />
              </div>

              <div className="flex items-center gap-2 bg-white/70 rounded-lg p-1 border border-orange-200">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="w-full px-6 py-8">
        <Card className="mb-8 border-2 border-dashed border-orange-300 bg-gradient-to-r from-orange-100/50 to-amber-100/50 hover:border-orange-400 transition-all duration-300">
          <CardContent className="p-8">
            <div
              className={`text-center transition-all duration-300 ${
                isDragOver ? "scale-105 bg-orange-200/50 rounded-lg p-4" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 w-16 h-16 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {isUploading ? "Processing your files..." : "Upload Study Materials"}
                  </h3>
                  <p className="text-gray-600 mb-4">Drag and drop your PDF files or images here, or click to browse</p>

                  <input
                    type="file"
                    multiple
                    accept=".pdf,image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    disabled={isUploading}
                  />

                  <label htmlFor="file-upload">
                    <Button
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium px-6 py-2"
                      disabled={isUploading}
                      asChild
                    >
                      <span className="cursor-pointer flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        {isUploading ? "Processing..." : "Choose Files"}
                      </span>
                    </Button>
                  </label>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    PDF Files
                  </span>
                  <span className="flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" />
                    Images
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Materials List */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Study Materials ({filteredMaterials.length})
          </h2>

          {filteredMaterials.length === 0 ? (
            <Card className="bg-white/70 border-orange-200">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No materials yet</h3>
                <p className="text-gray-600">Upload your first study material to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {filteredMaterials.map((material) => (
                <Card key={material._id} className="bg-white/80 border-orange-200 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getFileIcon(material.fileType)}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-medium text-gray-800 truncate">
                            {material.filename}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${getFileTypeColor(material.fileType)}`}>
                              {material.fileType.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(material.dateUploaded).toLocaleDateString()}
                            </span>
                          </div>
                          {material.category && (
                            <p className="text-sm text-gray-500 italic mt-1">
                              📂 Category: {material.category}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCardExpansion(material._id)}
                          className="w-full justify-between p-2 h-auto text-left hover:bg-orange-50"
                        >
                          <span className="font-medium text-gray-700">AI Summary</span>
                          {expandedCards.has(material._id) ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>

                        {expandedCards.has(material._id) && (
                          <div className="mt-2 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                              {material.summary}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          onClick={() => {
                            if (!material.fileUrl) {
                              alert("No file URL available")
                            } else {
                              window.open(material.fileUrl, "_blank")
                            }
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50"
                          onClick={() => {
                            const downloadUrl = `http://localhost:5000/download/${encodeURIComponent(
                              material.fileUrl.split("/").pop() || ""
                            )}`
                            const a = document.createElement("a")
                            a.href = downloadUrl
                            a.setAttribute("download", material.filename)
                            document.body.appendChild(a)
                            a.click()
                            document.body.removeChild(a)
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleDelete(material._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
