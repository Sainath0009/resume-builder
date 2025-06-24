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
import { format } from "date-fns"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { cn } from "@/lib/utils"

export default function CertificationsForm({ validationErrors = [] }) {
  const { resumeData, updateCertifications } = useResumeContext()
  const [certificationsList, setCertificationsList] = useState(
    resumeData.certifications.length > 0
      ? resumeData.certifications
      : [
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
  )

  useEffect(() => {
    if (resumeData.certifications.length > 0) {
      setCertificationsList(resumeData.certifications)
    }
  }, [resumeData.certifications])

  const handleChange = (index, e) => {
    const { name, value } = e.target
    const updatedList = [...certificationsList]
    updatedList[index] = {
      ...updatedList[index],
      [name]: value,
    }
    setCertificationsList(updatedList)
    updateCertifications(updatedList)
  }

  const handleDateChange = (index, name, date) => {
    const formattedDate = date ? format(date, "yyyy-MM") : ""
    const updatedList = [...certificationsList]
    updatedList[index] = {
      ...updatedList[index],
      [name]: formattedDate,
    }
    setCertificationsList(updatedList)
    updateCertifications(updatedList)
  }

  const addCertification = () => {
    const updatedList = [
      ...certificationsList,
      {
        name: "",
        issuer: "",
        date: "",
        expiration: "",
        credentialID: "",
        url: "",
        description: "",
      },
    ]
    setCertificationsList(updatedList)
    updateCertifications(updatedList)
  }

  const removeCertification = (index) => {
    const updatedList = certificationsList.filter((_, i) => i !== index)
    setCertificationsList(updatedList)
    updateCertifications(updatedList)
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

        {certificationsList.map((certification, index) => (
          <div key={index} className="mb-8 border-b pb-6 last:border-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Certification #{index + 1}</h3>
              {certificationsList.length > 1 && (
                <Button variant="destructive" size="sm" onClick={() => removeCertification(index)}>
                  <Trash className="h-4 w-4 mr-1" /> Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${index}`}>Certification Name</Label>
                <Input
                  id={`name-${index}`}
                  name="name"
                  value={certification.name}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="AWS Certified Solutions Architect"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`issuer-${index}`}>Issuing Organization</Label>
                <Input
                  id={`issuer-${index}`}
                  name="issuer"
                  value={certification.issuer}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Amazon Web Services"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`date-${index}`}>Issue Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !certification.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {certification.date ? (
                        format(new Date(certification.date), "MMM yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <DayPicker
                      mode="single"
                      selected={certification.date ? new Date(certification.date) : undefined}
                      onSelect={(date) => handleDateChange(index, "date", date)}
                      fromYear={1960}
                      toYear={new Date().getFullYear()}
                      captionLayout="dropdown"
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`expiration-${index}`}>Expiration Date (if applicable)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !certification.expiration && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {certification.expiration ? (
                        format(new Date(certification.expiration), "MMM yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <DayPicker
                      mode="single"
                      selected={certification.expiration ? new Date(certification.expiration) : undefined}
                      onSelect={(date) => handleDateChange(index, "expiration", date)}
                      fromYear={1960}
                      toYear={new Date().getFullYear() + 10}
                      captionLayout="dropdown"
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`credentialID-${index}`}>Credential ID</Label>
                <Input
                  id={`credentialID-${index}`}
                  name="credentialID"
                  value={certification.credentialID}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="ABC123XYZ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`url-${index}`}>Credential URL</Label>
                <Input
                  id={`url-${index}`}
                  name="url"
                  value={certification.url}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="https://www.credential.net/abc123xyz"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Textarea
                id={`description-${index}`}
                name="description"
                value={certification.description}
                onChange={(e) => handleChange(index, e)}
                placeholder="Brief description of the certification and skills demonstrated"
                rows={3}
              />
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addCertification} className="w-full mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Certification
        </Button>
      </CardContent>
    </Card>
  )
}