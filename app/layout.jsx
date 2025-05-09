import "./globals.css"
import { Inter } from "next/font/google"
import { ResumeProvider } from "../context/resume-provider"


const inter = Inter({ subsets: ["latin"] })



export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        
         
            <ResumeProvider>
              {children}
              
            </ResumeProvider>
         
       
      </body>
    </html>
  )
}
