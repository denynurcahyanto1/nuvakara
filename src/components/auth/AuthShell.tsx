import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";

export interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Short points shown on the desktop side panel. */
  highlights?: { title: string; description: string }[];
}

/**
 * Split layout for the auth pages: brand panel on the left (desktop only),
 * form on the right. On a phone the form takes the full width, because the
 * brand panel would only push the form below the fold.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  highlights,
}: AuthShellProps) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-navy p-12 lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-champagne/10 blur-3xl"
        />

        <Logo size={40} variant="light" href="/" />

        <div className="relative flex flex-col gap-8">
          <h2 className="max-w-md font-display text-4xl leading-tight text-ivory">
            Setiap momen layak punya undangan yang memorable.
          </h2>

          {highlights?.length ? (
            <ul className="flex flex-col gap-5">
              {highlights.map((highlight) => (
                <li key={highlight.title} className="flex flex-col gap-1">
                  <span className="font-display text-lg text-gold">
                    {highlight.title}
                  </span>
                  <span className="text-sm text-ivory/70">
                    {highlight.description}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <p className="relative text-xs text-ivory/50">
          © {new Date().getFullYear()} NUVAKARA
        </p>
      </aside>

      <main className="flex flex-col bg-ivory">
        <div className="flex items-center justify-between border-b border-navy/10 px-5 py-4 lg:hidden">
          <Logo size={32} />
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-sm text-navy/70 transition-colors hover:text-navy"
          >
            Kembali
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 sm:py-16">
          <div className="w-full max-w-md">
            <h1 className="font-display text-3xl text-navy sm:text-4xl">{title}</h1>
            {subtitle ? (
              <p className="mt-2 text-sm text-muted">{subtitle}</p>
            ) : null}

            <div className="mt-8">{children}</div>

            {footer ? <div className="mt-8">{footer}</div> : null}
          </div>
        </div>
      </main>
    </div>
  );
}
