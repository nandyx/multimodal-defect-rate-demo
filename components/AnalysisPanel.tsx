"use client";

import { Globe, MessageSquareText, ImageIcon, Target } from "lucide-react";
import { cn } from "@/styles";
import type { ClaimAnalysis } from "@/lib/types";
import { AnalysisChip } from "./AnalysisChip";
import { AnalysisSectionHeader } from "./AnalysisSectionHeader";
import { AnalysisSkeleton } from "./AnalysisSkeleton";
import { ConfidenceBar } from "./ConfidenceBar";
import { CredibilityScoreAnimated } from "./CredibilityScoreAnimated";

type Props = {
  analysis: ClaimAnalysis | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};

function sentimentVariant(sentiment: string): "neutral" | "green" | "red" {
  if (sentiment === "NEGATIVE") return "red";
  if (sentiment === "POSITIVE") return "green";
  return "neutral";
}

export function AnalysisPanel({ analysis, isLoading, error, onRetry }: Props) {
  if (error) {
    return (
      <div className="surface-card text-center">
        <p className="score-text-fraud text-lg mb-2">Error en el análisis</p>
        <p className="text-muted text-sm mb-4">{error}</p>
        <button type="button" onClick={onRetry} className={cn("btn-primary", "w-auto", "px-6", "py-3", "text-sm")}>
          Reintentar
        </button>
      </div>
    );
  }

  if (isLoading) return <AnalysisSkeleton />;
  if (!analysis) return null;

  return (
    <div className="space-y-4">
      <div className="surface-card">
        <AnalysisSectionHeader icon={Globe} title="Idioma detectado" />
        <div className="surface-muted space-y-1">
          <div className="flex items-center gap-2">
            <AnalysisChip label={analysis.language.detected.toUpperCase()} variant="blue" />
            <span className="text-sm text-muted">
              Confianza: {(analysis.language.confidence * 100).toFixed(0)}%
            </span>
          </div>
          {analysis.language.wasTranslated && analysis.language.translatedText && (
            <div className="mt-2 text-sm">
              <p className="text-muted text-xs">Traducido al idioma del restaurante:</p>
              <p className="text-body italic">&ldquo;{analysis.language.translatedText}&rdquo;</p>
            </div>
          )}
        </div>
      </div>

      <div className="surface-card">
        <AnalysisSectionHeader icon={MessageSquareText} title="Análisis de texto" />
        <div className="surface-muted space-y-3">
          <div>
            <p className="text-xs text-muted mb-1">Sentimiento</p>
            <AnalysisChip label={analysis.text.sentiment} variant={sentimentVariant(analysis.text.sentiment)} />
          </div>
          {analysis.text.keyPhrases.length > 0 && (
            <div>
              <p className="text-xs text-muted mb-1">Frases clave</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.text.keyPhrases.map((phrase, i) => (
                  <AnalysisChip key={i} label={phrase} />
                ))}
              </div>
            </div>
          )}
          {analysis.text.entities.length > 0 && (
            <div>
              <p className="text-xs text-muted mb-1">Entidades</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.text.entities.map((entity, i) => (
                  <AnalysisChip key={i} label={`${entity.text} (${entity.type})`} variant="blue" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="surface-card">
        <AnalysisSectionHeader icon={ImageIcon} title="Análisis de imagen" />
        <div className="surface-muted space-y-3">
          {analysis.image.labels.length > 0 ? (
            <div>
              <p className="text-xs text-muted mb-2">Objetos detectados</p>
              <div className="space-y-1.5">
                {analysis.image.labels.slice(0, 6).map((label, i) => (
                  <ConfidenceBar key={i} name={label.name} confidence={label.confidence} />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">No hay imagen añadida</p>
          )}
          {analysis.image.moderationFlags.length > 0 && (
            <div>
              <p className="text-xs score-text-fraud mb-1">Flags de moderación</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.image.moderationFlags.map((flag, i) => (
                  <AnalysisChip key={i} label={flag.name} variant="red" />
                ))}
              </div>
            </div>
          )}
          {analysis.image.labels.length > 0 && (
            <div className="flex items-center gap-2">
              <span
                className={cn("w-2 h-2 rounded-full", analysis.image.isValid ? "bg-success" : "bg-danger")}
              />
              <span className="text-sm text-muted">
                {analysis.image.isValid ? "Imagen válida" : "Imagen no válida o irrelevante"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="surface-card">
        <AnalysisSectionHeader icon={Target} title="Score de credibilidad" />
        <CredibilityScoreAnimated
          value={analysis.score.value}
          recommendation={analysis.score.recommendation}
          reasons={analysis.score.reasons}
        />
      </div>
    </div>
  );
}
