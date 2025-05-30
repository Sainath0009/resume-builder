"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Github, Twitter, Linkedin, Heart, FileInput } from "lucide-react"
import { Button } from "./ui/button"

export function Footer() {
  return (
 <footer className="bg-zinc-50 border-t border-zinc-2000">
  <div className="container mx-auto px-4 py-16">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      
      {/* Brand Section */}
      <div>
        <Link href="/" className="flex items-center space-x-2 group mb-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-teal-100 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-center h-9 w-9 rounded-lg bg-teal-600 text-white group-hover:bg-teal-700 transition-colors">
              <FileInput className="h-5 w-5" />
            </div>
          </div>
          <span className="text-xl font-bold text-zinc-800 group-hover:text-teal-700 transition-colors">
            Resum<span className="text-teal-600">AI</span>
          </span>
        </Link>
        <p className="text-sm text-zinc-600 leading-relaxed mb-4">
          Build professional resumes in minutes with the power of AI.
        </p>
        <div className="flex space-x-4">
          {/* X logo */}
          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-teal-600 hover:bg-teal-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.36 3H21L14.25 10.19L22.5 21H16.98L11.79 14.34L5.88 21H3L10.2 13.25L2.25 3H8.01L12.75 9.19L18.36 3Z" />
            </svg>
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-teal-600 hover:bg-teal-50">
            <Linkedin className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-teal-600 hover:bg-teal-50">
            <Github className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Navigation Links */}
      <div>
        <h4 className="text-sm font-semibold text-zinc-900 uppercase mb-4">Product</h4>
        <ul className="space-y-2 text-sm text-zinc-600">
          <li><Link href="/builder" className="hover:text-teal-600">Resume Builder</Link></li>
          <li><Link href="/templates" className="hover:text-teal-600">Templates</Link></li>
          <li><Link href="/pricing" className="hover:text-teal-600">Pricing</Link></li>
          <li><Link href="/examples" className="hover:text-teal-600">Examples</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-zinc-900 uppercase mb-4">Resources</h4>
        <ul className="space-y-2 text-sm text-zinc-600">
          <li><Link href="/blog" className="hover:text-teal-600">Blog</Link></li>
          <li><Link href="/guides" className="hover:text-teal-600">Resume Guides</Link></li>
          <li><Link href="/career-advice" className="hover:text-teal-600">Career Advice</Link></li>
          <li><Link href="/faq" className="hover:text-teal-600">FAQ</Link></li>
        </ul>
      </div>

      {/* Contact Info */}
      <div>
        <h4 className="text-sm font-semibold text-zinc-900 uppercase mb-4">Contact</h4>
        <ul className="space-y-3 text-sm text-zinc-600">
          <li className="flex items-start space-x-2">
            <Mail className="h-4 w-4 text-teal-600 mt-0.5" />
            <span>support@resumai.com</span>
          </li>
          <li className="flex items-start space-x-2">
            <Phone className="h-4 w-4 text-teal-600 mt-0.5" />
            <span>0217 234 2499</span>
          </li>
          <li className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-teal-600 mt-0.5" />
            <span>
              JV7R+FG8, Vijapur Rd, Opp. SRP Camp, Soregaon,<br />
              Solapur, Maharashtra 413008
            </span>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom Footer */}
    <div className="border-t border-zinc-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
      <p className="mb-4 md:mb-0 flex items-center">
        © {new Date().getFullYear()} ResumAI. Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for job seekers.
      </p>
      <div className="flex space-x-6">
        <Link href="/privacy" className="hover:text-teal-600">Privacy</Link>
        <Link href="/terms" className="hover:text-teal-600">Terms</Link>
        <Link href="/cookies" className="hover:text-teal-600">Cookies</Link>
        <Link href="/legal" className="hover:text-teal-600">Legal</Link>
      </div>
    </div>
  </div>
</footer>
  )
}