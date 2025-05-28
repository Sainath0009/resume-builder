"use client"

import { useState, useEffect } from "react"
import { useResumeContext } from "../../context/resume-provider"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertCircle, Plus, Trash } from "lucide-react"
import { MagicWriter } from "../magic-writer"

export default function ExperienceForm({ validationErrors = [] }) {
  const { resumeData, updateExperience } = useResumeContext()
  const [experienceList, setExperienceList] = useState(
    resumeData.experience.length > 0
      ? resumeData.experience
      : [
          {
            company: "",
            position: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
          },
        ],
  )
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (resumeData.experience.length > 0) {
      setExperienceList(resumeData.experience)
    }
  }, [resumeData.experience])

  const validateField = (name, value, index) => {
    if (name === "company" || name === "position") {
      if (!value.trim()) {
        return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
      }
    }
    return ""
  }

  const handleChange = (index, e) => {
    const { name, value } = e.target
    const updatedList = [...experienceList]
    updatedList[index] = {
      ...updatedList[index],
      [name]: value,
    }
    setExperienceList(updatedList)

    // Clear error when user starts typing
    if (errors[index]?.[name]) {
      setErrors((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          [name]: "",
        },
      }))
    }

    // Update context in real-time for live preview
    updateExperience(updatedList)
  }

  const handleBlur = (index, e) => {
    const { name, value } = e.target
    const fieldError = validateField(name, value, index)

    // Update errors state
    if (fieldError) {
      setErrors((prev) => ({
        ...prev,
        [index]: {
          ...(prev[index] || {}),
          [name]: fieldError,
        },
      }))
    } else {
      // Remove error if field is now valid
      setErrors((prev) => {
        const newErrors = { ...prev }
        if (newErrors[index]) {
          delete newErrors[index][name]
          if (Object.keys(newErrors[index]).length === 0) {
            delete newErrors[index]
          }
        }
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (index, checked) => {
    const updatedList = [...experienceList]
    updatedList[index] = {
      ...updatedList[index],
      current: checked,
      endDate: checked ? "" : updatedList[index].endDate,
    }
    setExperienceList(updatedList)
    updateExperience(updatedList)
  }

  const handleEnhanceDescription = (index, enhancedText) => {
    const updatedList = [...experienceList]
    updatedList[index] = {
      ...updatedList[index],
      description: enhancedText,
    }
    setExperienceList(updatedList)
    updateExperience(updatedList)
  }

  const addExperience = () => {
    const updatedList = [
      ...experienceList,
      {
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]
    setExperienceList(updatedList)
    updateExperience(updatedList)
  }

  const removeExperience = (index) => {
    const updatedList = experienceList.filter((_, i) => i !== index)
    setExperienceList(updatedList)
    updateExperience(updatedList)

    // Remove errors for this index
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[index]
      return newErrors
    })
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="px-0">
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

        {experienceList.map((experience, index) => (
          <div key={index} className="mb-8 border-b pb-6 last:border-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
              {experienceList.length > 1 && (
                <Button variant="destructive" size="sm" onClick={() => removeExperience(index)}>
                  <Trash className="h-4 w-4 mr-1" /> Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`company-${index}`} className="flex items-center">
                  Company <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id={`company-${index}`}
                  name="company"
                  value={experience.company}
                  onChange={(e) => handleChange(index, e)}
                  onBlur={(e) => handleBlur(index, e)}
                  placeholder="Example Corp"
                  className={errors[index]?.company ? "border-red-500" : ""}
                  required
                />
                {errors[index]?.company && <p className="text-sm text-red-500">{errors[index].company}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`position-${index}`} className="flex items-center">
                  Position <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id={`position-${index}`}
                  name="position"
                  value={experience.position}
                  onChange={(e) => handleChange(index, e)}
                  onBlur={(e) => handleBlur(index, e)}
                  placeholder="Software Engineer"
                  className={errors[index]?.position ? "border-red-500" : ""}
                  required
                />
                {errors[index]?.position && <p className="text-sm text-red-500">{errors[index].position}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`location-${index}`}>Location</Label>
                <Input
                  id={`location-${index}`}
                  name="location"
                  value={experience.location}
                  onChange={(e) => handleChange(index, e)}
                  onBlur={(e) => handleBlur(index, e)}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                  <Input
                    id={`startDate-${index}`}
                    name="startDate"
                    type="month"
                    value={experience.startDate}
                    onChange={(e) => handleChange(index, e)}
                    onBlur={(e) => handleBlur(index, e)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${index}`}>End Date</Label>
                  <Input
                    id={`endDate-${index}`}
                    name="endDate"
                    type="month"
                    value={experience.endDate}
                    onChange={(e) => handleChange(index, e)}
                    onBlur={(e) => handleBlur(index, e)}
                    disabled={experience.current}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id={`current-${index}`}
                checked={experience.current}
                onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor={`current-${index}`}>I currently work here</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Textarea
                id={`description-${index}`}
                name="description"
                value={experience.description}
                onChange={(e) => handleChange(index, e)}
                onBlur={(e) => handleBlur(index, e)}
                placeholder="Describe your responsibilities, achievements, and technologies used"
                rows={4}
              />
              <MagicWriter
                text={experience.description}
                onEnhance={(enhancedText) => handleEnhanceDescription(index, enhancedText)}
                label="✨ Enhance with AI"
                inline={true}
              />
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addExperience} className="w-full mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Experience
        </Button>
      </CardContent>
    </Card>
  )
}