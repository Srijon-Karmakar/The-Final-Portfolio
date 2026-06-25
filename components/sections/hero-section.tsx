"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LOGO_O_TRANSFORM_ORIGIN = "75.4% 54.7%";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blackLayerRef = useRef<HTMLDivElement>(null);
  const introLockupRef = useRef<HTMLDivElement>(null);
  const introLogoRef = useRef<HTMLImageElement>(null);
  const zoomLogoStageRef = useRef<HTMLDivElement>(null);
  const zoomLogoRef = useRef<HTMLImageElement>(null);
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
      const introLogo = introLogoRef.current;
      const zoomLogoStage = zoomLogoStageRef.current;
      const zoomLogo = zoomLogoRef.current;

      if (!introLockup || !introLogo || !zoomLogoStage || !zoomLogo) {
        return;
      }

      const buildScrollTimeline = () => {
        scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            pin: ".hero-sticky",
          },
        });

        scrollTimeline.set(zoomLogo, { transformOrigin: LOGO_O_TRANSFORM_ORIGIN }, 0);

        scrollTimeline.fromTo(zoomLogoStage, { opacity: 0 }, { opacity: 1, duration: 2, ease: "none" }, 0);

        scrollTimeline.to(introLockup, { opacity: 0, duration: 6, ease: "power2.out" }, 0);

        scrollTimeline.to(
          zoomLogo,
          {
            scale: 28,
            duration: 30,
            ease: "power3.in",
            transformOrigin: LOGO_O_TRANSFORM_ORIGIN,
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
        gsap.set(zoomLogoStage, { opacity: 0 });
        gsap.set(zoomLogo, { scale: 1, transformOrigin: LOGO_O_TRANSFORM_ORIGIN });
        gsap.set(introLockup, { opacity: 1 });
        gsap.set(introLogo, { opacity: 0, scale: 0.86, y: 18 });

        introTimeline = gsap.timeline({
          onComplete: buildScrollTimeline,
        });

        introTimeline.to(introLogo, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
        });

        introTimeline.to({}, { duration: 0.9 });
      };

      startIntro();
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
            <img ref={introLogoRef} src="/logo/logo.png" alt="" className="hero-intro-logo" />
          </div>

          <div ref={zoomLogoStageRef} className="hero-zoom-logo-stage" aria-hidden="true">
            <img ref={zoomLogoRef} src="/logo/logo.png" alt="" className="hero-zoom-logo" />
          </div>
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
