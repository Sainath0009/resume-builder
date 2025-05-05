"use client"

import { useState, useEffect } from "react"
import { useResumeContext } from "../../context/resume-provider"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertCircle, Plus, Trash } from "lucide-react"
import { MagicWriter } from "../magic-writer"


export default function EducationForm({ validationErrors = [] }) {
  const { resumeData, updateEducation } = useResumeContext()
  const [educationList, setEducationList] = useState(
    resumeData.education.length > 0
      ? resumeData.education
      : [
          {
            institution: "",
            degree: "",
            field: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ],
  )
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (resumeData.education.length > 0) {
      setEducationList(resumeData.education)
    }
  }, [resumeData.education])

  const validateField = (name, value, index) => {
    if (name === "institution" || name === "degree") {
      if (!value.trim()) {
        return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
      }
    }
    return ""
  }

  const handleChange = (index, e) => {
    const { name, value } = e.target
    const updatedList = [...educationList]
    updatedList[index] = {
      ...updatedList[index],
      [name]: value,
    }
    setEducationList(updatedList)

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
    updateEducation(updatedList)
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

  const handleEnhanceDescription = (index, enhancedText) => {
    const updatedList = [...educationList]
    updatedList[index] = {
      ...updatedList[index],
      description: enhancedText,
    }
    setEducationList(updatedList)
    updateEducation(updatedList)
  }

  const addEducation = () => {
    const updatedList = [
      ...educationList,
      {
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]
    setEducationList(updatedList)
    updateEducation(updatedList)
  }

  const removeEducation = (index) => {
    const updatedList = educationList.filter((_, i) => i !== index)
    setEducationList(updatedList)
    updateEducation(updatedList)

    // Remove errors for this index
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[index]
      return newErrors
    })
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Education</CardTitle>
        <CardDescription>Add your educational background, including degrees and certifications</CardDescription>
      </CardHeader>
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

        {educationList.map((education, index) => (
          <div key={index} className="mb-8 border-b pb-6 last:border-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Education #{index + 1}</h3>
              {educationList.length > 1 && (
                <Button variant="destructive" size="sm" onClick={() => removeEducation(index)}>
                  <Trash className="h-4 w-4 mr-1" /> Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`institution-${index}`} className="flex items-center">
                  Institution <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id={`institution-${index}`}
                  name="institution"
                  value={education.institution}
                  onChange={(e) => handleChange(index, e)}
                  onBlur={(e) => handleBlur(index, e)}
                  placeholder="University of Example"
                  className={errors[index]?.institution ? "border-red-500" : ""}
                  required
                />
                {errors[index]?.institution && <p className="text-sm text-red-500">{errors[index].institution}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`degree-${index}`} className="flex items-center">
                  Degree <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id={`degree-${index}`}
                  name="degree"
                  value={education.degree}
                  onChange={(e) => handleChange(index, e)}
                  onBlur={(e) => handleBlur(index, e)}
                  placeholder="Bachelor of Science"
                  className={errors[index]?.degree ? "border-red-500" : ""}
                  required
                />
                {errors[index]?.degree && <p className="text-sm text-red-500">{errors[index].degree}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`field-${index}`}>Field of Study</Label>
                <Input
                  id={`field-${index}`}
                  name="field"
                  value={education.field}
                  onChange={(e) => handleChange(index, e)}
                  onBlur={(e) => handleBlur(index, e)}
                  placeholder="Computer Science"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                  <Input
                    id={`startDate-${index}`}
                    name="startDate"
                    type="month"
                    value={education.startDate}
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
                    value={education.endDate}
                    onChange={(e) => handleChange(index, e)}
                    onBlur={(e) => handleBlur(index, e)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Textarea
                id={`description-${index}`}
                name="description"
                value={education.description}
                onChange={(e) => handleChange(index, e)}
                onBlur={(e) => handleBlur(index, e)}
                placeholder="Relevant coursework, achievements, or activities"
                rows={3}
              />
              <MagicWriter
                text={education.description}
                onEnhance={(enhancedText) => handleEnhanceDescription(index, enhancedText)}
                label="✨ Enhance with AI"
                inline={true}
              />
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addEducation} className="w-full mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Education
        </Button>
      </CardContent>
    </Card>
  )
}
