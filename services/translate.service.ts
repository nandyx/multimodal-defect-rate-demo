import { httpClient } from "./http-client";

type TranslatePayload = {
  text: string;
  targetLang: string;
};

type TranslateResponse = {
  translatedText?: string;
};

export async function translateText(payload: TranslatePayload): Promise<string | null> {
  const { data } = await httpClient.post<TranslateResponse>("/translate", payload);
  return data.translatedText ?? null;
}
