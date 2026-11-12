import { cn } from "@/lib/cn";

export interface GradientOrbProps {
  className?: string;
  color?: "gold" | "champagne" | "blush" | "sage";
}

const gradients: Record<NonNullable<GradientOrbProps["color"]>, string> = {
  gold: "radial-gradient(circle at center, rgba(198,161,91,0.55) 0%, rgba(198,161,91,0) 70%)",
  champagne:
    "radial-gradient(circle at center, rgba(232,217,192,0.65) 0%, rgba(232,217,192,0) 70%)",
  blush:
    "radial-gradient(circle at center, rgba(232,201,196,0.55) 0%, rgba(232,201,196,0) 70%)",
  sage: "radial-gradient(circle at center, rgba(185,199,178,0.55) 0%, rgba(185,199,178,0) 70%)",
};

/**
 * Soft blurred colour blob used as ambient background. Purely decorative,
 * animated with CSS so it stays off the main thread.
 */
export function GradientOrb({
  className,
  color = "gold",
}: GradientOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("orb-drift pointer-events-none absolute rounded-full blur-3xl", className)}
      style={{ background: gradients[color] }}
    />
  );
}
