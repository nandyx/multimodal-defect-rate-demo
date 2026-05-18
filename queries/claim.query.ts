import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/lib/http-client";
import type { ClaimAnalysis } from "@/lib/types";

type AnalyzePayload = {
  claimId: string;
  scenarioType: string;
  text: string;
  imageUrl: string | null;
};

type AnalyzeResponse = ClaimAnalysis | { error: { message: string } };

async function analyzeClaim(payload: AnalyzePayload): Promise<ClaimAnalysis> {
  const { data } = await httpClient.post<AnalyzeResponse>("/analyze-claim", payload);
  if ("error" in data && data.error) {
    throw new Error(data.error.message);
  }
  return data as ClaimAnalysis;
}

export function useAnalyzeClaim() {
  return useMutation({
    mutationFn: analyzeClaim,
  });
}
