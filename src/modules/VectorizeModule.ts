import { ModuleStrategy, GenerationContext } from "./types";
import { ConditionEngine } from "../core/ConditionEngine";
import { GLOBAL_NEGATIVE_PROMPT } from "../constants";

export const VectorizeModule: ModuleStrategy = {
  id: 'vectorize',
  name: 'Vectorize',
  
  constructPrompt: (context: GenerationContext) => {
    const { prompt, preset, base64Image, strictMode, isIllustrated, isSubjectOnly, selectedPalette } = context;
    
    let colorInstruction = "2. COLOR BLOCKING: Apply solid, flat color fills. Ensure there are zero gradients, no airbrushing, and no soft color transitions.";
    if (selectedPalette && selectedPalette.name !== 'Default') {
      colorInstruction = `2. COLOR PALETTE: STRICTLY USE ONLY THESE COLORS: ${selectedPalette.name} (${selectedPalette.colors.join(', ')}). No other colors allowed. Apply solid, flat color fills.`;
    }

    const coreRules = `
### CORE GEOMETRIC RULES
1. LINE WORK: Use clean, closed-path strokes with consistent line weights. No sketchy or organic brushstrokes.
${colorInstruction}
3. EDGE DEFINITION: All edges must be razor-sharp and aliased. Avoid all depth-of-field, lens blur, or soft focus.
4. LIGHTING & SHADOWS: Use cel-shading or hard-edge shadows only. No realistic global illumination or soft drop shadows.

### TECHNICAL FINISH
Ensure the final output resembles a finished 2D digital graphic created in Adobe Illustrator. The image should be uncluttered, minimalist, and high-contrast.
CRITICAL: The result MUST look like high-end, professional graphic design. It MUST NOT look like cheap stock clipart, amateur vector art, or basic icon sets.

### COMPOSITION FIDELITY
Maintain the subject's original pose, angle, and composition. Do not rotate, flip, or excessively reimagine the subject's placement unless explicitly asked. The subject should be the primary focus, clearly visible, and not obscured by excessive stylistic elements.`;

    let finalPrompt = `### PRIMARY DIRECTIVE\nGenerate a professional ${preset.name} vector illustration of ${prompt}.\n\nStyle: ${preset.basePrompt}\n${coreRules}`;

    if (isIllustrated) {
      finalPrompt += `\n\n### ILLUSTRATION MODE ACTIVE\nRendered in high-fidelity illustrated vector finish. Add subtle textures, depth, and polish while maintaining vector clean lines.`;
    }

    if (isSubjectOnly) {
      finalPrompt += `\n\n### SUBJECT ISOLATION ACTIVE\nTransparent-style solid background, zero background clutter. Focus ONLY on the main subject.`;
    }

    if (base64Image) {
      const fidelityInstruction = strictMode 
        ? "STRICTLY COPY the reference image subject's pose, angle, and composition. Do NOT reposition, rotate, or reimagine the subject. Simply redraw it in the requested style."
        : "Maintain the main features, pose, and composition of the reference image. Do NOT excessively reposition or rotate the subject.";

      finalPrompt = `### PRIMARY DIRECTIVE\nRecreate the subject of this image entirely as a professional ${preset.name} vector illustration.\n\nStyle: ${preset.basePrompt}\n\nCRITICAL: Isolate the subject. Remove the original background and replace it with a solid, flat color.\nThe output MUST NOT look like a filtered photo. You must completely rebuild the image from scratch using ONLY the techniques of the requested style.\nIgnore the original textures and lighting of the photo. If the style is Paper Cutout, the entire image must be made of layered paper. If the style is Line Art, it must be only lines.\n${fidelityInstruction}\n${coreRules}`;

      if (isIllustrated) {
        finalPrompt += `\n\n### ILLUSTRATION MODE ACTIVE\nRendered in high-fidelity illustrated vector finish. Add subtle textures, depth, and polish while maintaining vector clean lines.`;
      }

      if (isSubjectOnly) {
        finalPrompt += `\n\n### SUBJECT ISOLATION ACTIVE\nTransparent-style solid background, zero background clutter. Focus ONLY on the main subject.`;
      }
    }
    
    if (preset.name === 'T&T Core Vibe') {
      finalPrompt += `\n\nCRITICAL AESTHETIC INSTRUCTION (T&T Vibe): 
      Enforce mathematically precise paths, 45-degree shears, zero-gap terminals, and monolithic mass.
      The aesthetic MUST be Urban, Tech, Sport, Cyberpunk, Brutalist, Streetwear, or High-Fidelity Vector.
      BANNED AESTHETICS: Absolutely NO watercolor, sketch, photorealism, soft pastels, vintage, rustic, organic, or lo-fi styles.`;
    }

    finalPrompt += `\n\nCRITICAL BACKGROUND INSTRUCTION: The background MUST be a solid, flat color (e.g., black, white, or a solid brand color). 
    Do NOT use brick walls, concrete textures, street scenes, or any realistic environment. 
    Isolate the design on a clean, solid background.
    
    PERFECT ALIGNMENT: The subject must be perfectly upright, centered, and front-facing. No slants, no tilts, no perspective distortion (unless explicitly requested by the style).`;

    // Apply KSD Rules
    finalPrompt = ConditionEngine.applyKSD(finalPrompt, 'vectorize');

    return finalPrompt;
  },

  constructNegativePrompt: (context: GenerationContext) => {
    const { preset } = context;
    return `${preset.negativePrompt}, ${GLOBAL_NEGATIVE_PROMPT}`.trim();
  },

  shouldSkipTurbo: (context: GenerationContext) => {
    return false;
  }
};
