export function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="loading-dot" />
      <span className="loading-dot loading-dot-delay-1" />
      <span className="loading-dot loading-dot-delay-2" />
    </span>
  );
}
