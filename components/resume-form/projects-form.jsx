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
export default function ProjectsForm({ validationErrors = [] }) {
  const { resumeData, updateProjects } = useResumeContext()
  const [projectsList, setProjectsList] = useState(
    resumeData.projects.length > 0
      ? resumeData.projects
      : [
          {
            name: "",
            description: "",
            technologies: "",
            link: "",
            startDate: "",
            endDate: "",
          },
        ],
  )

  useEffect(() => {
    if (resumeData.projects.length > 0) {
      setProjectsList(resumeData.projects)
    }
  }, [resumeData.projects])

  const handleChange = (index, e) => {
    const { name, value } = e.target
    const updatedList = [...projectsList]
    updatedList[index] = {
      ...updatedList[index],
      [name]: value,
    }
    setProjectsList(updatedList)

    // Update context in real-time for live preview
    updateProjects(updatedList)
  }

  const handleEnhanceDescription = (index, enhancedText) => {
    const updatedList = [...projectsList]
    updatedList[index] = {
      ...updatedList[index],
      description: enhancedText,
    }
    setProjectsList(updatedList)
    updateProjects(updatedList)
  }

  const addProject = () => {
    const updatedList = [
      ...projectsList,
      {
        name: "",
        description: "",
        technologies: "",
        link: "",
        startDate: "",
        endDate: "",
      },
    ]
    setProjectsList(updatedList)
    updateProjects(updatedList)
  }

  const removeProject = (index) => {
    const updatedList = projectsList.filter((_, i) => i !== index)
    setProjectsList(updatedList)
    updateProjects(updatedList)
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Projects</CardTitle>
        <CardDescription>Add your personal or professional projects to showcase your skills</CardDescription>
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
        {projectsList.map((project, index) => (
          <div key={index} className="mb-8 border-b pb-6 last:border-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Project #{index + 1}</h3>
              {projectsList.length > 1 && (
                <Button variant="destructive" size="sm" onClick={() => removeProject(index)}>
                  <Trash className="h-4 w-4 mr-1" /> Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${index}`}>Project Name</Label>
                <Input
                  id={`name-${index}`}
                  name="name"
                  value={project.name}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Portfolio Website"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`technologies-${index}`}>Technologies Used</Label>
                <Input
                  id={`technologies-${index}`}
                  name="technologies"
                  value={project.technologies}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`link-${index}`}>Project Link</Label>
                <Input
                  id={`link-${index}`}
                  name="link"
                  value={project.link}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="https://github.com/username/project"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                  <Input
                    id={`startDate-${index}`}
                    name="startDate"
                    type="month"
                    value={project.startDate}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${index}`}>End Date</Label>
                  <Input
                    id={`endDate-${index}`}
                    name="endDate"
                    type="month"
                    value={project.endDate}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Textarea
                id={`description-${index}`}
                name="description"
                value={project.description}
                onChange={(e) => handleChange(index, e)}
                placeholder="Describe the project, its purpose, and your role"
                rows={3}
              />
              <MagicWriter
                text={project.description}
                onEnhance={(enhancedText) => handleEnhanceDescription(index, enhancedText)}
                label="✨ Enhance with AI"
                inline={true}
              />
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addProject} className="w-full mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </CardContent>
    </Card>
  )
}
