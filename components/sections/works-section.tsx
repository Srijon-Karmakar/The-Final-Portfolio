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

const PROJECTS: Project[] = [
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

export function WorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slideWrapRef = useRef<HTMLDivElement>(null);
  const nextSectionRef = useRef<HTMLDivElement>(null);
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
          scrub: 0.6,
          pin: ".works-sticky",
        },
      });

      // Phase 1 (0-12): Title slides up from bottom
      tl.fromTo(
        titleRef.current,
        { y: "100vh" },
        { y: "0%", duration: 12, ease: "power2.out" },
        0
      );

      // Phase 2 (14-58): Grid items appear one by one
      gridRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: 0, y: 60, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 6, ease: "power2.out" },
          14 + i * 6
        );
      });

      // Phase 3 (65-100): Slide entire works section left, white section slides in from right
      tl.to(
        slideWrapRef.current,
        { xPercent: -100, duration: 35, ease: "power2.inOut" },
        65
      );
      tl.fromTo(
        nextSectionRef.current,
        { xPercent: 100 },
        { xPercent: 0, duration: 35, ease: "power2.inOut" },
        65
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
              {PROJECTS.map((project, i) => (
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
            <div className="works-white-inner" />
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
