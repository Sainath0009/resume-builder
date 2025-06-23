"use client"

import { useState, useCallback } from "react"
import { Button } from "./ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"

/**
 * MagicWriter: Corrects grammar, spelling, and improves ATS-friendliness
 * without adding new content or extra lines.
 */
export function MagicWriter({ text, onEnhance }) {
  const [isEnhancing, setIsEnhancing] = useState(false)

  const handleEnhance = useCallback(async () => {
    if (!text || text.trim().length < 10) {
      toast.error("Minimum 10 characters required for enhancement")
      return
    }

    setIsEnhancing(true)
    const loadingToast = toast.loading("Enhancing text...")

    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Enhancement failed")
      }

      onEnhance(data.result)
      toast.success("Text optimized successfully!", { id: loadingToast })
    } catch (err) {
      console.error("Enhance error:", err)
      toast.error("AI failed — fallback applied", { id: loadingToast })
      onEnhance(applyLocalEnhancements(text))
    } finally {
      setIsEnhancing(false)
    }
  }, [text, onEnhance])

  const applyLocalEnhancements = (rawText) => {
    const corrections = [
      [/\bi\b/g, "I"],
      [/\bi'm\b/gi, "I am"],
      [/\bdon't\b/gi, "do not"],
      [/\bcan't\b/gi, "cannot"],
      [/\bdefinately\b/gi, "definitely"],
      [/\brecieve\b/gi, "receive"],
      [/\bresponsable\b/gi, "responsible"],
      [/\bteh\b/gi, "the"],

      // ATS-friendly replacements
      [/worked on/gi, "developed"],
      [/made/gi, "created"],
      [/helped/gi, "contributed to"],
      [/used/gi, "utilized"],
      [/did/gi, "executed"],
      [/team player/gi, "collaborated in cross-functional teams"],
      [/responsible for/gi, "accountable for"],
      [/in charge of/gi, "led"],
    ]

    let enhanced = rawText
    corrections.forEach(([pattern, replacement]) => {
      enhanced = enhanced.replace(pattern, replacement)
    })

    // Capitalize sentence starts
    enhanced = enhanced.replace(/(^\w|\.\s+\w)/g, s => s.toUpperCase())

    // Keep formatting as original (no new lines)
    return enhanced.trim()
  }

  return (
    <Button
      onClick={handleEnhance}
      disabled={isEnhancing || !text || text.length < 10}
      size="sm"
      className="gap-2 mt-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md transition-all"
      aria-label="Enhance resume text"
    >
      {isEnhancing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2">Enhancing...</span>
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
