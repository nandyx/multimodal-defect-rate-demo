import { TranslateClient } from "@aws-sdk/client-translate";
import { ComprehendClient } from "@aws-sdk/client-comprehend";
import { RekognitionClient } from "@aws-sdk/client-rekognition";

const config = {
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
};

export const translateClient = new TranslateClient(config);
export const comprehendClient = new ComprehendClient(config);
export const rekognitionClient = new RekognitionClient(config);
