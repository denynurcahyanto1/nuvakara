import type { ReactNode } from "react";
import { Footer } from "@/components/marketing/Footer";
import { Navbar } from "@/components/marketing/Navbar";

/** Shared shell for the public marketing pages. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-24 sm:pt-28">{children}</main>
      <Footer />
    </>
  );
}
