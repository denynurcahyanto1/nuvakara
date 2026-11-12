"use client";

import { useRef } from "react";
import { gsap, motionQueries, useGSAP } from "./gsap";

export interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  className?: string;
}

/**
 * Word-by-word reveal. The full text is exposed once to screen readers
 * (`.sr-only`) while the animated words are hidden from them.
 */
export function TextReveal({
  text,
  as = "span",
  delay = 0,
  className,
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };
  const words = text.split(" ");

  useGSAP(() => {
    const root = ref.current;
    if (!root) return;
    const wordElements = root.querySelectorAll<HTMLElement>("[data-word]");

    const mm = gsap.matchMedia();
    mm.add(motionQueries.animate, () => {
      gsap.from(wordElements, {
        yPercent: 110,
        opacity: 0,
        duration: 0.65,
        delay,
        ease: "power3.out",
        stagger: 0.05,
      });
    });

    return () => mm.revert();
  }, { scope: ref });

  const content = (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            data-word=""
            className="inline-block overflow-hidden align-bottom"
          >
            <span className="inline-block">
              {word}
              {index < words.length - 1 ? "\u00A0" : ""}
            </span>
          </span>
        ))}
      </span>
    </>
  );

  const props = { ref: setRef, className } as const;

  if (as === "h1") return <h1 {...props}>{content}</h1>;
  if (as === "h2") return <h2 {...props}>{content}</h2>;
  if (as === "h3") return <h3 {...props}>{content}</h3>;
  if (as === "p") return <p {...props}>{content}</p>;
  return <span {...props}>{content}</span>;
}
