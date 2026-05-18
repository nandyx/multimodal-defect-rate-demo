"use client";

import { useAnimatedScore } from "@/hooks";
import { CredibilityScore } from "../molecules/CredibilityScore";
import type { Recommendation } from "@/lib/types";

type Props = {
  value: number;
  recommendation: Recommendation;
  reasons: string[];
};

export function CredibilityScoreSection({ value, recommendation, reasons }: Props) {
  const displayValue = useAnimatedScore(value);
  return (
    <CredibilityScore
      displayValue={displayValue}
      recommendation={recommendation}
      reasons={reasons}
    />
  );
}
