import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react"

export default function ModernTemplate({ data }) {
  const {
    personal,
    education,
    experience,
    skills,
    projects,
    certifications,
    themeColor = "blue",
    themeFont = "sans",
    sectionOrder,
  } = data

  // Get color classes based on theme
  const getColorClasses = () => {
    switch (themeColor) {
      case "green":
        return { border: "border-green-300", heading: "text-green-700" }
      case "purple":
        return { border: "border-purple-300", heading: "text-purple-700" }
      case "red":
        return { border: "border-red-300", heading: "text-red-700" }
      case "gray":
        return { border: "border-gray-300", heading: "text-gray-700" }
      case "teal":
        return { border: "border-teal-300", heading: "text-teal-700" }
      case "amber":
        return { border: "border-amber-300", heading: "text-amber-700" }
      case "indigo":
        return { border: "border-indigo-300", heading: "text-indigo-700" }
      default:
        return { border: "border-blue-300", heading: "text-blue-700" }
    }
  }

  const colorClasses = getColorClasses()
  const fontClass = themeFont === "serif" ? "font-serif" : themeFont === "mono" ? "font-mono" : "font-sans"

  // Default section order if not provided
  const defaultSectionOrder = [
    { id: "summary", name: "Professional Summary" },
    { id: "experience", name: "Work Experience" },
    { id: "education", name: "Education" },
    { id: "skills", name: "Skills" },
    { id: "projects", name: "Projects" },
    { id: "certifications", name: "Certifications" },
  ]

  // Use provided section order or default
  const sectionsOrder = sectionOrder || defaultSectionOrder

  // Render a section based on its ID
  const renderSection = (sectionId) => {
    switch (sectionId) {
      case "summary":
        return (
          personal.summary && (
            <section className="mb-6">
              <h2
                className={`text-xl font-semibold border-b-2 ${colorClasses.border} pb-1 mb-3 ${colorClasses.heading}`}
              >
                Professional Summary
              </h2>
              <p className="text-sm">{personal.summary}</p>
            </section>
          )
        )
      case "experience":
        return (
          experience.length > 0 &&
          experience[0].company && (
            <section className="mb-6">
              <h2
                className={`text-xl font-semibold border-b-2 ${colorClasses.border} pb-1 mb-3 ${colorClasses.heading}`}
              >
                Work Experience
              </h2>
              {experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-medium">{exp.position}</h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate &&
                        new Date(exp.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}{" "}
                      -{" "}
                      {exp.current
                        ? "Present"
                        : exp.endDate &&
                          new Date(exp.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-medium text-gray-700">{exp.company}</p>
                    <p className="text-sm text-gray-600">{exp.location}</p>
                  </div>
                  {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                </div>
              ))}
            </section>
          )
        )
      case "education":
        return (
          education.length > 0 &&
          education[0].institution && (
            <section className="mb-6">
              <h2
                className={`text-xl font-semibold border-b-2 ${colorClasses.border} pb-1 mb-3 ${colorClasses.heading}`}
              >
                Education
              </h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-medium">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {edu.startDate &&
                        new Date(edu.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}{" "}
                      -{" "}
                      {edu.endDate &&
                        new Date(edu.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{edu.institution}</p>
                  {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                </div>
              ))}
            </section>
          )
        )
      case "certifications":
        return (
          certifications.length > 0 &&
          certifications[0].name && (
            <section className="mb-6">
              <h2
                className={`text-xl font-semibold border-b-2 ${colorClasses.border} pb-1 mb-3 ${colorClasses.heading}`}
              >
                Certifications
              </h2>
              {certifications.map((cert, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-medium">{cert.name}</h3>
                    <span className="text-sm text-gray-600">
                      {cert.date &&
                        new Date(cert.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                      {cert.expiration &&
                        ` - ${new Date(cert.expiration).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}`}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{cert.issuer}</p>
                  {cert.credentialID && <p className="text-sm text-gray-600">Credential ID: {cert.credentialID}</p>}
                  {cert.url && (
                    <p className="text-sm text-blue-600">
                      <a href={cert.url} target="_blank" rel="noopener noreferrer">
                        View Certificate
                      </a>
                    </p>
                  )}
                  {cert.description && <p className="text-sm mt-1">{cert.description}</p>}
                </div>
              ))}
            </section>
          )
        )
      case "projects":
        return (
          projects.length > 0 &&
          projects[0].name && (
            <section className="mb-6">
              <h2
                className={`text-xl font-semibold border-b-2 ${colorClasses.border} pb-1 mb-3 ${colorClasses.heading}`}
              >
                Projects
              </h2>
              {projects.map((project, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-medium">{project.name}</h3>
                    <span className="text-sm text-gray-600">
                      {project.startDate &&
                        new Date(project.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}{" "}
                      -{" "}
                      {project.endDate &&
                        new Date(project.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    </span>
                  </div>
                  {project.technologies && (
                    <p className="text-sm font-medium text-gray-700">Technologies: {project.technologies}</p>
                  )}
                  {project.link && <p className="text-sm text-blue-600">{project.link}</p>}
                  {project.description && <p className="text-sm mt-1">{project.description}</p>}
                </div>
              ))}
            </section>
          )
        )
      case "skills":
        return (
          <section>
            <h2 className={`text-xl font-semibold border-b-2 ${colorClasses.border} pb-1 mb-3 ${colorClasses.heading}`}>
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {skills.technical.length > 0 && (
                <div>
                  <h3 className="text-base font-medium mb-2">Technical Skills</h3>
                  <ul className="list-disc list-inside text-sm">
                    {skills.technical.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
              {skills.soft.length > 0 && (
                <div>
                  <h3 className="text-base font-medium mb-2">Soft Skills</h3>
                  <ul className="list-disc list-inside text-sm">
                    {skills.soft.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
              {skills.languages.length > 0 && (
                <div>
                  <h3 className="text-base font-medium mb-2">Languages</h3>
                  <ul className="list-disc list-inside text-sm">
                    {skills.languages.map((language, index) => (
                      <li key={index}>{language}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )
      default:
        return null
    }
  }

  return (
    <div className={`p-8 text-gray-800 ${fontClass}`}>
      {/* Header */}
      <header className="mb-6">
        <h1 className={`text-3xl font-bold text-gray-900 mb-1 ${colorClasses.heading} ${fontClass}`}>{personal.name || "Your Name"}</h1>

        <div className="flex flex-wrap gap-3 text-sm mt-3">
          {personal.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{personal.phone}</span>
            </div>
          )}
          {personal.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{personal.location}</span>
            </div>
          )}
          {personal.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>{personal.website}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-4 w-4" />
              <span>{personal.linkedin}</span>
            </div>
          )}
          {personal.github && (
            <div className="flex items-center gap-1">
              <Github className="h-4 w-4" />
              <span>{personal.github}</span>
            </div>
          )}
        </div>
      </header>

      {/* Render sections in the specified order */}
      {sectionsOrder.map((section) => (
        <div key={section.id}>{renderSection(section.id)}</div>
      ))}
    </div>
  )
}
