import { cn } from "@/styles";

type Props = {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, left, right, className }: Props) {
  return (
    <header className={cn("surface-header sticky top-0 z-10", className)}>
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="min-w-0 flex-1">{left}</div>
        <h1 className="text-lg font-bold text-body px-2">{title}</h1>
        <div className="min-w-0 flex-1 flex justify-end">{right}</div>
      </div>
    </header>
  );
}
