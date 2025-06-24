"use client"

import { useState, useEffect } from "react"
import { useResumeContext } from "../../context/resume-provider"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
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

const initialEducation = {
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  description: "",
}

export default function EducationForm({ validationErrors = [] }) {
  const { resumeData, updateEducation } = useResumeContext()
  const [educationList, setEducationList] = useState(
    resumeData.education.length > 0 ? resumeData.education : [initialEducation]
  )
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (resumeData.education.length > 0) {
      setEducationList(resumeData.education)
    }
  }, [resumeData.education])

  const validateField = (name, value) => {
    if ((name === "institution" || name === "degree") && !value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
    }
    return ""
  }

  const updateEducationList = (updatedList) => {
    setEducationList(updatedList)
    updateEducation(updatedList)
  }

  const handleChange = (index, e) => {
    const { name, value } = e.target
    const updatedList = [...educationList]
    updatedList[index] = { ...updatedList[index], [name]: value }
    updateEducationList(updatedList)

    if (errors[index]?.[name]) {
      setErrors(prev => ({
        ...prev,
        [index]: { ...prev[index], [name]: "" }
      }))
    }
  }

  const handleDateChange = (index, name, date) => {
    const formattedDate = date ? format(date, "yyyy-MM") : ""
    const updatedList = [...educationList]
    updatedList[index] = { ...updatedList[index], [name]: formattedDate }
    updateEducationList(updatedList)
  }

  const handleBlur = (index, e) => {
    const { name, value } = e.target
    const fieldError = validateField(name, value)

    setErrors(prev => ({
      ...prev,
      [index]: { ...prev[index], [name]: fieldError || undefined }
    }))
  }

  const handleEnhance = (index, enhancedText) => {
    const updatedList = [...educationList]
    updatedList[index] = { ...updatedList[index], description: enhancedText }
    updateEducationList(updatedList)
  }

  const addEducation = () => updateEducationList([...educationList, initialEducation])

  const removeEducation = (index) => {
    const updatedList = educationList.filter((_, i) => i !== index)
    updateEducationList(updatedList)
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[index]
      return newErrors
    })
  }

  const renderDatePicker = (index, name, label) => (
    <div className="space-y-2">
      <Label htmlFor={`${name}-${index}`}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn(
            "w-full justify-start text-left font-normal",
            !educationList[index][name] && "text-muted-foreground"
          )}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {educationList[index][name] 
              ? format(new Date(educationList[index][name]), "MMM yyyy") 
              : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <DayPicker
            mode="single"
            selected={educationList[index][name] ? new Date(educationList[index][name]) : undefined}
            onSelect={(date) => handleDateChange(index, name, date)}
            fromYear={1960}
            toYear={name === "endDate" ? new Date().getFullYear() + 5 : new Date().getFullYear()}
            captionLayout="dropdown"
            initialFocus
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
        value={educationList[index][name]}
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
              {renderInputField(index, "institution", "Institution", true)}
              {renderInputField(index, "degree", "Degree", true)}
              {renderInputField(index, "field", "Field of Study")}
              
              <div className="grid grid-cols-2 gap-2">
                {renderDatePicker(index, "startDate", "Start Date")}
                {renderDatePicker(index, "endDate", "End Date")}
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
                onEnhance={(enhancedText) => handleEnhance(index, enhancedText)}
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