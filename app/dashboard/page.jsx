"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Plus, FileText, Clock, Star, Download, Edit, Trash2, ChevronRight } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { toast } from "sonner"
import { Badge } from "../../components/ui/badge"

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
    if (isSignedIn && user) {
      const savedResumes = localStorage.getItem(`resumes_${user.id}`)
      if (savedResumes) {
        setResumes(JSON.parse(savedResumes))
      } else {
        const defaultResumes = [
          {
            id: "resume-1",
            title: "Software Engineer Resume",
            lastUpdated: new Date().toISOString(),
            template: "modern",
            data: {
              personal: {
                name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Your Name",
                email: user.emailAddresses?.[0]?.emailAddress || "",
              },
            },
          },
        ]
        setResumes(defaultResumes)
        localStorage.setItem(`resumes_${user.id}`, JSON.stringify(defaultResumes))
      }
    }
  }, [isSignedIn, user])

  const deleteResume = (resumeId) => {
    if (!user) return
    const updatedResumes = resumes.filter((resume) => resume.id !== resumeId)
    setResumes(updatedResumes)
    localStorage.setItem(`resumes_${user.id}`, JSON.stringify(updatedResumes))
    toast.success("Resume deleted successfully")
  }

  const downloadResume = (resume) => {
    toast.success(`Downloading ${resume.title}...`)
    // PDF generation would go here
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600" />
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-zinc-600 mb-8">Please sign in to access your dashboard.</p>
        <Link href="/">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">Go Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <Badge className="mb-2 bg-teal-100 text-teal-800 hover:bg-teal-200 border-0">
              Welcome back
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Your Resumes, <span className="text-teal-600">{user?.firstName || "User"}</span>
            </h1>
            <p className="text-zinc-500 mt-2">
              {resumes.length} {resumes.length === 1 ? "resume" : "resumes"} in your collection
            </p>
          </div>
          <Link href="/builder">
            <Button className="gap-2 bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="h-4 w-4" /> Create New
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <Card key={resume.id} className="group overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold line-clamp-1">{resume.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1 text-sm">
                    <Clock className="mr-1 h-3 w-3" />
                    Updated {new Date(resume.lastUpdated).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-amber-500"
                  onClick={() => toast.info("Feature coming soon!")}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="relative h-40 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-lg overflow-hidden flex items-center justify-center">
                <FileText className="h-12 w-12 text-zinc-300" />
                <div className="absolute inset-0 bg-teal-600/5 group-hover:bg-teal-600/10 transition-colors" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Link href={`/builder?resume=${resume.id}`} className="w-full">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Edit className="h-4 w-4" /> Edit
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="gap-2"
                  onClick={() => downloadResume(resume)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => deleteResume(resume.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}

        {/* Create New Resume Card */}
        <Link href="/builder">
          <Card className="h-full border-2 border-dashed border-zinc-200 bg-zinc-50 hover:border-teal-300 hover:bg-teal-50/50 transition-colors flex flex-col items-center justify-center p-8 text-center group">
            <div className="bg-teal-100/50 group-hover:bg-teal-100 rounded-full p-4 mb-4 transition-colors">
              <Plus className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-zinc-800">New Resume</h3>
            <p className="text-sm text-zinc-500">Start from scratch or use a template</p>
            <div className="mt-4 flex items-center text-teal-600 text-sm font-medium">
              Get started <ChevronRight className="ml-1 h-4 w-4" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Empty State */}
      {resumes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-zinc-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">No resumes yet</h3>
          <p className="text-zinc-500 mb-6 max-w-md">
            You haven't created any resumes yet. Get started by creating your first professional resume.
          </p>
          <Link href="/builder">
            <Button className="gap-2 bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="h-4 w-4" /> Create Resume
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}