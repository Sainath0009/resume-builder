"use client"

export default function MinimalTemplate({ data }) {
  const { personal, experience, education, skills, projects, certifications, customization, sectionOrder } = data

  // Default section order if not provided
  const order = sectionOrder || ["experience", "education", "skills", "projects", "certifications"]

  // Render sections in the specified order
  const renderSections = () => {
    return order.map((section) => {
      switch (section) {
        case "experience":
          return experience && experience.length > 0 ? renderExperience() : null
        case "education":
          return education && education.length > 0 ? renderEducation() : null
        case "skills":
          return skills && skills.length > 0 ? renderSkills() : null
        case "projects":
          return projects && projects.length > 0 ? renderProjects() : null
        case "certifications":
          return certifications && certifications.length > 0 ? renderCertifications() : null
        default:
          return null
      }
    })
  }

  const renderExperience = () => (
    <section className="mb-6">
      <h2 className="text-base font-medium mb-3 text-gray-800">Professional Experience</h2>
      <div className="space-y-4">
        {experience.map((exp) => (
          <div key={exp.id} className="mb-2">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-sm">{exp.position}</h3>
              <span className="text-xs text-gray-500">
                {exp.startDate} - {exp.endDate || "Present"}
              </span>
            </div>
            <p className="text-sm text-gray-700">{exp.company}</p>
            <p className="text-xs text-gray-500">{exp.location}</p>
            <ul className="mt-1 text-xs space-y-1">
              {exp.description.split("\n").map((item, index) => (
                <li key={index} className="pl-4 relative">
                  <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )

  const renderEducation = () => (
    <section className="mb-6">
      <h2 className="text-base font-medium mb-3 text-gray-800">Education</h2>
      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="mb-2">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-sm">{edu.degree}</h3>
              <span className="text-xs text-gray-500">
                {edu.startDate} - {edu.endDate}
              </span>
            </div>
            <p className="text-sm text-gray-700">{edu.institution}</p>
            <p className="text-xs text-gray-500">{edu.location}</p>
            {edu.gpa && <p className="text-xs">GPA: {edu.gpa}</p>}
          </div>
        ))}
      </div>
    </section>
  )

  const renderSkills = () => (
    <section className="mb-6">
      <h2 className="text-base font-medium mb-3 text-gray-800">Key Skills</h2>
      <div className="grid grid-cols-1 gap-4">
        {skills.map((category) => (
          <div key={category.id}>
            <h3 className="text-sm font-medium mb-2">{category.category}</h3>
            <div className="space-y-2">
              {category.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-24 text-xs">{skill}</div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div
                      className="bg-[#1e3a8a] h-2 rounded-full"
                      style={{ width: `${Math.random() * 40 + 60}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  const renderProjects = () => (
    <section className="mb-6">
      <h2 className="text-base font-medium mb-3 text-gray-800">Projects</h2>
      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="mb-2">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-sm">{project.title}</h3>
              {(project.startDate || project.endDate) && (
                <span className="text-xs text-gray-500">
                  {project.startDate} {project.endDate && `- ${project.endDate}`}
                </span>
              )}
            </div>
            {project.technologies && <p className="text-xs text-gray-700">{project.technologies}</p>}
            <ul className="mt-1 text-xs space-y-1">
              {project.description.split("\n").map((item, index) => (
                <li key={index} className="pl-4 relative">
                  <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )

  const renderCertifications = () => (
    <section className="mb-6">
      <h2 className="text-base font-medium mb-3 text-gray-800">Certifications</h2>
      <div className="space-y-2">
        {certifications.map((cert) => (
          <div key={cert.id} className="mb-2">
            <h3 className="font-medium text-sm">{cert.title}</h3>
            <p className="text-xs text-gray-700">{cert.issuer}</p>
            {cert.date && <p className="text-xs text-gray-500">{cert.date}</p>}
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <div className="max-w-[210mm] mx-auto bg-white text-gray-800">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white p-4">
        <div className="text-center">
          <h1 className="text-xl font-medium">{personal.name || "Your Name"}</h1>
          <p className="text-sm">{personal.title || "Professional Title"}</p>
        </div>
      </header>

      {/* Contact Info Bar */}
      <div className="bg-gray-100 py-2 px-4 text-center text-xs">
        <div className="flex flex-wrap justify-center gap-4">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <section className="p-4 border-b border-gray-200">
          <p className="text-sm">{personal.summary}</p>
        </section>
      )}

      {/* Main Content */}
      <div className="p-4">
        {/* Render all sections in the specified order */}
        {renderSections()}
      </div>
    </div>
  )
}
