"use client"

import { useState, useEffect } from "react"
import { useResumeContext } from "../../context/resume-provider"
import { Input} from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertCircle, Plus, Trash, CalendarIcon } from "lucide-react"
import { MagicWriter } from "../magic-writer"
import { format } from "date-fns"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"

const initialExperience = {
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
}

export default function ExperienceForm({ validationErrors = [] }) {
  const { resumeData, updateExperience } = useResumeContext()
  const [experienceList, setExperienceList] = useState(
    resumeData.experience.length > 0 ? resumeData.experience : [initialExperience]
  )
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (resumeData.experience.length > 0) {
      setExperienceList(resumeData.experience)
    }
  }, [resumeData.experience])

  const validateField = (name, value) => {
    if ((name === "company" || name === "position") && !value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
    }
    return ""
  }

  const updateExperienceList = (updatedList) => {
    setExperienceList(updatedList)
    updateExperience(updatedList)
  }

  const handleChange = (index, e) => {
    const { name, value } = e.target
    const updatedList = [...experienceList]
    updatedList[index] = { ...updatedList[index], [name]: value }
    updateExperienceList(updatedList)

    if (errors[index]?.[name]) {
      setErrors(prev => ({
        ...prev,
        [index]: { ...prev[index], [name]: "" }
      }))
    }
  }

  const handleDateChange = (index, name, date) => {
    const formattedDate = date ? format(date, "yyyy-MM") : ""
    const updatedList = [...experienceList]
    updatedList[index] = { ...updatedList[index], [name]: formattedDate }
    updateExperienceList(updatedList)
  }

  const handleBlur = (index, e) => {
    const { name, value } = e.target
    const fieldError = validateField(name, value)

    setErrors(prev => ({
      ...prev,
      [index]: { ...prev[index], [name]: fieldError || undefined }
    }))
  }

  const handleCheckboxChange = (index, checked) => {
    const updatedList = [...experienceList]
    updatedList[index] = {
      ...updatedList[index],
      current: checked,
      endDate: checked ? "" : updatedList[index].endDate,
    }
    updateExperienceList(updatedList)
  }

  const handleEnhance = (index, enhancedText) => {
    const updatedList = [...experienceList]
    updatedList[index] = { ...updatedList[index], description: enhancedText }
    updateExperienceList(updatedList)
  }

  const addExperience = () => updateExperienceList([...experienceList, initialExperience])

  const removeExperience = (index) => {
    const updatedList = experienceList.filter((_, i) => i !== index)
    updateExperienceList(updatedList)
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[index]
      return newErrors
    })
  }

  const renderDatePicker = (index, name, label, disabled = false) => (
    <div className="space-y-2">
      <Label htmlFor={`${name}-${index}`}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !experienceList[index][name] && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {disabled ? (
              <span>Present</span>
            ) : experienceList[index][name] ? (
              format(new Date(experienceList[index][name]), "MMM yyyy")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <DayPicker
            mode="single"
            selected={experienceList[index][name] ? new Date(experienceList[index][name]) : undefined}
            onSelect={(date) => handleDateChange(index, name, date)}
            fromYear={1960}
            toYear={name === "endDate" ? new Date().getFullYear() + 5 : new Date().getFullYear()}
            captionLayout="dropdown"
            initialFocus
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  )

  const renderInputField = (index, name, label, required = false) => (
    <div className="space-y-2">
      <Label htmlFor={`${name}-${index}`} className="flex items-center">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={`${name}-${index}`}
        name={name}
        value={experienceList[index][name]}
        onChange={(e) => handleChange(index, e)}
        onBlur={(e) => handleBlur(index, e)}
        placeholder={label}
        className={errors[index]?.[name] ? "border-red-500" : ""}
        required={required}
      />
      {errors[index]?.[name] && <p className="text-sm text-red-500">{errors[index][name]}</p>}
    </div>
  )

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="px-0">
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc pl-5">
                {validationErrors.map((error, i) => <li key={i}>{error}</li>)}
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
              {renderInputField(index, "company", "Company", true)}
              {renderInputField(index, "position", "Position", true)}
              {renderInputField(index, "location", "Location")}
              
              <div className="grid grid-cols-2 gap-2">
                {renderDatePicker(index, "startDate", "Start Date")}
                {renderDatePicker(index, "endDate", "End Date", experience.current)}
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
                onEnhance={(enhancedText) => handleEnhance(index, enhancedText)}
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