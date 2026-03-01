import { Preset } from '../presets';
import { ColorPalette } from '../colorPalettes';
import { ImageModel } from '../services/modelRegistry';

export interface GenerationConfig {
  readonly prompt: string;
  readonly preset: Preset;
  readonly palette?: ColorPalette;
  readonly base64Image?: string;
  readonly mimeType?: string;
  readonly strictMode: boolean;
  readonly model: ImageModel;
}

export interface EnginePayload {
  readonly finalPrompt: string;
  readonly preset: Preset;
  readonly base64Image?: string;
  readonly mimeType?: string;
  readonly strictMode: boolean;
  readonly model: ImageModel;
}

export class ConditionEngine {
  static build(config: GenerationConfig): EnginePayload {
    // 1. Normalize prompt
    let finalPrompt = config.prompt.trim();

    // 2. Safely merge color palette rules
    if (config.palette && config.palette.name !== 'Default') {
      finalPrompt += ` CRITICAL COLOR INSTRUCTION: Use exactly this color palette: ${config.palette.name} (${config.palette.colors.join(', ')}). Do not use any other colors.`;
    }

    // 3. Apply KSD schema layers (placeholder for KSD V2 logic)
    // In a full implementation, this would load KSD_V2.json and append structural rules
    // based on the preset category or specific tags.

    // 4. Validate against model capabilities
    // For example, if strictMode is true, ensure the model supports it or adjust parameters.
    // This is a simplified validation.
    if (config.strictMode && !config.base64Image) {
      console.warn("ConditionEngine: strictMode is true but no reference image provided.");
    }

    // Return immutable payload
    return Object.freeze({
      finalPrompt,
      preset: config.preset, // Preset is already frozen
      base64Image: config.base64Image,
      mimeType: config.mimeType,
      strictMode: config.strictMode,
      model: config.model
    });
  }
}
