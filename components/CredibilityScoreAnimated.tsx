"use client";

import { useAnimatedScore } from "@/hooks";
import { CredibilityScore } from "./CredibilityScore";
import type { Recommendation } from "@/lib/types";

type Props = {
  value: number;
  recommendation: Recommendation;
  reasons: string[];
};

export function CredibilityScoreAnimated({ value, recommendation, reasons }: Props) {
  const displayValue = useAnimatedScore(value);
  return (
    <CredibilityScore
      displayValue={displayValue}
      recommendation={recommendation}
      reasons={reasons}
    />
  );
}
