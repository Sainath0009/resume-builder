"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Download,
  Save,
  Wand2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  User,
  GraduationCap,
  Briefcase,
  Lightbulb,
  Award,
  FolderKanban,
  Maximize2,
  ZoomIn,
  ZoomOut,
  FileText,
  Sparkles,
} from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { ScrollArea } from "../../components/ui/scroll-area"
import { toast } from "sonner"
import { useResumeContext } from "../../context/resume-provider"
import { templates } from "../../lib/templates"
import { validateResumeData } from "../../lib/validation"
import { generatePDF } from "../../lib/pdf-generator"
import MinimalTemplate from "../../components/templates/minimal-template"
import ModernTemplate from "../../components/templates/modern-template"
import ProfessionalTemplate from "../../components/templates/professional-template"
import { TemplateCustomizer } from "../../components/template-customizer"
import PersonalInfoForm from "../../components/resume-form/personal-info-form"
import EducationForm from "../../components/resume-form/education-form"
import ExperienceForm from "../../components/resume-form/experience-form"
import SkillsForm from "../../components/resume-form/skills-form"
import ProjectsForm from "../../components/resume-form/projects-form"
import CertificationsForm from "../../components/resume-form/certifications-form"
import { FullScreenPreview } from "../../components/full-screen-preview"
import { TemplateSelector } from "../../components/template-selector"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs"

const SECTIONS = [
  { id: "personal", label: "Personal", icon: <User className="h-4 w-4" /> },
  { id: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
  { id: "experience", label: "Experience", icon: <Briefcase className="h-4 w-4" /> },
  { id: "skills", label: "Skills", icon: <Lightbulb className="h-4 w-4" /> },
  { id: "certifications", label: "Certificates", icon: <Award className="h-4 w-4" /> },
  { id: "projects", label: "Projects", icon: <FolderKanban className="h-4 w-4" /> },
]

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
}

export default function Builder() {
  const { userId, isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resumeData, setResumeData } = useResumeContext()

  const [activeTab, setActiveTab] = useState("personal")
  const [selectedTemplate, setSelectedTemplate] = useState(
    searchParams.get("template") || "modern",
  )
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [scale, setScale] = useState(0.7)
  const resumeRef = useRef(null)

  
  const TemplateComponent = useMemo(
    () => TEMPLATE_COMPONENTS[selectedTemplate] || ModernTemplate,
    [selectedTemplate],
  )

  const templateDisplayName = useMemo(() => {
    const template = templates.find((t) => t.id === selectedTemplate)
    return template?.name || "Template"
  }, [selectedTemplate])

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    const filledSections = Object.keys(resumeData).filter((key) => {
      if (Array.isArray(resumeData[key])) return resumeData[key].length > 0
      return Object.keys(resumeData[key]).length > 0
    }).length
    
    const totalSections = Object.keys(resumeData).length
    return Math.min(Math.floor((filledSections / totalSections) * 100), 100)
  }, [resumeData])

  const handleTemplateSelect = useCallback(
    (templateId) => {
      setSelectedTemplate(templateId)
      setResumeData((prev) => ({
        ...prev,
        selectedTemplate: templateId,
      }))

      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set("template", templateId)
      router.replace(`?${newSearchParams.toString()}`, { scroll: false })
      setShowTemplateSelector(false)
    },
    [searchParams, router, setResumeData],
  )

  const handleFormChange = useCallback(
    (section, data) => {
      setResumeData((prev) => ({
        ...prev,
        [section]: data,
      }))
    },
    [setResumeData],
  )

  const handleSaveDraft = useCallback(() => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData))
    toast.success("Draft saved", {
      description: "Your resume has been saved as a draft",
    })
  }, [resumeData])

  const handleDownloadPDF = useCallback(async () => {
    const errors = validateResumeData(resumeData)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      toast.error("Download failed", {
        description: "Some required fields are missing or invalid.",
      })
      return
    }

    if (!resumeRef.current) return

    setIsGeneratingPDF(true)
    const toastId = toast.loading("Generating PDF...", {
      description: "Your resume is being prepared for download",
    })

    try {
      await generatePDF(
        resumeRef.current,
        resumeData.personal.name || "resume",
      )
      toast.success("Download complete", {
        id: toastId,
        description: "Your resume has been downloaded successfully.",
      })
    } catch (error) {
      console.error("PDF generation failed:", error)
      toast.error("Download failed", {
        id: toastId,
        description:
          "There was an error generating your PDF. Please try again.",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }, [resumeData])

  
  const navigateTab = useCallback((direction) => {
    setActiveTab((currentTab) => {
      const currentIndex = SECTIONS.findIndex(
        (section) => section.id === currentTab,
      )
      const newIndex =
        direction === "next" ? currentIndex + 1 : currentIndex - 1
      return SECTIONS[newIndex]?.id || currentTab
    })
  }, [])

  useEffect(() => {
    const templateId = searchParams.get("template") || "modern"
    if (templateId !== selectedTemplate) {
      setSelectedTemplate(templateId)
      setResumeData((prev) => ({
        ...prev,
        selectedTemplate: templateId,
      }))
    }
  }, [searchParams, selectedTemplate, setResumeData])

  const renderTemplate = useCallback(
    () => <TemplateComponent data={resumeData} />,
    [TemplateComponent, resumeData],
  )

  const renderFormSection = useCallback(() => {
    const commonProps = {
      data: resumeData[activeTab],
      onChange: (data) => handleFormChange(activeTab, data),
      validationErrors: validationErrors[activeTab] || [],
    }

    switch (activeTab) {
      case "personal":
        return <PersonalInfoForm {...commonProps} />
      case "education":
        return <EducationForm {...commonProps} />
      case "experience":
        return <ExperienceForm {...commonProps} />
      case "skills":
        return <SkillsForm {...commonProps} />
      case "certifications":
        return <CertificationsForm {...commonProps} />
      case "projects":
        return <ProjectsForm {...commonProps} />
      default:
        return null
    }
  }, [activeTab, handleFormChange, resumeData, validationErrors])

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (isFullScreenPreview) {
    return (
      <FullScreenPreview
        resumeRef={resumeRef}
        scale={scale}
        setScale={setScale}
        isGeneratingPDF={isGeneratingPDF}
        handleDownloadPDF={handleDownloadPDF}
        setIsFullScreenPreview={setIsFullScreenPreview}
        renderTemplate={renderTemplate}
      />
    )
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Resume Builder</h1>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 bg-zinc-100 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium">Auto-saving</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplateSelector(true)}
                className="hidden gap-2 sm:flex"
                aria-label="Change template"
              >
                <FileText className="h-4 w-4" />
                {templateDisplayName}
              </Button>

              <TemplateCustomizer />

              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                aria-label="Save draft"
                className="gap-2 hidden sm:flex"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </Button>

          

              <Button
                size="sm"
                variant={"default"}
                onClick={handleDownloadPDF}
                className="gap-2 bg-teal-600 hover:bg-teal-700"
                disabled={isGeneratingPDF}
                aria-label="Download PDF"
              >
                {isGeneratingPDF ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Download PDF</span>
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium">Progress</h2>
              <Badge variant="outline" className="gap-1.5 border-zinc-300">
                <span>{completionPercentage}%</span> Complete
              </Badge>
            </div>
            <Progress value={completionPercentage} className="h-2 bg-zinc-200">
              <div
                className="h-full bg-gradient-to-r from-teal-600 to-green-600"
                style={{ width: `${completionPercentage}%` }}
              />
            </Progress>
          </div>
        </div>
      </header>

      <TemplateSelector
        showTemplateSelector={showTemplateSelector}
        setShowTemplateSelector={setShowTemplateSelector}
        templates={templates}
        selectedTemplate={selectedTemplate}
        handleTemplateSelect={handleTemplateSelect}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="lg:w-2/3">
            <Card className="overflow-hidden border border-zinc-200">
              <div className="p-4 border-b">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <div className="mb-4">
                    <TabsList className="grid grid-cols-3 gap-1 bg-transparent p-0.5 sm:grid-cols-6">
                      {SECTIONS.map((section) => (
                        <TabsTrigger
                          key={section.id}
                          value={section.id}
                          className="flex h-auto flex-col gap-1 py-2"
                        >
                          {section.icon}
                          <span className="text-xs">{section.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  <div className="mt-4">
                    <TabsContent value={activeTab} className="animate-slide-in">
                      {renderFormSection()}
                    </TabsContent>
                  </div>

                  <div className="mt-6 flex justify-between border-t pt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigateTab("prev")}
                      disabled={activeTab === SECTIONS[0].id}
                      className="gap-2 border-zinc-300"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>
                    <Button
                      onClick={() => navigateTab("next")}
                      disabled={activeTab === SECTIONS[SECTIONS.length - 1].id}
                      className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Tabs>
              </div>
            </Card>

            <div className="mt-6 lg:hidden">
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

          <div className="lg:w-1/3 hidden lg:block">
            <Card className="overflow-hidden sticky top-24 border border-zinc-200">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-medium">Preview</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-zinc-100 rounded-md px-2 py-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
                      disabled={scale <= 0.5}
                    >
                      <ZoomOut className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-medium w-8 text-center">{Math.round(scale * 100)}%</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setScale((prev) => Math.min(1.5, prev + 0.1))}
                      disabled={scale >= 1.5}
                    >
                      <ZoomIn className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsFullScreenPreview(true)}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-zinc-50 p-4">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div
                    className="bg-white shadow-md mx-auto transition-transform"
                    style={{
                      width: "100%",
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}