export function requestErrorTitle() {
  return "No pudimos cargar la información";
}

export function requestErrorMessage(detail?: string | null) {
  if (detail) return detail;
  return "Verifica tu conexión e intenta de nuevo.";
}
