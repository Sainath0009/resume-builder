
import { Button } from "@/components/ui/button";
import { Download, Loader2, X, ZoomIn, ZoomOut } from "lucide-react";

export const FullScreenPreview = ({
  resumeRef,
  scale,
  setScale,
  isGeneratingPDF,
  handleDownloadPDF,
  setIsFullScreenPreview,
  renderTemplate,
}) => {
  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex items-center justify-between border-b bg-card p-4">
        <h2 className="text-xl font-semibold">Resume Preview</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-md bg-secondary px-2 py-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
              disabled={scale <= 0.5}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-sm font-medium">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setScale((prev) => Math.min(1.5, prev + 0.1))}
              disabled={scale >= 1.5}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleDownloadPDF}
            className="gap-2"
            disabled={isGeneratingPDF}
            aria-label="Download PDF"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 />
                Generating...
              </>
            ) : (
              <>
               <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullScreenPreview(false)}
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 justify-center overflow-auto bg-secondary p-8">
        <div
          className="paper-effect mx-auto bg-white transition-transform"
          style={{
            width: "210mm",
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            minHeight: "297mm",
          }}
          ref={resumeRef}
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};
