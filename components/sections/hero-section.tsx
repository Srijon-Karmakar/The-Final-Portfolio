"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blackLayerRef = useRef<HTMLDivElement>(null);
  const maskSvgRef = useRef<SVGSVGElement>(null);
  const whiteLayerRef = useRef<HTMLDivElement>(null);
  const subtextRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textEl = maskSvgRef.current?.querySelector("text");
      if (!textEl || !maskSvgRef.current) return;

      const charIndex = 4;
      let cx: number, cy: number;

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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          pin: ".hero-sticky",
        },
      });

      // Phase 1 (0-30): Dive into the "o"
      tl.to(
        maskSvgRef.current,
        {
          attr: { viewBox: finalViewBox },
          duration: 30,
          ease: "power3.in",
        },
        0
      );

      // Phase 2 (24-32): Black layer fades out
      tl.to(
        blackLayerRef.current,
        {
          opacity: 0,
          duration: 8,
          ease: "power2.in",
        },
        24
      );

      // Phase 3 (32-38): White layer content fades in
      tl.fromTo(
        whiteLayerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 6, ease: "power2.out" },
        32
      );

      // Phase 4 (38-56): Subtexts stagger in
      subtextRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 6, ease: "power2.out" },
          38 + i * 6
        );
      });

      // Phase 5 (58-72): Circle slides up from bottom to center-right
      tl.fromTo(
        circleRef.current,
        { y: "100vh" },
        { y: "0%", duration: 14, ease: "power2.out" },
        58
      );

      // Phase 6 (78-100): Circle expands to fill screen
      tl.to(
        circleRef.current,
        {
          scale: 15,
          duration: 22,
          ease: "power3.in",
        },
        78
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="hero-container">
      <div className="hero-sticky">
        {/* Black layer — zoom into the "o" portal */}
        <div ref={blackLayerRef} className="hero-black-layer">
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

        {/* White layer revealed after portal */}
        <div ref={whiteLayerRef} className="hero-white-layer">
          <div className="hero-name">
            <h1 className="hero-title">Srijon</h1>
            <h2 className="hero-title hero-title--surname">Karmakar</h2>
          </div>
          <div className="hero-subtexts">
            {["Engineer", "developer", "designer"].map((text, i) => (
              <span
                key={text}
                ref={(el) => { subtextRefs.current[i] = el; }}
                className="hero-subtext"
              >
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Lavender circle */}
        <div ref={circleRef} className="circle-orb" />
      </div>
    </section>
  );
}
