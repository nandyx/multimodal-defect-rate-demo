"use client";

import { useCallback, useEffect, useState } from "react";
import { getClaimById } from "@/data/stubs/claims";
import { PARTNER } from "@/data/partner.const";
import { isSpanishText } from "@/lib";
import { analyzeClaim, translateText } from "@/services";
import type { ClaimAnalysis } from "@/lib/types";
import type { ClaimDetailView } from "@/types";
import type { StubClaim } from "@/data/stubs/claims";

export function useClaimDetail(id: string) {
  const claim = getClaimById(id);
  const [analysis, setAnalysis] = useState<ClaimAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ClaimDetailView>("detail");
  const [claimLoaded, setClaimLoaded] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setClaimLoaded(true), 600);
    return () => clearTimeout(timer);
  }, [id]);

  const handleTranslate = useCallback(async () => {
    if (!claim) return;
    if (translatedText) {
      setShowOriginal(false);
      return;
    }
    setIsTranslating(true);
    try {
      const result = await translateText({
        text: claim.text,
        targetLang: PARTNER.language,
      });
      if (result) {
        setTranslatedText(result);
        setShowOriginal(false);
      }
    } catch {
    } finally {
      setIsTranslating(false);
    }
  }, [claim, translatedText]);

  const toggleOriginal = useCallback(() => {
    setShowOriginal((prev) => !prev);
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!claim) return;
    setView("analysis");
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeClaim({
        claimId: claim.id,
        scenarioType: claim.scenarioType,
        text: claim.text,
        imageUrl: claim.imageUrl || null,
      });
      setAnalysis(result);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Error de conexión. Verifica tu red e intenta de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [claim]);

  const goBackToDetail = useCallback(() => {
    setView("detail");
    setAnalysis(null);
    setError(null);
  }, []);

  const displayCommentText =
    translatedText && !showOriginal ? translatedText : (claim?.text ?? "");

  const showTranslateButton = claim ? !isSpanishText(claim.text) : false;

  return {
    claim: claim as StubClaim | undefined,
    analysis,
    isLoading,
    error,
    view,
    claimLoaded,
    translatedText,
    isTranslating,
    showOriginal,
    displayCommentText,
    showTranslateButton,
    handleTranslate,
    toggleOriginal,
    runAnalysis,
    goBackToDetail,
  };
}
