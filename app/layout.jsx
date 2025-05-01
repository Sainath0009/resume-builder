import "./globals.css"
import { ResumeProvider } from "../context/resume-provider"
import { ToastProvider } from "../hooks/use-toast"
import { Toaster } from "../components/ui/toaster"

export const metadata = {
  title: "Resume Builder",
  description: "Create professional resumes with customizable templates",
 
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <ResumeProvider>
            {children}
            <Toaster />
          </ResumeProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
