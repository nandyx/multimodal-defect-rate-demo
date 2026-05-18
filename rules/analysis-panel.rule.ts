export function sentimentVariant(sentiment: string): "neutral" | "green" | "red" {
  if (sentiment === "NEGATIVE") return "red";
  if (sentiment === "POSITIVE") return "green";
  return "neutral";
}
