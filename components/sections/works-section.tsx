"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  img: string;
  title: string;
  desc: string;
  link: string;
}

interface DesignProject extends Project {
  circleClassName: string;
  appearAt: number;
}

const ENGINEERING_PROJECTS: Project[] = [
  {
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    title: "DevFlow",
    desc: "A real-time collaborative code editor with syntax highlighting and live cursors.",
    link: "#",
  },
  {
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    title: "StackSync",
    desc: "Full-stack deployment pipeline automating CI/CD for monorepo architectures.",
    link: "#",
  },
  {
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    title: "InsightBoard",
    desc: "Analytics dashboard with real-time data visualization and custom widgets.",
    link: "#",
  },
  {
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
    title: "CloudForge",
    desc: "Infrastructure-as-code platform for provisioning cloud resources visually.",
    link: "#",
  },
  {
    img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=500&fit=crop",
    title: "Mobicraft",
    desc: "Cross-platform mobile app builder with drag-and-drop components.",
    link: "#",
  },
  {
    img: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=500&fit=crop",
    title: "Wireframe AI",
    desc: "AI-powered wireframing tool that converts sketches to production-ready UI.",
    link: "#",
  },
  {
    img: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=500&fit=crop",
    title: "CodeLens",
    desc: "Intelligent code review assistant with automated vulnerability scanning.",
    link: "#",
  },
];

const DESIGN_PROJECTS: DesignProject[] = [
  {
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    title: "Interface Atlas",
    desc: "A modular UI system study exploring dense dashboard layouts and scalable components.",
    link: "#",
    circleClassName: "design-circle--1",
    appearAt: 82,
  },
  {
    img: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=900&q=80",
    title: "Poster Pulse",
    desc: "Experimental poster direction mixing bold color blocks, oversized type, and motion-first layouts.",
    link: "#",
    circleClassName: "design-circle--2",
    appearAt: 88,
  },
  {
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    title: "Figma Frames",
    desc: "High-fidelity web app screens translated into polished Figma prototypes and design tokens.",
    link: "#",
    circleClassName: "design-circle--3",
    appearAt: 94,
  },
  {
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
    title: "Palette Study",
    desc: "Color system explorations balancing accessibility, depth, and a soft editorial visual language.",
    link: "#",
    circleClassName: "design-circle--4",
    appearAt: 94,
  },
  {
    img: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=900&q=80",
    title: "Brand Orbit",
    desc: "Identity direction for a digital product studio spanning symbol work, layouts, and brand motion.",
    link: "#",
    circleClassName: "design-circle--5",
    appearAt: 100,
  },
  {
    img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    title: "Grid Study",
    desc: "Editorial-style composition tests built around asymmetric spacing and precise visual rhythm.",
    link: "#",
    circleClassName: "design-circle--6",
    appearAt: 106,
  },
  {
    img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
    title: "Motion Sheets",
    desc: "Micro-interaction boards defining transitions, timing curves, and interface choreography.",
    link: "#",
    circleClassName: "design-circle--7",
    appearAt: 112,
  },
  {
    img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
    title: "Icon Atlas",
    desc: "Interface icon explorations focused on consistency, optical balance, and sharp small-size rendering.",
    link: "#",
    circleClassName: "design-circle--8",
    appearAt: 112,
  },
  {
    img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80",
    title: "Type Rhythm",
    desc: "Display typography explorations pairing heavy headlines with quiet, neutral supporting copy.",
    link: "#",
    circleClassName: "design-circle--9",
    appearAt: 118,
  },
  {
    img: "https://images.unsplash.com/photo-1510906594845-bc082582c8cc?auto=format&fit=crop&w=900&q=80",
    title: "Visual Stack",
    desc: "Cross-device design mockups testing balance between product clarity, imagery, and spatial depth.",
    link: "#",
    circleClassName: "design-circle--10",
    appearAt: 124,
  },
];

const DESIGN_TITLE = "Design Works";

export function WorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slideWrapRef = useRef<HTMLDivElement>(null);
  const nextSectionRef = useRef<HTMLDivElement>(null);
  const designCircleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const designLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cartoonRef = useRef<HTMLImageElement>(null);
  const expandBoxRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const popupBgRef = useRef<HTMLDivElement>(null);

  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const openPopup = (project: Project) => {
    setActiveProject(project);
  };

  const closePopup = () => {
    if (!popupRef.current || !popupBgRef.current) {
      setActiveProject(null);
      return;
    }
    gsap.to(popupRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(popupBgRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setActiveProject(null),
    });
  };

  useEffect(() => {
    if (activeProject && popupRef.current && popupBgRef.current) {
      gsap.fromTo(
        popupBgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        popupRef.current,
        { scale: 0.85, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.4)" }
      );
    }
  }, [activeProject]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          pin: ".works-sticky",
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: Engineering title enters.
      tl.fromTo(
        titleRef.current,
        { y: "100vh" },
        { y: "0%", duration: 12, ease: "power2.out" },
        0
      );

      // Phase 2: Engineering cards rise in.
      gridRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: 0, y: 60, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 5, ease: "power2.out" },
          14 + i * 4
        );
      });

      // Phase 3: Shift into the white design stage.
      tl.to(
        slideWrapRef.current,
        { xPercent: -100, duration: 28, ease: "power2.inOut" },
        48
      );
      tl.fromTo(
        nextSectionRef.current,
        { xPercent: 100 },
        { xPercent: 0, duration: 28, ease: "power2.inOut" },
        48
      );

      // Phase 4: Design circles appear from below. Small circles arrive in pairs.
      DESIGN_PROJECTS.forEach((project, i) => {
        if (!designCircleRefs.current[i]) return;
        tl.fromTo(
          designCircleRefs.current[i],
          { autoAlpha: 0, y: 120, scale: 0.68 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 8,
            ease: "power3.out",
          },
          project.appearAt
        );
      });

      // Phase 5: Cartoon rises in.
      tl.fromTo(
        cartoonRef.current,
        { autoAlpha: 0, y: 180 },
        { autoAlpha: 1, y: 0, duration: 14, ease: "power3.out" },
        132
      );

      // Phase 6: Title reveals letter by letter.
      const designLetterElements = designLetterRefs.current.filter(
        (el): el is HTMLSpanElement => Boolean(el)
      );

      if (designLetterElements.length > 0) {
        tl.fromTo(
          designLetterElements,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 4,
            stagger: 1,
            ease: "power2.out",
          },
          148
        );
      }

      // Phase 7: Small purple square slides into the center.
      tl.fromTo(
        expandBoxRef.current,
        { autoAlpha: 0, y: "-58vh" },
        { autoAlpha: 1, y: 0, scale: 1, duration: 12, ease: "power3.out" },
        168
      );

      // Phase 8: The same square expands into the next full-screen panel.
      tl.to(
        expandBoxRef.current,
        {
          width: "100vw",
          height: "100vh",
          duration: 20,
          ease: "power3.inOut",
        },
        184
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={containerRef} className="works-container">
        <div className="works-sticky">
          {/* Orange works section (slides left) */}
          <div ref={slideWrapRef} className="works-slide works-orange">
            <h2 ref={titleRef} className="works-title">
              Engineering
              <br />
              Works
            </h2>
            <div className="bento-grid">
              {ENGINEERING_PROJECTS.map((project, i) => (
                <div
                  key={i}
                  ref={(el) => { gridRefs.current[i] = el; }}
                  className="bento-item"
                  onClick={() => openPopup(project)}
                >
                  <img src={project.img} alt={project.title} loading="lazy" />
                  <div className="bento-overlay">
                    <span className="bento-overlay-title">{project.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* White section (slides in from right) */}
          <div ref={nextSectionRef} className="works-slide works-white">
            <div className="works-white-inner">
              <h2 className="design-title" aria-label={DESIGN_TITLE}>
                {DESIGN_TITLE.split("").map((character, i) => (
                  <span
                    key={`${character}-${i}`}
                    ref={(el) => { designLetterRefs.current[i] = el; }}
                    className="design-title-letter"
                  >
                    {character === " " ? "\u00A0" : character}
                  </span>
                ))}
              </h2>

              {DESIGN_PROJECTS.map((project, i) => (
                <button
                  key={project.title}
                  type="button"
                  ref={(el) => { designCircleRefs.current[i] = el; }}
                  className={`design-circle ${project.circleClassName}`}
                  onClick={() => openPopup(project)}
                  aria-label={`Open ${project.title}`}
                >
                  <img src={project.img} alt={project.title} loading="lazy" />
                  <span className="design-circle-label">{project.title}</span>
                </button>
              ))}

              <img
                ref={cartoonRef}
                className="design-cartoon"
                src="/images/3d-cartoon.png"
                alt="3D cartoon character"
                loading="lazy"
              />

              <div ref={expandBoxRef} className="design-expand-box" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Popup */}
      {activeProject && (
        <div className="popup-backdrop" ref={popupBgRef} onClick={closePopup}>
          <div
            className="popup"
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="popup-close" onClick={closePopup}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <img
              className="popup-img"
              src={activeProject.img}
              alt={activeProject.title}
            />
            <div className="popup-body">
              <h3 className="popup-title">{activeProject.title}</h3>
              <p className="popup-desc">{activeProject.desc}</p>
              <a
                href={activeProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="popup-cta"
              >
                View Project
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 12L12 4M12 4H6M12 4V10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
