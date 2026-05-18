export type Restaurant = {
  id: string;
  name: string;
  language: string;
  rating: number;
  reviewsCount: number;
  defectRate: number;
  products: Product[];
};

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
};

export type Order = {
  id: string;
  restaurantId: string;
  customerId: string;
  items: { productId: string; quantity: number }[];
  total: number;
  deliveredAt: string;
};

export type ClaimStatus =
  | "SUBMITTED"
  | "ANALYZING"
  | "AUTO_APPROVED"
  | "IN_REVIEW"
  | "REJECTED"
  | "ESCALATED";

export type Claim = {
  id: string;
  orderId: string;
  productId: string;
  customerId: string;
  description: string;
  imageBase64: string;
  status: ClaimStatus;
  createdAt: string;
};

export type Recommendation = "VALID" | "REVIEW" | "FRAUD";

export type ClaimAnalysis = {
  language: {
    detected: string;
    confidence: number;
    wasTranslated: boolean;
    translatedText?: string;
  };
  text: {
    sentiment: string;
    sentimentScores: Record<string, number>;
    keyPhrases: string[];
    entities: { text: string; type: string }[];
  };
  image: {
    labels: { name: string; confidence: number }[];
    moderationFlags: { name: string; confidence: number }[];
    isValid: boolean;
  };
  imageTextMatch: {
    matches: boolean;
    mentionedItems: string[];
    detectedItems: string[];
    explanation: string;
  } | null;
  score: {
    value: number;
    recommendation: Recommendation;
    reasons: string[];
  };
};

export type AnalyzeClaimRequest = {
  text: string;
  imageBase64: string;
  restaurantLanguage: string;
};

export type AnalyzeClaimError = {
  error: {
    code: "INVALID_INPUT" | "AWS_ERROR" | "TIMEOUT" | "IMAGE_TOO_LARGE" | "UNSUPPORTED_LANGUAGE";
    message: string;
    details?: string;
  };
};
