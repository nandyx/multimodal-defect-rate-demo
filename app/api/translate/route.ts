import { NextRequest, NextResponse } from "next/server";
import { translateText } from "@/lib/aws/translate";
import { formatError } from "@/lib/errors";
import { PARTNER } from "@/data/partner.const";

const mockTranslations: Record<string, string> = {
  "I ordered a chicken sandwich and they sent me chilaquiles with beans!":
    "¡Pedí sandwich de pollo y me enviaron chilaquiles con frijoles!",
};

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLang, targetLang } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Texto requerido" } },
        { status: 400 }
      );
    }

    const target = targetLang || PARTNER.language;

    if (sourceLang === target) {
      return NextResponse.json({ translatedText: text });
    }

    if (process.env.DEMO_MODE === "mock") {
      await new Promise((r) => setTimeout(r, 500));
      const translated = mockTranslations[text] || `[Traducido] ${text}`;
      return NextResponse.json({ translatedText: translated });
    }

    const translated = await translateText(
      text,
      sourceLang || "auto",
      target
    );
    return NextResponse.json({ translatedText: translated });
  } catch (error) {
    console.error("[translate] Error:", error);
    const formatted = formatError(error);
    return NextResponse.json({ error: formatted }, { status: 500 });
  }
}
