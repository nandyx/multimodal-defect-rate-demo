import type { ClaimAnalysis } from "@/lib/types";

export const mockResponses: Record<string, ClaimAnalysis> = {
  legitimate: {
    language: {
      detected: "en",
      confidence: 0.99,
      wasTranslated: true,
      translatedText: "¡Pedí sandwich de pollo y me enviaron chilaquiles con frijoles!",
    },
    text: {
      sentiment: "NEGATIVE",
      sentimentScores: { positive: 0.02, negative: 0.91, neutral: 0.05, mixed: 0.02 },
      keyPhrases: ["chicken sandwich", "chilaquiles", "beans"],
      entities: [
        { text: "chicken sandwich", type: "OTHER" },
        { text: "chilaquiles", type: "OTHER" },
      ],
    },
    image: {
      labels: [
        { name: "Food", confidence: 99.1 },
        { name: "Meal", confidence: 94.2 },
        { name: "Plate", confidence: 91.5 },
        { name: "Meat", confidence: 88.3 },
      ],
      moderationFlags: [],
      isValid: true,
    },
    imageTextMatch: {
      matches: true,
      mentionedItems: ["chicken sandwich", "chilaquiles", "beans"],
      detectedItems: ["Comida", "Plato", "Carne"],
      explanation: "La imagen muestra comida pero no se pudo identificar el tipo específico para comparar",
    },
    score: {
      value: 95,
      recommendation: "VALID",
      reasons: [
        "La imagen es coherente con lo descrito en el reclamo",
        "El tono negativo es consistente con un reclamo real",
        "El reclamo incluye una descripción detallada",
      ],
    },
  },

  multilanguage: {
    language: {
      detected: "es",
      confidence: 0.98,
      wasTranslated: false,
    },
    text: {
      sentiment: "NEGATIVE",
      sentimentScores: { positive: 0.01, negative: 0.93, neutral: 0.04, mixed: 0.02 },
      keyPhrases: ["orden incompleta", "hamburguesa", "papas", "reembolso"],
      entities: [
        { text: "hamburguesa", type: "OTHER" },
        { text: "papas", type: "OTHER" },
      ],
    },
    image: {
      labels: [
        { name: "Food", confidence: 99.1 },
        { name: "Fries", confidence: 97.3 },
        { name: "Plate", confidence: 89.2 },
      ],
      moderationFlags: [],
      isValid: true,
    },
    imageTextMatch: {
      matches: true,
      mentionedItems: ["orden incompleta", "hamburguesa", "papas", "reembolso"],
      detectedItems: ["Comida", "Papas fritas", "Plato"],
      explanation: "La imagen coincide con el reclamo: se detectó Papas fritas mencionado en el texto",
    },
    score: {
      value: 95,
      recommendation: "VALID",
      reasons: [
        "La imagen es coherente con lo descrito en el reclamo",
        "El tono negativo es consistente con un reclamo real",
        "El reclamo incluye una descripción detallada",
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
    imageTextMatch: null,
    score: {
      value: 45,
      recommendation: "REVIEW",
      reasons: [
        "No se proporcionó imagen como evidencia del reclamo",
        "El tono negativo es consistente con un reclamo real",
        "El reclamo incluye una descripción detallada",
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
      sentiment: "NEGATIVE",
      sentimentScores: { positive: 0.1, negative: 0.7, neutral: 0.15, mixed: 0.05 },
      keyPhrases: ["asco", "dinero"],
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
    imageTextMatch: {
      matches: false,
      mentionedItems: ["asco", "dinero"],
      detectedItems: ["Captura de pantalla", "Texto", "Electrónicos", "Pantalla"],
      explanation: "Inconsistencia: el texto describe un reclamo de comida pero la imagen muestra Captura de pantalla, Electrónicos",
    },
    score: {
      value: 5,
      recommendation: "FRAUD",
      reasons: [
        "La imagen no corresponde con lo descrito en el reclamo",
        "La descripción es demasiado corta para evaluar el reclamo",
        "Alta probabilidad de reclamo fraudulento",
      ],
    },
  },
};
