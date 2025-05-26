"use client"
import { motion } from "framer-motion";
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Download, Users, Zap, Star, Sparkles, SlidersHorizontal, Layers, CheckCircle2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { templates } from "../lib/templates"
import {
  containerVariants,
  itemVariants,
  slideInLeft,
  slideInRight,
  fadeIn
} from "../lib/motion"


export default function Home() {

  const scrollToTemplates = () => {
    const templatesSection = document.getElementById("templates");
    if (templatesSection) {
      templatesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen from-zinc-100 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-2 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="transform -translate-y-10"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-teal-100 text-teal-800 hover:bg-teal-200 border-0">
                New AI-Powered Features
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent"
            >
              Craft Your Perfect Resume
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-zinc-600 mb-8 leading-relaxed"
            >
              Stand out from the crowd with professionally designed templates and AI-powered content suggestions.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/builder" passHref>
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
                  Get Started <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-zinc-300"
                onClick={scrollToTemplates}
              >
                View Templates
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center mt-8 space-x-1 text-zinc-600"
            >
              <CheckCircle2 className="h-5 w-5 text-teal-600" />
              <span className="text-sm">No credit card required</span>
              <span className="mx-2">•</span>
              <CheckCircle2 className="h-5 w-5 text-teal-600" />
              <span className="text-sm">Free PDF downloads</span>
              <span className="mx-2">•</span>
              <CheckCircle2 className="h-5 w-5 text-teal-600" />
              <span className="text-sm">ATS-friendly</span>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="relative pl-4 lg:pl-6"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative z-10 w-[380px] rounded-2xl overflow-hidden shadow-lg border border-zinc-200 ml-4" // Changed from 450px to 380px
            >
              <Image
                src="https://cdn.enhancv.com/images/1098/i/aHR0cHM6Ly9jZG4uZW5oYW5jdi5jb20vcHJlZGVmaW5lZC1leGFtcGxlcy92S09jYmlpSlhTeTdHdDhmdXFZSUpXdW1VYnVyU2RsR0UyYmgyR3p6L2ltYWdlLnBuZw~~.png"
                alt="Resume Preview"
                width={380}
                height={507}
                className="w-full h-auto object-cover"
              />
            </motion.div>

            {/* Floating Icons - Simplified */}
            <motion.div
              variants={slideInLeft}
              className="absolute top-6 -left-[40px] z-20 bg-white rounded-lg shadow-sm p-2 border border-zinc-100" // Reduced padding and adjusted position
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> {/* Smaller icon */}
                <span className="text-xs font-medium text-zinc-700">AI Magic</span> {/* Smaller text */}
              </div>
            </motion.div>

            <motion.div
              variants={slideInRight}
              className="absolute top-1/3 right-20 z-20"
            >
              <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl p-4 border border-white/30 duration-300 hover:scale-105 w-40">
                <div className="flex items-center space-x-2 mb-2">
                  <SlidersHorizontal className="h-5 w-5 text-indigo-500" />
                  <span className="text-xs font-semibold text-zinc-700">Customize Style</span>
                </div>

                {/* Color Palettes */}
                <div className="mb-3">
                  <p className="text-[10px] uppercase font-medium text-zinc-500 mb-1">Colors</p> {/* Smaller text */}
                  <div className="flex space-x-1">
                    <div className="w-5 h-5 rounded-full bg-teal-600 cursor-pointer border-2 border-white shadow-sm hover:scale-110 transition-transform"></div>
                    <div className="w-5 h-5 rounded-full bg-green-600 cursor-pointer border-2 border-white shadow-sm hover:scale-110 transition-transform"></div>
                    <div className="w-5 h-5 rounded-full bg-amber-500 cursor-pointer border-2 border-white shadow-sm hover:scale-110 transition-transform"></div>
                    <div className="w-5 h-5 rounded-full bg-indigo-600 cursor-pointer border-2 border-white shadow-sm hover:scale-110 transition-transform"></div>
                  </div>
                </div>

                {/* Font Options */}
                <div>
                  <p className="text-[10px] uppercase font-medium text-zinc-500 mb-1">Fonts</p> {/* Smaller text */}
                  <div className="space-y-0.5">
                    <div className="text-xs font-sans cursor-pointer hover:text-indigo-600">Sans Serif</div>
                    <div className="text-xs font-serif cursor-pointer hover:text-indigo-600">Serif</div>
                    <div className="text-xs font-mono cursor-pointer hover:text-indigo-600">Monospace</div>
                    <div className="text-xs font-handwriting cursor-pointer hover:text-indigo-600">Handwriting</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={slideInRight}
              className="absolute bottom-6 left-[340px] z-20 bg-white rounded-lg shadow-sm p-2 border border-zinc-100" // Adjusted position and padding
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-teal-500" /> {/* Smaller icon */}
                <span className="text-xs font-medium text-zinc-700">Resume Ready</span> {/* Smaller text */}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-zinc-50"
        id="features"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-800 border-0 hover:bg-amber-200">Powerful Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Create a Standout Resume</h2>
            <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
              Our platform combines beautiful design with powerful AI tools to help you create a resume that gets
              noticed.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Sparkles className="h-6 w-6 text-teal-600" />,
                title: "AI Content Suggestions",
                description: "Get smart suggestions for your job descriptions, skills, and achievements.",
                color: "bg-teal-100",
              },
              {
                icon: <Layers className="h-6 w-6 text-amber-600" />,
                title: "Beautiful Templates",
                description: "Choose from dozens of professionally designed templates that are ATS-friendly.",
                color: "bg-amber-100",
              },
              {
                icon: <Download className="h-6 w-6 text-rose-600" />,
                title: "Easy Export",
                description: "Download your resume as a PDF or share it online with a custom link.",
                color: "bg-rose-100",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-zinc-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Process Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <Badge className="mb-4 bg-rose-100 text-rose-800 hover:bg-rose-200 border-0">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Create Your Resume in 3 Steps</h2>
            <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
              Quick and straightforward resume creation.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-200 -translate-y-1/2 hidden md:block"></div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
            >
              {[1, 2, 3].map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center mb-4 mx-auto">
                    {step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">
                    {step === 1 && "Fill Information"}
                    {step === 2 && "Choose Design"}
                    {step === 3 && "Download"}
                  </h3>
                  <p className="text-zinc-600 text-center">
                    {step === 1 && "Enter your details to get started."}
                    {step === 2 && "Select from professional templates."}
                    {step === 3 && "Export your resume as PDF."}
                  </p>
                </motion.div>
              ))}

            </motion.div>
          </div>
        </div>
      </motion.section>
      <motion.section
        className="py-20 bg-zinc-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.3
            }
          }
        }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            variants={{
              hidden: { opacity: 1 },
              visible: { opacity: 1 }
            }}
          >
            {[
              { icon: <Users className="h-8 w-8" />, number: "50,000+", label: "Resumes Created" },
              { icon: <Star className="h-8 w-8" />, number: "4.9/5", label: "User Rating" },
              { icon: <Zap className="h-8 w-8" />, number: "95%", label: "Success Rate" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: { type: "spring", stiffness: 100 }
                  }
                }}
              >
                <motion.div
                  className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 text-teal-600"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div
                  className="text-3xl font-bold text-zinc-900 mb-2"
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {stat.number}
                </motion.div>
                <motion.div
                  className="text-zinc-600"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
      {/* Templates Section with Redesigned Cards */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20"
        id="templates"
      >
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
      </motion.section>



      {/* CTA Section */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Your Resume?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join professionals who landed their dream jobs with our builder.
            </p>
            <Link href="/builder" passHref>
              <Button size="lg" className="bg-white text-teal-600 hover:bg-zinc-100">
                Get Started for Free <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

          </div>
        </div>
      </motion.section>
    </div>
  )
} 