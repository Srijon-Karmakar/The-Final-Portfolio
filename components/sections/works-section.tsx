"use client";

import dynamic from "next/dynamic";
import { Fragment, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DroidScene } from "@/components/droid-scene";
import type { InfiniteMenuItem } from "@/components/infinite-menu";
import { MagnetLines } from "@/components/magnet-lines";

gsap.registerPlugin(ScrollTrigger);

const InfiniteMenu = dynamic(
  () => import("@/components/infinite-menu").then((mod) => mod.InfiniteMenu),
  { ssr: false }
);

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

interface CareerStat {
  value: number;
  label: string;
  suffix?: string;
  decimals?: number;
}


const ENGINEERING_PROJECTS: Project[] = [
  {
    img: "https://res.cloudinary.com/dneq7tdty/image/upload/v1782383831/the_better_pass_oxk3e9.png",
    title: "BetterPass",
    desc: "Travel app",
    link: "https://thebetterpass.com",
  },
  {
    img: "https://res.cloudinary.com/dneq7tdty/image/upload/v1782383831/toolit_zkgtgd.png",
    title: "ToolMitra",
    desc: "Online tool system",
    link: "https://toolit-y4pd.onrender.com",
  },
  {
    img: "https://res.cloudinary.com/dneq7tdty/image/upload/v1782383831/snv_studio_yyhswq.png",
    title: "Senevon Studio",
    desc: "Agency portfolio",
    link: "https://senevon.in",
  },
  {
    img: "https://res.cloudinary.com/dneq7tdty/image/upload/v1782383831/house_of_musa_ztbea2.png",
    title: "House of Musa",
    desc: "3D agency portfolio",
    link: "https://www.houseofmusa.co.in",
  },
  {
    img: "https://res.cloudinary.com/dneq7tdty/image/upload/v1782383830/cricket_game_yiasxt.png",
    title: "POV-Cricket Game",
    desc: "3D online game",
    link: "https://pov-cricket.onrender.com",
  },
  {
    img: "https://res.cloudinary.com/dneq7tdty/image/upload/v1782383830/art_block_d3xgk2.png",
    title: "ArtBlock",
    desc: "Social media",
    link: "https://artblock-03d1.onrender.com",
  },
  {
    img: "https://res.cloudinary.com/dneq7tdty/image/upload/v1782383829/3d-portfolio_myrle9.png",
    title: "3D-Portfolio",
    desc: "Personal portfolio",
    link: "https://srijons.onrender.com",
  },
  {
    img: "https://res.cloudinary.com/dneq7tdty/image/upload/v1782383829/esportm_osgsiz.png",
    title: "EsportM",
    desc: "Sports management system",
    link: "https://esm-9x3l.onrender.com",
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
const CAREER_TITLE_LINES = ["Career", "at a glance"];
const CAREER_SUMMARY = "CV-backed snapshot of projects, product work, and engineering progress.";
const CAREER_STATS: CareerStat[] = [
  { value: 10, suffix: "+", label: "Projects" },
  { value: 3, label: "Games Created" },
  { value: 3, label: "Ongoing Projects" },
  { value: 1, suffix: "+", label: "Engineering Experience" },
  { value: 5, label: "Years in Graphic Design" },
  { value: 8.6, decimals: 1, label: "CGPA" },
];
const SHOWCASE_MENU_ITEMS: InfiniteMenuItem[] = [
  {
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&h=1600&fit=crop",
    link: "#",
    title: "Cloud Code Editor",
    description: "React + Node editor with auth, storage, and execution flows.",
  },
  {
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&h=1600&fit=crop",
    link: "#",
    title: "Online Tool System",
    description: "Backend-powered media workflows with validation and secure file handling.",
  },
  {
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=1600&fit=crop",
    link: "#",
    title: "Testing Portal",
    description: "NestJS proctoring system for tests, assignments, and role-based access.",
  },
  {
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&h=1600&fit=crop",
    link: "#",
    title: "Sports ERP",
    description: "Multi-role platform to manage club operations, players, and administration.",
  },
  {
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&h=1600&fit=crop",
    link: "#",
    title: "Cricket Game",
    description: "3D cricket experience built with Three.js, TypeScript, Cannon, and Blender.",
  },
  {
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1600&h=1600&fit=crop",
    link: "#",
    title: "Agency Portfolio",
    description: "Motion-led portfolio system focused on presentation, clarity, and interaction.",
  },
];

function formatCareerStatValue(stat: CareerStat, value: number) {
  const digits = stat.decimals ?? 0;
  return `${value.toFixed(digits)}${stat.suffix ?? ""}`;
}

export function WorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRefs = useRef<(HTMLAnchorElement | null)[]>([]);
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
  const crossPlusRef = useRef<HTMLDivElement>(null);
  const crossGroupRef = useRef<SVGGElement>(null);
  const crossVisibleGroupRef = useRef<SVGGElement>(null);
  const crossMaskRectRef = useRef<SVGRectElement>(null);
  const careerTitleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const careerSummaryRef = useRef<HTMLParagraphElement>(null);
  const careerStatsGridRef = useRef<HTMLDivElement>(null);
  const careerStatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const careerStatValueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bottomRevealRef = useRef<HTMLDivElement>(null);
  const bottomShowcaseVisibleRef = useRef(false);
  const droidMotionRef = useRef({ drift: 0, spin: 0 });

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showBottomShowcase, setShowBottomShowcase] = useState(false);

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
      const careerTitleWords = careerTitleRefs.current.filter(
        (el): el is HTMLSpanElement => Boolean(el)
      );
      const careerStatCards = careerStatRefs.current.filter(
        (el): el is HTMLDivElement => Boolean(el)
      );
      if (aboutParagraphWords.length > 0) {
        gsap.set(aboutParagraphWords, { opacity: 0.1 });
        gsap.set(aboutParagraphWords[0], { opacity: 1 });
        if (aboutParagraphWords[1]) {
          gsap.set(aboutParagraphWords[1], { opacity: 0.4 });
        }
      }
      if (bottomRevealRef.current) {
        gsap.set(bottomRevealRef.current, { yPercent: 100 });
      }
      careerStatValueRefs.current.forEach((el, i) => {
        if (!el) return;
        el.textContent = formatCareerStatValue(CAREER_STATS[i], 0);
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          pin: ".works-sticky",
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const nextShowBottomShowcase = self.progress > 0.935;
            if (bottomShowcaseVisibleRef.current !== nextShowBottomShowcase) {
              bottomShowcaseVisibleRef.current = nextShowBottomShowcase;
              setShowBottomShowcase(nextShowBottomShowcase);
            }
          },
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
      const crossVisibleEl = crossVisibleGroupRef.current;
      const crossPlusEl = crossPlusRef.current;
      if (crossOverlayRef.current) {
        if (crossEl && crossVisibleEl) {
          gsap.set([crossEl, crossVisibleEl], {
            scale: 0.1,
            y: 80,
            x: 0,
            svgOrigin: "50 50",
          });
        }
        if (crossPlusEl) {
          gsap.set(crossPlusEl, {
            scale: 0.1,
            y: 80,
            transformOrigin: "50% 50%",
          });
        }

        tl.to(
          crossOverlayRef.current,
          { autoAlpha: 1, duration: 1 },
          278
        );

        if (crossEl && crossVisibleEl && crossPlusEl) {
          tl.to(
            [crossEl, crossVisibleEl, crossPlusEl],
            {
              y: 0,
              duration: 40,
              ease: "power3.out",
            },
            278
          );

          tl.to(
            [crossEl, crossVisibleEl, crossPlusEl],
            {
              scale: 20,
              duration: 60,
              ease: "power3.inOut",
            },
            318
          );
        }

        tl.to(
          crossMaskRectRef.current,
          {
            autoAlpha: 0,
            duration: 6,
            ease: "power2.inOut",
          },
          348
        );
      }

      if (careerTitleWords.length > 0) {
        tl.fromTo(
          careerTitleWords,
          { autoAlpha: 0, y: 44 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 6,
            stagger: 2.5,
            ease: "power3.out",
          },
          352
        );
      }
      tl.fromTo(
        careerSummaryRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 8, ease: "power2.out" },
        360
      );
      tl.fromTo(
        careerStatsGridRef.current,
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 8, ease: "power2.out" },
        370
      );
      if (careerStatCards.length > 0) {
        tl.fromTo(
          careerStatCards,
          { autoAlpha: 0, y: 28, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 4,
            stagger: 1.5,
            ease: "power2.out",
          },
          372
        );
      }
      CAREER_STATS.forEach((stat, i) => {
        const el = careerStatValueRefs.current[i];
        if (!el) return;

        const counter = { value: 0 };
        tl.to(
          counter,
          {
            value: stat.value,
            duration: 10,
            ease: "power2.out",
            snap: stat.decimals ? undefined : { value: 1 },
            onUpdate: () => {
              el.textContent = formatCareerStatValue(stat, counter.value);
            },
          },
          376 + i * 1.8
        );
      });
      tl.fromTo(
        bottomRevealRef.current,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 24,
          ease: "power3.inOut",
        },
        398
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
                <a
                  key={i}
                  ref={(el) => { gridRefs.current[i] = el; }}
                  className="bento-item"
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title}`}
                >
                  <img src={project.img} alt={project.title} loading="lazy" />
                  <div className="bento-overlay">
                    <div className="bento-overlay-copy">
                      <span className="bento-overlay-title">{project.title}</span>
                      <span className="bento-overlay-subtitle">{project.desc}</span>
                    </div>
                  </div>
                </a>
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
          <div ref={crossOverlayRef} className="works-cross-overlay">
            <div className="works-cross-bg" />
            <div ref={crossPlusRef} className="works-cross-plus" aria-hidden="true" />
            <div className="career-glance-wrap">
              <h2 className="career-title" aria-label="Career at a glance">
                {CAREER_TITLE_LINES.map((line, i) => (
                  <span
                    key={line}
                    ref={(el) => { careerTitleRefs.current[i] = el; }}
                    className="career-title-line"
                  >
                    {line}
                  </span>
                ))}
              </h2>
              <p ref={careerSummaryRef} className="career-summary">
                {CAREER_SUMMARY}
              </p>
              <div ref={careerStatsGridRef} className="career-stats-grid">
                {CAREER_STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    ref={(el) => { careerStatRefs.current[i] = el; }}
                    className="career-stat-card"
                  >
                    <span
                      ref={(el) => { careerStatValueRefs.current[i] = el; }}
                      className="career-stat-value"
                    >
                      {formatCareerStatValue(stat, 0)}
                    </span>
                    <span className="career-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <svg
              className="works-cross-svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
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
                ref={crossMaskRectRef}
                width="100"
                height="100"
                fill="#ffffff"
                mask="url(#works-cross-mask)"
              />
              <g ref={crossVisibleGroupRef}>
                <rect x="35" y="5" width="30" height="90" fill="#f97316" />
                <rect x="5" y="35" width="90" height="30" fill="#f97316" />
              </g>
            </svg>
          </div>

          <div
            ref={bottomRevealRef}
            className="works-slide works-bottom-reveal"
          >
            {showBottomShowcase ? (
              <div className="works-bottom-reveal-bg">
                <MagnetLines
                  rows={18}
                  columns={14}
                  containerSize="120vmax"
                  lineColor="#ff8843"
                  lineWidth="2px"
                  lineHeight="30px"
                  baseAngle={-10}
                  className="works-bottom-magnet-lines"
                />
              </div>
            ) : null}
            <div className="works-bottom-reveal-content">
              {showBottomShowcase ? (
                <InfiniteMenu items={SHOWCASE_MENU_ITEMS} scale={1} />
              ) : null}
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
