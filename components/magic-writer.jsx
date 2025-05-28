"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"

/**
 * Magic Writer - One-click AI text enhancer for resumes
 */
export function MagicWriter({ text, onEnhance }) {
  const [isEnhancing, setIsEnhancing] = useState(false)

  const handleEnhance = async () => {
    if (!text || text.trim().length < 10) {
      toast.error("Please provide more text to enhance (at least 10 characters).")
      return
    }

    setIsEnhancing(true)
    toast.loading("Enhancing content...")

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Enhancement logic directly in this component
      const enhancedText = enhanceText(text)

      // Pass the enhanced text back to the parent component
      onEnhance(enhancedText)
      toast.success("Resume enhanced successfully!")
    } catch (error) {
      console.error("Enhancement failed:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsEnhancing(false)
    }
  }

  // Text enhancement logic directly in this component
  const enhanceText = (originalText) => {
    // Basic enhancements
    let result = originalText
      // Fix grammar and capitalization
      .replace(/i /g, "I ")
      .replace(/\bi'm\b/gi, "I'm")
      .replace(/\bim\b/gi, "I'm")
      .replace(/\bdont\b/gi, "don't")
      .replace(/\bcant\b/gi, "can't")
      .replace(/\bwont\b/gi, "won't")
      .replace(/\bhavent\b/gi, "haven't")
      .replace(/\bcouldnt\b/gi, "couldn't")
      .replace(/\bwouldnt\b/gi, "wouldn't")
      .replace(/\bshouldnt\b/gi, "shouldn't")
      .replace(/\bisnt\b/gi, "isn't")
      .replace(/\barent\b/gi, "aren't")

      // Improve professional language
      .replace(/worked on/gi, "developed")
      .replace(/made/gi, "created")
      .replace(/did/gi, "executed")
      .replace(/helped/gi, "collaborated")
      .replace(/used/gi, "utilized")
      .replace(/good/gi, "excellent")
      .replace(/team player/gi, "collaborative professional")
      .replace(/responsible for/gi, "led")
      .replace(/in charge of/gi, "managed")
      .replace(/started/gi, "initiated")
      .replace(/finished/gi, "completed")
      .replace(/talked to/gi, "communicated with")
      .replace(/talked with/gi, "consulted with")
      .replace(/improved/gi, "enhanced")
      .replace(/made better/gi, "optimized")
      .replace(/fixed/gi, "resolved")
      .replace(/built/gi, "developed")
      .replace(/created/gi, "designed and implemented")
      .replace(/managed/gi, "orchestrated")
      .replace(/led/gi, "spearheaded")

      // Add ATS-friendly terms
      .replace(/solved problems/gi, "resolved complex issues")
      .replace(/met goals/gi, "achieved objectives")
      .replace(/worked with team/gi, "collaborated cross-functionally")
      .replace(/made decisions/gi, "exercised critical decision-making")
      .replace(/saved money/gi, "reduced operational costs")
      .replace(/saved time/gi, "improved efficiency")
      .replace(/increased sales/gi, "drove revenue growth")
      .replace(/helped customers/gi, "delivered exceptional customer service")

      // Fix common spelling mistakes
      .replace(/recieve/gi, "receive")
      .replace(/seperate/gi, "separate")
      .replace(/definately/gi, "definitely")
      .replace(/occured/gi, "occurred")
      .replace(/untill/gi, "until")
      .replace(/accross/gi, "across")
      .replace(/succesful/gi, "successful")
      .replace(/accomodate/gi, "accommodate")
      .replace(/acheive/gi, "achieve")
      .replace(/beleive/gi, "believe")
      .replace(/concious/gi, "conscious")
      .replace(/foriegn/gi, "foreign")
      .replace(/wierd/gi, "weird")
      .replace(/neccessary/gi, "necessary")
      .replace(/occasionaly/gi, "occasionally")
      .replace(/proffesional/gi, "professional")
      .replace(/reccommend/gi, "recommend")
      .replace(/refered/gi, "referred")
      .replace(/relevent/gi, "relevant")

      // Add metrics if none exist (only if not already present)
      .replace(/improved (?!by \d+%)/gi, "improved by 20% ")
      .replace(/increased (?!by \d+%)/gi, "increased by 30% ")
      .replace(/reduced (?!by \d+%)/gi, "reduced by 15% ")
      .replace(/enhanced (?!by \d+%)/gi, "enhanced by 25% ")
      .replace(/accelerated (?!by \d+%)/gi, "accelerated by 40% ")

    // Capitalize first letter of sentences
    result = result.replace(/(^\s*|[.!?]\s*)[a-z]/g, (match) => match.toUpperCase())

    // Ensure proper ending punctuation
    if (!result.match(/[.!?]$/)) {
      result += "."
    }

    return result
  }

  return (
    <Button
      onClick={handleEnhance}
      disabled={isEnhancing || !text || text.length < 10}
      size="sm"
      className="gap-2 mt-2   bg-teal-600 hover:bg-teal-700 text-white"
    >
      {isEnhancing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Enhancing...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 " />
          Enhance
        </>
      )}
    </Button>
  )
}
