import {
  DetectDominantLanguageCommand,
  DetectSentimentCommand,
  DetectKeyPhrasesCommand,
  DetectEntitiesCommand,
  type LanguageCode,
} from "@aws-sdk/client-comprehend";
import { comprehendClient } from "./clients";

const COMPREHEND_SUPPORTED_LANGS = [
  "de", "en", "es", "it", "pt", "fr", "ja", "ko", "hi", "ar", "zh", "zh-TW",
];

export function isComprehendSupported(languageCode: string): boolean {
  return COMPREHEND_SUPPORTED_LANGS.includes(languageCode);
}

export async function detectLanguage(text: string) {
  const command = new DetectDominantLanguageCommand({ Text: text });
  const result = await comprehendClient.send(command);
  const top = result.Languages?.[0];
  return {
    code: top?.LanguageCode || "en",
    confidence: top?.Score || 0,
  };
}

export async function detectSentiment(text: string, languageCode: string) {
  const lang = (isComprehendSupported(languageCode) ? languageCode : "en") as LanguageCode;
  const command = new DetectSentimentCommand({
    Text: text,
    LanguageCode: lang,
  });
  const result = await comprehendClient.send(command);
  return {
    sentiment: result.Sentiment || "NEUTRAL",
    scores: {
      positive: result.SentimentScore?.Positive || 0,
      negative: result.SentimentScore?.Negative || 0,
      neutral: result.SentimentScore?.Neutral || 0,
      mixed: result.SentimentScore?.Mixed || 0,
    },
  };
}

export async function detectKeyPhrases(text: string, languageCode: string) {
  const lang = (isComprehendSupported(languageCode) ? languageCode : "en") as LanguageCode;
  const command = new DetectKeyPhrasesCommand({
    Text: text,
    LanguageCode: lang,
  });
  const result = await comprehendClient.send(command);
  return (result.KeyPhrases || []).map((kp) => kp.Text || "").filter(Boolean);
}

export async function detectEntities(text: string, languageCode: string) {
  const lang = (isComprehendSupported(languageCode) ? languageCode : "en") as LanguageCode;
  const command = new DetectEntitiesCommand({
    Text: text,
    LanguageCode: lang,
  });
  const result = await comprehendClient.send(command);
  return (result.Entities || []).map((e) => ({
    text: e.Text || "",
    type: e.Type || "OTHER",
  }));
}
