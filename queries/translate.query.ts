import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/lib/http-client";

type TranslatePayload = {
  text: string;
  targetLang: string;
};

type TranslateResponse = {
  translatedText?: string;
};

async function translateText(payload: TranslatePayload): Promise<string | null> {
  const { data } = await httpClient.post<TranslateResponse>("/translate", payload);
  return data.translatedText ?? null;
}

export function useTranslateText() {
  return useMutation({
    mutationFn: translateText,
  });
}
