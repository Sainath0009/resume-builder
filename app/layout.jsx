import { useResumeContext } from "../context/resume-provider"
import { ResumeProvider } from "../context/resume-provider"
import { ToastProvider } from "../hooks/use-toast"
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
