"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { Sparkles, Loader2, Check } from "lucide-react"
import { aiService } from "../lib/utils"
import { useResumeContext } from "../context/resume-provider"

export function BatchEnhancer() {
  const { resumeData, updatePersonalInfo, updateExperience, updateEducation, updateProjects } = useResumeContext()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTone, setSelectedTone] = useState("professional")
  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    experience: true,
    education: true,
    projects: true,
  })
  const [progress, setProgress] = useState(0)
  const [enhancedCount, setEnhancedCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const toggleSection = (section) => {
    setSelectedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleBatchEnhance = async () => {
    setIsLoading(true)
    setProgress(0)
    setEnhancedCount(0)
    setIsComplete(false)

    try {
      let totalSections = 0
      let completedSections = 0

      // Count total sections to enhance
      if (selectedSections.summary && resumeData.personal.summary) totalSections++
      if (selectedSections.experience) totalSections += resumeData.experience.filter((exp) => exp.description).length
      if (selectedSections.education) totalSections += resumeData.education.filter((edu) => edu.description).length
      if (selectedSections.projects) totalSections += resumeData.projects.filter((proj) => proj.description).length

      // Enhance personal summary
      if (selectedSections.summary && resumeData.personal.summary) {
        const enhancedSummary = await aiService.enhanceText(resumeData.personal.summary, selectedTone)
        updatePersonalInfo({ summary: enhancedSummary })
        completedSections++
        setEnhancedCount((prev) => prev + 1)
        setProgress(Math.round((completedSections / totalSections) * 100))
      }

      // Enhance experience descriptions
      if (selectedSections.experience) {
        const updatedExperience = [...resumeData.experience]
        for (let i = 0; i < updatedExperience.length; i++) {
          if (updatedExperience[i].description) {
            updatedExperience[i].description = await aiService.enhanceText(
              updatedExperience[i].description,
              selectedTone,
            )
            completedSections++
            setEnhancedCount((prev) => prev + 1)
            setProgress(Math.round((completedSections / totalSections) * 100))
          }
        }
        updateExperience(updatedExperience)
      }

      // Enhance education descriptions
      if (selectedSections.education) {
        const updatedEducation = [...resumeData.education]
        for (let i = 0; i < updatedEducation.length; i++) {
          if (updatedEducation[i].description) {
            updatedEducation[i].description = await aiService.enhanceText(updatedEducation[i].description, selectedTone)
            completedSections++
            setEnhancedCount((prev) => prev + 1)
            setProgress(Math.round((completedSections / totalSections) * 100))
          }
        }
        updateEducation(updatedEducation)
      }

      // Enhance project descriptions
      if (selectedSections.projects) {
        const updatedProjects = [...resumeData.projects]
        for (let i = 0; i < updatedProjects.length; i++) {
          if (updatedProjects[i].description) {
            updatedProjects[i].description = await aiService.enhanceText(updatedProjects[i].description, selectedTone)
            completedSections++
            setEnhancedCount((prev) => prev + 1)
            setProgress(Math.round((completedSections / totalSections) * 100))
          }
        }
        updateProjects(updatedProjects)
      }

      setIsComplete(true)
    } catch (error) {
      console.error("Batch enhancement failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2" variant="outline">
        <Sparkles className="h-4 w-4 text-blue-500" />
        Enhance All Content
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) {
            setIsComplete(false)
            setProgress(0)
            setEnhancedCount(0)
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Batch AI Enhancement
            </DialogTitle>
          </DialogHeader>

          {!isLoading && !isComplete ? (
            <>
              <div className="space-y-4 my-4">
                <p className="text-sm text-muted-foreground">
                  Enhance multiple sections of your resume at once with AI. Select the sections you want to improve and
                  the enhancement style.
                </p>

                <div className="space-y-3 border rounded-md p-4 bg-muted/20">
                  <h3 className="font-medium">Select sections to enhance:</h3>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="summary"
                        checked={selectedSections.summary}
                        onCheckedChange={() => toggleSection("summary")}
                      />
                      <Label htmlFor="summary">Professional Summary</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="experience"
                        checked={selectedSections.experience}
                        onCheckedChange={() => toggleSection("experience")}
                      />
                      <Label htmlFor="experience">Work Experience</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="education"
                        checked={selectedSections.education}
                        onCheckedChange={() => toggleSection("education")}
                      />
                      <Label htmlFor="education">Education</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="projects"
                        checked={selectedSections.projects}
                        onCheckedChange={() => toggleSection("projects")}
                      />
                      <Label htmlFor="projects">Projects</Label>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4 bg-muted/20">
                  <h3 className="font-medium mb-3">Select enhancement style:</h3>
                  <Tabs defaultValue="professional" value={selectedTone} onValueChange={setSelectedTone}>
                    <TabsList className="grid grid-cols-2 mb-2">
                      <TabsTrigger value="professional">Professional</TabsTrigger>
                      <TabsTrigger value="ats">ATS-Optimized</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="concise">Concise</TabsTrigger>
                      <TabsTrigger value="confident">Confident</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleBatchEnhance}
                  disabled={!Object.values(selectedSections).some(Boolean)}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Enhance Selected Sections
                </Button>
              </DialogFooter>
            </>
          ) : isComplete ? (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto bg-green-100 dark:bg-green-900/30 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-medium">Enhancement Complete!</h3>
              <p className="text-muted-foreground">Successfully enhanced {enhancedCount} sections of your resume.</p>
              <Button onClick={() => setIsOpen(false)} className="mt-4">
                Close
              </Button>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto rounded-full p-3 w-16 h-16 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              <h3 className="text-xl font-medium">Enhancing Your Resume</h3>
              <p className="text-muted-foreground">Enhanced {enhancedCount} sections so far...</p>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">{progress}% complete</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
