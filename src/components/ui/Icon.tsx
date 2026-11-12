import type { SVGProps } from "react";

export type IconName =
  | "invitation"
  | "templates"
  | "rsvp"
  | "guestbook"
  | "gallery"
  | "music"
  | "countdown"
  | "maps"
  | "analytics"
  | "whatsapp"
  | "menu"
  | "close"
  | "arrow-right"
  | "mail"
  | "phone"
  | "pin"
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "check"
  | "eye"
  | "eye-off";

const paths: Record<IconName, string[]> = {
  invitation: [
    "M4 6h16v12H4z",
    "m4 7 8 6 8-6",
  ],
  templates: [
    "M4 4h7v7H4z",
    "M13 4h7v4h-7z",
    "M13 10h7v10h-7z",
    "M4 13h7v7H4z",
  ],
  rsvp: [
    "M9 11l3 3 7-7",
    "M20 12a8 8 0 1 1-3.2-6.4",
  ],
  guestbook: [
    "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z",
    "M9 8h6",
    "M9 12h6",
  ],
  gallery: [
    "M3 6h18v12H3z",
    "m3 16 5-4 4 3 3-2 6 4",
    "M8.5 9.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z",
  ],
  music: [
    "M9 18V6l11-2v12",
    "M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
    "M20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  ],
  countdown: [
    "M12 8v4l3 2",
    "M19 12a7 7 0 1 1-3.2-6.4",
    "M12 3v2",
  ],
  maps: [
    "M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z",
    "M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  ],
  analytics: [
    "M4 20V10",
    "M10 20V4",
    "M16 20v-7",
    "M22 20H2",
  ],
  whatsapp: [
    "M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12z",
    "M9 9c0 3 3 6 6 6",
  ],
  menu: ["M4 7h16", "M4 12h16", "M4 17h16"],
  close: ["m6 6 12 12", "m18 6-12 12"],
  "arrow-right": ["M5 12h14", "m13 6 6 6-6 6"],
  mail: ["M3 7h18v10H3z", "m3 7 9 6 9-6"],
  phone: [
    "M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z",
  ],
  pin: [
    "M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z",
  ],
  instagram: [
    "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z",
    "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z",
    "M17.5 6.5h.01",
  ],
  tiktok: [
    "M15 4v9.5a3.5 3.5 0 1 1-3-3.46",
    "M15 4c.6 2.3 2.2 3.6 4.5 3.8",
  ],
  linkedin: [
    "M6 9v9",
    "M6 5.5v.01",
    "M10 18v-5a3 3 0 0 1 6 0v5",
    "M10 9v9",
  ],
  check: ["m5 13 4 4L19 7"],
  eye: [
    "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z",
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  ],
  "eye-off": [
    "M4 4l16 16",
    "M9.9 5.2A9.9 9.9 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.3 7.8A17 17 0 0 0 2 12s3.5 7 10 7a9.8 9.8 0 0 0 4-.8",
  ],
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 24, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
