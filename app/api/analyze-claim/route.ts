import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { detectLanguage, detectSentiment, detectKeyPhrases, detectEntities, isComprehendSupported } from "@/lib/aws/comprehend";
import { translateText } from "@/lib/aws/translate";
import { detectLabels, detectModerationLabels } from "@/lib/aws/rekognition";
import { analyzeImageTextMatch } from "@/lib/image-text-match";
import { analyzeClaim } from "@/lib/groq/evaluate";
import { formatError, AppError } from "@/lib/errors";
import { mockResponses } from "@/data/mock-responses";
import { PARTNER } from "@/data/partner.const";
import type { ClaimAnalysis } from "@/lib/types";

const CLAIM_MOCK_MAP: Record<string, string> = {
  "claim-001": "legitimate",
  "claim-002": "fraud",
  "claim-003": "noImage",
  "claim-004": "multilanguage",
};

const SCENARIO_FALLBACK: Record<string, string> = {
  real: "legitimate",
  fake: "fraud",
  "no-image": "noImage",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (process.env.DEMO_MODE === "mock") {
      const mockKey = CLAIM_MOCK_MAP[body.claimId]
        || SCENARIO_FALLBACK[body.scenarioType]
        || "legitimate";
      const mock = mockResponses[mockKey];
      await new Promise((r) => setTimeout(r, 800));
      return NextResponse.json(mock || mockResponses.legitimate);
    }

    const { text, imageUrl, imageBase64, restaurantLanguage } = body;

    if (!text) {
      throw new AppError("INVALID_INPUT", "Se requiere texto para analizar el reclamo");
    }

    let imageBytes: Uint8Array | null = null;

    if (imageBase64) {
      imageBytes = Uint8Array.from(atob(imageBase64), (c) => c.charCodeAt(0));
    } else if (imageUrl) {
      const filePath = join(process.cwd(), "public", imageUrl);
      const buffer = await readFile(filePath);
      imageBytes = new Uint8Array(buffer);
    }

    if (imageBytes && imageBytes.length > 5 * 1024 * 1024) {
      throw new AppError("IMAGE_TOO_LARGE", "La imagen excede el límite de 5MB");
    }

    const lang = await detectLanguage(text);
    const detectedLang = lang.code;

    const targetLang = restaurantLanguage || PARTNER.language;
    let textForAnalysis = text;
    let wasTranslated = false;
    let translatedText: string | undefined;

    if (detectedLang !== targetLang) {
      translatedText = await translateText(text, detectedLang, targetLang);
      textForAnalysis = translatedText;
      wasTranslated = true;
    }

    const analysisLang = isComprehendSupported(detectedLang)
      ? (wasTranslated ? targetLang : detectedLang)
      : "en";

    const analysisText = isComprehendSupported(wasTranslated ? targetLang : detectedLang)
      ? textForAnalysis
      : await translateText(text, detectedLang, "en");

    const [sentimentResult, keyPhrases, entities] = await Promise.all([
      detectSentiment(analysisText, analysisLang),
      detectKeyPhrases(analysisText, analysisLang),
      detectEntities(analysisText, analysisLang),
    ]);

    let labels: { name: string; confidence: number }[] = [];
    let moderationFlags: { name: string; confidence: number }[] = [];

    if (imageBytes) {
      [labels, moderationFlags] = await Promise.all([
        detectLabels(imageBytes),
        detectModerationLabels(imageBytes),
      ]);
    }

    const imageIsValid = imageBytes ? (moderationFlags.length === 0 && labels.length > 0) : false;

    const imageTextMatch = labels.length > 0
      ? await analyzeImageTextMatch({ keyPhrases, entities, labels })
      : null;

    const scoreResult = await analyzeClaim({
      claimId: body.claimId,
      claimText: textForAnalysis,
      sentiment: sentimentResult.sentiment,
      keyPhrases,
      entities,
      imageLabels: labels,
      moderationFlags,
      imageTextMatches: imageTextMatch?.matches,
      textLength: text.length,
      hasImage: imageBytes !== null,
    });

    const analysis: ClaimAnalysis = {
      language: {
        detected: detectedLang,
        confidence: lang.confidence,
        wasTranslated,
        translatedText,
      },
      text: {
        sentiment: sentimentResult.sentiment,
        sentimentScores: sentimentResult.scores,
        keyPhrases,
        entities,
      },
      image: {
        labels,
        moderationFlags,
        isValid: imageIsValid,
      },
      imageTextMatch,
      score: scoreResult,
    };

    console.info("[debug:analyze-claim] response:", JSON.stringify(analysis, null, 2));
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("[analyze-claim] Error:", error);
    const formatted = formatError(error);
    return NextResponse.json(
      { error: formatted },
      { status: formatted.code === "INVALID_INPUT" || formatted.code === "IMAGE_TOO_LARGE" ? 400 : 500 }
    );
  }
}
