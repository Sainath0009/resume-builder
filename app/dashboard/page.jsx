"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Plus, FileText, Clock, Star, Download, Edit, Trash2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { toast } from "sonner"

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [resumes, setResumes] = useState([])

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    // Load resumes from localStorage
    if (isSignedIn && user) {
      const savedResumes = localStorage.getItem(`resumes_${user.id}`)
      if (savedResumes) {
        setResumes(JSON.parse(savedResumes))
      } else {
        // Default resumes for demo
        const defaultResumes = [
          {
            id: "resume-1",
            title: "Software Engineer Resume",
            lastUpdated: new Date().toISOString(),
            template: "modern",
            data: {
              personal: { name: user.firstName + " " + user.lastName, email: user.emailAddresses[0]?.emailAddress },
            },
          },
        ]
        setResumes(defaultResumes)
        localStorage.setItem(`resumes_${user.id}`, JSON.stringify(defaultResumes))
      }
    }
  }, [isSignedIn, user])

  const deleteResume = (resumeId) => {
    const updatedResumes = resumes.filter((resume) => resume.id !== resumeId)
    setResumes(updatedResumes)
    localStorage.setItem(`resumes_${user.id}`, JSON.stringify(updatedResumes))
    toast.success("Resume deleted successfully")
  }

  const downloadResume = (resume) => {
    toast.success(`Downloading ${resume.title}...`)
    // In a real app, this would generate and download a PDF
  }

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600" />
      </div>
    )
  }

  if (!isSignedIn) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-zinc-600 mt-1">Welcome back, {user?.firstName || "User"}</p>
        </div>
        <Link href="/builder">
          <Button className="mt-4 md:mt-0 bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Create New Resume
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <Card key={resume.id} className="overflow-hidden border hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">{resume.title}</CardTitle>
              <CardDescription className="flex items-center text-zinc-500">
                <Clock className="mr-1 h-3 w-3" />
                {new Date(resume.lastUpdated).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="h-40 bg-zinc-100 rounded-md flex items-center justify-center">
                <FileText className="h-12 w-12 text-zinc-400" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4 bg-zinc-50">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-600"
                onClick={() => toast.info("Feature coming soon!")}
              >
                <Star className="mr-1 h-4 w-4" /> Favorite
              </Button>
              <div className="flex gap-2">
                <Link href={`/builder?resume=${resume.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-1 h-4 w-4" /> Edit
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={() => downloadResume(resume)}
                >
                  <Download className="mr-1 h-4 w-4" /> Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => deleteResume(resume.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}

        {/* Create New Resume Card */}
        <Link href="/builder" className="block h-full">
          <Card className="h-full border-dashed border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-400 transition-colors flex flex-col items-center justify-center p-8 text-center">
            <Plus className="h-12 w-12 text-zinc-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Create New Resume</h3>
            <p className="text-zinc-500 text-sm">Start from scratch or use a template</p>
          </Card>
        </Link>
      </div>
    </div>
  )
}
