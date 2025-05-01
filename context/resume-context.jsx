"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

const defaultResumeData = {
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
  },
  education: [
    {
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
  experience: [
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
  skills: {
    technical: [],
    soft: [],
    languages: [],
  },
  projects: [
    {
      name: "",
      description: "",
      technologies: "",
      link: "",
      startDate: "",
      endDate: "",
    },
  ],
  certifications: [
    {
      name: "",
      issuer: "",
      date: "",
      expiration: "",
      credentialID: "",
      url: "",
      description: "",
    },
  ],
  selectedTemplate: "modern",
}

const ResumeContext = createContext()

export function ResumeProvider({ children }) {
  const [resumeData, setResumeData] = useState(defaultResumeData)

  useEffect(() => {
    const savedData = localStorage.getItem("resumeData")
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData))
      } catch (error) {
        console.error("Failed to parse saved resume data:", error)
      }
    }
  }, [])

  const updatePersonalInfo = (data) => {
    setResumeData((prev) => {
      const hasChanges = Object.entries(data).some(
        ([key, value]) => prev.personal[key] !== value
      )
      if (!hasChanges) return prev
      return {
        ...prev,
        personal: {
          ...prev.personal,
          ...data,
        },
      }
    })
  }

  const updateEducation = (data) => {
    setResumeData((prev) => {
      if (JSON.stringify(prev.education) === JSON.stringify(data)) return prev
      return {
        ...prev,
        education: data,
      }
    })
  }

  const updateExperience = (data) => {
    setResumeData((prev) => {
      if (JSON.stringify(prev.experience) === JSON.stringify(data)) return prev
      return {
        ...prev,
        experience: data,
      }
    })
  }

  const updateSkills = (data) => {
    setResumeData((prev) => {
      const hasChanges = Object.entries(data).some(
        ([key, value]) =>
          JSON.stringify(prev.skills[key]) !== JSON.stringify(value)
      )
      if (!hasChanges) return prev
      return {
        ...prev,
        skills: {
          ...prev.skills,
          ...data,
        },
      }
    })
  }

  const updateProjects = (data) => {
    setResumeData((prev) => {
      if (JSON.stringify(prev.projects) === JSON.stringify(data)) return prev
      return {
        ...prev,
        projects: data,
      }
    })
  }

  const updateCertifications = (data) => {
    setResumeData((prev) => {
      if (JSON.stringify(prev.certifications) === JSON.stringify(data)) return prev
      return {
        ...prev,
        certifications: data,
      }
    })
  }

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        updatePersonalInfo,
        updateEducation,
        updateExperience,
        updateSkills,
        updateProjects,
        updateCertifications,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export function useResumeContext() {
  const context = useContext(ResumeContext)
  if (context === undefined) {
    throw new Error("useResumeContext must be used within a ResumeProvider")
  }
  return context
}
