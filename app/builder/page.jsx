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
export default function Builder() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resumeData, setResumeData } = useResumeContext()
  const [activeTab, setActiveTab] = useState("personal")
  const [selectedTemplate, setSelectedTemplate] = useState(searchParams.get("template") || "modern")
  const [validationErrors, setValidationErrors] = useState({})
  const [scale, setScale] = useState(0.7)
  const resumeRef = useRef(null)
  const { toast } = useToast()
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showAIUploadDialog, setShowAIUploadDialog] = useState(false)
  const [isProcessingAI, setIsProcessingAI] = useState(false)
  const fileInputRef = useRef(null)
  const [isMobilePreviewVisible, setIsMobilePreviewVisible] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [isGeneratingShareLink, setIsGeneratingShareLink] = useState(false)
  const [shareEmail, setShareEmail] = useState("")

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
    toast({
      title: "Draft saved",
      description: "Your resume has been saved as a draft",
    })
  }

  const handleDownloadPDF = async () => {
    // Validate data before download
    const errors = validateResumeData(resumeData)

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)

      // Show toast with validation error
      toast({
        title: "Please fix the following errors",
        description: "Some required fields are missing or invalid",
        variant: "destructive",
      })

      return
    }

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

      // Provide a more helpful error message
      let errorMessage = "There was an error generating your PDF. Please try again."

      if (error.message && error.message.includes("oklch")) {
        errorMessage = "PDF generation failed due to color compatibility issues. We've fixed this - please try again."
      }

      toast({
        title: "Download failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleAIUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsProcessingAI(true)

    toast({
      title: "Processing resume",
      description: "Our AI is analyzing your uploaded resume...",
    })

    try {
      const aiData = await aiService.autoFillFromUpload(file)

      if (aiData) {
        setResumeData(aiData)

        toast({
          title: "Resume processed successfully",
          description: "Your resume data has been extracted and filled in",
        })
      }
    } catch (error) {
      console.error("AI processing failed:", error)

      toast({
        title: "Processing failed",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive",
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

      toast({
        title: "Share failed",
        description: "There was an error generating a share link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingShareLink(false)
    }
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink)

    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    })
  }

  const handleShareViaEmail = () => {
    if (!shareEmail) return

    // In a real app, this would send an email with the share link
    toast({
      title: "Email sent",
      description: `Share link sent to ${shareEmail}`,
    })

    setShareEmail("")
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullScreenPreview(false)}
              aria-label="Close preview"
            >
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

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="bg-card border-b sticky top-0 z-10 transition-colors duration-300">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <Button variant="ghost" size="sm" className="gap-2 font-bold">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-sm h-6 w-6 flex items-center justify-center text-white">
                  R
                </div>
                <span className="hidden sm:inline">Smart Resume</span>
              </Button>
            </Link>

            <Badge variant="outline" className="hidden md:flex gap-1 items-center">
              <Sparkles className="h-3 w-3 text-blue-500" />
              <span>AI-Powered</span>
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTemplateSelector(true)}
                    className="gap-2 hidden sm:flex"
                  >
                    <Palette className="h-4 w-4" />
                    {getTemplateDisplayName(selectedTemplate)}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Change template</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAIUploadDialog(true)}
                    className="gap-2 hidden sm:flex"
                  >
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    AI Import
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import resume with AI</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareResume}
                    className="gap-2 hidden sm:flex"
                    disabled={isGeneratingShareLink}
                  >
                    {isGeneratingShareLink ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share your resume</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save draft</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" onClick={handleDownloadPDF} className="gap-2" disabled={isGeneratingPDF}>
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">Generating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Download</span>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download PDF</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ThemeToggle />
                </TooltipTrigger>
                <TooltipContent>Toggle theme</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      {/* Template Selector Dialog */}
      <Dialog open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
        <DialogContent className="sm:max-w-[800px]">
          <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all hover:shadow-md",
                  selectedTemplate === template.id ? "border-primary" : "border-border hover:border-primary/50",
                )}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={template.thumbnail || "/placeholder.svg"}
                    alt={template.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {selectedTemplate === template.id && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <Check className="h-6 w-6" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-center">{template.name}</h3>
                  <p className="text-center text-sm text-muted-foreground">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Upload Dialog */}
      <Dialog open={showAIUploadDialog} onOpenChange={setShowAIUploadDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-2">AI Resume Import</h2>
            <p className="text-muted-foreground mb-6">
              Upload your existing resume and our AI will automatically extract and fill in your information.
            </p>

            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 mb-6 hover:border-primary/50 transition-colors">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAIUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />

              <Button
                variant="outline"
                size="lg"
                className="gap-2 w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingAI}
              >
                {isProcessingAI ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileUp className="h-5 w-5" />
                    Select Resume File
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground mt-3">Supported formats: PDF, DOC, DOCX</p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 text-left">
              <h3 className="font-medium flex items-center gap-2 mb-2">
                <Wand2 className="h-4 w-4 text-blue-500" />
                How it works
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                <li>Our AI analyzes your resume and extracts key information</li>
                <li>Your data is automatically filled into the appropriate sections</li>
                <li>Review and edit the extracted information as needed</li>
                <li>Your uploaded file is not stored on our servers</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-green-500 opacity-20"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-white" />
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-2">Share Your Resume</h2>
            <p className="text-muted-foreground mb-6">
              Share your resume with recruiters, colleagues, or friends using the link below.
            </p>

            <div className="flex items-center gap-2 mb-6">
              <Input value={shareLink} readOnly className="bg-muted/50" />
              <Button variant="outline" size="icon" onClick={copyShareLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium mb-3 text-left">Share via email</h3>
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
                <Button variant="outline" size="icon" onClick={handleShareViaEmail} disabled={!shareEmail}>
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                    <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                      {sections.map((section) => (
                        <TabsTrigger key={section.id} value={section.id} className="flex flex-col gap-1 py-2 h-auto">
                          {section.icon}
                          <span className="text-xs">{section.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  <div className="sm:hidden">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const currentIndex = sections.findIndex((section) => section.id === activeTab)
                          if (currentIndex > 0) {
                            setActiveTab(sections[currentIndex - 1].id)
                          }
                        }}
                        disabled={activeTab === sections[0].id}
                        aria-label="Previous section"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        {sections.findIndex((section) => section.id === activeTab) + 1} / {sections.length}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const currentIndex = sections.findIndex((section) => section.id === activeTab)
                          if (currentIndex < sections.length - 1) {
                            setActiveTab(sections[currentIndex + 1].id)
                          }
                        }}
                        disabled={activeTab === sections[sections.length - 1].id}
                        aria-label="Next section"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* AI Tools Banner */}
                <div className="ai-gradient-bg rounded-lg p-4 mb-6 ai-border">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/20 rounded-full p-2">
                      <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-1">AI Assistant Enabled</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Our AI will help you create a professional resume by suggesting improvements and enhancing your
                        content.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <BatchEnhancer />
                        <KeywordTargeter />
                      </div>
                    </div>
                  </div>
                </div>

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
                    <ChevronLeft className="h-4 w-4" /> Previous
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
                    Next <ChevronRight className="h-4 w-4" />
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
          </div>
        </div>
      </div>
    </div>
  )
}
