export default function MinimalTemplate({ data }) {
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

  const getColorClasses = () => {
    switch (themeColor) {
      case "green":
        return { accent: "text-green-600", heading: "text-green-700" }
      case "purple":
        return { accent: "text-purple-600", heading: "text-purple-700" }
      case "red":
        return { accent: "text-red-600", heading: "text-red-700" }
      case "gray":
        return { accent: "text-gray-600", heading: "text-gray-700" }
      case "teal":
        return { accent: "text-teal-600", heading: "text-teal-700" }
      case "amber":
        return { accent: "text-amber-600", heading: "text-amber-700" }
      case "indigo":
        return { accent: "text-indigo-600", heading: "text-indigo-700" }
      default:
        return { accent: "text-blue-600", heading: "text-blue-700" }
    }
  }

  const colorClasses = getColorClasses()
  const fontClass = themeFont === "serif" ? "font-serif" : themeFont === "mono" ? "font-mono" : "font-sans"

  const defaultSectionOrder = [
    { id: "summary", name: "Professional Summary" },
    { id: "experience", name: "Work Experience" },
    { id: "education", name: "Education" },
    { id: "skills", name: "Skills" },
    { id: "projects", name: "Projects" },
    { id: "certifications", name: "Certifications" },
  ]

  const sectionsOrder = sectionOrder || defaultSectionOrder

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case "summary":
        return (
          personal.summary && (
            <section className="mb-6">
              <p className="text-sm text-center">{personal.summary}</p>
            </section>
          )
        )
      case "experience":
        return (
          experience.length > 0 &&
          experience[0].company && (
            <section className="mb-6">
              <h2 className={`text-lg font-semibold uppercase tracking-wider mb-3 ${colorClasses.heading}`}>
                Experience
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
                  <p className="text-sm font-medium text-gray-700">
                    {exp.company}, {exp.location}
                  </p>
                  {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
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
              <h2 className={`text-lg font-semibold uppercase tracking-wider mb-3 ${colorClasses.heading}`}>
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
                  {project.link && <p className={`text-sm ${colorClasses.accent}`}>{project.link}</p>}
                  {project.description && <p className="text-sm mt-1">{project.description}</p>}
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
              <h2 className={`text-lg font-semibold uppercase tracking-wider mb-3 ${colorClasses.heading}`}>
                Certifications
              </h2>
              {certifications.map((cert, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-medium">{cert.name}</h3>
                    <span className="text-sm text-gray-600">
                      {cert.date &&
                        new Date(cert.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{cert.issuer}</p>
                  {cert.url && <p className={`text-sm ${colorClasses.accent}`}>{cert.url}</p>}
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
              <h2 className={`text-lg font-semibold uppercase tracking-wider mb-3 ${colorClasses.heading}`}>
                Education
              </h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-base font-medium">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-sm font-medium text-gray-700">{edu.institution}</p>
                  <p className="text-sm text-gray-600">
                    {edu.startDate &&
                      new Date(edu.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}{" "}
                    -{" "}
                    {edu.endDate &&
                      new Date(edu.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </p>
                  {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                </div>
              ))}
            </section>
          )
        )
      case "skills":
        return (
          <section>
            <h2 className={`text-lg font-semibold uppercase tracking-wider mb-3 ${colorClasses.heading}`}>Skills</h2>
            {skills.technical.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-medium mb-1">Technical Skills</h3>
                <p className="text-sm">{skills.technical.join(", ")}</p>
              </div>
            )}
            {skills.soft.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-medium mb-1">Soft Skills</h3>
                <p className="text-sm">{skills.soft.join(", ")}</p>
              </div>
            )}
            {skills.languages.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-medium mb-1">Languages</h3>
                <p className="text-sm">{skills.languages.join(", ")}</p>
              </div>
            )}
          </section>
        )
      default:
        return null
    }
  }

  return (
    <div className={`p-8 text-gray-800 max-w-4xl mx-auto ${fontClass}`}>
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${colorClasses.heading} ${fontClass}`}>
          {personal.name || "Your Name"}
        </h1>

        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <span>{personal.github}</span>}
        </div>
      </header>

      {/* Summary */}
      {renderSection("summary")}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {sectionsOrder
            .filter((section) => ["experience", "projects", "certifications"].includes(section.id))
            .map((section) => (
              <div key={section.id}>{renderSection(section.id)}</div>
            ))}
        </div>

        <div>
          {sectionsOrder
            .filter((section) => ["education", "skills"].includes(section.id))
            .map((section) => (
              <div key={section.id}>{renderSection(section.id)}</div>
            ))}
        </div>
      </div>
    </div>
  )
}
