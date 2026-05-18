import type { Metadata } from "next";
import { cn } from "@/styles";
import { QueryProvider } from "@/providers/QueryProvider";
import { geistMono, geistSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Defect Rate IA - Análisis de Reclamos",
  description: "Demo de IA aplicada al defect rate con AWS Translate, Comprehend y Rekognition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(geistSans.variable, geistMono.variable, "h-full antialiased")}
    >
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
