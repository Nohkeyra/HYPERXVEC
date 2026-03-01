import { ModuleStrategy, GenerationContext } from "./types";

export const LetteringModule: ModuleStrategy = {
  id: 'core lettering',
  name: 'Core Lettering',
  
  constructPrompt: (context: GenerationContext) => {
    const { prompt, preset, base64Image, strictMode } = context;
    
    // Architectural Lettering Vision: Structural, 3D masses, Solid Void
    const structuralBase = `STRUCTURAL LETTERING: characters built as 3D architectural masses, monolithic block forms, industrial structural integrity, clean geometric extrusions.`;
    const solidVoidRule = `SOLID VOID RULE: design exists on a flat, absolute solid background, zero environmental noise, no photographic textures.`;
    
    let finalPrompt = `${structuralBase} Subject: ${prompt}. Style: ${preset.basePrompt}. ${solidVoidRule}`;

    if (base64Image) {
      const fidelity = strictMode ? "STRICT SILHOUETTE ADHERENCE" : "GENERAL FORM MATCHING";
      finalPrompt = `ARCHITECTURAL TRANSFORMATION: ${fidelity}. Rebuild the subject of this image as a 3D structural lettering mass. 
      Discard all original environment. Apply style: ${preset.basePrompt}. ${structuralBase} ${solidVoidRule}`;
    }

    return finalPrompt;
  },

  constructNegativePrompt: (context: GenerationContext) => {
    const { preset } = context;
    const globalNegative = "photorealism, brick walls, concrete textures, realistic rooms, photographic depth of field, street scenes, organic textures, messy gradients, blurry, low resolution, watermark, signature";
    return `${preset.negativePrompt}, ${globalNegative}`.trim();
  },

  shouldSkipTurbo: (context: GenerationContext) => {
    return false;
  }
};
