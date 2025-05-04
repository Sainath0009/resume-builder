import "./globals.css"
import { Inter } from "next/font/google"
import { ResumeProvider } from "../context/resume-provider"
import { ToastProvider } from "../hooks/use-toast"
import { Toaster } from "../components/ui/toaster"
import { ThemeProvider } from "../components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Resume Builder",
  description: "Create professional resumes with customizable templates",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <ToastProvider>
            <ResumeProvider>
              {children}
              <Toaster />
            </ResumeProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
