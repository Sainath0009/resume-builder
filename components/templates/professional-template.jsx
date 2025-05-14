export default function ProfessionalTemplate({ data }) {
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
        return { header: "bg-green-800", border: "border-green-800", text: "text-green-600" }
      case "purple":
        return { header: "bg-purple-800", border: "border-purple-800", text: "text-purple-600" }
      case "red":
        return { header: "bg-red-800", border: "border-red-800", text: "text-red-600" }
      case "gray":
        return { header: "bg-gray-800", border: "border-gray-800", text: "text-gray-600" }
      case "teal":
        return { header: "bg-teal-800", border: "border-teal-800", text: "text-teal-600" }
      case "amber":
        return { header: "bg-amber-800", border: "border-amber-800", text: "text-amber-600" }
      case "indigo":
        return { header: "bg-indigo-800", border: "border-indigo-800", text: "text-indigo-600" }
      default:
        return { header: "bg-gray-800", border: "border-gray-800", text: "text-blue-600" }
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
              <h2 className={`text-xl font-bold text-gray-800 mb-3 pb-1 border-b-2 ${colorClasses.border}`}>
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
              <h2 className={`text-xl font-bold text-gray-800 mb-3 pb-1 border-b-2 ${colorClasses.border}`}>
                Professional Experience
              </h2>
              {experience.map((exp, index) => (
                <div key={index} className="mb-5">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <h3 className="text-lg font-semibold">{exp.position}</h3>
                    <p className="text-sm font-medium text-gray-700">
                      {exp.startDate &&
                        new Date(exp.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}{" "}
                      -{" "}
                      {exp.current
                        ? "Present"
                        : exp.endDate &&
                          new Date(exp.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    </p>
                  </div>
                  <p className="text-base font-medium">
                    {exp.company}, {exp.location}
                  </p>
                  {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
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
              <h2 className={`text-xl font-bold text-gray-800 mb-3 pb-1 border-b-2 ${colorClasses.border}`}>
                Education
              </h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <h3 className="text-lg font-semibold">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-sm font-medium text-gray-700">
                      {edu.startDate &&
                        new Date(edu.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}{" "}
                      -{" "}
                      {edu.endDate &&
                        new Date(edu.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    </p>
                  </div>
                  <p className="text-base font-medium">{edu.institution}</p>
                  {edu.description && <p className="text-sm mt-2">{edu.description}</p>}
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
              <h2 className={`text-xl font-bold text-gray-800 mb-3 pb-1 border-b-2 ${colorClasses.border}`}>
                Certifications
              </h2>
              {certifications.map((cert, index) => (
                <div key={index} className="mb-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <h3 className="text-lg font-semibold">{cert.name}</h3>
                    <p className="text-sm font-medium text-gray-700">
                      {cert.date &&
                        new Date(cert.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                      {cert.expiration &&
                        ` - ${new Date(cert.expiration).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}`}
                    </p>
                  </div>
                  <p className="text-base font-medium">{cert.issuer}</p>
                  {cert.credentialID && <p className="text-sm">Credential ID: {cert.credentialID}</p>}
                  {cert.url && <p className={`text-sm ${colorClasses.text}`}>{cert.url}</p>}
                  {cert.description && <p className="text-sm mt-2">{cert.description}</p>}
                </div>
              ))}
            </section>
          )
        )
      case "skills":
        return (
          <section className="mb-6">
            <h2 className={`text-xl font-bold text-gray-800 mb-3 pb-1 border-b-2 ${colorClasses.border}`}>Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {skills.technical.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold mb-2">Technical Skills</h3>
                  <ul className="list-disc list-inside text-sm">
                    {skills.technical.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
              {skills.soft.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold mb-2">Soft Skills</h3>
                  <ul className="list-disc list-inside text-sm">
                    {skills.soft.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
              {skills.languages.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold mb-2">Languages</h3>
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
      case "projects":
        return (
          projects.length > 0 &&
          projects[0].name && (
            <section>
              <h2 className={`text-xl font-bold text-gray-800 mb-3 pb-1 border-b-2 ${colorClasses.border}`}>
                Projects
              </h2>
              {projects.map((project, index) => (
                <div key={index} className="mb-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <p className="text-sm font-medium text-gray-700">
                      {project.startDate &&
                        new Date(project.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}{" "}
                      -{" "}
                      {project.endDate &&
                        new Date(project.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    </p>
                  </div>
                  {project.technologies && (
                    <p className="text-base font-medium">Technologies: {project.technologies}</p>
                  )}
                  {project.link && <p className={`text-sm ${colorClasses.text}`}>{project.link}</p>}
                  {project.description && <p className="text-sm mt-2">{project.description}</p>}
                </div>
              ))}
            </section>
          )
        )
      default:
        return null
    }
  }

  return (
    <div className={`font-sans text-gray-800 ${fontClass}`}>
      {/* Header with colored background */}
      <header className={`${colorClasses.header} text-white p-8`}>
        <h1 className="text-3xl font-bold mb-2">{personal.name || "Your Name"}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-4">
          <div>
            {personal.email && <p>{personal.email}</p>}
            {personal.phone && <p>{personal.phone}</p>}
            {personal.location && <p>{personal.location}</p>}
          </div>
          <div>
            {personal.website && <p>{personal.website}</p>}
            {personal.linkedin && <p>{personal.linkedin}</p>}
            {personal.github && <p>{personal.github}</p>}
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Render sections in the specified order */}
        {sectionsOrder.map((section) => (
          <div key={section.id}>{renderSection(section.id)}</div>
        ))}
      </div>
    </div>
  )
}
