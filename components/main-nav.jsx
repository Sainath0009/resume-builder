"use client"

import { useState } from "react"
import Link from "next/link"
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Menu, X, FileText } from "lucide-react"
import { Button} from "../components/ui/button"

export function MainNav() {
  const { isSignedIn, isLoaded } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* <Logo size="md" /> */}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/#features">
              <Button variant="ghost" className="text-zinc-600 hover:text-zinc-900">
                Features
              </Button>
            </Link>
            <Link href="/#templates">
              <Button variant="ghost" className="text-zinc-600 hover:text-zinc-900">
                Templates
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" className="text-zinc-600 hover:text-zinc-900">
                Pricing
              </Button>
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {!isLoaded ? (
              <div className="flex space-x-3">
                <div className="h-9 w-20 bg-zinc-200 rounded animate-pulse" />
                <div className="h-9 w-20 bg-zinc-200 rounded animate-pulse" />
              </div>
            ) : isSignedIn ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <Button variant="ghost" className="font-medium">
                    <FileText className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <UserButton afterSignOutUrl="/" userProfileMode="navigation" userProfileUrl="/user-profile" />
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link href="/sign-in">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/#features" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Features
                </Button>
              </Link>
              <Link href="/#templates" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Templates
                </Button>
              </Link>
              <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Pricing
                </Button>
              </Link>
            </nav>

            <div className="pt-4 border-t space-y-3">
              {isSignedIn ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      <FileText className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex justify-center">
                    <UserButton afterSignOutUrl="/" userProfileMode="navigation" userProfileUrl="/user-profile" />
                  </div>
                </>
              ) : (
                <>
                  <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Get Started</Button>
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
