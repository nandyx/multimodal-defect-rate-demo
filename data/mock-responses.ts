import type { ClaimAnalysis } from "@/lib/types";

export const mockResponses: Record<string, ClaimAnalysis> = {
  legitimate: {
    language: {
      detected: "es",
      confidence: 0.99,
      wasTranslated: false,
    },
    text: {
      sentiment: "NEGATIVE",
      sentimentScores: { positive: 0.02, negative: 0.91, neutral: 0.05, mixed: 0.02 },
      keyPhrases: ["pure de papas", "papas fritas", "equivocado"],
      entities: [
        { text: "pure de papas", type: "OTHER" },
        { text: "papas fritas", type: "OTHER" },
      ],
    },
    image: {
      labels: [
        { name: "Food", confidence: 99.1 },
        { name: "Fries", confidence: 96.8 },
        { name: "Meal", confidence: 94.2 },
        { name: "Plate", confidence: 91.5 },
        { name: "Meat", confidence: 88.3 },
      ],
      moderationFlags: [],
      isValid: true,
    },
    score: {
      value: 85,
      recommendation: "VALID",
      reasons: [
        "El reclamo parece legítimo: la imagen y el texto son coherentes",
        "Sentimiento negativo consistente con un reclamo real",
        "Se detectó comida en la imagen que coincide con la descripción",
      ],
    },
  },

  multilanguage: {
    language: {
      detected: "pt",
      confidence: 0.98,
      wasTranslated: true,
      translatedText: "La hamburguesa llegó fría y sin queso.",
    },
    text: {
      sentiment: "NEGATIVE",
      sentimentScores: { positive: 0.01, negative: 0.93, neutral: 0.04, mixed: 0.02 },
      keyPhrases: ["hamburguesa", "fría", "sin queso"],
      entities: [
        { text: "hamburguesa", type: "OTHER" },
        { text: "queso", type: "OTHER" },
      ],
    },
    image: {
      labels: [
        { name: "Food", confidence: 99.1 },
        { name: "Burger", confidence: 97.3 },
        { name: "Bread", confidence: 89.2 },
      ],
      moderationFlags: [],
      isValid: true,
    },
    score: {
      value: 82,
      recommendation: "VALID",
      reasons: [
        "El reclamo parece legítimo: la imagen y el texto son coherentes",
        "Texto traducido automáticamente de portugués a español",
      ],
    },
  },

  noImage: {
    language: {
      detected: "es",
      confidence: 0.99,
      wasTranslated: false,
    },
    text: {
      sentiment: "NEGATIVE",
      sentimentScores: { positive: 0.03, negative: 0.85, neutral: 0.10, mixed: 0.02 },
      keyPhrases: ["papas", "hamburguesa", "reembolso"],
      entities: [
        { text: "papas", type: "OTHER" },
        { text: "hamburguesa", type: "OTHER" },
      ],
    },
    image: {
      labels: [],
      moderationFlags: [],
      isValid: false,
    },
    score: {
      value: 45,
      recommendation: "REVIEW",
      reasons: [
        "No se proporcionó imagen como evidencia",
        "No se detectaron elementos relevantes en la imagen",
        "El texto del reclamo es descriptivo y coherente",
        "Se recomienda revisión manual por parte del equipo",
      ],
    },
  },

  fraud: {
    language: {
      detected: "es",
      confidence: 0.97,
      wasTranslated: false,
    },
    text: {
      sentiment: "NEUTRAL",
      sentimentScores: { positive: 0.1, negative: 0.2, neutral: 0.65, mixed: 0.05 },
      keyPhrases: ["pedido", "mal"],
      entities: [],
    },
    image: {
      labels: [
        { name: "Screenshot", confidence: 95.2 },
        { name: "Text", confidence: 91.4 },
        { name: "Electronics", confidence: 88.1 },
        { name: "Screen", confidence: 85.3 },
      ],
      moderationFlags: [],
      isValid: false,
    },
    score: {
      value: 15,
      recommendation: "FRAUD",
      reasons: [
        "La imagen no muestra comida o producto alimenticio",
        "Imagen irrelevante detectada: screenshot, text, electronics, screen",
        "La descripción del reclamo es demasiado corta",
        "Alta probabilidad de reclamo fraudulento",
      ],
    },
  },
};
