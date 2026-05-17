import { TranslateTextCommand } from "@aws-sdk/client-translate";
import { translateClient } from "./clients";

const cache = new Map<string, string>();

export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  if (sourceLanguage === targetLanguage) return text;

  const key = `${sourceLanguage}:${targetLanguage}:${text}`;
  const cached = cache.get(key);
  if (cached) {
    console.log("[translate cache HIT]", key.slice(0, 50));
    return cached;
  }

  const command = new TranslateTextCommand({
    Text: text,
    SourceLanguageCode: sourceLanguage,
    TargetLanguageCode: targetLanguage,
  });

  const result = await translateClient.send(command);
  const translated = result.TranslatedText || text;
  cache.set(key, translated);
  console.log("[translate cache MISS]", key.slice(0, 50));
  return translated;
}
