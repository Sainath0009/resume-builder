"use client"
import { useState, useEffect } from "react"
import { useResumeContext } from "../../context/resume-provider"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertCircle } from "lucide-react"
import { MagicWriter } from "../magic-writer"

export default function PersonalInfoForm({ validationErrors = [] }) {
  const { resumeData, updatePersonalInfo } = useResumeContext()
  const [formData, setFormData] = useState(resumeData.personal)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData(resumeData.personal)
  }, [resumeData.personal])

  const validateEmail = (email) => {
    if (!email) return true // Empty is handled by required validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    if (!phone) return true // Empty is handled by required validation
    // Basic phone validation - allows various formats
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
    return phoneRegex.test(phone)
  }

  const validateUrl = (url) => {
    if (!url) return true // Empty is handled by required validation
    try {
      // Check if it's a valid URL or a partial URL (without protocol)
      new URL(url.startsWith("http") ? url : `https://${url}`)
      return true
    } catch (e) {
      return false
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }

    // Update context in real-time for live preview
    updatePersonalInfo({ [name]: value })
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    let fieldError = ""

    // Validate specific fields
    if (name === "email" && value && !validateEmail(value)) {
      fieldError = "Please enter a valid email address"
    } else if (name === "phone" && value && !validatePhone(value)) {
      fieldError = "Please enter a valid phone number"
    } else if ((name === "website" || name === "linkedin" || name === "github") && value && !validateUrl(value)) {
      fieldError = "Please enter a valid URL"
    }

    // Update errors state
    if (fieldError) {
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }))
    } else {
      // Remove error if field is now valid
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleEnhanceSummary = (enhancedText) => {
    setFormData((prev) => ({
      ...prev,
      summary: enhancedText,
    }))
    updatePersonalInfo({ summary: enhancedText })
  }

  return (
    <div className="space-y-6">
      {validationErrors.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc pl-5">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div>
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center">
              Full Name <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John Doe"
              className={errors.name ? "border-red-500" : ""}
              required
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center">
              Email <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="john.doe@example.com"
              className={errors.email ? "border-red-500" : ""}
              required
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="(123) 456-7890"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="New York, NY"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Online Presence</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="www.johndoe.com"
              className={errors.website ? "border-red-500" : ""}
            />
            {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="linkedin.com/in/johndoe"
              className={errors.linkedin ? "border-red-500" : ""}
            />
            {errors.linkedin && <p className="text-sm text-red-500">{errors.linkedin}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="github.com/johndoe"
              className={errors.github ? "border-red-500" : ""}
            />
            {errors.github && <p className="text-sm text-red-500">{errors.github}</p>}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Professional Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="summary">Summary</Label>
            <MagicWriter text={formData.summary} onEnhance={handleEnhanceSummary} label="✨ Magic Writer" />
          </div>
          <Textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Briefly describe your professional background and career goals"
            rows={5}
          />
        </div>
      </div>
    </div>
  )
}