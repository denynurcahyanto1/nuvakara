import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/site-config";

describe("siteConfig", () => {
  it("memakai brand NUVAKARA dan tagline yang disepakati", () => {
    expect(siteConfig.name).toBe("NUVAKARA");
    expect(siteConfig.tagline).toBe("Every Moment Deserves a Beautiful Invitation.");
  });

  it("menampilkan 10 fitur sesuai spec", () => {
    expect(siteConfig.features).toHaveLength(10);
    expect(siteConfig.features.map((f) => f.id)).toEqual(
      expect.arrayContaining([
        "digital-invitation",
        "premium-templates",
        "rsvp",
        "guestbook",
        "gallery",
        "music",
        "countdown",
        "maps",
        "analytics",
        "whatsapp",
      ]),
    );
  });

  it("memuat 5 langkah how-it-works dan link nav ke section yang ada", () => {
    expect(siteConfig.howItWorks).toHaveLength(5);
    const hrefs = siteConfig.nav.map((n) => n.href);
    expect(hrefs).toEqual(
      expect.arrayContaining(["/#fitur", "/#template", "/#harga", "/#tentang"]),
    );
  });
});
