import Link from 'next/link';
import { ArrowLeft, XIcon } from 'lucide-react';
import { PageHeader } from './PageHeader';
import type { ClaimDetailView } from '@/types';
import { claimDetailHeaderTitle } from '@/rules/claim-detail-header.rule';

type Props = {
  view: ClaimDetailView;
  onBackToDetail: () => void;
};

export function ClaimDetailHeader({ view, onBackToDetail }: Props) {
  const title = claimDetailHeaderTitle(view);

  const left =
    view === 'analysis' ? (
      <button type="button" onClick={onBackToDetail} className="btn-link">
        <ArrowLeft size={20} />
        <span>Volver</span>
      </button>
    ) : (
      <Link href="/" className="btn-link">
        <ArrowLeft size={20} />
      </Link>
    );

  const right = (
    <Link href="/" className="text-muted hover:text-body text-xl leading-none">
      <XIcon size={20} />
    </Link>
  );

  return <PageHeader title={title} left={left} right={right} />;
}
