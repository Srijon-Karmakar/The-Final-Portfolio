"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DroidScene } from "@/components/droid-scene";

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

interface TechItem {
  name: string;
  icon: string;
  category: "language" | "framework" | "other";
}

const TECH_STACK: TechItem[] = [
  { name: "JavaScript", icon: "javascript/javascript-original", category: "language" },
  { name: "TypeScript", icon: "typescript/typescript-original", category: "language" },
  { name: "Python", icon: "python/python-original", category: "language" },
  { name: "C++", icon: "cplusplus/cplusplus-original", category: "language" },
  { name: "HTML5", icon: "html5/html5-original", category: "language" },
  { name: "CSS3", icon: "css3/css3-original", category: "language" },
  { name: "React", icon: "react/react-original", category: "framework" },
  { name: "Next.js", icon: "nextjs/nextjs-original", category: "framework" },
  { name: "Node.js", icon: "nodejs/nodejs-original", category: "framework" },
  { name: "Django", icon: "django/django-plain", category: "framework" },
  { name: "Tailwind", icon: "tailwindcss/tailwindcss-original", category: "framework" },
  { name: "Express", icon: "express/express-original", category: "framework" },
  { name: "Three.js", icon: "threejs/threejs-original", category: "other" },
  { name: "Supabase", icon: "supabase/supabase-original", category: "other" },
  { name: "Blender", icon: "blender/blender-original", category: "other" },
  { name: "Git", icon: "git/git-original", category: "other" },
  { name: "GitHub", icon: "github/github-original", category: "other" },
  { name: "Figma", icon: "figma/figma-original", category: "other" },
  { name: "Docker", icon: "docker/docker-original", category: "other" },
  { name: "PostgreSQL", icon: "postgresql/postgresql-original", category: "other" },
  { name: "MongoDB", icon: "mongodb/mongodb-original", category: "other" },
  { name: "VS Code", icon: "vscode/vscode-original", category: "other" },
];

const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const DESIGN_TITLE = "Design Works";
const ABOUT_SUBTITLE_LINES = [
  "Engineer by instinct,",
  "3D designer by hobby.",
];
const ABOUT_PARAGRAPHS = [
  "I am Srijon Karmakar, a Full-Stack Developer focused on building modern web applications and digital products, with a strong foundation in Computer Science.",
  "My core skills span React, Next.js, Node.js, Python, and cloud-based systems, helping me turn ideas into scalable, user-centric solutions.",
  "From ERP platforms and online testing systems to interactive web experiences, I enjoy combining technical expertise, problem-solving, and creativity to deliver products that create real value.",
];
const ABOUT_PARAGRAPH_TEXT = ABOUT_PARAGRAPHS.join(" ");
const ABOUT_PARAGRAPH_WORDS = ABOUT_PARAGRAPH_TEXT.split(" ");

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
  const modelStageRef = useRef<HTMLDivElement>(null);
  const modelWrapRef = useRef<HTMLDivElement>(null);
  const aboutTitleWordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const aboutSubtitleRef = useRef<HTMLParagraphElement>(null);
  const aboutParagraphRef = useRef<HTMLDivElement>(null);
  const aboutParagraphWordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);
  const popupBgRef = useRef<HTMLDivElement>(null);
  const crossOverlayRef = useRef<HTMLDivElement>(null);
  const crossGroupRef = useRef<SVGGElement>(null);
  const toolsTitleWordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const techGridRef = useRef<HTMLDivElement>(null);
  const techItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const droidMotionRef = useRef({ drift: 0, spin: 0 });

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

      const aboutParagraphWords = aboutParagraphWordRefs.current.filter(
        (el): el is HTMLSpanElement => Boolean(el)
      );
      if (aboutParagraphWords.length > 0) {
        gsap.set(aboutParagraphWords, { opacity: 0.1 });
        gsap.set(aboutParagraphWords[0], { opacity: 1 });
        if (aboutParagraphWords[1]) {
          gsap.set(aboutParagraphWords[1], { opacity: 0.4 });
        }
      }

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

      // Phase 9: Fade the panel to white while the droid rises into frame.
      tl.to(
        expandBoxRef.current,
        {
          backgroundColor: "#ffffff",
          duration: 16,
          ease: "power2.inOut",
        },
        204
      );
      tl.fromTo(
        modelStageRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 10, ease: "power2.out" },
        206
      );
      const aboutTitleWords = aboutTitleWordRefs.current.filter(
        (el): el is HTMLSpanElement => Boolean(el)
      );
      if (aboutTitleWords.length > 0) {
        tl.fromTo(
          aboutTitleWords,
          { autoAlpha: 0, y: 42 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 8,
            stagger: 4,
            ease: "power2.out",
          },
          208
        );
      }
      tl.fromTo(
        aboutSubtitleRef.current,
        { autoAlpha: 0, x: -80 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 12,
          ease: "power3.out",
        },
        218
      );
      tl.set(
        aboutParagraphRef.current,
        { autoAlpha: 1 },
        228
      );
      tl.to(
        modelWrapRef.current,
        {
          xPercent: 24,
          duration: 14,
          ease: "power3.inOut",
        },
        228
      );
      if (aboutParagraphWords.length > 1) {
        tl.to(
          aboutParagraphWords.slice(1),
          {
            opacity: 1,
            duration: 0.45,
            stagger: 0.45,
            ease: "none",
          },
          228
        );
      }
      tl.fromTo(
        modelWrapRef.current,
        { autoAlpha: 0, y: "42vh" },
        { autoAlpha: 1, y: "0vh", duration: 16, ease: "power3.out" },
        206
      );

      // Phase 10: Next scrolls wake up the model motion.
      tl.to(
        droidMotionRef.current,
        {
          spin: 0.9,
          duration: 26,
          ease: "none",
        },
        224
      );

      // Phase 11: Later scrolls drift the model slightly while it keeps floating.
      tl.to(
        modelWrapRef.current,
        {
          xPercent: 28,
          y: "-2vh",
          duration: 14,
          ease: "power2.inOut",
        },
        236
      );
      tl.to(
        droidMotionRef.current,
        {
          drift: 1,
          spin: 1.8,
          duration: 18,
          ease: "sine.inOut",
        },
        236
      );

      // Phase 12: Fade out model stage at the end.
      tl.to(
        modelStageRef.current,
        {
          autoAlpha: 0,
          duration: 8,
          ease: "power2.inOut",
        },
        270
      );

      // Phase 13-14: Cross reveal transition.
      const crossEl = crossGroupRef.current;
      if (crossOverlayRef.current && crossEl) {
        gsap.set(crossEl, {
          scale: 0.1,
          y: 80,
          transformOrigin: "50% 50%",
          transformBox: "fill-box",
        });

        // Show overlay
        tl.to(
          crossOverlayRef.current,
          { autoAlpha: 1, duration: 1 },
          278
        );

        // Phase 13: Cross slides up from below into center
        tl.to(
          crossEl,
          {
            y: 0,
            duration: 40,
            ease: "power3.out",
          },
          278
        );

        // Phase 14: Cross expands to fill viewport
        tl.to(
          crossEl,
          {
            scale: 20,
            duration: 60,
            ease: "power3.inOut",
          },
          318
        );

        // Phase 15: Tools title appears word by word
        const toolsWords = toolsTitleWordRefs.current.filter(
          (el): el is HTMLSpanElement => Boolean(el)
        );
        if (toolsWords.length > 0) {
          tl.fromTo(
            toolsWords,
            { autoAlpha: 0, y: 36 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 4,
              stagger: 1.5,
              ease: "power3.out",
            },
            354
          );
        }

        // Phase 16: Tech items appear with stagger
        const techItems = techItemRefs.current.filter(
          (el): el is HTMLDivElement => Boolean(el)
        );
        tl.fromTo(
          techGridRef.current,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 8, ease: "power2.out" },
          360
        );
        if (techItems.length > 0) {
          tl.fromTo(
            techItems,
            { autoAlpha: 0, y: 18 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 2,
              stagger: 0.16,
              ease: "power2.out",
            },
            362
          );
        }
      }
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

              <div ref={expandBoxRef} className="design-expand-box" aria-hidden="true">
                <div ref={modelStageRef} className="design-model-stage">
                  <h2 className="about-title" aria-label="ABOUT ME">
                    {["ABOUT", "ME"].map((word, i) => (
                      <span
                        key={word}
                        ref={(el) => { aboutTitleWordRefs.current[i] = el; }}
                        className="about-title-word"
                      >
                        {word}
                      </span>
                    ))}
                  </h2>
                  <p ref={aboutSubtitleRef} className="about-subtitle" aria-label={ABOUT_SUBTITLE_LINES.join(" ")}>
                    {ABOUT_SUBTITLE_LINES.map((line) => (
                      <span key={line} className="about-subtitle-line">
                        {line}
                      </span>
                    ))}
                  </p>
                  <div ref={aboutParagraphRef} className="about-paragraph" aria-label={ABOUT_PARAGRAPH_TEXT}>
                    {(() => {
                      let wordIndex = 0;

                      return ABOUT_PARAGRAPHS.map((paragraph, paragraphIndex) => {
                        const words = paragraph.split(" ");

                        return (
                          <p key={`paragraph-${paragraphIndex}`} className="about-paragraph-block">
                            {words.map((word, wordInParagraphIndex) => {
                              const currentWordIndex = wordIndex;
                              wordIndex += 1;

                              return (
                                <Fragment key={`${word}-${paragraphIndex}-${wordInParagraphIndex}`}>
                                  <span
                                    ref={(el) => { aboutParagraphWordRefs.current[currentWordIndex] = el; }}
                                    className="about-paragraph-word"
                                  >
                                    {word}
                                  </span>
                                  {wordInParagraphIndex < words.length - 1 ? " " : ""}
                                </Fragment>
                              );
                            })}
                          </p>
                        );
                      });
                    })()}
                  </div>
                  <div ref={modelWrapRef} className="design-model-wrap">
                    <DroidScene
                      className="design-model-canvas"
                      motion={droidMotionRef.current}
                      variant="showcase"
                      visible
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cross reveal overlay */}
          <div ref={crossOverlayRef} className="works-cross-overlay" aria-hidden="true">
            <div className="works-cross-bg">
              <div className="tools-title-wrap">
                <span
                  ref={(el) => { toolsTitleWordRefs.current[0] = el; }}
                  className="tools-title-word"
                >
                  Tools &amp; Technologies
                </span>
                <span
                  ref={(el) => { toolsTitleWordRefs.current[1] = el; }}
                  className="tools-title-word tools-title-word--small"
                >
                  i use
                </span>
              </div>

              <div ref={techGridRef} className="tech-grid">
                {TECH_STACK.map((tech, i) => (
                  <div
                    key={tech.name}
                    ref={(el) => { techItemRefs.current[i] = el; }}
                    className="tech-item"
                  >
                    <img
                      className="tech-icon"
                      src={`${DEVICON_BASE}/${tech.icon}.svg`}
                      alt={tech.name}
                      loading="lazy"
                    />
                    <span className="tech-label">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <svg
              className="works-cross-svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <mask id="works-cross-mask">
                  <rect width="100" height="100" fill="white" />
                  <g ref={crossGroupRef}>
                    <rect x="35" y="5" width="30" height="90" fill="black" />
                    <rect x="5" y="35" width="90" height="30" fill="black" />
                  </g>
                </mask>
              </defs>
              <rect
                width="100"
                height="100"
                fill="#ffffff"
                mask="url(#works-cross-mask)"
              />
            </svg>
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
