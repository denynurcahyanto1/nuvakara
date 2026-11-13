import { templateCatalog } from "@/components/templates/catalog";
import type { TemplatePreview } from "@/lib/types";

/**
 * Catalogue shown on `/template` and the marketing showcase. Derived from the
 * template registry so a new design can never be missing from the catalogue.
 */
export const templatePreviews: TemplatePreview[] = templateCatalog;

export { templateCatalog };
