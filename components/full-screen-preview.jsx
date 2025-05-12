"use client"

import { useRef } from "react"
import { Button } from "./ui/button"
import { ZoomIn, ZoomOut, Download, Loader2, X } from "lucide-react"
import ModernTemplate from "./templates/modern-template"
import MinimalTemplate from "./templates/minimal-template"
import ProfessionalTemplate from "./templates/professional-template"

export function FullScreenPreview({
  resumeData,
  scale,
  setScale,
  setIsFullScreenPreview,
  handleDownloadPDF,
  isGeneratingPDF,
}) {
  const resumeRef = useRef(null)

  const renderTemplate = () => {
    switch (resumeData.selectedTemplate) {
      case "modern":
        return <ModernTemplate data={resumeData} />
      case "minimal":
        return <MinimalTemplate data={resumeData} />
      case "professional":
        return <ProfessionalTemplate data={resumeData} />
      default:
        return <ModernTemplate data={resumeData} />
    }
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-card border-b p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Resume Preview</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-secondary rounded-md px-2 py-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
              disabled={scale <= 0.5}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setScale((prev) => Math.min(1.5, prev + 0.1))}
              disabled={scale >= 1.5}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="gap-2"
            disabled={isGeneratingPDF}
            aria-label="Download PDF"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsFullScreenPreview(false)} aria-label="Close preview">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-secondary/30 p-8 flex justify-center">
        <div
          className="bg-white paper-effect mx-auto transition-transform"
          style={{
            width: "210mm",
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            minHeight: "297mm",
          }}
          ref={resumeRef}
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  )
}
