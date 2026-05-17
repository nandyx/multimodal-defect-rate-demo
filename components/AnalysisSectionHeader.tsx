type Props = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
};

export function AnalysisSectionHeader({ icon: Icon, title }: Props) {
  return (
    <p className="text-label-section mb-2 flex items-center gap-1.5 text-muted">
      <Icon size={14} /> {title}
    </p>
  );
}
