"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"

/**
 * AI-Powered Resume Enhancer - Optimizes text for ATS systems and professional impact
 */
export function MagicWriter({ text, onEnhance }) {
  const [isEnhancing, setIsEnhancing] = useState(false)

  const handleEnhance = async () => {
    if (!text || text.trim().length < 10) {
      toast.error("Minimum 10 characters required for enhancement")
      return
    }

    setIsEnhancing(true)
    const loadingToast = toast.loading("Optimizing content with AI...")

    try {
      // Enhanced API request with better error handling
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Transform this resume text to be ATS-optimized with professional language, action verbs, and quantifiable achievements. 
                Requirements:
                1. Use power verbs: orchestrated, spearheaded, optimized
                2. Include metrics (%, $, numbers)
                3. Apply ATS keywords from the job description
                4. Maintain original meaning
                5. Return only enhanced text
                
                Text to enhance: "${text}"`
              }]
            }],
            generationConfig: {
              temperature: 0.2,
              topP: 0.8,
              topK: 40
            }
          })
        }
      )

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || `API error: ${response.status}`)
      }

      const enhancedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      if (!enhancedText) throw new Error("No enhanced content returned")

      onEnhance(enhancedText)
      toast.success("Resume professionally enhanced!", { id: loadingToast })
    } catch (error) {
      console.error("AI Enhancement error:", error)
      toast.error("AI service unavailable - using standard enhancement", { id: loadingToast })
      onEnhance(applyLocalEnhancements(text))
    } finally {
      setIsEnhancing(false)
    }
  }

  // Optimized local enhancement with ATS keywords
  const applyLocalEnhancements = (text) => {
    const transformations = [
      // Grammar fixes
      [/\bi\b/g, "I"],
      [/\bi'm\b/gi, "I am"],
      [/\bim\b/gi, "I am"],
      [/\bdon't\b/gi, "do not"],
      [/\bcan't\b/gi, "cannot"],
      
      // ATS action verbs
      [/worked on/g, "developed"],
      [/made/g, "created"],
      [/did/g, "implemented"],
      [/helped/g, "collaborated on"],
      [/used/g, "utilized"],
      [/good/g, "exceptional"],
      [/team player/g, "cross-functional collaborator"],
      [/responsible for/g, "accountable for"],
      [/in charge of/g, "oversaw"],
      
      // Quantification injection
      [/improved/g, "improved by 25%"],
      [/increased/g, "increased by 30%"],
      [/reduced/g, "reduced by 20%"],
      [/saved/g, "saved $"],
      [/managed/g, "managed team of "],
      
      // Professional phrases
      [/problem solving/g, "complex problem resolution"],
      [/hard worker/g, "results-driven professional"],
      [/quick learner/g, "rapid skill acquisition"],
    ]

    let enhanced = text
    transformations.forEach(([regex, replacement]) => {
      enhanced = enhanced.replace(regex, replacement)
    })

    // Ensure professional formatting
    enhanced = enhanced.replace(/(^|[.!?]\s+)([a-z])/g, (m) => m.toUpperCase())
    if (!enhanced.endsWith(".")) enhanced += "."

    return enhanced
  }

  return (
    <Button
      onClick={handleEnhance}
      disabled={isEnhancing || !text || text.length < 10}
      size="sm"
      className="gap-2 mt-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md transition-all"
      aria-label="Enhance text with AI"
    >
      {isEnhancing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2">Optimizing...</span>
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          <span className="ml-2">AI Enhance</span>
        </>
      )}
    </Button>
  )
}