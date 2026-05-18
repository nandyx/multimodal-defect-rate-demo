"use client";

import { useCallback, useEffect, useState } from "react";
import { getClaimById } from "@/data/stubs/claims";
import { PARTNER } from "@/data/partner.const";
import { isSpanishText } from "@/lib";
import { useAnalyzeClaim, useTranslateText } from "@/queries";
import type { ClaimDetailView } from "@/types";
import type { StubClaim } from "@/data/stubs/claims";

export function useClaimDetail(id: string) {
  const claim = getClaimById(id);
  const [view, setView] = useState<ClaimDetailView>("detail");
  const [claimLoaded, setClaimLoaded] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  const analysisMutation = useAnalyzeClaim();
  const translateMutation = useTranslateText();

  useEffect(() => {
    const timer = setTimeout(() => setClaimLoaded(true), 600);
    return () => clearTimeout(timer);
  }, [id]);

  const handleTranslate = useCallback(() => {
    if (!claim) return;
    if (translatedText) {
      setShowOriginal(false);
      return;
    }
    translateMutation.mutate(
      {
        text: claim.text,
        targetLang: PARTNER.language,
      },
      {
        onSuccess: (result) => {
          if (result) {
            setTranslatedText(result);
            setShowOriginal(false);
          }
        },
      },
    );
  }, [claim, translatedText, translateMutation]);

  const toggleOriginal = useCallback(() => {
    setShowOriginal((prev) => !prev);
  }, []);

  const runAnalysis = useCallback(() => {
    if (!claim) return;
    setView("analysis");
    analysisMutation.mutate({
      claimId: claim.id,
      scenarioType: claim.scenarioType,
      text: claim.text,
      imageUrl: claim.imageUrl || null,
    });
  }, [claim, analysisMutation]);

  const goBackToDetail = useCallback(() => {
    setView("detail");
    analysisMutation.reset();
  }, [analysisMutation]);

  const displayCommentText =
    translatedText && !showOriginal ? translatedText : (claim?.text ?? "");

  const showTranslateButton = claim ? !isSpanishText(claim.text) : false;

  return {
    claim: claim as StubClaim | undefined,
    analysis: analysisMutation.data || null,
    isLoading: analysisMutation.isPending,
    error: analysisMutation.error?.message || null,
    view,
    claimLoaded,
    translatedText,
    isTranslating: translateMutation.isPending,
    translateError: translateMutation.error?.message || null,
    showOriginal,
    displayCommentText,
    showTranslateButton,
    handleTranslate,
    toggleOriginal,
    runAnalysis,
    goBackToDetail,
  };
}
