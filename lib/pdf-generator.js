import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

/**
 * Generates a PDF from a DOM element
 * @param {HTMLElement} element The DOM element to convert to PDF
 * @param {string} filename The name of the PDF file (without extension)
 */
export async function generatePDF(element, filename = "resume") {
  try {
    // Create a clone of the element to avoid modifying the original
    const clone = element.cloneNode(true)

    // Create a temporary container
    const container = document.createElement("div")
    container.style.position = "absolute"
    container.style.left = "-9999px"
    container.style.top = "-9999px"
    container.style.width = "210mm" // A4 width
    container.style.minHeight = "297mm" // A4 height
    container.style.background = "white"
    container.style.transform = "none" // Remove any transforms
    container.style.transformOrigin = "top left"
    container.style.overflow = "hidden"

    // Add the clone to the container
    container.appendChild(clone)

    // Add the container to the document
    document.body.appendChild(container)

    // Wait for images to load
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate canvas
    const canvas = await html2canvas(clone, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: "#ffffff",
    })

    // Calculate dimensions
    const imgWidth = 210 // mm (A4 width)
    const pageHeight = 297 // mm (A4 height)
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4")

    // Add image to PDF
    pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, 0, imgWidth, imgHeight)

    // If the content is longer than one page, add more pages
    let heightLeft = imgHeight
    let position = 0

    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save the PDF
    pdf.save(`${filename}.pdf`)

    // Clean up
    document.body.removeChild(container)
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}
