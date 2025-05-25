"use client"

import { useState } from "react"
import Link from "next/link"
import { useUser, UserButton } from "@clerk/nextjs"
import { Menu, X, FileText, FileInput, LayoutTemplate, DollarSign, Home } from "lucide-react"
import { Button } from "../components/ui/button"

export function MainNav() {
  const { isSignedIn, isLoaded } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/">
              <Button variant="ghost" className="text-zinc-600 hover:text-teal-600 hover:bg-teal-50 flex items-center gap-1 transition-colors">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/#templates">
              <Button variant="ghost" className="text-zinc-600 hover:text-teal-600 hover:bg-teal-50 flex items-center gap-1 transition-colors">
                <LayoutTemplate className="h-4 w-4" />
                Templates
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" className="text-zinc-600 hover:text-teal-600 hover:bg-teal-50 flex items-center gap-1 transition-colors">
                <DollarSign className="h-4 w-4" />
                Pricing
              </Button>
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {!isLoaded ? null : isSignedIn ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <Button variant="ghost" className="font-medium hover:text-teal-600 hover:bg-teal-50 transition-colors">
                    <FileText className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-8 w-8",
                      userButtonPopoverCard: "shadow-lg rounded-xl"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link href="/sign-in">
                  <Button variant="outline" className="border-zinc-300 hover:border-teal-400 hover:text-teal-600 transition-colors">
                    Log in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                    Create Resume
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b animate-in fade-in slide-in-from-top-2">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href="/#templates" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                  <LayoutTemplate className="h-4 w-4" />
                  Templates
                </Button>
              </Link>
              <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                  <DollarSign className="h-4 w-4" />
                  Pricing
                </Button>
              </Link>
            </nav>

            <div className="pt-4 border-t space-y-3">
              {isSignedIn ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white shadow-md hover:scale-[1.01] transition-transform">
                      <FileText className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex justify-center">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "h-10 w-10",
                          userButtonPopoverCard: "shadow-lg rounded-xl"
                        }
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-zinc-300 hover:border-teal-400 hover:text-teal-600 transition-colors">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white shadow-md hover:scale-[1.01] transition-transform">
                      Create Resume
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}