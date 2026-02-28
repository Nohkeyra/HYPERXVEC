import { ModuleStrategy, GenerationContext } from "./types";

export const VectorizeModule: ModuleStrategy = {
  id: 'vectorize',
  name: 'Vectorize',
  
  constructPrompt: (context: GenerationContext) => {
    const { prompt, preset, base64Image, strictMode, isIllustrated, isSubjectOnly } = context;
    
    let finalPrompt = `Professional high-end graphic design: ${prompt}. 
    Style: ${preset.basePrompt}. 
    Technical details: solid background, subject isolation, absolutely no photorealism, no photographic noise.`;

    if (isIllustrated) {
      finalPrompt += ` Rendered in high-fidelity illustrated vector finish, subtle textures, depth, and polish.`;
    }

    if (isSubjectOnly) {
      finalPrompt += ` Subject isolation, transparent-style solid background, zero background clutter. Focus ONLY on the main subject.`;
    }

    if (base64Image) {
      const fidelityInstruction = strictMode 
        ? "STRICTLY COPY the reference image subject's pose and composition, but COMPLETELY REDRAW it in the requested style."
        : "Maintain the main features of the reference image, but COMPLETELY REDRAW it in the requested style.";

      finalPrompt = `Recreate the subject of this image entirely in the following specific art style. 
      CRITICAL: Isolate the subject. Remove the original background and replace it with a solid, flat color.
      The output MUST NOT look like a filtered photo. You must completely rebuild the image from scratch using ONLY the techniques of the requested style.
      Ignore the original textures and lighting of the photo. If the style is Paper Cutout, the entire image must be made of layered paper. If the style is Line Art, it must be only lines.
      ${fidelityInstruction}
      Style: ${preset.basePrompt}.
      Technical details: solid background, subject isolation, absolutely no photorealism, no photographic noise.`;

      if (isIllustrated) {
        finalPrompt += ` Rendered in high-fidelity illustrated vector finish, subtle textures, depth, and polish.`;
      }

      if (isSubjectOnly) {
        finalPrompt += ` Subject isolation, transparent-style solid background, zero background clutter. Focus ONLY on the main subject.`;
      }
    }
    
    if (preset.name === 'T&T Core Vibe') {
      finalPrompt += ` CRITICAL AESTHETIC INSTRUCTION (T&T Vibe): 
      Enforce mathematically precise paths, 45-degree shears, zero-gap terminals, and monolithic mass.
      The aesthetic MUST be Urban, Tech, Sport, Cyberpunk, Brutalist, Streetwear, or High-Fidelity Vector.
      BANNED AESTHETICS: Absolutely NO watercolor, sketch, photorealism, soft pastels, vintage, rustic, organic, or lo-fi styles.`;
    }

    finalPrompt += `
    CRITICAL BACKGROUND INSTRUCTION: The background MUST be a solid, flat color (e.g., black, white, or a solid brand color). 
    Do NOT use brick walls, concrete textures, street scenes, or any realistic environment. 
    Isolate the design on a clean, solid background.`;

    return finalPrompt;
  },

  shouldSkipTurbo: (context: GenerationContext) => {
    return false;
  }
};
