"use client";

import { cn } from "@/styles";
import type { Recommendation } from "@/lib/types";
import {
  BTN,
  CIRCUMFERENCE,
  ICONS,
  LABELS,
  RING,
  SURFACE,
  TEXT,
  TITLES,
} from "@/consts/credibility-score.const";

type Props = {
  displayValue: number;
  recommendation: Recommendation;
  reasons: string[];
};

export function CredibilityScore({ displayValue, recommendation, reasons }: Props) {
  const strokeDashoffset = CIRCUMFERENCE - (displayValue / 100) * CIRCUMFERENCE;
  const ReasonIcon = ICONS[recommendation];

  return (
    <div className={cn(SURFACE[recommendation], "md:p-6")}>
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div className="relative score-circle-sm md:score-circle-lg flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              className="text-muted"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              className={cn(RING[recommendation], "transition-all duration-300")}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-3xl md:text-4xl font-bold", TEXT[recommendation])}>
              {displayValue}
            </span>
            <span className="text-xs text-muted uppercase tracking-wider">score</span>
          </div>
        </div>

        <div className="flex-1 w-full">
          <p
            className={cn(
              "font-semibold text-sm uppercase tracking-wider mb-2",
              TEXT[recommendation],
            )}
          >
            {TITLES[recommendation]}
          </p>
          <ul className="space-y-1.5">
            {reasons.map((reason, i) => (
              <li key={i} className="text-sm text-muted flex items-start gap-2">
                <ReasonIcon size={14} className={cn("mt-0.5 flex-shrink-0", TEXT[recommendation])} />
                {reason}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={cn(
              "mt-4 w-full md:w-auto px-6 py-3 rounded-full font-semibold text-white text-sm transition-colors",
              BTN[recommendation],
            )}
          >
            {LABELS[recommendation]}
          </button>
        </div>
      </div>
    </div>
  );
}
