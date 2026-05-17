export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function formatError(error: unknown): {
  code: string;
  message: string;
  details?: string;
} {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      details: process.env.NODE_ENV === "development" ? error.details : undefined,
    };
  }

  if (error instanceof Error) {
    if (error.name === "SubscriptionRequiredException") {
      return {
        code: "AWS_ERROR",
        message: "AWS no activado — revisar que el plan pago esté activo",
        details: error.message,
      };
    }

    if (error.message.includes("timeout") || error.message.includes("Timeout")) {
      return {
        code: "TIMEOUT",
        message: "El análisis tomó demasiado tiempo. Intenta de nuevo.",
        details: error.message,
      };
    }

    return {
      code: "AWS_ERROR",
      message: "Error al procesar el reclamo. Intenta de nuevo.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }

  return {
    code: "AWS_ERROR",
    message: "Error inesperado. Intenta de nuevo.",
  };
}
