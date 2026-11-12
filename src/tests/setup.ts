import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

/**
 * jsdom (as shipped with Vitest 5) does not implement `window.matchMedia`,
 * which GSAP's ScrollTrigger requires at registration time. The stub below
 * answers the queries this project actually uses, so the animation layer
 * behaves the same in tests as it does in a browser.
 */
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  const evaluate = (query: string): boolean => {
    if (query.includes("prefers-reduced-motion: reduce")) return false;
    if (query.includes("prefers-reduced-motion: no-preference")) return true;
    if (query.includes("min-width: 1024px")) return window.innerWidth >= 1024;
    if (query.includes("min-width: 768px")) return window.innerWidth >= 768;
    if (query.includes("hover: hover")) return true;
    if (query.includes("pointer: fine")) return true;
    return false;
  };

  window.matchMedia = ((query: string) => ({
    matches: evaluate(query),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

/**
 * jsdom does not implement IntersectionObserver either. The stub reports
 * every observed element as visible so viewport-driven animations settle
 * deterministically.
 */
if (!globalThis.IntersectionObserver) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    private readonly callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }

    observe(target: Element): void {
      this.callback(
        [
          {
            isIntersecting: true,
            target,
            intersectionRatio: 1,
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRect: target.getBoundingClientRect(),
            rootBounds: null,
            time: 0,
          } as IntersectionObserverEntry,
        ],
        this,
      );
    }

    unobserve(): void {}

    disconnect(): void {}

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  globalThis.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
}
