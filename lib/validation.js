export function validateResumeData(data, activeTab) {
  const errors = {}

  // Validate personal information
  if (!activeTab || activeTab === "personal") {
    const personalErrors = []

    if (!data.personal.name) {
      personalErrors.push("Full name is required")
    }

    if (!data.personal.email) {
      personalErrors.push("Email address is required")
    } else if (!isValidEmail(data.personal.email)) {
      personalErrors.push("Please enter a valid email address")
    }

    if (data.personal.phone && !isValidPhone(data.personal.phone)) {
      personalErrors.push("Please enter a valid phone number")
    }

    if (data.personal.website && !isValidUrl(data.personal.website)) {
      personalErrors.push("Please enter a valid website URL")
    }

    if (data.personal.linkedin && !isValidUrl(data.personal.linkedin)) {
      personalErrors.push("Please enter a valid LinkedIn URL")
    }

    if (data.personal.github && !isValidUrl(data.personal.github)) {
      personalErrors.push("Please enter a valid GitHub URL")
    }

    if (personalErrors.length > 0) {
      errors.personal = personalErrors
    }
  }

  // Validate education
  if (!activeTab || activeTab === "education") {
    const educationErrors = []

    // Only validate if there's at least one education entry
    if (data.education.length > 0) {
      const firstEducation = data.education[0]

      if (firstEducation.institution || firstEducation.degree || firstEducation.field) {
        // If any field is filled, validate required fields
        if (!firstEducation.institution) {
          educationErrors.push("Institution name is required")
        }

        if (!firstEducation.degree) {
          educationErrors.push("Degree is required")
        }
      }
    }

    if (educationErrors.length > 0) {
      errors.education = educationErrors
    }
  }

  // Validate experience
  if (!activeTab || activeTab === "experience") {
    const experienceErrors = []

    // Only validate if there's at least one experience entry
    if (data.experience.length > 0) {
      const firstExperience = data.experience[0]

      if (firstExperience.company || firstExperience.position || firstExperience.description) {
        // If any field is filled, validate required fields
        if (!firstExperience.company) {
          experienceErrors.push("Company name is required")
        }

        if (!firstExperience.position) {
          experienceErrors.push("Position is required")
        }
      }
    }

    if (experienceErrors.length > 0) {
      errors.experience = experienceErrors
    }
  }

  return errors
}

// Helper validation functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPhone(phone) {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
  return phoneRegex.test(phone)
}

function isValidUrl(url) {
  try {
    // Check if it's a valid URL or a partial URL (without protocol)
    new URL(url.startsWith("http") ? url : `https://${url}`)
    return true
  } catch (e) {
    return false
  }
}
