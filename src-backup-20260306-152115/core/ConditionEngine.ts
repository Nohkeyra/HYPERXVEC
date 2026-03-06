import { Preset } from '@/src/presets';
import { ColorPalette } from '@/src/colorPalettes';
import { ImageModel } from '@/src/services/modelRegistry';
import { KSD } from '@/src/core/ksd';

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
  static applyKSD(prompt: string, moduleId: string): string {
    let enhancedPrompt = prompt;
    
    // Apply Global Rules (Conceptual - represented as instructions)
    if (KSD.globalRules.geometry_priority) {
      enhancedPrompt += "\n\n[KSD: GEOMETRY PRIORITY ACTIVE]";
    }

    // Apply Module-Specific Rules
    const moduleRules = KSD.modules[moduleId as keyof typeof KSD.modules];
    if (moduleRules) {
      enhancedPrompt += `\n\n### KSD MODULE LOGIC: ${moduleId.toUpperCase()}`;
      // Cast to any to access properties that might not exist on all module types
      const rules = moduleRules as any;
      enhancedPrompt += `\n- Shape Language: ${rules.shape_language || 'Standard'}`;
      enhancedPrompt += `\n- Path Fidelity: ${rules.path_fidelity || 'Standard'}`;
      
      if (moduleRules.additionalRules) {
        enhancedPrompt += `\n- ${moduleRules.additionalRules.join('\n- ')}`;
      }
    }

    // Apply Structural Layers based on module
    if (moduleId === 'vectorize') {
      enhancedPrompt += `\n\n### KSD STRUCTURAL LAYER: VECTOR BASE\n- ${KSD.structuralLayers.vector_base.join('\n- ')}`;
    } else if (moduleId === 'core lettering') {
      enhancedPrompt += `\n\n### KSD STRUCTURAL LAYER: TYPOGRAPHY BASE\n- ${KSD.structuralLayers.typography_base.join('\n- ')}`;
    }

    return enhancedPrompt;
  }

  static build(config: GenerationConfig): EnginePayload {
    // 1. Normalize prompt
    let finalPrompt = config.prompt.trim();

    // 2. Safely merge color palette rules
    if (config.palette && config.palette.name !== 'Default') {
      finalPrompt += ` CRITICAL COLOR INSTRUCTION: Use exactly this color palette: ${config.palette.name} (${config.palette.colors.join(', ')}). Do not use any other colors.`;
    }

    // 3. Validate against model capabilities
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
