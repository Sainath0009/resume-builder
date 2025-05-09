"use client"

import { useState, useEffect } from "react"
import { useResumeContext } from "../context/resume-provider"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { Palette, Type } from "lucide-react"
import { toast } from "sonner"

// Available color schemes
const colorSchemes = [
  { id: "blue", name: "Blue", primary: "bg-blue-600", secondary: "bg-blue-100", text: "text-blue-600" },
  { id: "green", name: "Green", primary: "bg-green-600", secondary: "bg-green-100", text: "text-green-600" },
  { id: "purple", name: "Purple", primary: "bg-purple-600", secondary: "bg-purple-100", text: "text-purple-600" },
  { id: "red", name: "Red", primary: "bg-red-600", secondary: "bg-red-100", text: "text-red-600" },
  { id: "gray", name: "Gray", primary: "bg-gray-600", secondary: "bg-gray-100", text: "text-gray-600" },
  { id: "teal", name: "Teal", primary: "bg-teal-600", secondary: "bg-teal-100", text: "text-teal-600" },
  { id: "amber", name: "Amber", primary: "bg-amber-600", secondary: "bg-amber-100", text: "text-amber-600" },
  { id: "indigo", name: "Indigo", primary: "bg-indigo-600", secondary: "bg-indigo-100", text: "text-indigo-600" },
]

// Available fonts
const fontOptions = [
  { id: "sans", name: "Sans", class: "font-sans" },
  { id: "serif", name: "Serif", class: "font-serif" },
  { id: "mono", name: "Mono", class: "font-mono" },
]

export function TemplateCustomizer() {
  const { resumeData, setResumeData } = useResumeContext()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(resumeData.themeColor || "blue")
  const [selectedFont, setSelectedFont] = useState(resumeData.themeFont || "sans")
  const [activeTab, setActiveTab] = useState("colors")

  // Initialize theme settings from resumeData if they exist
  useEffect(() => {
    if (resumeData.themeColor) {
      setSelectedColor(resumeData.themeColor)
    }
    if (resumeData.themeFont) {
      setSelectedFont(resumeData.themeFont)
    }
  }, [resumeData.themeColor, resumeData.themeFont])

  const handleSaveTheme = () => {
    setResumeData((prev) => ({
      ...prev,
      themeColor: selectedColor,
      themeFont: selectedFont,
    }))

    toast.success("Template customization saved")
    setIsOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" size="sm" className="gap-2">
        <Palette className="h-4 w-4" />
        Customize Template
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Customize Template</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="colors" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="fonts" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Fonts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {colorSchemes.map((color) => (
                  <div
                    key={color.id}
                    className={`cursor-pointer rounded-md p-1 transition-all ${
                      selectedColor === color.id ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                    onClick={() => setSelectedColor(color.id)}
                  >
                    <div className={`${color.primary} h-12 rounded-md`}>
                      <div className={`${color.secondary} h-6 rounded-t-md`}></div>
                    </div>
                    <p className="text-xs text-center mt-1">{color.name}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-muted/30 rounded-md">
                <p className="text-sm text-muted-foreground">
                  The selected color scheme will be applied to your resume template, including headings, borders, and
                  accent elements.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="fonts" className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {fontOptions.map((font) => (
                  <div
                    key={font.id}
                    className={`cursor-pointer rounded-md p-4 transition-all ${font.class} ${
                      selectedFont === font.id
                        ? "ring-2 ring-primary ring-offset-2 bg-primary/5"
                        : "border hover:bg-muted/30"
                    }`}
                    onClick={() => setSelectedFont(font.id)}
                  >
                    <h3 className="text-lg font-semibold">The quick brown fox</h3>
                    <p className="text-sm text-muted-foreground">
                      This is how your text will appear in the {font.name} font family.
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-muted/30 rounded-md">
                <p className="text-sm text-muted-foreground">
                  The selected font will be applied to all text in your resume. Choose a font that best represents your
                  professional style.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTheme}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
