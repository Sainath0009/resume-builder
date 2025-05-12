"use client"

import { useRef } from "react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import ModernTemplate from "./templates/modern-template"
import MinimalTemplate from "./templates/minimal-template"
import ProfessionalTemplate from "./templates/professional-template"

export function ResumePreview({ resumeData, scale, setScale, setIsFullScreenPreview }) {
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
    <div className="bg-card rounded-lg border shadow-sm p-6 transition-colors duration-300 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Live Preview</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
            disabled={scale <= 0.5}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale((prev) => Math.min(1, prev + 0.1))}
            disabled={scale >= 1}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="bg-secondary/30 rounded-lg p-4 flex justify-center transition-colors duration-300 h-[calc(100%-80px)]">
        <ScrollArea className="h-full w-full">
          <div
            className="bg-white paper-effect mx-auto transition-transform origin-top"
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
        </ScrollArea>
      </div>
      <div className="flex justify-center mt-4">
        <Button onClick={() => setIsFullScreenPreview(true)} className="gap-2" aria-label="Full screen preview">
          <Maximize2 className="h-4 w-4" /> Full Screen Preview
        </Button>
      </div>
    </div>
  )
}
