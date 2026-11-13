import type { FC } from "react";
import type { GuestbookMessage, TemplateData } from "@/lib/templates-data";

/**
 * Contract between the registry and every template renderer.
 *
 * `eventId` and `messages` are absent on the public preview route, where the
 * RSVP and guestbook forms render in a disabled preview state.
 */
export interface TemplateRenderProps {
  data: TemplateData;
  eventId?: number;
  messages?: GuestbookMessage[];
  mode?: "live" | "preview";
}

export type TemplateRenderer = FC<TemplateRenderProps>;
