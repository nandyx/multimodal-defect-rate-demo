import type { StubClaim } from "@/data/stubs/claims";
import { ClaimCard } from "./ClaimCard";

type Props = {
  claims: StubClaim[];
};

export function ClaimsList({ claims }: Props) {
  return (
    <div className="space-y-3">
      {claims.map((claim) => (
        <ClaimCard key={claim.id} claim={claim} />
      ))}
    </div>
  );
}
