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
import { toast } from "sonner"
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
import { TemplateSelector } from "../../components/template-selector"

import { validateResumeData } from "../../lib/validation"
import ModernTemplate from "../../components/templates/modern-template"
import MinimalTemplate from "../../components/templates/minimal-template"
import ProfessionalTemplate from "../../components/templates/professional-template"
import { ScrollArea } from "../../components/ui/scroll-area"
import { generatePDF } from "../../lib/pdf-generator"
import { TemplateCustomizer } from "../../components/template-customizer"

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
  const [isEnhancingResume, setIsEnhancingResume] = useState(false)

  useEffect(() => {
    const templateId = searchParams.get("template") || "modern"
    if (selectedTemplate !== templateId) {
      setSelectedTemplate(templateId)
      if (resumeData.selectedTemplate !== templateId) {
        setResumeData((prev) => ({
          ...prev,
          selectedTemplate: templateId,
        }))
      }
    }
  }, [searchParams, resumeData.selectedTemplate])

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId)
    setResumeData((prev) => ({
      ...prev,
      selectedTemplate: templateId,
    }))
    setShowTemplateSelector(false)
    toast.success("Template changed successfully")
  }

  const handleSaveDraft = () => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData))
    toast.success("Draft saved successfully")
  }

  const handleDownloadPDF = async () => {
    const errors = validateResumeData(resumeData)

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      toast.error("Please fix the validation errors before downloading")
      return
    }

    if (!resumeRef.current) return

    setIsGeneratingPDF(true)
    const toastId = toast.loading("Generating PDF...")

    try {
      await generatePDF(resumeRef.current, resumeData.personal.name || "resume")
      toast.success("PDF downloaded successfully", { id: toastId })
    } catch (error) {
      console.error("PDF generation failed:", error)
      toast.error("Failed to generate PDF. Please try again.", { id: toastId })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleEnhanceFullResume = async () => {
    if (!resumeData.personal.name || !resumeData.personal.email) {
      toast.error("Please fill in at least your name and email before enhancing")
      return
    }

    setIsEnhancingResume(true)
    const toastId = toast.loading("Enhancing your resume...")

    try {
      // Create a copy of the resume data to work with
      const enhancedData = { ...resumeData }

      // Enhance personal summary if it exists
      if (enhancedData.personal.summary) {
        enhancedData.personal.summary = await enhanceText(enhancedData.personal.summary, "summary")
      }

      // Enhance career objective if it exists
      if (enhancedData.personal.objective) {
        enhancedData.personal.objective = await enhanceText(enhancedData.personal.objective, "objective")
      }

      // Enhance experience descriptions
      if (enhancedData.experience && enhancedData.experience.length > 0) {
        for (let i = 0; i < enhancedData.experience.length; i++) {
          if (enhancedData.experience[i].description) {
            enhancedData.experience[i].description = await enhanceText(
              enhancedData.experience[i].description,
              "experience",
            )
          }
        }
      }

      // Enhance project descriptions
      if (enhancedData.projects && enhancedData.projects.length > 0) {
        for (let i = 0; i < enhancedData.projects.length; i++) {
          if (enhancedData.projects[i].description) {
            enhancedData.projects[i].description = await enhanceText(enhancedData.projects[i].description, "project")
          }
        }
      }

      // Enhance education descriptions
      if (enhancedData.education && enhancedData.education.length > 0) {
        for (let i = 0; i < enhancedData.education.length; i++) {
          if (enhancedData.education[i].description) {
            enhancedData.education[i].description = await enhanceText(
              enhancedData.education[i].description,
              "education",
            )
          }
        }
      }

      // Update the resume data with enhanced content
      setResumeData(enhancedData)
      toast.success("Resume enhanced successfully!", { id: toastId })
    } catch (error) {
      console.error("Error enhancing resume:", error)
      toast.error("Failed to enhance resume. Please try again.", { id: toastId })
    } finally {
      setIsEnhancingResume(false)
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

  const getTemplateDisplayName = (templateId) => {
    const template = templates.find((t) => t.id === templateId)
    return template ? template.name : "Template"
  }

  const sections = [
    { id: "personal", label: "Personal Info", icon: <User className="h-4 w-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "experience", label: "Experience", icon: <Briefcase className="h-4 w-4" /> },
    { id: "skills", label: "Skills", icon: <Lightbulb className="h-4 w-4" /> },
    { id: "certifications", label: "Certifications", icon: <Award className="h-4 w-4" /> },
    { id: "projects", label: "Projects", icon: <FolderKanban className="h-4 w-4" /> },
  ]

  if (isFullScreenPreview) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col animate-fade-in">
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
      <header className="bg-card border-b sticky top-0 z-10 transition-colors duration-300">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-semibold">
              Resume Builder
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplateSelector(true)}
              className="gap-2 hidden sm:flex"
              aria-label="Change template"
            >
              <Palette className="h-4 w-4" />
              {getTemplateDisplayName(selectedTemplate)}
            </Button>
            <TemplateCustomizer />

            <Button
              variant="outline"
              size="sm"
              onClick={handleEnhanceFullResume}
              className="gap-2 hidden sm:flex"
              disabled={isEnhancingResume}
              aria-label="Enhance resume"
            >
              {isEnhancingResume ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              Magic Writer
            </Button>

            <Button variant="outline" size="icon" onClick={handleSaveDraft} aria-label="Save draft">
              <Save className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              onClick={handleDownloadPDF}
              className="gap-2"
              disabled={isGeneratingPDF}
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
                  <span className="hidden sm:inline">Download</span>
                </>
              )}
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </header>

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
                    src={template.thumbnail || "/placeholder.svg?height=192&width=300"}
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

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2 animate-fade-in">
            <div className="bg-card rounded-lg border p-6 transition-colors duration-300">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-6">
                  <div className="hidden sm:block">
                    <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                      {sections.map((section) => (
                        <TabsTrigger
                          key={section.id}
                          value={section.id}
                          className="flex flex-col gap-1 py-2 h-auto"
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
          <div className="hidden lg:block lg:w-1/2 animate-fade-in">
            <div className="bg-card rounded-lg border p-6 sticky top-20 transition-colors duration-300">
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
              <div className="bg-secondary/30 rounded-lg flex justify-center transition-colors duration-300">
                <ScrollArea className="h-[calc(100vh-220px)] w-full">
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
                <Button
                  onClick={() => setIsFullScreenPreview(true)}
                  className="gap-2"
                  aria-label="Full screen preview"
                >
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