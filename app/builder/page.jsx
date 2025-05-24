"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Download,
  Save,
  ArrowLeft,
  Wand2,
  Palette,
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
  Share2,
  Copy,
  Eye,
  Undo,
  Redo,
  MoreHorizontal,
} from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { ScrollArea } from "../../components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { toast } from "sonner"
import { useResumeContext } from "../../context/resume-provider"
import { templates } from "../../lib/templates"
import { validateResumeData } from "../../lib/validation"
import { generatePDF } from "../../lib/pdf-generator"
import MinimalTemplate from "../../components/templates/minimal-template"
import ModernTemplate from "../../components/templates/modern-template"
import ProfessionalTemplate from "../../components/templates/professional-template"
import {TemplateCustomizer} from "../../components/template-customizer";
import PersonalInfoForm from "../../components/resume-form/personal-info-form"
import EducationForm from "../../components/resume-form/education-form"
import ExperienceForm from "../../components/resume-form/experience-form"
import SkillsForm from "../../components/resume-form/skills-form"
import ProjectsForm from "../../components/resume-form/projects-form"
import CertificationsForm from "../../components/resume-form/certifications-form"
import { FullScreenPreview } from "../../components/full-screen-preview"
import { TemplateSelector } from "../../components/template-selector"
const sections = [
  { id: "personal", label: "Personal", icon: <User className="h-5 w-5" /> },
  { id: "education", label: "Education", icon: <GraduationCap className="h-5 w-5" /> },
  { id: "experience", label: "Experience", icon: <Briefcase className="h-5 w-5" /> },
  { id: "skills", label: "Skills", icon: <Lightbulb className="h-5 w-5" /> },
  { id: "certifications", label: "Certificates", icon: <Award className="h-5 w-5" /> },
  { id: "projects", label: "Projects", icon: <FolderKanban className="h-5 w-5" /> },
]
export default function Builder() {
  const { userId, isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resumeData, setResumeData } = useResumeContext()
  
  const [activeSection, setActiveSection] = useState("personal")
  const [validationErrors, setValidationErrors] = useState({})
  const [scale, setScale] = useState(0.8)
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showCustomizePanel, setShowCustomizePanel] = useState(false)
  const [isEnhancingResume, setIsEnhancingResume] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [undoHistory, setUndoHistory] = useState([])
  const [redoHistory, setRedoHistory] = useState([])
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [isLoadingResume, setIsLoadingResume] = useState(true)
  const [resumeId, setResumeId] = useState(null)

  const renderTemplate = () => {
    switch (selectedTemplate) {
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
  
  const resumeRef = useRef(null)
  const selectedTemplate = searchParams.get("template") || "modern"

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      router.push("/sign-in")
      return
    }

    const loadUserResume = async () => {
      try {
        const resumeId = searchParams.get("id")
        if (resumeId) {
          const resume = await loadResume(userId, resumeId)
          if (resume) {
            setResumeData(resume.data)
            setResumeId(resume.id)
          }
        }
      } catch (error) {
        toast.error("Failed to load resume")
      } finally {
        setIsLoadingResume(false)
      }
    }

    loadUserResume()
  }, [isLoaded, isSignedIn, userId, searchParams, setResumeData, router])

  useEffect(() => {
    const filledSections = Object.keys(resumeData).filter((key) => {
      if (Array.isArray(resumeData[key])) return resumeData[key].length > 0
      return Object.keys(resumeData[key]).length > 0
    }).length
    
    const totalSections = Object.keys(resumeData).length
    setCompletionPercentage(Math.min(Math.floor((filledSections / totalSections) * 100), 100))
  }, [resumeData])

  const handleSaveResume = async () => {
    if (!userId) {
      toast.error("You must be signed in to save your resume")
      return
    }

    try {
      const toastId = toast.loading("Saving resume...")
      const savedResume = await saveResume(userId, resumeData, resumeId)
      setResumeId(savedResume.id)
      toast.success("Resume saved successfully", { id: toastId })
    } catch (error) {
      toast.error("Failed to save resume")
    }
  }

  const handleTemplateSelect = (templateId) => {
    router.push(`/builder?template=${templateId}${resumeId ? `&id=${resumeId}` : ''}`)
    setResumeData(prev => ({ ...prev, selectedTemplate: templateId }))
    toast.success(`Template changed to ${templates.find(t => t.id === templateId)?.name || templateId}`)
    setShowTemplateSelector(false)
  }

  const handleDownloadPDF = async () => {
    const errors = validateResumeData(resumeData)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      toast.error("Please fix the validation errors before downloading")
      return
    }

    setIsGeneratingPDF(true)
    const toastId = toast.loading("Generating PDF...")

    try {
      await generatePDF(resumeRef.current, resumeData.personal.name || "resume")
      toast.success("PDF downloaded successfully", { id: toastId })
    } catch (error) {
      toast.error("Failed to generate PDF. Please try again.", { id: toastId })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleEnhanceResume = async () => {
    if (!userId) {
      toast.error("You must be signed in to use AI features")
      return
    }

    setIsEnhancingResume(true)
    const toastId = toast.loading("Enhancing your resume with AI...")

    try {
      const enhancedData = { ...resumeData }

      if (enhancedData.personal.summary) {
        enhancedData.personal.summary = await enhanceTextWithAI(
          userId,
          enhancedData.personal.summary,
          "summary"
        )
      }

      if (enhancedData.experience?.length > 0) {
        for (const exp of enhancedData.experience) {
          if (exp.description) {
            exp.description = await enhanceTextWithAI(
              userId,
              exp.description,
              "experience"
            )
          }
        }
      }

      setResumeData(enhancedData)
      toast.success("Resume enhanced successfully!", { id: toastId })
    } catch (error) {
      toast.error("Failed to enhance resume. Please try again.", { id: toastId })
    } finally {
      setIsEnhancingResume(false)
    }
  }

  const renderSectionContent = () => {
    if (isLoadingResume) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      )
    }

    const FormComponent = {
      personal: PersonalInfoForm,
      education: EducationForm,
      experience: ExperienceForm,
      skills: SkillsForm,
      certifications: CertificationsForm,
      projects: ProjectsForm,
    }[activeSection] || PersonalInfoForm

    return <FormComponent validationErrors={validationErrors[activeSection] || []} />
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto h-16 px-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 bg-zinc-100 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium">Auto-saving</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="border-zinc-300">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={handleSaveResume} 
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Resume</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Share2 className="h-4 w-4" />
                  <span>Share Resume</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Copy className="h-4 w-4" />
                  <span>Duplicate</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="default"
              onClick={handleDownloadPDF}
              className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download PDF</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Build Your Resume</h1>
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

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 shrink-0">
            <Card className="overflow-hidden border border-zinc-200">
              <div className="p-4 border-b bg-zinc-50">
                <h2 className="font-medium">Resume Sections</h2>
              </div>
              <div className="p-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${
                      activeSection === section.id
                        ? "bg-gradient-to-r from-teal-600 to-green-600 text-white"
                        : "hover:bg-zinc-100 text-zinc-800"
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.icon}
                    <span>{section.label}</span>
                    {activeSection === section.id && <ChevronRight className="h-4 w-4 ml-auto" />}
                  </button>
                ))}
              </div>
              <div className="p-4 border-t">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-zinc-300 hover:bg-zinc-100 text-zinc-800"
                    onClick={() => setShowTemplateSelector(true)}
                  >
                    <Palette className="h-4 w-4" />
                    <span>Change Template</span>
                  </Button>
                  <TemplateCustomizer />
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-zinc-300 hover:bg-zinc-100 text-zinc-800"
                    onClick={() => setShowAIPanel(true)}
                    disabled={isEnhancingResume}
                  >
                    {isEnhancingResume ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4" />
                    )}
                    <span>AI Assistant</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex-1 relative">
            <AnimatePresence>
              {showCustomizePanel && <CustomizePanel />}
            </AnimatePresence>

            <Card className="overflow-hidden border border-zinc-200">
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h2 className="font-medium flex items-center gap-2">
                    {sections.find((s) => s.id === activeSection)?.icon}
                    <span>{sections.find((s) => s.id === activeSection)?.label} Information</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" disabled={undoHistory.length === 0}>
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" disabled={redoHistory.length === 0}>
                    <Redo className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setIsFullScreenPreview(true)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-6">{renderSectionContent()}</div>
              <div className="p-4 border-t flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    const currentIndex = sections.findIndex((s) => s.id === activeSection)
                    if (currentIndex > 0) setActiveSection(sections[currentIndex - 1].id)
                  }}
                  disabled={activeSection === sections[0].id}
                  className="gap-2 border-zinc-300"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button
                  onClick={() => {
                    const currentIndex = sections.findIndex((s) => s.id === activeSection)
                    if (currentIndex < sections.length - 1) setActiveSection(sections[currentIndex + 1].id)
                  }}
                  disabled={activeSection === sections[sections.length - 1].id}
                  className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:w-[450px] shrink-0 hidden lg:block">
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
                  <Button variant="ghost" size="icon" onClick={() => setIsFullScreenPreview(true)}>
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

      <TemplateSelector
        open={showTemplateSelector}
        onOpenChange={setShowTemplateSelector}
        templates={templates}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={handleTemplateSelect}
      />

      {isFullScreenPreview && (
        <FullScreenPreview
          resumeData={resumeData}
          scale={scale}
          setScale={setScale}
          setIsFullScreenPreview={setIsFullScreenPreview}
          handleDownloadPDF={handleDownloadPDF}
          isGeneratingPDF={isGeneratingPDF}
        />
      )}
    </div>
  )
}