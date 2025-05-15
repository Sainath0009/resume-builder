"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Download,SlidersHorizontal, Sparkles, Layers, CheckCircle2, ArrowRight, FileText, Wand2, Palette, Check } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { templates } from "../lib/templates"

export default function Home() {
  const [activeTemplate, setActiveTemplate] = useState("modern")

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      {/* Hero Section */}

      {/* Background Elements
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"> sda</div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-100 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/3"></div>
      </div> */}

      <div className="container mx-auto px-4 py-12">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
    <div>
      <Badge className="mb-4 bg-teal-100 text-teal-800 hover:bg-teal-200 border-0">
        New AI-Powered Features
      </Badge>
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
        Craft Your Perfect Resume
      </h1>
      <p className="text-xl text-zinc-600 mb-8 leading-relaxed">
        Stand out from the crowd with professionally designed templates and AI-powered content suggestions that
        help you land your dream job.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
          Get Started <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline" className="border-zinc-300">
          View Templates
        </Button>
      </div>

      <div className="flex items-center mt-8 space-x-1 text-zinc-600">
        <CheckCircle2 className="h-5 w-5 text-teal-600" />
        <span className="text-sm">No credit card required</span>
        <span className="mx-2">•</span>
        <CheckCircle2 className="h-5 w-5 text-teal-600" />
        <span className="text-sm">Free PDF downloads</span>
        <span className="mx-2">•</span>
        <CheckCircle2 className="h-5 w-5 text-teal-600" />
        <span className="text-sm">ATS-friendly</span>
      </div>
    </div>

    {/* Image Section with padding-left and margin-left */}
    <div className="relative pl-4 lg:pl-8">
      <div className="relative z-10 w-[450px] rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 hover:shadow-3xl transition-shadow duration-300 ml-4">
        <Image
          src="https://cdn.enhancv.com/images/1098/i/aHR0cHM6Ly9jZG4uZW5oYW5jdi5jb20vcHJlZGVmaW5lZC1leGFtcGxlcy92S09jYmlpSlhTeTdHdDhmdXFZSUpXdW1VYnVyU2RsR0UyYmgyR3p6L2ltYWdlLnBuZw~~.png"
          alt="Resume Preview"
          width={450}
          height={600}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Floating Icons */}
    
<div className="absolute top-6 -left-[50px] z-20 backdrop-blur-md bg-white/60 rounded-xl shadow-xl p-4 border border-white/30 animate-float-slow transition-all duration-300 hover:scale-105">
  <div className="flex items-center space-x-2">
    <Sparkles className="h-7 w-7 text-amber-500" />
    <span className="text-sm font-medium text-zinc-700">AI Magic</span>
  </div>
</div>
<div className="absolute top-1/3 -right-10 z-20 backdrop-blur-md bg-white/70 rounded-2xl shadow-xl p-5 border border-white/30 animate-float-slow transition-all duration-300 hover:scale-105 w-48">
  <div className="flex items-center space-x-2 mb-3">
    <SlidersHorizontal className="h-7 w-7 text-indigo-500" />
    <span className="text-sm font-semibold text-zinc-700">Customize Style</span>
  </div>

  {/* Color Palettes */}
  <div className="mb-4">
    <p className="text-xs uppercase font-medium text-zinc-500 mb-2">Colors</p>
    <div className="flex space-x-2">
      <div className="w-6 h-6 rounded-full bg-teal-600 cursor-pointer border-2 border-white shadow-sm hover:scale-110 transition-transform"></div>
      <div className="w-6 h-6 rounded-full bg-green-600 cursor-pointer border-2 border-white shadow-sm hover:scale-110 transition-transform"></div>
      <div className="w-6 h-6 rounded-full bg-amber-500 cursor-pointer border-2 border-white shadow-sm hover:scale-110 transition-transform"></div>
      <div className="w-6 h-6 rounded-full bg-indigo-600 cursor-pointer border-2 border-white shadow-sm hover:scale-110 transition-transform"></div>
    </div>
  </div>

  {/* Font Options */}
  <div>
    <p className="text-xs uppercase font-medium text-zinc-500 mb-2">Fonts</p>
    <div className="space-y-1">
      <div className="text-sm font-sans cursor-pointer hover:text-indigo-600">Sans Serif</div>
      <div className="text-sm font-serif cursor-pointer hover:text-indigo-600">Serif</div>
      <div className="text-sm font-mono cursor-pointer hover:text-indigo-600">Monospace</div>
      <div className="text-sm font-handwriting cursor-pointer hover:text-indigo-600">Handwriting</div>
    </div>
  </div>
</div>

<div className="absolute bottom-6 left-[430px] z-20 backdrop-blur-md bg-white/60 rounded-xl shadow-xl p-4 border border-white/30 animate-fade-glow transition-all duration-300 hover:scale-105">
  <div className="flex items-center space-x-2">
    <CheckCircle2 className="h-7 w-7 text-teal-500" />
    <span className="text-sm font-medium text-zinc-700">Resume Ready</span>
  </div>
</div>

    </div>
  </div>
</div>



      {/* Features Section */}
      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">Powerful Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Create a Standout Resume</h2>
            <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
              Our platform combines beautiful design with powerful AI tools to help you create a resume that gets
              noticed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Content Suggestions</h3>
                <p className="text-zinc-600">
                  Get smart suggestions for your job descriptions, skills, and achievements that make your experience
                  shine.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <Layers className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Beautiful Templates</h3>
                <p className="text-zinc-600">
                  Choose from dozens of professionally designed templates that are ATS-friendly and customizable.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Export</h3>
                <p className="text-zinc-600">
                  Download your resume as a PDF, share it online, or print it directly from our platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-rose-100 text-rose-800 hover:bg-rose-200 border-0">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Create Your Resume in 3 Easy Steps</h2>
            <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
              Our intuitive platform makes resume creation quick and painless.
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-200 -translate-y-1/2 hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center mb-4 mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Fill Your Information</h3>
                <p className="text-zinc-600 text-center">
                  Enter your details or import from LinkedIn to get started quickly.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center mb-4 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Choose Your Design</h3>
                <p className="text-zinc-600 text-center">
                  Select from our professional templates and customize colors and fonts.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center mb-4 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Download & Share</h3>
                <p className="text-zinc-600 text-center">
                  Export your resume as a PDF or share it online with a custom link.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section - Minimalist Gallery */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-medium mb-8 text-center">Choose Your Perfect Template</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-zinc-200 transition-all duration-300 hover:shadow-md">
                  <Image
                    src={template.thumbnail || "/placeholder.svg"}
                    alt={template.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>

                  <div className="absolute bottom-0 left-0 right-0 bg-white p-3 border-t border-zinc-100">
                    <h3 className="font-medium">{template.name}</h3>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link href={`/builder?template=${template.id}`}>
                      <Button variant="secondary" className="bg-white shadow-sm">
                        Use Template
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Your Resume?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who have successfully landed their dream jobs with our resume builder.
            </p>
            <Button size="lg" className="bg-white text-teal-600 hover:bg-zinc-100">
              Get Started for Free <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}