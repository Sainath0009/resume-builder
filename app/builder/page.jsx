"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Download,
  Save,
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
  FileText,
} from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { Button } from "../../components/ui/button"
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
import { ResumePreview } from "@/components/ResumePreview"

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
  const { isLoaded, isSignedIn } = useAuth()
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
      <header className="bg-card border-b sticky top-0 z-10 transition-colors duration-300">
        <div className="container mx-auto px-4 py-3 flex justify-end items-center">

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplateSelector(true)}
              className="gap-2 hidden sm:flex"
              aria-label="Change template"
            >
              <FileText className="h-4 w-4" />
              <span>{templateDisplayName}</span>
            </Button>

            <TemplateCustomizer />

            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              className="gap-2 hidden sm:flex" aria-label="Save draft"
            >
              <Save className="h-5 w-5" />
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="gap-2 bg-primary text-white  hover:bg-primary/90"
              aria-label="Download PDF"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download </span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

       <TemplateSelector
        open={showTemplateSelector}
        onOpenChange={setShowTemplateSelector}
        templates={templates}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={handleTemplateSelect}
      />


      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="animate-fade-in lg:w-1/2">
            <div className="rounded-lg border bg-card p-6 transition-colors duration-300">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="hidden sm:block">
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
                  <div className="sm:hidden">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigateTab("prev")}
                        disabled={activeTab === SECTIONS[0].id}
                        aria-label="Previous section"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        {SECTIONS.findIndex((s) => s.id === activeTab) + 1} /{" "}
                        {SECTIONS.length}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigateTab("next")}
                        disabled={
                          activeTab === SECTIONS[SECTIONS.length - 1].id
                        }
                        aria-label="Next section"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <TabsContent value={activeTab} className="animate-slide-in">
                    {renderFormSection()}
                  </TabsContent>
                </div>

                <div className="mt-8 flex justify-between border-t pt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigateTab("prev")}
                    disabled={activeTab === SECTIONS[0].id}
                    className="gap-2"
                    aria-label="Previous section"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <Button
                    onClick={() => navigateTab("next")}
                    disabled={activeTab === SECTIONS[SECTIONS.length - 1].id}
                    className="gap-2"
                    aria-label="Next section"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Tabs>
            </div>

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

          <ResumePreview
            resumeRef={resumeRef}
            scale={scale}
            setScale={setScale}
            renderTemplate={renderTemplate}
            setIsFullScreenPreview={setIsFullScreenPreview}
          />
        </div>
      </div>
    </div>
  )
}