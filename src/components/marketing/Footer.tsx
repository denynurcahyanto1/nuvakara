import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/lib/site-config";

const socialIcons: Record<string, IconName> = {
  Instagram: "instagram",
  TikTok: "tiktok",
  LinkedIn: "linkedin",
  WhatsApp: "whatsapp",
};

export function Footer() {
  return (
    <footer id="tentang" className="border-t border-navy/10 bg-ivory py-16">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Logo size={34} />
            <p className="max-w-xs text-sm text-navy/70">
              {siteConfig.footer.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {siteConfig.footer.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="tap-target rounded-full border border-navy/12 text-navy/70 transition-colors hover:border-gold hover:text-gold-deep"
                >
                  <Icon name={socialIcons[social.label] ?? "mail"} size={18} />
                </a>
              ))}
            </div>
          </div>

          {siteConfig.footer.navGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <h2 className="text-xs font-semibold tracking-[0.2em] text-gold-deep uppercase">
                {group.title}
              </h2>
              <ul className="flex flex-col gap-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-sm text-navy/75 transition-colors hover:text-navy"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 border-t border-navy/10 pt-8 text-sm text-navy/70 sm:grid-cols-3">
          <p className="flex items-center gap-2">
            <Icon name="mail" size={16} />
            <a href={`mailto:${siteConfig.footer.contact.email}`}>
              {siteConfig.footer.contact.email}
            </a>
          </p>
          <p className="flex items-center gap-2">
            <Icon name="phone" size={16} />
            <a href={`tel:${siteConfig.footer.contact.phone.replace(/\s/g, "")}`}>
              {siteConfig.footer.contact.phone}
            </a>
          </p>
          <p className="flex items-center gap-2">
            <Icon name="pin" size={16} />
            {siteConfig.footer.contact.address}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-navy/10 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. Seluruh hak
            cipta dilindungi.
          </p>
          <div className="flex gap-4">
            <Link href="/privasi" className="min-h-11 py-3 transition-colors hover:text-navy">
              Privacy Policy
            </Link>
            <Link href="/ketentuan" className="min-h-11 py-3 transition-colors hover:text-navy">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
