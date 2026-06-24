"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blackLayerRef = useRef<HTMLDivElement>(null);
  const introLockupRef = useRef<HTMLDivElement>(null);
  const introIconRef = useRef<HTMLImageElement>(null);
  const introWordRef = useRef<HTMLParagraphElement>(null);
  const maskSvgRef = useRef<SVGSVGElement>(null);
  const whiteLayerRef = useRef<HTMLDivElement>(null);
  const subtextRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let introTimeline: gsap.core.Timeline | null = null;
    let scrollTimeline: gsap.core.Timeline | null = null;
    const previousScrollRestoration =
      typeof window !== "undefined" && "scrollRestoration" in window.history
        ? window.history.scrollRestoration
        : null;

    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    const ctx = gsap.context(() => {
      const introLockup = introLockupRef.current;
      const introIcon = introIconRef.current;
      const introWord = introWordRef.current;
      const maskSvg = maskSvgRef.current;
      const textEl = maskSvg?.querySelector("text");

      if (!introLockup || !introIcon || !introWord || !maskSvg || !textEl) {
        return;
      }

      const buildScrollTimeline = () => {
        const charIndex = 4;
        let cx: number;
        let cy: number;

        try {
          const extent = textEl.getExtentOfChar(charIndex);
          cx = extent.x + extent.width / 2;
          cy = extent.y + extent.height / 2;
        } catch {
          cx = 567;
          cy = 80;
        }

        const finalSize = 2;
        const finalViewBox = `${cx - finalSize / 2} ${cy - finalSize / 2} ${finalSize} ${finalSize}`;

        scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            pin: ".hero-sticky",
          },
        });

        scrollTimeline.fromTo(
          maskSvg,
          { opacity: 0 },
          { opacity: 1, duration: 6, ease: "power2.out" },
          0
        );

        scrollTimeline.to(
          introLockup,
          {
            opacity: 0,
            duration: 6,
            ease: "power2.out",
          },
          0
        );

        scrollTimeline.to(
          maskSvg,
          {
            attr: { viewBox: finalViewBox },
            duration: 30,
            ease: "power3.in",
          },
          0
        );

        scrollTimeline.to(
          blackLayerRef.current,
          {
            opacity: 0,
            duration: 8,
            ease: "power2.in",
          },
          24
        );

        scrollTimeline.fromTo(
          whiteLayerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 6, ease: "power2.out" },
          32
        );

        subtextRefs.current.forEach((el, i) => {
          if (!el) return;
          scrollTimeline?.fromTo(
            el,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 6, ease: "power2.out" },
            38 + i * 6
          );
        });

        scrollTimeline.fromTo(
          circleRef.current,
          { y: "100vh" },
          { y: "0%", duration: 14, ease: "power2.out" },
          58
        );

        scrollTimeline.to(
          circleRef.current,
          {
            scale: 15,
            duration: 22,
            ease: "power3.in",
          },
          78
        );
      };

      const startIntro = () => {
        const wordWidth = introWord.scrollWidth;
        const lockupGap = Math.max(12, Math.min(28, window.innerWidth * 0.016));

        gsap.set(maskSvg, { opacity: 0 });
        gsap.set(introLockup, { opacity: 1 });
        gsap.set(introLockup, { gap: 0 });
        gsap.set(introIcon, { opacity: 0, scale: 0.82, x: 0 });
        gsap.set(introWord, { opacity: 0, width: 0, x: 18 });

        introTimeline = gsap.timeline({
          onComplete: buildScrollTimeline,
        });

        introTimeline.to(introIcon, {
          opacity: 1,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
        });

        introTimeline.to({}, { duration: 0.6 });

        introTimeline.to(introLockup, {
          gap: lockupGap,
          duration: 0.95,
          ease: "power3.inOut",
        });

        introTimeline.to(
          introWord,
          {
            opacity: 1,
            width: wordWidth,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "<+0.06"
        );
      };

      if (document.fonts?.ready) {
        document.fonts.ready.then(startIntro);
      } else {
        startIntro();
      }
    }, containerRef);

    return () => {
      if (previousScrollRestoration && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = previousScrollRestoration;
      }

      introTimeline?.kill();
      scrollTimeline?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="hero-container">
      <div className="hero-sticky">
        <div ref={blackLayerRef} className="hero-black-layer">
          <div ref={introLockupRef} className="hero-intro-lockup" aria-hidden="true">
            <img
              ref={introIconRef}
              src="/logo/icon.png"
              alt=""
              className="hero-intro-icon"
            />
            <p ref={introWordRef} className="hero-intro-word">
              srijon
            </p>
          </div>

          <svg
            ref={maskSvgRef}
            className="hero-mask-text"
            viewBox="0 0 900 200"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="450"
              y="140"
              textAnchor="middle"
              fill="white"
              fontFamily="'Azonix', sans-serif"
              fontWeight="400"
              fontSize="120"
              letterSpacing="-2"
            >
              srijon
            </text>
          </svg>
        </div>

        <div ref={whiteLayerRef} className="hero-white-layer">
          <div className="hero-name">
            <h1 className="hero-title">Srijon</h1>
            <h2 className="hero-title hero-title--surname">Karmakar</h2>
          </div>
          <div className="hero-subtexts">
            {["Engineer", "developer", "designer"].map((text, i) => (
              <span
                key={text}
                ref={(el) => {
                  subtextRefs.current[i] = el;
                }}
                className="hero-subtext"
              >
                {text}
              </span>
            ))}
          </div>
        </div>

        <div ref={circleRef} className="circle-orb" />
      </div>
    </section>
  );
}
