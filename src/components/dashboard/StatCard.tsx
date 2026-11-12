"use client";

import { FC } from "react";
import { Icon, IconName } from "@/components/ui/Icon";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: IconName;
  trend?: { value: number; label: string };
  className?: string;
}

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}) => {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-navy/10 p-6
        shadow-soft hover:shadow-glow transition-shadow
        ${className || ""}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-gold-deep uppercase">
            {title}
          </p>
          <p className="mt-1 font-display text-3xl text-navy">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-muted">{description}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
          <Icon name={icon} size={24} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 pt-4 border-t border-navy/10">
          <span
            className={`text-sm font-medium ${
              trend.value >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </span>
        </div>
      )}
    </div>
  );
};