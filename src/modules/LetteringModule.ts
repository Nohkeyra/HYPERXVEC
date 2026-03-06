import { ModuleStrategy, GenerationContext } from "./types";
import { ConditionEngine } from "../core/ConditionEngine";
import { GLOBAL_NEGATIVE_PROMPT } from "../constants";

export const LetteringModule: ModuleStrategy = {
  id: 'core lettering',
  name: 'Core Lettering',
  
  constructPrompt: (context: GenerationContext) => {
    const { prompt, preset, base64Image, strictMode, isIllustrated, isSubjectOnly, selectedPalette } = context;
    
    let colorRule = "- COLOR: Use a flat, high-contrast color palette. Zero gradients. Zero shading.";
    if (selectedPalette && selectedPalette.name !== 'Default') {
      colorRule = `- COLOR PALETTE: STRICTLY USE ONLY THESE COLORS: ${selectedPalette.name} (${selectedPalette.colors.join(', ')}). No other colors allowed.`;
    }

    const coreRules = `
### 3. COMPOSITION & BACKGROUND
- BACKGROUND: Place the design on a PURE SOLID COLOR BACKGROUND. 
- MASKING: If using Style #16, the graphic must be physically woven through the letter strokes.
- ISOLATION: The design must be centered, symmetrical, and completely isolated from any environment or scenery.

### 4. TECHNICAL VECTOR FINISH
- EDGES: All lines and curves must be razor-sharp and aliased.
${colorRule}
- TEXTURE: Absolute zero grain, noise, or painterly brushstrokes. The finish must resemble a "clean path" export from Adobe Illustrator.

### 5. LINGUISTIC PROCESSING (CRITICAL)
- VAE FONT TOKENS: Process the text as a structured linguistic system, not just a visual shape.
- CHARACTER INTEGRITY: Use specialized font tokens encoded through a variational autoencoder (VAE) to represent the fundamental characteristics of each character. Do not attempt to "paint" letters from random noise.`;

    let finalPrompt = `### 1. PRIMARY OBJECTIVE\nGenerate a high-impact 2D typographic illustration of the word: "${prompt}".\n\n### 2. STYLE EXECUTION (SELECT FROM LIBRARY)\nApply the following Preset Style: ${preset.name}\n- Focus on the specific structural rules of this style: ${preset.basePrompt}\n- Ensure the word remains recognizable while being stylistically distorted or intertwined.\n${coreRules}`;

    if (base64Image) {
      const fidelity = strictMode ? "STRICT SILHOUETTE ADHERENCE" : "GENERAL FORM MATCHING";
      finalPrompt = `### 1. PRIMARY OBJECTIVE\nRebuild the subject of this image as a high-impact 2D typographic illustration of the word: "${prompt}".\n\n### 2. STYLE EXECUTION (SELECT FROM LIBRARY)\nApply the following Preset Style: ${preset.name}\n- Focus on the specific structural rules of this style: ${preset.basePrompt}\n- Ensure the word remains recognizable while being stylistically distorted or intertwined.\n- ${fidelity}\n${coreRules}`;
    }

    if (isIllustrated) {
      finalPrompt += `\n\n### ILLUSTRATION MODE ACTIVE\nRendered in high-fidelity illustrated vector finish. Add subtle textures, depth, and polish while maintaining vector clean lines.`;
    }

    if (isSubjectOnly) {
      finalPrompt += `\n\n### SUBJECT ISOLATION ACTIVE\nTransparent-style solid background, zero background clutter. Focus ONLY on the main subject.`;
    }

    // Apply KSD Rules
    finalPrompt = ConditionEngine.applyKSD(finalPrompt, 'core lettering');

    return finalPrompt;
  },

  constructNegativePrompt: (context: GenerationContext) => {
    const { preset } = context;
    return preset.negativePrompt ? `${preset.negativePrompt}, ${GLOBAL_NEGATIVE_PROMPT}` : GLOBAL_NEGATIVE_PROMPT;
  },

  shouldSkipTurbo: (context: GenerationContext) => {
    return false;
  }
};
