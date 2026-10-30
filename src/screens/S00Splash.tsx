import React, { useEffect, useState } from "react";
import { useDemo } from "../context/Demo";

export const S00Splash: React.FC = () => {
  const { reset } = useDemo();
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        reset("02");
      }, 800);
      return () => clearTimeout(timer);
    }

    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 2000);

    const endTimer = setTimeout(() => {
      reset("02");
    }, 2280);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [reset]);

  const handleSkip = () => {
    reset("02");
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex items-center justify-center cursor-pointer select-none transition-opacity duration-280 ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="flex items-center gap-3">
        <svg
          width={36}
          height={45}
          viewBox="0 0 32 40"
          fill="var(--accent)"
          aria-hidden="true"
          className="overflow-visible"
        >
          <g className="splash-l-bar">
            <rect x="0" y="0" width="10" height="40" />
          </g>
          <g className="splash-l-foot">
            <polygon points="10,30 32,30 26,40 10,40" />
          </g>
        </svg>

        <span
          className="font-semibold text-[28px] tracking-tight splash-wordmark"
          style={{ color: "var(--ink)" }}
        >
          Logislo
        </span>
      </div>

      <style>{`
        .splash-l-bar {
          transform-box: fill-box;
          transform-origin: bottom;
          animation: barGrow 480ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .splash-l-foot {
          transform-box: fill-box;
          transform-origin: left;
          animation: footExtend 320ms cubic-bezier(0.16, 1, 0.3, 1) 420ms both;
        }

        .splash-wordmark {
          animation: wordmarkReveal 360ms cubic-bezier(0.16, 1, 0.3, 1) 800ms both;
        }

        @keyframes barGrow {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }

        @keyframes footExtend {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes wordmarkReveal {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .splash-l-bar, .splash-l-foot, .splash-wordmark {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};
