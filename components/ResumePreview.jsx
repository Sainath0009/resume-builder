import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

export const ResumePreview = ({
  resumeRef,
  scale,
  setScale,
  renderTemplate,
  setIsFullScreenPreview,
}) => {
  return (
    <div className="animate-fade-in hidden lg:block lg:w-1/2">
      <div className="sticky top-20 rounded-xl border bg-card shadow-md p-5 transition-colors duration-300">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Live Preview</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
              disabled={scale <= 0.5}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-10 text-center">{Math.round(scale * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale((prev) => Math.min(1, prev + 0.1))}
              disabled={scale >= 1}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsFullScreenPreview(true)}
              className="gap-2"
              aria-label="Full screen preview"
            >
              <Maximize2 className="h-5 w-5" />
            
            </Button>
          </div>
        </div>

        <div className="relative max-h-[calc(100vh-220px)] overflow-y-auto rounded-xl bg-secondary p-4 scrollbar-hide">
          <div className="flex justify-center">
            <div
              className="bg-white shadow-xl rounded-lg transition-transform paper-effect"
              style={{
                width: "210mm",
                minHeight: "297mm",
                transform: `scale(${scale})`,
                transformOrigin: "top center",
              }}
              ref={resumeRef}
            >
              {renderTemplate()}
            </div>
          </div>
        </div>
        <div className="border-t p-2 text-center text-xs text-muted-foreground">
          <p>Scroll to navigate • Pinch or Ctrl+Scroll to zoom</p>
        </div>
      </div>
    </div>
  );
};
