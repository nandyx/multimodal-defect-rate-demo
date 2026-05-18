import Link from "next/link";
import { ChevronRight, ImageOff } from "lucide-react";
import { cn } from "@/styles";
import type { StubClaim } from "@/data/stubs/claims";
import { scenarioLabel } from "@/rules/claim-card.rule";

type Props = {
  claim: StubClaim;
  className?: string;
};

export function ClaimCard({ claim, className }: Props) {
  return (
    <Link
      href={`/claim/${claim.id}`}
      className={cn("block surface-card hover:shadow-md transition-shadow", className)}
    >
      {claim.status === "paused" && (
        <div className="badge-danger-surface mb-3 inline-block">
          <span className="badge-danger-text">Pausado</span>
        </div>
      )}
      {claim.status === "active" && (
        <div className="badge-success-surface mb-3 inline-block">
          <span className="badge-success-text">Activo</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="thumb-list flex items-center justify-center">
          {claim.productImageUrl ? (
            <img
              src={claim.productImageUrl}
              alt={claim.productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageOff size={24} className="text-muted" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-body truncate">{claim.productName}</p>
          <p className="text-sm text-muted truncate">{claim.productDescription}</p>
          <p className="text-xs text-muted mt-1">
            {claim.defectType}
            {" · "}
            {scenarioLabel(claim.scenarioType)}
          </p>
        </div>

        <ChevronRight size={20} className="text-muted flex-shrink-0" />
      </div>
    </Link>
  );
}
