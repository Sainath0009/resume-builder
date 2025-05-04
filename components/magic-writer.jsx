"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { Sparkles, Check, X, Loader2, Wand2 } from "lucide-react"
import { Badge } from "./ui/badge"

/**
 * MagicWriter component for enhancing text with AI
 * @param {Object} props
 * @param {string} props.text - The original text to enhance
 * @param {function} props.onEnhance - Callback function when text is enhanced
 * @param {boolean} props.inline - Whether to show inline suggestions (default: false)
 * @param {string} props.label - Label for the button (default: "✨ Magic Writer")
 */
export function MagicWriter({ text, onEnhance, inline = false, label = "✨ Magic Writer" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [enhancedText, setEnhancedText] = useState("")
  const [selectedTone, setSelectedTone] = useState("professional")
  const [error, setError] = useState(null)
  const [diffHighlight, setDiffHighlight] = useState(null)

  
  const enhanceText = async (text, tone) => {
    if (!text || text.trim().length < 10) {
      throw new Error("Please provide more text to enhance (at least 10 characters).")
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock enhancement based on tone
      let result = text

      // Basic enhancements for all tones
      result = result
        .replace(/i /g, "I ")
        .replace(/\bi'm\b/gi, "I'm")
        .replace(/\bim\b/gi, "I'm")
        .replace(/\bdont\b/gi, "don't")
        .replace(/\bcant\b/gi, "can't")

      // Tone-specific enhancements
      switch (tone) {
        case "professional":
          result = result
            .replace(/worked on/gi, "developed")
            .replace(/made/gi, "created")
            .replace(/did/gi, "executed")
            .replace(/helped/gi, "collaborated")
            .replace(/used/gi, "utilized")
            .replace(/good/gi, "excellent")
            .replace(/team player/gi, "collaborative professional")
            .replace(/responsible for/gi, "led")
            .replace(/in charge of/gi, "managed")

          // Add more professional language
          if (!result.includes("successfully") && Math.random() > 0.7) {
            result = result.replace(/\. /g, " successfully. ")
          }
          break

        case "ats":
          // Add industry keywords if they don't exist
          const keywords = [
            "developed",
            "implemented",
            "managed",
            "optimized",
            "analyzed",
            "coordinated",
            "strategic",
            "cross-functional",
            "innovative",
          ]
          const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)]

          if (!keywords.some((keyword) => result.toLowerCase().includes(keyword))) {
            result = `${randomKeyword} ${result.charAt(0).toLowerCase() + result.slice(1)}`
          }

          // Add metrics if none exist
          if (!result.match(/\d+%/) && !result.match(/\d+ percent/) && Math.random() > 0.6) {
            result = result.replace(/\. /g, ", resulting in significant improvements. ")
          }
          break

        case "concise":
          // Make text more concise
          result = result
            .replace(/in order to/gi, "to")
            .replace(/due to the fact that/gi, "because")
            .replace(/at this point in time/gi, "now")
            .replace(/on a regular basis/gi, "regularly")
            .replace(/in the event that/gi, "if")
            .replace(/in the process of/gi, "currently")

          // Remove filler words
          result = result.replace(/basically |essentially |actually |really |very |quite |literally /gi, "")
          break

        case "confident":
          // Add confident language
          result = result
            .replace(/I think/gi, "I know")
            .replace(/I believe/gi, "I am confident")
            .replace(/might/gi, "will")
            .replace(/could/gi, "can")
            .replace(/tried to/gi, "successfully")
            .replace(/attempted to/gi, "accomplished")
            .replace(/helped/gi, "led")
            .replace(/participated in/gi, "drove")
            .replace(/was part of/gi, "was instrumental in")
          break
      }

      // Capitalize first letter of sentences
      result = result.replace(/(^\s*|[.!?]\s*)[a-z]/g, (match) => match.toUpperCase())

      // Ensure proper ending punctuation
      if (!result.match(/[.!?]$/)) {
        result += "."
      }

      // Generate diff highlights
      const diffResult = generateDiffHighlight(text, result)
      setDiffHighlight(diffResult)

      return result
    } catch (error) {
      throw new Error("Failed to enhance text. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Simple function to highlight differences between original and enhanced text
  const generateDiffHighlight = (original, enhanced) => {
    // This is a simplified approach - in a real app, you'd use a proper diff algorithm
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

  const handleEnhance = async () => {
    try {
      const enhanced = await enhanceText(text, selectedTone)
      setEnhancedText(enhanced)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleAccept = () => {
    if (enhancedText) {
      onEnhance(enhancedText)
      setIsOpen(false)
      setEnhancedText("")
      setDiffHighlight(null)
    }
  }

  const handleOpenChange = (open) => {
    setIsOpen(open)
    if (open) {
      handleEnhance()
    } else {
      setEnhancedText("")
      setError(null)
      setDiffHighlight(null)
    }
  }

  // Render the highlighted text with changes emphasized
  const renderHighlightedText = () => {
    if (!diffHighlight) return enhancedText

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

  if (inline) {
    // Inline suggestion UI
    return (
      <div className="mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-blue-600 dark:text-blue-400 h-7 px-2 text-xs"
          onClick={() => setIsOpen(true)}
          disabled={!text || text.length < 10}
        >
          <Wand2 className="h-3 w-3" />
          {label}
        </Button>

        {isOpen && (
          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-md animate-fade-in">
            <div className="flex items-start gap-2">
              {isLoading ? (
                <div className="flex items-center gap-2 w-full justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-800 dark:text-blue-300">Enhancing your text...</span>
                </div>
              ) : error ? (
                <div className="text-sm text-red-600 dark:text-red-400 py-2">{error}</div>
              ) : (
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
                        onClick={() => setIsOpen(false)}
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
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Modal UI
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

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Magic Writer
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="professional" value={selectedTone} onValueChange={setSelectedTone} className="mt-4">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="ats">ATS-Optimized</TabsTrigger>
              <TabsTrigger value="concise">Concise</TabsTrigger>
              <TabsTrigger value="confident">Confident</TabsTrigger>
            </TabsList>

            <TabsContent value="professional">
              <p className="text-sm text-muted-foreground mb-4">
                Enhances your text with professional language and industry-standard terminology.
              </p>
            </TabsContent>

            <TabsContent value="ats">
              <p className="text-sm text-muted-foreground mb-4">
                Optimizes your text for Applicant Tracking Systems by adding relevant keywords and metrics.
              </p>
            </TabsContent>

            <TabsContent value="concise">
              <p className="text-sm text-muted-foreground mb-4">
                Makes your text more concise by removing filler words and simplifying complex phrases.
              </p>
            </TabsContent>

            <TabsContent value="confident">
              <p className="text-sm text-muted-foreground mb-4">
                Transforms your language to sound more confident, decisive, and achievement-oriented.
              </p>
            </TabsContent>

            <div className="space-y-4 mt-2">
              <div className="p-4 border rounded-md bg-muted/30">
                <h4 className="text-sm font-medium mb-2">Original Text</h4>
                <p className="text-sm">{text || "No text provided."}</p>
              </div>

              <div className="p-4 border rounded-md bg-blue-50 dark:bg-blue-950/30">
                <h4 className="text-sm font-medium mb-2 flex items-center justify-between">
                  <span>Enhanced Text</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1"
                    onClick={handleEnhance}
                    disabled={isLoading || !text}
                  >
                    {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    Regenerate
                  </Button>
                </h4>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8 gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-800 dark:text-blue-300">Enhancing your text...</span>
                  </div>
                ) : error ? (
                  <div className="text-sm text-red-600 dark:text-red-400 py-4">{error}</div>
                ) : (
                  <p className="text-sm">{renderHighlightedText()}</p>
                )}
              </div>
            </div>
          </Tabs>

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
