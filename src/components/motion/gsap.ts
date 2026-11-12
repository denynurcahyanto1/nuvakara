import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * GSAP setup shared by every animation primitive.
 *
 * Registration happens only in the browser: these modules are imported by
 * client components that are still server-rendered, and GSAP must never run
 * during SSR.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

/**
 * Media queries used across the motion layer.
 *
 * `gsap.matchMedia()` runs a callback only while its query matches, and
 * reverts the animations it created when the query stops matching. Using
 * explicit queries (instead of a conditions object) keeps the semantics
 * obvious: `animate` matches only when the user has NOT asked for reduced
 * motion, so every animation is a no-op for those users — and because the
 * start state is applied by GSAP itself, their content simply stays visible.
 */
export const motionQueries = {
  /** Animations are allowed. */
  animate: "(prefers-reduced-motion: no-preference)",
  /** The user asked for less motion. */
  reduce: "(prefers-reduced-motion: reduce)",
  /** Pointer devices with a real hover state. */
  pointerFine: "(hover: hover) and (pointer: fine)",
  /** Desktop widths, where parallax and magnetic buttons make sense. */
  desktop: "(min-width: 768px)",
  /** Large screens only. */
  wide: "(min-width: 1024px)",
} as const;

/** Combines media queries, e.g. `and("(min-width: 768px)", "(prefers-reduced-motion: no-preference)")`. */
export function and(...queries: string[]): string {
  return queries.map((query) => `(${query})`).join(" and ");
}

export { gsap, ScrollTrigger, useGSAP };
