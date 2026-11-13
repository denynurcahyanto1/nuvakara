import type { Metadata } from "next";

export const metadata: Metadata = { title: "Undangan Baru" };

export default function CreateEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
