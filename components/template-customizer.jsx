"use client"

import { useState, useEffect } from "react"
import { useResumeContext } from "../context/resume-provider"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { Palette, Type, LayoutPanelLeft, Contrast } from "lucide-react"
import { toast } from "sonner"
import { cn } from "../lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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

const fontOptions = [
  { id: "sans", name: "Inter", class: "font-sans" },
  { id: "serif", name: "Lora", class: "font-serif" },
  { id: "mono", name: "Roboto Mono", class: "font-mono" },
]

export function TemplateCustomizer() {
  const { resumeData, setResumeData } = useResumeContext()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(resumeData.themeColor || "teal")
  const [selectedFont, setSelectedFont] = useState(resumeData.themeFont || "sans")
  const [activeTab, setActiveTab] = useState("colors")

  useEffect(() => {
    if (resumeData.themeColor) setSelectedColor(resumeData.themeColor)
    if (resumeData.themeFont) setSelectedFont(resumeData.themeFont)
  }, [resumeData])

  const handleSaveTheme = () => {
    setResumeData(prev => ({
      ...prev,
      themeColor: selectedColor,
      themeFont: selectedFont,
    }))
    toast.success("Template customization saved")
    setIsOpen(false)
  }

  const resetToDefaults = () => {
    setSelectedColor("teal")
    setSelectedFont("sans")
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="outline" 
        size="sm" 
        className="w-full justify-start gap-2"
      >
        <Palette className="h-4 w-4" />
        Customize Design
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <AnimatePresence>
          {isOpen && (
            <DialogContent className="sm:max-w-[600px] p-0 border-none bg-transparent shadow-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-background p-6 rounded-lg shadow-lg"
              >
                <DialogHeader>
                  <DialogTitle>Customize Template Design</DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="grid grid-cols-4 gap-3"
                    >
                      {colorSchemes.map((color) => (
                        <button
                          key={color.id}
                          className={cn(
                            "group flex flex-col items-center gap-1 rounded-md p-2 transition-all",
                            selectedColor === color.id && "ring-2 ring-primary ring-offset-2"
                          )}
                          onClick={() => setSelectedColor(color.id)}
                        >
                          <div className={`${color.primary} h-10 w-full rounded-md relative overflow-hidden`}>
                            <div className={`${color.secondary} h-4 w-full absolute bottom-0`}></div>
                          </div>
                          <span className="text-sm">{color.name}</span>
                        </button>
                      ))}
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 bg-muted/30 rounded-md"
                    >
                      <p className="text-sm text-muted-foreground">
                        The selected color scheme will be applied to headings, borders, and accent elements.
                      </p>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="fonts" className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="grid grid-cols-1 gap-3"
                    >
                      {fontOptions.map((font) => (
                        <button
                          key={font.id}
                          className={cn(
                            "text-left p-4 rounded-md border transition-all",
                            font.class,
                            selectedFont === font.id
                              ? "ring-2 ring-primary ring-offset-2 bg-primary/5"
                              : "hover:bg-muted/30"
                          )}
                          onClick={() => setSelectedFont(font.id)}
                        >
                          <h3 className="text-lg font-semibold">The quick brown fox</h3>
                          <p className="text-sm text-muted-foreground">
                            {font.name} - Professional and clean
                          </p>
                        </button>
                      ))}
                    </motion.div>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="gap-2 sm:gap-0 mt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button variant="outline" onClick={resetToDefaults}>
                      Reset Defaults
                    </Button>
                  </motion.div>
                  <motion.div 
                    className="flex gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveTheme}>Apply Changes</Button>
                  </motion.div>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>
    </>
  )
}