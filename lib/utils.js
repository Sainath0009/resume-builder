import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Disabled AI features (code preserved for future use)
export const aiFeatures = {
  enabled: false,

  // AI-powered resume suggestions
  suggestImprovements: async (text) => {
    if (!aiFeatures.enabled) return null

    // This would normally call an AI service
    console.log("AI suggestion requested for:", text)
    return "This is a placeholder for AI-powered suggestions."
  },

  // AI-powered auto-fill
  autoFillFromUpload: async (file) => {
    if (!aiFeatures.enabled) return null

    // This would normally process an uploaded resume/CV
    console.log("AI auto-fill requested for file:", file.name)
    return {
      personal: {
        name: "AI Generated Name",
        email: "ai@example.com",
        // other fields would be filled here
      },
      // other sections would be filled here
    }
  },

  // AI-powered skill extraction
  extractSkillsFromDescription: (description) => {
    if (!aiFeatures.enabled) return []

    // This would normally analyze text and extract skills
    console.log("AI skill extraction requested for:", description)
    return ["Placeholder Skill 1", "Placeholder Skill 2"]
  },
}
