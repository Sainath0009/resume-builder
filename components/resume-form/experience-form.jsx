"use client"

import { useState, useEffect } from "react"
import { useResumeContext } from "../../context/resume-provider"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertCircle, Plus, Trash } from "lucide-react"
import { aiFeatures } from "../../lib/utils"
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

  useEffect(() => {
    if (resumeData.experience.length > 0) {
      setExperienceList(resumeData.experience)
    }
  }, [resumeData.experience])

  const handleChange = (index, e) => {
    const { name, value } = e.target
    const updatedList = [...experienceList]
    updatedList[index] = {
      ...updatedList[index],
      [name]: value,
    }
    setExperienceList(updatedList)

    // Update context in real-time for live preview
    updateExperience(updatedList)
  }

  const handleCheckboxChange = (index, checked) => {
    const updatedList = [...experienceList]
    updatedList[index] = {
      ...updatedList[index],
      current: checked,
      endDate: checked ? "" : updatedList[index].endDate,
    }
    setExperienceList(updatedList)

    // Update context in real-time for live preview
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

      {experienceList.map((experience, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
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
                  placeholder="Example Corp"
                  required
                />
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
                  placeholder="Software Engineer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`location-${index}`}>Location</Label>
                <Input
                  id={`location-${index}`}
                  name="location"
                  value={experience.location}
                  onChange={(e) => handleChange(index, e)}
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
                    disabled={experience.current}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id={`current-${index}`}
                checked={experience.current}
                onCheckedChange={(checked) => {
                  handleCheckboxChange(index, checked)
                }}
              />
              <Label htmlFor={`current-${index}`}>I currently work here</Label>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor={`description-${index}`}>Description</Label>
              </div>
              <Textarea
                id={`description-${index}`}
                name="description"
                value={experience.description}
                onChange={(e) => handleChange(index, e)}
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
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={addExperience} className="w-full mt-2">
        <Plus className="h-4 w-4 mr-2" /> Add Experience
      </Button>
    </div>
  )
}
