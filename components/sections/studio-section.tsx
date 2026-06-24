interface ServiceItem {
  index: string;
  title: string;
  description: string;
}

interface StatItem {
  value: string;
  label: string;
}

const BUILD_BAND = ["I", "Build", "\u2192", "High-Impact Products"];

const SERVICES: ServiceItem[] = [
  {
    index: "01",
    title: "Full-Stack Development",
    description: "Build scalable web applications with React, Next.js, Node.js, and Django.",
  },
  {
    index: "02",
    title: "Backend APIs & Auth",
    description: "Develop REST APIs, role-based access control, validation, and database integrations.",
  },
  {
    index: "03",
    title: "Dashboard & Portal Systems",
    description: "Create data-driven dashboards, testing platforms, and multi-role management workflows.",
  },
  {
    index: "04",
    title: "Performance Optimization",
    description: "Improve load times, component reuse, and overall user experience from build to deployment.",
  },
];

const STATS: StatItem[] = [
  { value: "2", label: "Professional roles" },
  { value: "7+", label: "Projects in CV" },
  { value: "8.6", label: "B.Tech GPA" },
  { value: "2025", label: "Graduation year" },
];

const STUDIO_LINKS = [
  {
    href: "mailto:srijonkarmakar.dev@gmail.com",
    label: "Email",
    value: "srijonkarmakar.dev@gmail.com",
  },
  {
    href: "https://www.linkedin.com/in/srijon-karmakar/",
    label: "LinkedIn",
    value: "linkedin.com/in/srijon-karmakar",
  },
];

export function StudioSection() {
  return (
    <section className="studio-section" id="about">
      <div className="studio-shell">
        <div className="studio-intro">
          <div className="studio-intro__visual" aria-hidden="true">
            <div className="studio-intro__globe">
              <span className="studio-intro__globe-ring" />
              <span className="studio-intro__globe-ring studio-intro__globe-ring--vertical" />
              <span className="studio-intro__globe-line" />
            </div>
            <div className="studio-intro__caption">
              <span className="studio-dot" />
              Full-stack developer based in Kolkata, building clean and scalable web applications.
            </div>
          </div>

          <div className="studio-intro__content">
            <span className="studio-eyebrow">About Me</span>
            <h2 className="studio-title">
              I build full-stack web applications with React, Next.js, Node.js, Django, and
              Python,{" "}
              <span>
                focused on scalable architecture, secure APIs, and polished user experiences.
              </span>
            </h2>

            <div className="studio-links" aria-label="Profile links">
              {STUDIO_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="studio-link-pill"
                >
                  <span className="studio-link-pill__label">{link.label}</span>
                  <span className="studio-link-pill__value">{link.value}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="studio-band" aria-label="Personal build focus">
          {BUILD_BAND.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className={`studio-band__item studio-band__item--${index + 1}`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="studio-bottom">
          <div className="studio-services" id="services">
            <div className="studio-services__heading">
              <span className="studio-eyebrow">Services</span>
              <h3 className="studio-services__title">What I do best</h3>
            </div>

            <div className="studio-service-list">
              {SERVICES.map((service) => (
                <article key={service.index} className="studio-service-row">
                  <span className="studio-service-row__index">{service.index}</span>
                  <div className="studio-service-row__body">
                    <h4>{service.title}</h4>
                    <p>{service.description}</p>
                  </div>
                  <span className="studio-service-row__arrow" aria-hidden="true">
                    {"\u2197"}
                  </span>
                </article>
              ))}
            </div>
          </div>

          <aside className="studio-panel">
            <div className="studio-panel__header">
              <span className="studio-eyebrow studio-eyebrow--light">Highlights</span>
              <h3 className="studio-panel__title">
                Work shaped by shipping products and solving real problems.
              </h3>
            </div>

            <div className="studio-stats">
              {STATS.map((stat) => (
                <div key={stat.label} className="studio-stat">
                  <span className="studio-stat__value">{stat.value}</span>
                  <span className="studio-stat__label">{stat.label}</span>
                </div>
              ))}
            </div>

            <a className="studio-panel__cta" href="/cv/cv.pdf">
              <span>View my CV</span>
              <span className="studio-panel__cta-icon" aria-hidden="true">
                {"\u2197"}
              </span>
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
