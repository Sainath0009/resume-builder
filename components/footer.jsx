"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Github, Twitter, Linkedin, Heart, FileInput } from "lucide-react"
import { Button } from "./ui/button"

export function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-200">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Link
                href="/"
                className="flex items-center space-x-2 group transition-all active:scale-95"
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-teal-100 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center justify-center h-9 w-9 rounded-lg bg-teal-600 text-white group-hover:bg-teal-700 transition-colors">
                    <FileInput className="h-5 w-5" />
                  </div>
                </div>
                <span className="text-xl font-bold text-zinc-800 group-hover:text-teal-700 transition-colors">
                  Resum<span className="text-teal-600">AI</span>
                </span>
              </Link>
            </div>
            <p className="text-zinc-600 mb-6 leading-relaxed">
              Create professional resumes with AI assistance. Stand out and land your dream job faster.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-teal-600 hover:bg-teal-50">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-teal-600 hover:bg-teal-50">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-teal-600 hover:bg-teal-50">
                <Github className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/builder" className="text-zinc-600 hover:text-teal-600 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-teal-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-zinc-600 hover:text-teal-600 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-teal-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-zinc-600 hover:text-teal-600 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-teal-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/examples" className="text-zinc-600 hover:text-teal-600 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-teal-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Examples
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-zinc-600 hover:text-teal-600 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-teal-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-zinc-600 hover:text-teal-600 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-teal-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Resume Guides
                </Link>
              </li>
              <li>
                <Link href="/career-advice" className="text-zinc-600 hover:text-teal-600 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-teal-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Career Advice
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-zinc-600 hover:text-teal-600 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-teal-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3 text-zinc-600">
              <li className="flex items-start space-x-3">
                <Mail className="h-4 w-4 mt-0.5 text-teal-600" />
                <span>support@resumai.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-4 w-4 mt-0.5 text-teal-600" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5 text-teal-600" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-zinc-200/50 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-zinc-500 mb-4 md:mb-0 flex items-center">
              © {new Date().getFullYear()} ResumAI. Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for job seekers.
            </p>
            
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <Link href="/privacy" className="text-zinc-500 hover:text-teal-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-zinc-500 hover:text-teal-600 transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-zinc-500 hover:text-teal-600 transition-colors">
                Cookies
              </Link>
              <Link href="/legal" className="text-zinc-500 hover:text-teal-600 transition-colors">
                Legal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}