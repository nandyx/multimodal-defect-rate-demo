import { cn } from "@/styles";
import { requestErrorMessage, requestErrorTitle } from "@/rules/request-error.rule";

type Props = {
  title?: string;
  message?: string | null;
  onRetry: () => void;
  className?: string;
};

export function RequestErrorState({ title, message, onRetry, className }: Props) {
  return (
    <div className={cn("surface-muted rounded-card p-6 text-center", className)}>
      <p className="text-body font-semibold text-lg mb-2">{title ?? requestErrorTitle()}</p>
      <p className="text-muted text-sm mb-4">{requestErrorMessage(message)}</p>
      <button type="button" onClick={onRetry} className="btn-retry">
        Reintentar
      </button>
    </div>
  );
}
