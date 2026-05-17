import { ClaimDetailContent } from "./ClaimDetailContent";
import { ClaimDetailFooter } from "./ClaimDetailFooter";
import { ClaimDetailHeader } from "./ClaimDetailHeader";
import { ClaimDetailSkeleton } from "./ClaimDetailSkeleton";
import { AnalysisPanel } from "./AnalysisPanel";
import type { StubClaim } from "@/data/stubs/claims";
import type { ClaimAnalysis } from "@/lib/types";
import type { ClaimDetailView as ClaimView } from "@/types";

type Props = {
  claim: StubClaim;
  view: ClaimView;
  claimLoaded: boolean;
  analysis: ClaimAnalysis | null;
  isLoading: boolean;
  error: string | null;
  translatedText: string | null;
  isTranslating: boolean;
  showOriginal: boolean;
  displayCommentText: string;
  showTranslateButton: boolean;
  onTranslate: () => void;
  onToggleOriginal: () => void;
  onRunAnalysis: () => void;
  onBackToDetail: () => void;
};

export function ClaimDetailView({
  claim,
  view,
  claimLoaded,
  analysis,
  isLoading,
  error,
  translatedText,
  isTranslating,
  showOriginal,
  displayCommentText,
  showTranslateButton,
  onTranslate,
  onToggleOriginal,
  onRunAnalysis,
  onBackToDetail,
}: Props) {
  return (
    <div className="canvas-page pb-24">
      <ClaimDetailHeader view={view} onBackToDetail={onBackToDetail} />

      <main className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {view === "detail" ? (
          !claimLoaded ? (
            <ClaimDetailSkeleton />
          ) : (
            <ClaimDetailContent
              claim={claim}
              displayCommentText={displayCommentText}
              showTranslateButton={showTranslateButton}
              isTranslating={isTranslating}
              translatedText={translatedText}
              showOriginal={showOriginal}
              onTranslate={onTranslate}
              onToggleOriginal={onToggleOriginal}
            />
          )
        ) : (
          <AnalysisPanel
            analysis={analysis}
            isLoading={isLoading}
            error={error}
            onRetry={onRunAnalysis}
          />
        )}
      </main>

      <ClaimDetailFooter
        view={view}
        claimLoaded={claimLoaded}
        isLoading={isLoading}
        analysis={analysis}
        onRunAnalysis={onRunAnalysis}
      />
    </div>
  );
}
