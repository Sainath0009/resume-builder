"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

import { Button } from "../../components/ui/button"
import { Dialog, DialogContent } from "../../components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import PersonalInfoForm from "../../components/resume-form/personal-info-form"
import EducationForm from "../../components/resume-form/education-form"
import ExperienceForm from "../../components/resume-form//experience-form"
import SkillsForm from "../../components/resume-form/skills-form"
import ProjectsForm from "../../components/resume-form/projects-form"
import CertificationsForm from "../../components/resume-form/certifications-form"
import { useResumeContext } from "../../context/resume-provider"
import { templates } from "../../lib/templates"
import { ThemeToggle } from "../../components/theme-toggle"
import { cn } from "../../lib/utils"
import { DayPickerProvider } from 'react-day-picker';



import {
  Download,
  Save,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  User,
  GraduationCap,
  Briefcase,
  Lightbulb,
  Award,
  FolderKanban,
  Palette,
  X,
  Sparkles,
  FileUp,
  Wand2,
  Share2,
  Copy,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "../../hooks/use-toast"
import { validateResumeData } from "../../lib/validation"
import ModernTemplate from "../../components/templates/modern-template"
import MinimalTemplate from "../../components/templates/minimal-template"
import ProfessionalTemplate from "../../components/templates/professional-template"
import { ScrollArea } from "../../components/ui/scroll-area"
import { generatePDF } from "../../lib/pdf-generator"
import { Badge } from "../../components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import { Input } from "../../components/ui/input"
import { BatchEnhancer } from "../../components/batch-enhancer"
import { KeywordTargeter } from "../../components/keyword-targeter"
import { TemplateSelector } from "../../components/template-selector"
import { ResumePreview } from "../../components/resume-preview"
import { FullScreenPreview } from "../../components/full-screen-preview"
export default function Builder() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resumeData, setResumeData } = useResumeContext()
  const [activeTab, setActiveTab] = useState("personal")
  const [selectedTemplate, setSelectedTemplate] = useState(searchParams.get("template") || "modern")
  const [validationErrors, setValidationErrors] = useState({})
  const [scale, setScale] = useState(0.7)
  const resumeRef = useRef(null)
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showAIUploadDialog, setShowAIUploadDialog] = useState(false)
  const [isProcessingAI, setIsProcessingAI] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [isGeneratingShareLink, setIsGeneratingShareLink] = useState(false)

  // Load template from URL parameter
  useEffect(() => {
    const templateId = searchParams.get("template")
    if (templateId && templateId !== resumeData.selectedTemplate) {
      setSelectedTemplate(templateId)
      setResumeData((prev) => ({
        ...prev,
        selectedTemplate: templateId,
      }))
    }
  }, [searchParams, setResumeData, resumeData.selectedTemplate])

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId)
    setResumeData((prev) => ({
      ...prev,
      selectedTemplate: templateId,
    }))
    setShowTemplateSelector(false)
  }

  const handleSaveDraft = () => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData))
    toast.success("Your resume has been saved as a draft", {
      title: "Draft saved",
    })
  }

  const handleDownloadPDF = async () => {
    // Validate data before download
    const errors = validateResumeData(resumeData)

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)

      // Show toast with validation error
      toast.error("Some required fields are missing or invalid", {
        title: "Please fix the following errors",
      })

      return
    }

    if (!resumeRef.current) return

    setIsGeneratingPDF(true)

    toast.loading("Your resume is being prepared for download", {
      title: "Generating PDF",
    })

    try {
      // Use our custom PDF generator function
      await generatePDF(resumeRef.current, resumeData.personal.name || "resume")

      toast.success("Your resume has been downloaded successfully", {
        title: "Download complete",
      })
    } catch (error) {
      console.error("PDF generation failed:", error)

      // Provide a more helpful error message
      let errorMessage = "There was an error generating your PDF. Please try again."

      if (error.message && error.message.includes("oklch")) {
        errorMessage = "PDF generation failed due to color compatibility issues. We've fixed this - please try again."
      }

      toast.error(errorMessage, {
        title: "Download failed",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleAIUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsProcessingAI(true)

    toast.loading("Our AI is analyzing your uploaded resume...", {
      title: "Processing resume",
    })

    try {
      const aiData = await aiService.autoFillFromUpload(file)

      if (aiData) {
        setResumeData(aiData)

        toast.success("Your resume data has been extracted and filled in", {
          title: "Resume processed successfully",
        })
      }
    } catch (error) {
      console.error("AI processing failed:", error)

      toast.error("There was an error processing your resume. Please try again.", {
        title: "Processing failed",
      })
    } finally {
      setIsProcessingAI(false)
      setShowAIUploadDialog(false)
    }
  }

  const handleShareResume = async () => {
    setIsGeneratingShareLink(true)

    try {
      // In a real app, this would create a shareable link by saving the resume data to a database
      // and generating a unique URL
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random ID for the share link
      const shareId = Math.random().toString(36).substring(2, 15)
      const shareUrl = `${window.location.origin}/shared/${shareId}`

      setShareLink(shareUrl)
      setShowShareDialog(true)
    } catch (error) {
      console.error("Error generating share link:", error)

      toast.error("There was an error generating a share link. Please try again.", {
        title: "Share failed",
      })
    } finally {
      setIsGeneratingShareLink(false)
    }
  }

  const getTemplateDisplayName = (templateId) => {
    const template = templates.find((t) => t.id === templateId)
    return template ? template.name : "Template"
  }

  const sections = [
    { id: "personal", label: "Personal", icon: <User className="h-4 w-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "experience", label: "Experience", icon: <Briefcase className="h-4 w-4" /> },
    { id: "skills", label: "Skills", icon: <Lightbulb className="h-4 w-4" /> },
    { id: "projects", label: "Projects", icon: <FolderKanban className="h-4 w-4" /> },
    { id: "certifications", label: "Certificates", icon: <Award className="h-4 w-4" /> },
  ]

  if (isFullScreenPreview) {
    return (
      <FullScreenPreview
        resumeData={resumeData}
        scale={scale}
        setScale={setScale}
        setIsFullScreenPreview={setIsFullScreenPreview}
        handleDownloadPDF={handleDownloadPDF}
        isGeneratingPDF={isGeneratingPDF}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      {/* <BuilderHeader
        selectedTemplate={selectedTemplate}
        getTemplateDisplayName={getTemplateDisplayName}
        handleSaveDraft={handleSaveDraft}
        handleDownloadPDF={handleDownloadPDF}
        isGeneratingPDF={isGeneratingPDF}
        setShowTemplateSelector={setShowTemplateSelector}
        setShowAIUploadDialog={setShowAIUploadDialog}
      /> */}

      {/* Dialogs */}
      <TemplateSelector
        open={showTemplateSelector}
        onOpenChange={setShowTemplateSelector}
        templates={templates}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={handleTemplateSelect}
      />

      {/* <AIUploadDialog
        open={showAIUploadDialog}
        onOpenChange={setShowAIUploadDialog}
        onUpload={handleAIUpload}
        isProcessing={isProcessingAI}
      /> */}

      {/* <ShareDialog open={showShareDialog} onOpenChange={setShowShareDialog} shareLink={shareLink} /> */}

      {/* Main Content - Split Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="split-layout">
          {/* Left Side - Form */}
          <div className="form-section animate-fade-in">
            <div className="bg-card rounded-lg border shadow-sm p-6 transition-colors duration-300 h-full">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Resume Builder</h2>
                  <div className="hidden sm:block">
                    {/* <FormNavigation sections={sections} activeTab={activeTab} setActiveTab={setActiveTab} /> */}
                  </div>
                  <div className="sm:hidden">
                    {/* <FormNavigation
                      sections={sections}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      isMobile={true}
                    /> */}
                  </div>
                </div>

                {/* AI Tools Banner */}
                {/* <AIToolsBanner /> */}

                <div className="mt-4">
                  <TabsContent value="personal" className="animate-slide-in">
                    <PersonalInfoForm validationErrors={validationErrors.personal || []} />
                  </TabsContent>
                  <TabsContent value="education" className="animate-slide-in">
                    <EducationForm validationErrors={validationErrors.education || []} />
                  </TabsContent>
                  <TabsContent value="experience" className="animate-slide-in">
                    <ExperienceForm validationErrors={validationErrors.experience || []} />
                  </TabsContent>
                  <TabsContent value="skills" className="animate-slide-in">
                    <SkillsForm validationErrors={validationErrors.skills || []} />
                  </TabsContent>
                  <TabsContent value="certifications" className="animate-slide-in">
                    <CertificationsForm validationErrors={validationErrors.certifications || []} />
                  </TabsContent>
                  <TabsContent value="projects" className="animate-slide-in">
                    <ProjectsForm validationErrors={validationErrors.projects || []} />
                  </TabsContent>
                </div>

                <div className="flex justify-between mt-8 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const currentIndex = sections.findIndex((section) => section.id === activeTab)
                      if (currentIndex > 0) {
                        setActiveTab(sections[currentIndex - 1].id)
                      }
                    }}
                    disabled={activeTab === sections[0].id}
                    className="gap-2"
                    aria-label="Previous section"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => {
                      const currentIndex = sections.findIndex((section) => section.id === activeTab)
                      if (currentIndex < sections.length - 1) {
                        setActiveTab(sections[currentIndex + 1].id)
                      }
                    }}
                    disabled={activeTab === sections[sections.length - 1].id}
                    className="gap-2"
                    aria-label="Next section"
                  >
                    Next
                  </Button>
                </div>
              </Tabs>
            </div>

            {/* Mobile Preview Button */}
            <div className="lg:hidden mt-6">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => setIsFullScreenPreview(true)}
                aria-label="View preview"
              >
                <Maximize2 className="h-4 w-4" /> View Resume Preview
              </Button>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="hidden lg:block preview-section animate-fade-in">
            <ResumePreview
              resumeData={resumeData}
              scale={scale}
              setScale={setScale}
              setIsFullScreenPreview={setIsFullScreenPreview}
            />
          </div>
        </div>
      </div>
    </div>
  )
}