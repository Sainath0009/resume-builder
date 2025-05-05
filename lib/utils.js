import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// AI service for resume builder
export const aiService = {
  // Enhanced text generation with different styles
  enhanceText: async (text, style = "professional") => {
    if (!text || text.trim().length < 10) {
      throw new Error("Please provide more text to enhance (at least 10 characters).")
    }

    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Basic enhancements for all styles
    let result = text
      .replace(/i /g, "I ")
      .replace(/\bi'm\b/gi, "I'm")
      .replace(/\bim\b/gi, "I'm")
      .replace(/\bdont\b/gi, "don't")
      .replace(/\bcant\b/gi, "can't")

    // Style-specific enhancements
    switch (style) {
      case "professional":
        result = result
          .replace(/worked on/gi, "developed")
          .replace(/made/gi, "created")
          .replace(/did/gi, "executed")
          .replace(/helped/gi, "collaborated")
          .replace(/used/gi, "utilized")
          .replace(/good/gi, "excellent")
          .replace(/team player/gi, "collaborative professional")
          .replace(/responsible for/gi, "led")
          .replace(/in charge of/gi, "managed")
          .replace(/started/gi, "initiated")
          .replace(/finished/gi, "completed")
          .replace(/talked to/gi, "communicated with")
          .replace(/talked with/gi, "consulted with")
          .replace(/improved/gi, "enhanced")
          .replace(/made better/gi, "optimized")

        // Add more professional language
        if (!result.includes("successfully") && Math.random() > 0.7) {
          result = result.replace(/\. /g, " successfully. ")
        }
        break

      case "ats":
        // Add industry keywords if they don't exist
        const keywords = [
          "developed",
          "implemented",
          "managed",
          "optimized",
          "analyzed",
          "coordinated",
          "strategic",
          "cross-functional",
          "innovative",
          "results-driven",
          "performance",
          "efficiency",
          "leadership",
          "collaboration",
        ]

        // Add metrics if none exist
        if (!result.match(/\d+%/) && !result.match(/\d+ percent/) && Math.random() > 0.6) {
          result = result.replace(/\. /g, ", resulting in significant improvements. ")
        }

        // Add keywords that don't already exist in the text
        for (const keyword of keywords) {
          if (!result.toLowerCase().includes(keyword.toLowerCase()) && Math.random() > 0.8) {
            const sentences = result.split(". ")
            if (sentences.length > 1) {
              const randomIndex = Math.floor(Math.random() * sentences.length)
              sentences[randomIndex] =
                `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} ${sentences[randomIndex].charAt(0).toLowerCase() + sentences[randomIndex].slice(1)}`
              result = sentences.join(". ")
            }
          }
        }
        break

      case "concise":
        // Make text more concise
        result = result
          .replace(/in order to/gi, "to")
          .replace(/due to the fact that/gi, "because")
          .replace(/at this point in time/gi, "now")
          .replace(/on a regular basis/gi, "regularly")
          .replace(/in the event that/gi, "if")
          .replace(/in the process of/gi, "currently")
          .replace(/a large number of/gi, "many")
          .replace(/the vast majority of/gi, "most")
          .replace(/for the purpose of/gi, "for")
          .replace(/in the vicinity of/gi, "near")
          .replace(/in spite of the fact that/gi, "although")

        // Remove filler words
        result = result.replace(/basically |essentially |actually |really |very |quite |literally /gi, "")
        break

      case "confident":
        // Add confident language
        result = result
          .replace(/I think/gi, "I know")
          .replace(/I believe/gi, "I am confident")
          .replace(/might/gi, "will")
          .replace(/could/gi, "can")
          .replace(/tried to/gi, "successfully")
          .replace(/attempted to/gi, "accomplished")
          .replace(/helped/gi, "led")
          .replace(/participated in/gi, "drove")
          .replace(/was part of/gi, "was instrumental in")
          .replace(/worked with/gi, "directed")
          .replace(/supported/gi, "championed")
          .replace(/contributed to/gi, "spearheaded")
        break

      case "formal":
        // Add formal language
        result = result
          .replace(/get/gi, "obtain")
          .replace(/got/gi, "obtained")
          .replace(/use/gi, "utilize")
          .replace(/used/gi, "utilized")
          .replace(/make/gi, "construct")
          .replace(/made/gi, "constructed")
          .replace(/find out/gi, "determine")
          .replace(/found out/gi, "determined")
          .replace(/start/gi, "commence")
          .replace(/started/gi, "commenced")
          .replace(/end/gi, "conclude")
          .replace(/ended/gi, "concluded")
          .replace(/show/gi, "demonstrate")
          .replace(/showed/gi, "demonstrated")
          .replace(/tell/gi, "inform")
          .replace(/told/gi, "informed")
        break
    }

    // Capitalize first letter of sentences
    result = result.replace(/(^\s*|[.!?]\s*)[a-z]/g, (match) => match.toUpperCase())

    // Ensure proper ending punctuation
    if (!result.match(/[.!?]$/)) {
      result += "."
    }

    return result
  },

  // AI-powered suggestions for improvements
  suggestImprovements: async (text) => {
    if (!text) return "Please provide some text to get suggestions."

    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (text.length < 50) {
      return "Consider adding more details to make your description more comprehensive."
    } else if (!text.includes(" achievements ") && !text.includes(" accomplished ")) {
      return "Try to include specific achievements or results to make your experience more impactful."
    } else if (!text.includes(" skills ") && !text.includes(" technologies ")) {
      return "Consider mentioning specific skills or technologies you used."
    }

    return "Your content looks good! Consider quantifying your achievements with specific metrics if possible."
  },

  // Extract skills from text
  extractSkillsFromDescription: (text) => {
    if (!text) return []

    const commonSkills = [
      "JavaScript",
      "React",
      "Angular",
      "Vue",
      "Node.js",
      "Express",
      "MongoDB",
      "SQL",
      "Python",
      "Java",
      "C#",
      ".NET",
      "PHP",
      "Ruby",
      "Rails",
      "HTML",
      "CSS",
      "Sass",
      "TypeScript",
      "GraphQL",
      "REST",
      "API",
      "AWS",
      "Azure",
      "GCP",
      "Docker",
      "Kubernetes",
      "Git",
      "CI/CD",
      "Agile",
      "Scrum",
      "Project Management",
      "Leadership",
      "Communication",
      "Problem Solving",
      "Critical Thinking",
      "Team Collaboration",
      "Time Management",
    ]

    return commonSkills.filter((skill) => text.toLowerCase().includes(skill.toLowerCase()))
  },

  // Generate a professional summary based on experience and skills
  generateSummary: async (experience, skills) => {
    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    if (!experience || experience.length === 0) {
      return "Dedicated professional with a passion for delivering high-quality results. Skilled in problem-solving and collaboration, with a track record of success in fast-paced environments."
    }

    const latestJob = experience[0]
    const yearsOfExperience = experience.reduce((total, job) => {
      if (!job.startDate) return total
      const start = new Date(job.startDate)
      const end = job.current ? new Date() : job.endDate ? new Date(job.endDate) : new Date()
      const years = (end - start) / (1000 * 60 * 60 * 24 * 365)
      return total + years
    }, 0)

    const roundedYears = Math.round(yearsOfExperience)
    const skillsList = skills?.technical?.slice(0, 3) || []

    return `${latestJob.position} with ${roundedYears}+ years of experience in ${
      latestJob.company
    }. Proficient in ${skillsList.join(", ")}. Demonstrated success in delivering high-quality solutions and driving business results through technical expertise and strong collaboration skills.`
  },

  // AI-powered auto-fill from uploaded resume
  autoFillFromUpload: async (file) => {
    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock data - in a real app, this would extract data from the uploaded resume
    console.log("AI auto-fill requested for file:", file.name)
    return {
      personal: {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "(555) 123-4567",
        location: "San Francisco, CA",
        website: "alexjohnson.dev",
        linkedin: "linkedin.com/in/alexjohnson",
        github: "github.com/alexjohnson",
        summary:
          "Experienced software developer with 5+ years of experience in web development, specializing in React and Node.js. Passionate about creating user-friendly applications and solving complex problems.",
      },
      education: [
        {
          institution: "University of California, Berkeley",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "2015-09",
          endDate: "2019-05",
          description:
            "Graduated with honors. Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems.",
        },
      ],
      experience: [
        {
          company: "Tech Innovations Inc.",
          position: "Senior Frontend Developer",
          location: "San Francisco, CA",
          startDate: "2021-03",
          endDate: "",
          current: true,
          description:
            "Lead the development of the company's main product using React and Redux. Improved application performance by 40% through code optimization and implementing lazy loading techniques.",
        },
        {
          company: "WebSolutions Co.",
          position: "Frontend Developer",
          location: "San Francisco, CA",
          startDate: "2019-06",
          endDate: "2021-02",
          current: false,
          description:
            "Developed responsive web applications using React, HTML5, and CSS3. Collaborated with UX designers to implement user-friendly interfaces.",
        },
      ],
      skills: {
        technical: ["JavaScript", "React", "Node.js", "HTML5", "CSS3", "Redux", "Git", "RESTful APIs", "MongoDB"],
        soft: ["Problem Solving", "Team Collaboration", "Communication", "Time Management"],
        languages: ["English (Native)", "Spanish (Intermediate)"],
      },
      projects: [
        {
          name: "E-commerce Platform",
          description:
            "Developed a full-stack e-commerce platform with React, Node.js, and MongoDB. Implemented features like user authentication, product search, and payment processing.",
          technologies: "React, Node.js, Express, MongoDB, Stripe API",
          link: "github.com/alexjohnson/ecommerce-platform",
          startDate: "2020-06",
          endDate: "2020-12",
        },
      ],
      certifications: [
        {
          name: "AWS Certified Developer - Associate",
          issuer: "Amazon Web Services",
          date: "2022-01",
          expiration: "2025-01",
          credentialID: "AWS-DEV-12345",
          url: "aws.amazon.com/verification",
          description: "Certification validating expertise in developing and maintaining AWS-based applications.",
        },
      ],
      selectedTemplate: "modern",
    }
  },

  // Generate diff highlights between original and enhanced text
  generateDiffHighlight: (original, enhanced) => {
    if (!original || !enhanced) return []

    const words1 = original.split(/\s+/)
    const words2 = enhanced.split(/\s+/)

    const result = []
    let i = 0,
      j = 0

    while (i < words2.length) {
      if (
        j < words1.length &&
        words2[i].toLowerCase().replace(/[.,!?;:]/g, "") === words1[j].toLowerCase().replace(/[.,!?;:]/g, "")
      ) {
        // Words match
        result.push({ text: words2[i], highlight: false })
        i++
        j++
      } else {
        // Words don't match - this is likely a change
        result.push({ text: words2[i], highlight: true })
        i++
        // Skip words in original text until we find a match or run out
        let found = false
        let lookahead = 1
        while (j + lookahead < words1.length && lookahead < 3 && !found) {
          if (
            words2[i] &&
            words1[j + lookahead] &&
            words2[i].toLowerCase().replace(/[.,!?;:]/g, "") ===
              words1[j + lookahead].toLowerCase().replace(/[.,!?;:]/g, "")
          ) {
            j = j + lookahead
            found = true
          }
          lookahead++
        }
        if (!found && i < words2.length) {
          j++
        }
      }
    }

    return result
  },
}

// For backward compatibility
export const aiFeatures = aiService
