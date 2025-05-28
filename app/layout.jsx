import "./globals.css"
import { Inter } from "next/font/google"
import { ResumeProvider } from "../context/resume-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { MainNav } from "../components/main-nav"
import {Footer} from "../components/footer"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ResumAI",
  description: "ResumAI – Create Intelligent, Impactful Resumes Powered by AI",
  icons: {
    icon: "/logo.png",
  },
};


export default function RootLayout({ children }) {
  return (<ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-teal-600 hover:bg-teal-700 text-white",
          footerActionLink: "text-teal-600 hover:text-teal-700",
        },
      }}
    > 
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
         <MainNav />
            <ResumeProvider>
              {children}
            
            </ResumeProvider>
          <Footer />
       
      </body>
    </html>
    </ClerkProvider>
  );
}
