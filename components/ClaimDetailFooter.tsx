import { LoadingDots } from "./LoadingDots";
import type { ClaimAnalysis } from "@/lib/types";
import type { ClaimDetailView } from "@/types";

type Props = {
  view: ClaimDetailView;
  claimLoaded: boolean;
  isLoading: boolean;
  analysis: ClaimAnalysis | null;
  onRunAnalysis: () => void;
};

export function ClaimDetailFooter({
  view,
  claimLoaded,
  isLoading,
  analysis,
  onRunAnalysis,
}: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 surface-bottom-bar">
      <div className="max-w-lg mx-auto">
        {view === "detail" ? (
          <button
            type="button"
            onClick={onRunAnalysis}
            disabled={!claimLoaded}
            className="btn-primary"
          >
            {!claimLoaded ? <LoadingDots /> : "Analizar reclamo"}
          </button>
        ) : isLoading ? (
          <button type="button" disabled className="btn-primary">
            <LoadingDots />
          </button>
        ) : analysis ? (
          <button type="button" className="btn-primary">
            Encender item
          </button>
        ) : (
          <button type="button" onClick={onRunAnalysis} className="btn-primary">
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
