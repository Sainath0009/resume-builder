"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Badge } from "./ui/badge"
import { Sparkles, Check, X, Loader2, Wand2 } from "lucide-react"
import { Progress } from "./ui/progress"
import { aiService } from "../lib/utils"

/**
 * Magic Writer - AI Text Enhancer
 * Transform your resume instantly with AI-powered rewriting in one click
 */
export function MagicWriter({ text, onEnhance, inline = false, label = "✨ Magic Writer" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [enhancedText, setEnhancedText] = useState("")
  const [selectedTone, setSelectedTone] = useState("professional")
  const [error, setError] = useState(null)
  const [diffHighlight, setDiffHighlight] = useState([])
  const [progress, setProgress] = useState(0)
  const [showEnhanced, setShowEnhanced] = useState(false)

  // One-click enhancement function
  const handleOneClickEnhance = async () => {
    if (!text || text.trim().length < 10) {
      setError("Please provide more text to enhance (at least 10 characters).")
      return
    }

    setIsLoading(true)
    setError(null)
    setProgress(0)
    setShowEnhanced(false)

    try {
      // Simulate text analysis progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.floor(Math.random() * 15)
        })
      }, 200)

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Clear the interval
      clearInterval(progressInterval)
      setProgress(100)

      // Generate enhanced text based on selected tone
      const enhanced = await aiService.enhanceText(text, selectedTone)
      setEnhancedText(enhanced)

      // Generate diff highlights
      const diffResult = generateDiffHighlight(text, enhanced)
      setDiffHighlight(diffResult)

      setShowEnhanced(true)
    } catch (err) {
      setError(err.message || "Failed to enhance text. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = () => {
    if (enhancedText) {
      onEnhance(enhancedText)
      setShowEnhanced(false)
      setEnhancedText("")
      setDiffHighlight([])
    }
  }

  // Generate diff highlights between original and enhanced text
  const generateDiffHighlight = (original, enhanced) => {
    if (!original || !enhanced) return []

    const words1 = original.split(/\s+/)
    const words2 = enhanced.split(/\s+/)

    const result = []
    let i = 0,
      j = 0

    while (i < words2.length) {
      if (
        j < words1.length &&
        words2[i].toLowerCase().replace(/[.,!?;:]/g, "") === words1[j].toLowerCase().replace(/[.,!?;:]/g, "")
      ) {
        // Words match
        result.push({ text: words2[i], highlight: false })
        i++
        j++
      } else {
        // Words don't match - this is likely a change
        result.push({ text: words2[i], highlight: true })
        i++
        // Skip words in original text until we find a match or run out
        let found = false
        let lookahead = 1
        while (j + lookahead < words1.length && lookahead < 3 && !found) {
          if (
            words2[i] &&
            words1[j + lookahead] &&
            words2[i].toLowerCase().replace(/[.,!?;:]/g, "") ===
              words1[j + lookahead].toLowerCase().replace(/[.,!?;:]/g, "")
          ) {
            j = j + lookahead
            found = true
          }
          lookahead++
        }
        if (!found && i < words2.length) {
          j++
        }
      }
    }

    return result
  }

  // Render the highlighted text with changes emphasized
  const renderHighlightedText = () => {
    if (!diffHighlight || diffHighlight.length === 0) return enhancedText

    return (
      <span>
        {diffHighlight.map((item, index) => (
          <span
            key={index}
            className={
              item.highlight
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-0.5 rounded"
                : ""
            }
          >
            {item.text}
            {index < diffHighlight.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    )
  }

  // Inline version (for use directly in forms)
  if (inline) {
    return (
      <div className="mt-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-blue-600 dark:text-blue-400 h-7 px-2 text-xs"
            onClick={handleOneClickEnhance}
            disabled={isLoading || !text || text.length < 10}
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
            {label}
          </Button>

          <Tabs defaultValue="professional" value={selectedTone} onValueChange={setSelectedTone} className="h-7">
            <TabsList className="h-7 p-0">
              <TabsTrigger value="professional" className="text-xs h-7 px-2">
                Professional
              </TabsTrigger>
              <TabsTrigger value="ats" className="text-xs h-7 px-2">
                ATS
              </TabsTrigger>
              <TabsTrigger value="confident" className="text-xs h-7 px-2">
                Confident
              </TabsTrigger>
              <TabsTrigger value="formal" className="text-xs h-7 px-2">
                Formal
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading && (
          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-md">
            <div className="flex flex-col items-center gap-2 w-full justify-center py-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-800 dark:text-blue-300">Enhancing your text...</span>
              </div>
              <Progress value={progress} className="w-full h-1" />
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="mt-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {showEnhanced && enhancedText && !isLoading && (
          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-md animate-fade-in">
            <div className="flex items-start gap-2">
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline" className="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900">
                    AI Enhanced
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full"
                      onClick={() => setShowEnhanced(false)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Dismiss</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full text-green-600"
                      onClick={handleAccept}
                    >
                      <Check className="h-3 w-3" />
                      <span className="sr-only">Accept</span>
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-300">{renderHighlightedText()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Dialog version (for more complex interactions)
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1 text-blue-600 dark:text-blue-400"
        onClick={() => setIsOpen(true)}
        disabled={!text || text.length < 10}
      >
        <Wand2 className="h-3 w-3" />
        {label}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Magic Writer - One-Click Text Enhancement
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <p className="text-sm text-muted-foreground">
              Instantly enhance your resume text with AI. Choose a tone and click "Enhance" to improve grammar, clarity,
              and professionalism.
            </p>

            <div className="flex justify-between items-center">
              <Tabs defaultValue="professional" value={selectedTone} onValueChange={setSelectedTone}>
                <TabsList>
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                  <TabsTrigger value="ats">ATS-Optimized</TabsTrigger>
                  <TabsTrigger value="confident">Confident</TabsTrigger>
                  <TabsTrigger value="formal">Formal</TabsTrigger>
                </TabsList>
              </Tabs>

              <Button onClick={handleOneClickEnhance} disabled={isLoading || !text} className="gap-2">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Enhance Text
              </Button>
            </div>

            <div className="p-4 border rounded-md bg-muted/30">
              <h4 className="text-sm font-medium mb-2">Original Text</h4>
              <p className="text-sm">{text || "No text provided."}</p>
            </div>

            {isLoading ? (
              <div className="p-6 border rounded-md bg-blue-50 dark:bg-blue-950/30">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                  <p className="text-blue-800 dark:text-blue-300">Enhancing your text...</p>
                  <div className="w-full max-w-xs">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-center mt-1 text-muted-foreground">{progress}%</p>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="p-4 border rounded-md bg-red-50 dark:bg-red-950/30">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : enhancedText ? (
              <div className="p-4 border rounded-md bg-blue-50 dark:bg-blue-950/30">
                <h4 className="text-sm font-medium mb-2">Enhanced Text</h4>
                <p className="text-sm">{renderHighlightedText()}</p>
              </div>
            ) : null}

            <div className="p-4 border rounded-md bg-muted/30">
              <h4 className="text-sm font-medium mb-2">What Magic Writer Improves:</h4>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>Fixes grammar and sentence structure</li>
                <li>Improves clarity and professionalism</li>
                <li>Optimizes for ATS and recruiter readability</li>
                <li>Adjusts tone based on your selection</li>
                <li>Enhances impact of your achievements</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAccept} disabled={isLoading || !enhancedText}>
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
