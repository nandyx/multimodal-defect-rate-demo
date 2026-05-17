import {
  DetectLabelsCommand,
  DetectModerationLabelsCommand,
} from "@aws-sdk/client-rekognition";
import { rekognitionClient } from "./clients";

export async function detectLabels(imageBytes: Uint8Array) {
  const command = new DetectLabelsCommand({
    Image: { Bytes: imageBytes },
    MaxLabels: 15,
    MinConfidence: 50,
  });
  const result = await rekognitionClient.send(command);
  return (result.Labels || []).map((l) => ({
    name: l.Name || "",
    confidence: l.Confidence || 0,
  }));
}

export async function detectModerationLabels(imageBytes: Uint8Array) {
  const command = new DetectModerationLabelsCommand({
    Image: { Bytes: imageBytes },
    MinConfidence: 50,
  });
  const result = await rekognitionClient.send(command);
  return (result.ModerationLabels || []).map((l) => ({
    name: l.Name || "",
    confidence: l.Confidence || 0,
  }));
}
