"use client";

import { use } from "react";
import { useClaimDetail } from "@/hooks";
import { ClaimDetailView, ClaimNotFound } from "@/components";

export default function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const vm = useClaimDetail(id);

  if (!vm.claim) {
    return <ClaimNotFound />;
  }

  return (
    <ClaimDetailView
      claim={vm.claim}
      view={vm.view}
      claimLoaded={vm.claimLoaded}
      analysis={vm.analysis}
      isLoading={vm.isLoading}
      error={vm.error}
      translatedText={vm.translatedText}
      isTranslating={vm.isTranslating}
      showOriginal={vm.showOriginal}
      displayCommentText={vm.displayCommentText}
      showTranslateButton={vm.showTranslateButton}
      translateError={vm.translateError}
      onTranslate={vm.handleTranslate}
      onToggleOriginal={vm.toggleOriginal}
      onRunAnalysis={vm.runAnalysis}
      onBackToDetail={vm.goBackToDetail}
    />
  );
}
