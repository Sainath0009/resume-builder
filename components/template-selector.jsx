"use client"

import { Dialog, DialogContent } from "./ui/dialog"
import { cn } from "../lib/utils"
import Image from "next/image"
import { Check } from "lucide-react"

export function TemplateSelector({ open, onOpenChange, templates, selectedTemplate, onSelectTemplate }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all hover:shadow-md",
                selectedTemplate === template.id ? "border-primary" : "border-border hover:border-primary/50",
              )}
              onClick={() => onSelectTemplate(template.id)}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={template.thumbnail || "/placeholder.svg"}
                  alt={template.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {selectedTemplate === template.id && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                      <Check className="h-6 w-6" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-center">{template.name}</h3>
                <p className="text-center text-sm text-muted-foreground">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
