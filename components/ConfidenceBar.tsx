type Props = {
  name: string;
  confidence: number;
};

export function ConfidenceBar({ name, confidence }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-body w-28 truncate">{name}</span>
      <div className="flex-1 bg-surface-muted rounded-full h-2">
        <div
          className="rounded-full h-2 transition-all duration-500 bg-link"
          style={{ width: `${confidence}%` }}
        />
      </div>
      <span className="text-xs text-muted w-10 text-right">{confidence.toFixed(0)}%</span>
    </div>
  );
}
