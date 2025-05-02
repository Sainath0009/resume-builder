"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import PersonalInfoForm from "../../components/resume-form/personal-info-form"
import EducationForm from "../../components/resume-form/education-form"
import ExperienceForm from "../../components/resume-form//experience-form"
import SkillsForm from "../../components/resume-form/skills-form"
import ProjectsForm from "../../components/resume-form/projects-form"
import CertificationsForm from "../../components/resume-form/certifications-form"
import { useResumeContext } from "../../context/resume-provider"
import { ArrowLeft, Download, Save, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react"
import Link from "next/link"
import { useToast } from "../../hooks/use-toast"
import { validateResumeData } from "../../lib/validation"
import ModernTemplate from "../../components/templates/modern-template"
import MinimalTemplate from "../../components/templates/minimal-template"
import ProfessionalTemplate from "../../components/templates/professional-template"
import { Separator } from "../../components/ui/separator"
import { ScrollArea } from "../../components/ui/scroll-area"
import { generatePDF } from "../../lib/pdf-generator"

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

  if (isFullScreenPreview) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-semibold">Resume Preview</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-md px-2 py-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
                disabled={scale <= 0.5}
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
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={handleDownloadPDF} className="gap-2" disabled={isGeneratingPDF}>
              <Download className="h-4 w-4" />
              {isGeneratingPDF ? "Generating..." : "Download PDF"}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsFullScreenPreview(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8 flex justify-center">
          <div
            className="bg-white shadow-lg mx-auto transition-transform"
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
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSaveDraft} className="gap-2">
            <Save className="h-4 w-4" /> Save Draft
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsFullScreenPreview(true)} className="gap-2">
            <Maximize2 className="h-4 w-4" /> Full Preview
          </Button>
          <Button size="sm" onClick={handleDownloadPDF} className="gap-2" disabled={isGeneratingPDF}>
            <Download className="h-4 w-4" />
            {isGeneratingPDF ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form and Template Selection */}
        <div className="space-y-6">
          {/* <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-xl font-semibold mb-4">Choose Template</h2>
            <div className="grid grid-cols-3 gap-3">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.id ? "ring-2 ring-primary" : "hover:border-primary/50"
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardContent className="p-2">
                    <div className="relative h-24 w-full mb-2">
                      <Image
                        src={template.thumbnail || "/placeholder.svg"}
                        alt={template.name}
                        fill
                        className="object-cover rounded-sm"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-center">{template.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div> */}

          <div className="bg-white rounded-lg shadow-sm border">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-6 w-full">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
              <div className="p-4">
                <TabsContent value="personal">
                  <PersonalInfoForm validationErrors={validationErrors.personal || []} />
                </TabsContent>
                <TabsContent value="education">
                  <EducationForm validationErrors={validationErrors.education || []} />
                </TabsContent>
                <TabsContent value="experience">
                  <ExperienceForm validationErrors={validationErrors.experience || []} />
                </TabsContent>
                <TabsContent value="skills">
                  <SkillsForm validationErrors={validationErrors.skills || []} />
                </TabsContent>
                <TabsContent value="certifications">
                  <CertificationsForm validationErrors={validationErrors.certifications || []} />
                </TabsContent>
                <TabsContent value="projects">
                  <ProjectsForm validationErrors={validationErrors.projects || []} />
                </TabsContent>
              </div>
            </Tabs>

            <div className="flex justify-between p-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  const tabs = ["personal", "education", "experience", "skills", "certifications", "projects"]
                  const currentIndex = tabs.indexOf(activeTab)
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1])
                  }
                }}
                disabled={activeTab === "personal"}
              >
                Previous
              </Button>
              <Button
                onClick={() => {
                  const tabs = ["personal", "education", "experience", "skills", "certifications", "projects"]
                  const currentIndex = tabs.indexOf(activeTab)
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1])
                  }
                }}
              >
                {activeTab === "projects" ? "Complete" : "Next"}
              </Button>
            </div>
          </div>

          {/* Disabled AI Features Section */}
          <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
            <h3 className="text-lg font-medium mb-2 text-muted-foreground">AI Features (Coming Soon)</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Our AI-powered resume suggestions and auto-fill features are temporarily disabled.
            </p>
            <Button variant="outline" className="w-full" disabled>
              Enable AI Features
            </Button>
          </div>
        </div>

        {/* Right Column - Live Preview */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-center sm:text-left w-full sm:w-auto">Live Preview</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
                disabled={scale <= 0.5}
              >
                -
              </Button>
              <span className="text-sm font-medium w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale((prev) => Math.min(1, prev + 0.1))}
                disabled={scale >= 1}
              >
                +
              </Button>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="flex justify-center bg-gray-100 rounded-xl p-4">
            <ScrollArea className="max-h-[calc(100vh-250px)] w-full flex justify-center">
              <div
                className="bg-white shadow-md transition-transform rounded-md"
                style={{
                  width: "210mm",
                  minHeight: "297mm",
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                }}
                ref={resumeRef}
              >
                {renderTemplate()}
              </div>
            </ScrollArea>
          </div>
        </div>

      </div>
    </div>
  )
}   