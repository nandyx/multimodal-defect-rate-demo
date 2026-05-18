import { translateText } from "@/lib/aws/translate";
import { PARTNER } from "@/data/partner.const";

type MatchInput = {
  keyPhrases: string[];
  entities: { text: string; type: string }[];
  labels: { name: string; confidence: number }[];
};

type MatchResult = {
  matches: boolean;
  mentionedItems: string[];
  detectedItems: string[];
  explanation: string;
};

const GENERIC_LABELS = [
  "food", "meal", "dish", "plate", "lunch", "dinner", "breakfast", "brunch",
  "snack", "cuisine", "food presentation", "produce", "ingredient",
  "tableware", "table", "bowl", "cup",
];

const IRRELEVANT_LABELS = [
  "screenshot", "selfie", "person", "human", "face", "text", "document",
  "electronics", "phone", "computer", "monitor", "screen", "webpage",
  "number", "symbol", "logo", "advertisement",
];

function isGeneric(label: string): boolean {
  const lower = label.toLowerCase();
  return GENERIC_LABELS.some((g) => lower === g || lower.includes(g));
}

function isIrrelevant(label: string): boolean {
  const lower = label.toLowerCase();
  return IRRELEVANT_LABELS.some((irr) => lower.includes(irr));
}

function termsOverlap(a: string, b: string): boolean {
  const wordsA = a.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const wordsB = b.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  return wordsA.some((wa) => wordsB.some((wb) => wa.includes(wb) || wb.includes(wa)));
}

const MOCK_LABEL_TRANSLATIONS: Record<string, string> = {
  "Food": "Comida",
  "Fries": "Papas fritas",
  "French Fries": "Papas fritas",
  "Burger": "Hamburguesa",
  "Hamburger": "Hamburguesa",
  "Sandwich": "Sándwich",
  "Chicken": "Pollo",
  "Salad": "Ensalada",
  "Meat": "Carne",
  "Pizza": "Pizza",
  "Rice": "Arroz",
  "Bread": "Pan",
  "Cheese": "Queso",
  "Soup": "Sopa",
  "Pasta": "Pasta",
  "Plate": "Plato",
  "Meal": "Comida",
  "Food Presentation": "Presentación de comida",
  "Brunch": "Brunch",
  "Dish": "Plato",
  "Screenshot": "Captura de pantalla",
  "Text": "Texto",
  "Electronics": "Electrónicos",
  "Screen": "Pantalla",
};

async function translateLabels(labels: string[]): Promise<string[]> {
  if (process.env.DEMO_MODE === "mock") {
    return labels.map((l) => MOCK_LABEL_TRANSLATIONS[l] || l);
  }

  const translated = await Promise.all(
    labels.map((label) => translateText(label, "en", PARTNER.language))
  );
  return translated;
}

export async function analyzeImageTextMatch(input: MatchInput): Promise<MatchResult> {
  const { keyPhrases, entities, labels } = input;

  if (labels.length === 0) {
    return {
      matches: false,
      mentionedItems: [],
      detectedItems: [],
      explanation: "No hay imagen para comparar con el texto del reclamo",
    };
  }

  const mentionedItems = [
    ...keyPhrases,
    ...entities.map((e) => e.text),
  ].filter((t) => t.length > 2);

  const textTerms = mentionedItems.map((t) => t.toLowerCase());

  const relevantLabels = labels
    .filter((l) => l.confidence > 60)
    .map((l) => l.name);

  const irrelevantLabels = relevantLabels.filter(isIrrelevant);
  const specificLabels = relevantLabels.filter((l) => !isGeneric(l) && !isIrrelevant(l));
  const hasGenericFood = relevantLabels.some(isGeneric);

  if (irrelevantLabels.length > 0 && !hasGenericFood && specificLabels.length === 0) {
    const translatedIrrelevant = await translateLabels(irrelevantLabels);
    return {
      matches: false,
      mentionedItems,
      detectedItems: translatedIrrelevant,
      explanation: `Inconsistencia: el texto describe un reclamo de comida pero la imagen muestra ${translatedIrrelevant.join(", ")}`,
    };
  }

  if (specificLabels.length === 0 && hasGenericFood) {
    return {
      matches: true,
      mentionedItems,
      detectedItems: await translateLabels(relevantLabels),
      explanation: "La imagen muestra comida pero no se pudo identificar el tipo específico para comparar",
    };
  }

  if (specificLabels.length > 0) {
    const translatedLabels = await translateLabels(specificLabels);

    const matchingPairs = translatedLabels.filter((translated) =>
      textTerms.some((term) => termsOverlap(term, translated))
    );

    const allTranslated = await translateLabels(relevantLabels);

    if (matchingPairs.length > 0) {
      return {
        matches: true,
        mentionedItems,
        detectedItems: allTranslated,
        explanation: `La imagen coincide con el reclamo: se detectó ${matchingPairs.join(", ")} mencionado en el texto`,
      };
    }

    return {
      matches: false,
      mentionedItems,
      detectedItems: allTranslated,
      explanation: `Inconsistencia: el texto menciona ${textTerms.slice(0, 4).join(", ")} pero la imagen muestra ${translatedLabels.join(", ")}`,
    };
  }

  return {
    matches: true,
    mentionedItems,
    detectedItems: await translateLabels(relevantLabels),
    explanation: "No se pudo determinar inconsistencia entre la imagen y el texto",
  };
}
