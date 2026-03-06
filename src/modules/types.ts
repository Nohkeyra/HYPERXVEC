import { Preset } from "../presets";
import { EnginePayload } from "../core/ConditionEngine";
import { ColorPalette } from "../colorPalettes";

export interface GenerationContext {
  prompt: string;
  preset: Preset;
  base64Image?: string;
  mimeType?: string;
  strictMode?: boolean;
  isIllustrated?: boolean;
  isSubjectOnly?: boolean;
  selectedPalette?: ColorPalette | null;
  logoType?: string;
  logoLayout?: string;
}

export interface ModuleStrategy {
  id: string;
  name: string;
  constructPrompt(context: GenerationContext): string;
  constructNegativePrompt?(context: GenerationContext): string;
  shouldSkipTurbo(context: GenerationContext): boolean;
  generate?(payload: EnginePayload, apiKey?: string): Promise<string>;
}
