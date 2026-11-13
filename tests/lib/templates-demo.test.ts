import { describe, expect, test } from "vitest";
import { registry } from "@/components/templates/registry";
import { demoTemplateData } from "@/lib/templates-demo";

describe("template previews", () => {
  test("every registered template has demo content", () => {
    for (const slug of Object.keys(registry)) {
      expect(demoTemplateData[slug], `missing demo data for ${slug}`).toBeDefined();
    }
  });

  test("demo content has the fields templates render", () => {
    for (const [slug, data] of Object.entries(demoTemplateData)) {
      expect(data.title, slug).toBeTruthy();
      expect(data.date, slug).toBeTruthy();
      expect(data.description, slug).toBeTruthy();
      expect(data.venue, slug).toBeTruthy();
      expect(data.mapUrl, slug).toContain("output=embed");
      expect(data.images.length, slug).toBeGreaterThan(0);
    }
  });
});
