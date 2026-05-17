import { cn } from "@/styles";

type Props = {
  className?: string;
};

export function Skeleton({ className }: Props) {
  return <div className={cn("skeleton-pulse", className)} />;
}
