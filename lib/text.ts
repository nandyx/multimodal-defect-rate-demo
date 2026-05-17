export function isSpanishText(text: string): boolean {
  return /[áéíóúñ¿¡]/i.test(text);
}
