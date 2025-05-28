"use client"
import { useState, useEffect } from "react"
import { useResumeContext } from "../../context/resume-provider"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertCircle ,X } from "lucide-react"
import { Badge } from "../ui/badge"
export default function SkillsForm({ validationErrors = [] }) {
  const { resumeData, updateSkills } = useResumeContext()
  const [technicalSkill, setTechnicalSkill] = useState("")
  const [softSkill, setSoftSkill] = useState("")
  const [language, setLanguage] = useState("")
  const [technicalSkills, setTechnicalSkills] = useState(resumeData.skills.technical || [])
  const [softSkills, setSoftSkills] = useState(resumeData.skills.soft || [])
  const [languages, setLanguages] = useState(resumeData.skills.languages || [])

  useEffect(() => {
    setTechnicalSkills(resumeData.skills.technical || [])
    setSoftSkills(resumeData.skills.soft || [])
    setLanguages(resumeData.skills.languages || [])
  }, [resumeData.skills])

  const addTechnicalSkill = () => {
    if (technicalSkill.trim() !== "" && !technicalSkills.includes(technicalSkill.trim())) {
      const updatedSkills = [...technicalSkills, technicalSkill.trim()]
      setTechnicalSkills(updatedSkills)
      updateSkills({ technical: updatedSkills })
      setTechnicalSkill("")
    } else {
      setTechnicalSkill("")
    }
  }

  const addSoftSkill = () => {
    if (softSkill.trim() !== "" && !softSkills.includes(softSkill.trim())) {
      const updatedSkills = [...softSkills, softSkill.trim()]
      setSoftSkills(updatedSkills)
      updateSkills({ soft: updatedSkills })
      setSoftSkill("")
    } else {
      setSoftSkill("")
    }
  }

  const addLanguage = () => {
    if (language.trim() !== "" && !languages.includes(language.trim())) {
      const updatedLanguages = [...languages, language.trim()]
      setLanguages(updatedLanguages)
      updateSkills({ languages: updatedLanguages })
      setLanguage("")
    } else {
      setLanguage("")
    }
  }

  const removeTechnicalSkill = (index) => {
    const updatedSkills = technicalSkills.filter((_, i) => i !== index)
    setTechnicalSkills(updatedSkills)
    updateSkills({ technical: updatedSkills })
  }

  const removeSoftSkill = (index) => {
    const updatedSkills = softSkills.filter((_, i) => i !== index)
    setSoftSkills(updatedSkills)
    updateSkills({ soft: updatedSkills })
  }

  const removeLanguage = (index) => {
    const updatedLanguages = languages.filter((_, i) => i !== index)
    setLanguages(updatedLanguages)
    updateSkills({ languages: updatedLanguages })
  }

  const handleKeyDown = (e, addFunction) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addFunction()
    }
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

        <div className="space-y-6">
          <div>
            <Label htmlFor="technical-skills">Technical Skills</Label>
            <div className="flex mt-2 mb-3">
              <Input
                id="technical-skills"
                value={technicalSkill}
                onChange={(e) => setTechnicalSkill(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, addTechnicalSkill)}
                placeholder="JavaScript, React, Node.js, etc."
                className="mr-2"
              />
              <Button type="button" onClick={addTechnicalSkill}  className="bg-teal-600 hover:bg-teal-700 text-white">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {technicalSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                  <X className="h-3 w-3 ml-2 cursor-pointer" onClick={() => removeTechnicalSkill(index)} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="soft-skills">Soft Skills</Label>
            <div className="flex mt-2 mb-3">
              <Input
                id="soft-skills"
                value={softSkill}
                onChange={(e) => setSoftSkill(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, addSoftSkill)}
                placeholder="Communication, Leadership, Teamwork, etc."
                className="mr-2"
              />
              <Button type="button" onClick={addSoftSkill}  className="bg-teal-600 hover:bg-teal-700 text-white">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                  <X className="h-3 w-3 ml-2 cursor-pointer" onClick={() => removeSoftSkill(index)} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="languages">Languages</Label>
            <div className="flex mt-2 mb-3">
              <Input
                id="languages"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, addLanguage)}
                placeholder="English, Spanish, French, etc."
                className="mr-2"
              />
              <Button type="button  " className="bg-teal-600 hover:bg-teal-700 text-white" onClick={addLanguage}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {lang}
                  <X className="h-3 w-3 ml-2 cursor-pointer" onClick={() => removeLanguage(index)} />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
