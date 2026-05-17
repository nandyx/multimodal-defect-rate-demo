import { ImageOff, Languages } from "lucide-react";
import type { StubClaim } from "@/data/stubs/claims";

type Props = {
  claim: StubClaim;
  displayCommentText: string;
  showTranslateButton: boolean;
  isTranslating: boolean;
  translatedText: string | null;
  showOriginal: boolean;
  onTranslate: () => void;
  onToggleOriginal: () => void;
};

export function ClaimDetailContent({
  claim,
  displayCommentText,
  showTranslateButton,
  isTranslating,
  translatedText,
  showOriginal,
  onTranslate,
  onToggleOriginal,
}: Props) {
  return (
    <>
      {claim.status === "paused" && (
        <div className="alert-danger-banner">
          <p className="alert-danger-text">
            Este producto ha sido pausado por exceso de reclamos
          </p>
        </div>
      )}

      <div className="surface-card">
        <p className="text-label-section mb-3">Item con defecto</p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="surface-muted">
              <p className="font-bold text-body">{claim.productName}</p>
              <p className="text-sm text-muted mt-0.5">{claim.productDescription}</p>
            </div>
          </div>
          <div className="thumb-claim-detail flex items-center justify-center">
            {claim.productImageUrl ? (
              <img
                src={claim.productImageUrl}
                alt={claim.productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageOff size={28} className="text-muted" />
            )}
          </div>
        </div>
      </div>

      <div className="surface-card space-y-3">
        <p className="text-label-section">Comentario</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="surface-muted">
            <p className="text-label-accent mb-0.5">ID:</p>
            <p className="font-bold text-body-sm">{claim.commentId}</p>
          </div>
          <div className="surface-muted">
            <p className="text-label-accent mb-0.5">Tipo de defecto</p>
            <p className="font-bold text-body-sm">{claim.defectType}</p>
          </div>
        </div>

        <div className="surface-muted">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-label-accent">Comentario</p>
            {showTranslateButton && (
              <button
                type="button"
                onClick={onTranslate}
                disabled={isTranslating}
                className="btn-translate disabled:opacity-50 transition-colors"
              >
                <Languages size={14} />
                {isTranslating
                  ? "Traduciendo..."
                  : translatedText && !showOriginal
                    ? "Traducido"
                    : "Traducir"}
              </button>
            )}
          </div>
          <p className="text-body-sm">&ldquo;{displayCommentText}&rdquo;</p>
          {translatedText && (
            <button
              type="button"
              onClick={onToggleOriginal}
              className="text-xs text-link hover:text-link-hover mt-1.5 transition-colors"
            >
              {showOriginal ? "Ver traducción" : "Ver original"}
            </button>
          )}
        </div>

        <div className="surface-muted">
          <p className="text-label-accent mb-2">Foto</p>
          {claim.imageUrl ? (
            <div className="rounded-xl overflow-hidden">
              <img
                src={claim.imageUrl}
                alt="Evidencia del reclamo"
                className="w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-muted">
              <ImageOff size={32} />
              <p className="text-sm mt-2">No hay imagen añadida</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
