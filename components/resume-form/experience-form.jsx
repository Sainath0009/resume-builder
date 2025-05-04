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
  const { resumeData, updateExperience, updateSkills } = useResumeContext()
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
  const [aiSuggestions, setAiSuggestions] = useState({})
  const [loadingSuggestions, setLoadingSuggestions] = useState({})

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

    // Remove any AI suggestions for this index
    const updatedSuggestions = { ...aiSuggestions }
    delete updatedSuggestions[index]
    setAiSuggestions(updatedSuggestions)
  }

  const getAISuggestion = async (index) => {
    const description = experienceList[index].description

    if (!description || description.length < 10) {
      setAiSuggestions({
        ...aiSuggestions,
        [index]: "Please add more details to your description to get AI suggestions.",
      })
      return
    }

    setLoadingSuggestions({
      ...loadingSuggestions,
      [index]: true,
    })

    try {
      const suggestion = await aiFeatures.suggestImprovements(description)

      setAiSuggestions({
        ...aiSuggestions,
        [index]: suggestion,
      })
    } catch (error) {
      console.error("Error getting AI suggestion:", error)
      setAiSuggestions({
        ...aiSuggestions,
        [index]: "Failed to get AI suggestions. Please try again.",
      })
    } finally {
      setLoadingSuggestions({
        ...loadingSuggestions,
        [index]: false,
      })
    }
  }

  const extractSkills = useCallback(
    (index) => {
      const description = experienceList[index].description
      if (!description) return "No description provided."

      const extractedSkills = aiFeatures.extractSkillsFromDescription(description)

      if (extractedSkills && extractedSkills.length > 0) {
        const currentTechnicalSkills = resumeData.skills.technical || []

        // Filter out skills that are already in the list
        const newSkills = extractedSkills.filter((skill) => !currentTechnicalSkills.includes(skill))

        if (newSkills.length > 0) {
          updateSkills({
            technical: [...currentTechnicalSkills, ...newSkills],
          })

          return `Added ${newSkills.length} skills: ${newSkills.join(", ")}`
        } else {
          return "No new skills found in your description."
        }
      } else {
        return "No skills detected in your description."
      }
    },
    [resumeData.skills.technical, updateSkills, experienceList],
  )

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
                <div className="flex gap-2">
                  <MagicWriter
                    text={experience.description}
                    onEnhance={(enhancedText) => handleEnhanceDescription(index, enhancedText)}
                    label="✨ Magic Writer"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-blue-600 dark:text-blue-400"
                    onClick={() => getAISuggestion(index)}
                    disabled={loadingSuggestions[index]}
                  >
                    {loadingSuggestions[index] ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Getting suggestions...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" />
                        Get AI suggestions
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <Textarea
                id={`description-${index}`}
                name="description"
                value={experience.description}
                onChange={(e) => handleChange(index, e)}
                placeholder="Describe your responsibilities, achievements, and technologies used"
                rows={4}
              />

              {aiSuggestions[index] && (
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-md">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 dark:text-blue-300">{aiSuggestions[index]}</p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 px-2"
                          onClick={() => {
                            const result = extractSkills(index)
                            setAiSuggestions({
                              ...aiSuggestions,
                              [index]: result,
                            })
                          }}
                        >
                          Extract Skills
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 px-2"
                          onClick={() => {
                            const updatedSuggestions = { ...aiSuggestions }
                            delete updatedSuggestions[index]
                            setAiSuggestions(updatedSuggestions)
                          }}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
