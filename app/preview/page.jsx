"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useResumeContext } from "@/context/resume-provider"
import ModernTemplate from "@/components/templates/modern-template"
import MinimalTemplate from "@/components/templates/minimal-template"
import ProfessionalTemplate from "@/components/templates/professional-template"
import { ArrowLeft, Download, Edit } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { generatePDF } from "@/lib/pdf-generator"

export default function Preview() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resumeData, setResumeData } = useResumeContext()
  const [isClient, setIsClient] = useState(false)
  const resumeRef = useRef(null)
  const { toast } = useToast()
  const [templateId, setTemplateId] = useState(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load data from localStorage if needed - separate effect
  useEffect(() => {
    if (!isClient) return

    if (Object.keys(resumeData.personal).length === 0) {
      const savedData = localStorage.getItem("resumeData")
      if (savedData) {
        try {
          setResumeData(JSON.parse(savedData))
        } catch (error) {
          console.error("Failed to parse saved resume data:", error)
        }
      }
    }
  }, [isClient, setResumeData, resumeData.personal])

  // Handle template from URL - separate effect
  useEffect(() => {
    if (!isClient) return

    const urlTemplateId = searchParams.get("template")
    if (urlTemplateId && urlTemplateId !== templateId) {
      setTemplateId(urlTemplateId)

      // Only update if the template has changed
      if (resumeData.selectedTemplate !== urlTemplateId) {
        setResumeData((prev) => ({
          ...prev,
          selectedTemplate: urlTemplateId,
        }))
      }
    }
  }, [isClient, searchParams, setResumeData, resumeData.selectedTemplate, templateId])

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return

    setIsGeneratingPDF(true)

    toast({
      title: "Generating PDF",
      description: "Your resume is being prepared for download",
    })

    try {
      // Use our custom PDF generator function
      await generatePDF(resumeRef.current, resumeData.personal.name || "resume")

      toast({
        title: "Download complete",
        description: "Your resume has been downloaded successfully",
      })
    } catch (error) {
      console.error("PDF generation failed:", error)

      toast({
        title: "Download failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

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

  if (!isClient) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/builder">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Editor
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href="/builder">
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" /> Edit Resume
            </Button>
          </Link>
          <Button onClick={handleDownloadPDF} className="gap-2" disabled={isGeneratingPDF}>
            <Download className="h-4 w-4" />
            {isGeneratingPDF ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-lg mx-auto max-w-[210mm] min-h-[297mm]" ref={resumeRef}>
        {renderTemplate()}
      </div>
    </div>
  )
}
