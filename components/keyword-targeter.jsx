"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Sparkles, Loader2, Check, Target } from "lucide-react"
import { useResumeContext } from "../context/resume-provider"

export function KeywordTargeter() {
  const { resumeData, updatePersonalInfo, updateExperience } = useResumeContext()
  const [isOpen, setIsOpen] = useState(false)
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [extractedKeywords, setExtractedKeywords] = useState([])
  const [optimizationComplete, setOptimizationComplete] = useState(false)
  const [step, setStep] = useState(1)

  const analyzeJobDescription = async () => {
    if (!jobDescription || jobDescription.trim().length < 20) {
      return
    }

    setIsAnalyzing(true)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Extract keywords from job description
      // In a real app, this would use NLP to extract relevant keywords
      const commonKeywords = [
        "JavaScript",
        "React",
        "Node.js",
        "TypeScript",
        "HTML",
        "CSS",
        "responsive design",
        "API",
        "REST",
        "GraphQL",
        "SQL",
        "NoSQL",
        "MongoDB",
        "PostgreSQL",
        "AWS",
        "Azure",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "Git",
        "Agile",
        "Scrum",
        "team player",
        "communication",
        "problem-solving",
        "leadership",
        "project management",
        "collaboration",
        "cross-functional",
        "detail-oriented",
        "innovative",
        "strategic thinking",
      ]

      // Randomly select 5-10 keywords that appear in the job description
      const keywords = commonKeywords
        .filter((keyword) => jobDescription.toLowerCase().includes(keyword.toLowerCase()))
        .slice(0, Math.floor(Math.random() * 5) + 5)

      // If not enough keywords found, add some common ones
      if (keywords.length < 5) {
        const additionalKeywords = commonKeywords.filter((k) => !keywords.includes(k)).slice(0, 5 - keywords.length)
        keywords.push(...additionalKeywords)
      }

      setExtractedKeywords(keywords)
      setStep(2)
    } catch (error) {
      console.error("Error analyzing job description:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const optimizeResume = async () => {
    if (extractedKeywords.length === 0) {
      return
    }

    setIsOptimizing(true)

    try {
      // Optimize summary
      if (resumeData.personal.summary) {
        let enhancedSummary = resumeData.personal.summary

        // Ensure keywords are included in the summary
        for (const keyword of extractedKeywords.slice(0, 3)) {
          if (!enhancedSummary.toLowerCase().includes(keyword.toLowerCase())) {
            // Add keyword if not already present
            enhancedSummary = enhancedSummary.replace(/\.$/, `. Skilled in ${keyword}.`)
          }
        }

        updatePersonalInfo({ summary: enhancedSummary })
      }

      // Optimize experience descriptions
      if (resumeData.experience.length > 0) {
        const updatedExperience = [...resumeData.experience]

        // Distribute keywords across experience entries
        const keywordsPerEntry = Math.ceil(extractedKeywords.length / updatedExperience.length)

        for (let i = 0; i < updatedExperience.length; i++) {
          if (updatedExperience[i].description) {
            let enhancedDescription = updatedExperience[i].description
            const startIdx = i * keywordsPerEntry
            const endIdx = Math.min(startIdx + keywordsPerEntry, extractedKeywords.length)
            const keywordsForThisEntry = extractedKeywords.slice(startIdx, endIdx)

            for (const keyword of keywordsForThisEntry) {
              if (!enhancedDescription.toLowerCase().includes(keyword.toLowerCase())) {
                // Add keyword if not already present
                if (Math.random() > 0.5) {
                  enhancedDescription = enhancedDescription.replace(/\.$/, `. Utilized ${keyword} to improve outcomes.`)
                } else {
                  enhancedDescription = enhancedDescription.replace(
                    /\.$/,
                    `. Applied ${keyword} skills to solve complex problems.`,
                  )
                }
              }
            }

            updatedExperience[i].description = enhancedDescription
          }
        }

        updateExperience(updatedExperience)
      }

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setOptimizationComplete(true)
      setStep(3)
    } catch (error) {
      console.error("Error optimizing resume:", error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const resetAndClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      setJobDescription("")
      setExtractedKeywords([])
      setOptimizationComplete(false)
      setStep(1)
    }, 300)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2" variant="outline">
        <Target className="h-4 w-4 text-blue-500" />
        Target Job Keywords
      </Button>

      <Dialog open={isOpen} onOpenChange={resetAndClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              Target Job Keywords
            </DialogTitle>
          </DialogHeader>

          {step === 1 && (
            <>
              <div className="space-y-4 my-4">
                <p className="text-sm text-muted-foreground">
                  Paste a job description below to analyze and extract important keywords. We'll help you optimize your
                  resume to match the job requirements.
                </p>

                <Textarea
                  placeholder="Paste job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={resetAndClose}>
                  Cancel
                </Button>
                <Button
                  onClick={analyzeJobDescription}
                  disabled={isAnalyzing || jobDescription.trim().length < 20}
                  className="gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Analyze Job Description
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-4 my-4">
                <p className="text-sm text-muted-foreground">
                  We've identified the following keywords from the job description. Your resume will be optimized to
                  include these keywords where appropriate.
                </p>

                <div className="border rounded-md p-4 bg-muted/20">
                  <h3 className="font-medium mb-3">Extracted Keywords:</h3>
                  <div className="flex flex-wrap gap-2">
                    {extractedKeywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-900/30">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={optimizeResume}
                  disabled={isOptimizing || extractedKeywords.length === 0}
                  className="gap-2"
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4" />
                      Optimize Resume
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}

          {step === 3 && (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto bg-green-100 dark:bg-green-900/30 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-medium">Optimization Complete!</h3>
              <p className="text-muted-foreground">
                Your resume has been optimized to include the targeted keywords. This will help your resume pass through
                Applicant Tracking Systems (ATS) and increase your chances of getting an interview.
              </p>
              <Button onClick={resetAndClose} className="mt-4">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
