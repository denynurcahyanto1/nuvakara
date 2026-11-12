import type { ReactNode } from "react";
import { PageTransition } from "@/components/motion/PageTransition";

/**
 * Wraps every route change so navigation fades and lifts smoothly.
 * Reduced-motion users get a plain fade.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
