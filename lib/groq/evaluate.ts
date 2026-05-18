import Groq from "groq-sdk";
import type { Recommendation } from "@/lib/types";

type EvaluationInput = {
  claimId: string;
  claimText: string;
  sentiment: string;
  keyPhrases: string[];
  entities: { text: string; type: string }[];
  imageLabels: { name: string; confidence: number }[];
  moderationFlags: { name: string; confidence: number }[];
  imageTextMatches: boolean | undefined;
  textLength: number;
  hasImage: boolean;
};

type EvaluationResult = {
  value: number;
  recommendation: Recommendation;
  reasons: string[];
};

const SYSTEM_PROMPT = `Eres un evaluador de reclamos de delivery de comida. Tu trabajo es determinar la credibilidad de un reclamo basándote en la evidencia proporcionada.

Debes responder ÚNICAMENTE con un JSON válido con esta estructura:
{
  "value": <número entre 0 y 100>,
  "recommendation": "<VALID | REVIEW | FRAUD>",
  "reasons": ["<razón 1>", "<razón 2>", "<razón 3>"]
}

Criterios de evaluación:
- VALID (70-100): El reclamo es legítimo. La imagen corresponde con el texto, el sentimiento es coherente con una queja real, y hay suficiente detalle.
- REVIEW (40-69): No hay suficiente evidencia para aprobar o rechazar. Falta imagen, o el texto es ambiguo.
- FRAUD (0-39): El reclamo es probablemente fraudulento. La imagen no corresponde con el texto, es un screenshot, el texto es muy genérico o corto.

Factores a considerar:
- Coherencia entre imagen y texto (si la imagen muestra lo que el texto describe)
- Sentimiento del mensaje (un reclamo real suele ser negativo/frustrado)
- Detalle del texto (reclamos reales suelen incluir detalles específicos)
- Presencia de imagen como evidencia
- Flags de moderación en la imagen
- Si la imagen es irrelevante (screenshots, selfies, etc.)

Responde en español. Las razones deben ser concisas (máximo 15 palabras cada una). Máximo 4 razones.`;

function buildPrompt(input: EvaluationInput): string {
  const parts = [
    `Texto del reclamo: "${input.claimText}"`,
    `Sentimiento detectado: ${input.sentiment}`,
    `Frases clave: ${input.keyPhrases.join(", ") || "ninguna"}`,
    `Tiene imagen: ${input.hasImage ? "Sí" : "No"}`,
  ];

  if (input.hasImage) {
    parts.push(`Labels de imagen: ${input.imageLabels.map((l) => `${l.name} (${l.confidence.toFixed(0)}%)`).join(", ")}`);
    parts.push(`Coherencia texto-imagen: ${input.imageTextMatches === true ? "Coincide" : input.imageTextMatches === false ? "No coincide" : "No determinado"}`);
  }

  if (input.moderationFlags.length > 0) {
    parts.push(`Flags de moderación: ${input.moderationFlags.map((f) => f.name).join(", ")}`);
  }

  return parts.join("\n");
}

export async function analyzeClaim(input: EvaluationInput): Promise<EvaluationResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY no configurada");
  }

  const groq = new Groq({ apiKey });

  const prompt = buildPrompt(input);

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    temperature: 0.1,
    response_format: { type: "json_object" },
  });

  const text = completion.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(text) as EvaluationResult;

  parsed.value = Math.max(0, Math.min(100, parsed.value));

  const validRecommendations: Recommendation[] = ["VALID", "REVIEW", "FRAUD"];
  if (!validRecommendations.includes(parsed.recommendation)) {
    if (parsed.value >= 70) parsed.recommendation = "VALID";
    else if (parsed.value >= 40) parsed.recommendation = "REVIEW";
    else parsed.recommendation = "FRAUD";
  }

  return parsed;
}
