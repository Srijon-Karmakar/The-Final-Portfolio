"use client";

import { useEffect, useState } from "react";

export function HeroSection() {
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    const revealTimer = setTimeout(() => setPhase("reveal"), 450);
    const doneTimer = setTimeout(() => setPhase("done"), 2000);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <section className={`hero hero--${phase}`}>
      <div className="hero__loader">
        <div className="loader__spinner" />
      </div>

      <header className="hero__nav">
        <span className="nav__logo">srijon</span>

        <div className="nav__actions">
          <a href="#contact" className="nav__btn nav__btn--light">
            <span>CONTACT ME</span>
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

          <button type="button" className="nav__btn nav__btn--dark">
            <span>MENU</span>
            <span className="nav__dots">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <div className="hero__bigtext hero__bigtext--main" aria-hidden="true">
        <span className="bigtext__word">srijon</span>
      </div>

      <div className="hero__bigtext hero__bigtext--ghost" aria-hidden="true">
        <span className="bigtext__word">engineer</span>
      </div>

      <div className="hero__tagline">
        <p>
          Products that feel sharp,
          <br />
          scale cleanly, and ship fast.
        </p>
      </div>

      <span className="hero__scroll">Scroll</span>
    </section>
  );
}
