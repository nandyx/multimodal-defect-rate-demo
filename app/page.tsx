"use client";

import { stubClaims } from "@/data/stubs/claims";
import { ClaimsList, PageHeader } from "@/components";

export default function Home() {
  return (
    <div className="canvas-page">
      <PageHeader title="Reclamos" />
      <main className="max-w-lg mx-auto px-4 py-4">
        <ClaimsList claims={stubClaims} />
      </main>
    </div>
  );
}
