import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Plan } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export interface PricingProps {
  plans: Plan[];
}

/**
 * Price catalogue. No payment gateway is connected yet, so the section states
 * that plainly instead of pretending a checkout exists.
 */
export function Pricing({ plans }: PricingProps) {
  return (
    <section id="harga" className="relative bg-cream/60 py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Harga"
            title="Paket yang tumbuh bersama acara Anda"
            description="Mulai gratis, lalu naikkan paket ketika butuh lebih banyak undangan dan template premium."
          />
        </Reveal>

        {plans.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              title="Paket harga sedang disiapkan"
              description="Paket akan dimuat dari dashboard admin. Sementara itu, Anda tetap bisa membuat akun dan menggunakan template gratis."
            />
          </div>
        ) : (
          <>
            <Stagger className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <StaggerItem key={plan.id}>
                  <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-[var(--shadow-soft)]">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-2xl text-navy">
                        {plan.name}
                      </h3>
                      {plan.isPremium ? <Badge variant="premium">Premium</Badge> : null}
                    </div>

                    <p className="mt-4 font-display text-3xl text-navy">
                      {formatCurrency(plan.price, plan.currency)}
                    </p>

                    {plan.description ? (
                      <p className="mt-2 text-sm text-navy/70">{plan.description}</p>
                    ) : null}

                    <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm text-navy/75">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span aria-hidden="true" className="mt-1 text-gold-deep">
                            &#10003;
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/register"
                      className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-navy px-5 text-sm font-medium text-ivory transition-colors hover:bg-navy-soft"
                    >
                      Pilih Paket
                    </Link>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>

            <p className="mt-6 text-center text-xs text-slate-600">
              Pembayaran belum tersedia â€” paket yang dipilih langsung aktif tanpa
              transaksi apa pun.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
