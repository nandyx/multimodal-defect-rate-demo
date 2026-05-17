import { cn } from "@/styles";

type Variant = "neutral" | "blue" | "green" | "red";

type Props = {
  label: string;
  variant?: Variant;
};

const VARIANT_CLASS: Record<Variant, string> = {
  neutral: "bg-surface-muted text-body",
  blue: "bg-success-surface text-link",
  green: "bg-success-surface score-text-valid",
  red: "badge-danger-surface badge-danger-text",
};

export function AnalysisChip({ label, variant = "neutral" }: Props) {
  return (
    <span className={cn("inline-block px-2.5 py-1 rounded-full text-xs font-medium", VARIANT_CLASS[variant])}>
      {label}
    </span>
  );
}
