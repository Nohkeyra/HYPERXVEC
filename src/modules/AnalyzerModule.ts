import { ModuleStrategy, GenerationContext } from "./types";

export const AnalyzerModule: ModuleStrategy = {
  id: 'image analyzer',
  name: 'Analyzer',
  
  constructPrompt: (context: GenerationContext) => {
    // Analyzer typically doesn't generate images, but if it does (e.g. style transfer),
    // it uses the standard prompt.
    const { prompt, preset, base64Image, strictMode } = context;
    
    let finalPrompt = `Professional high-end graphic design: ${prompt}. 
    Style: ${preset.basePrompt}. 
    Technical details: ultra-clean vector lines, sharp edges, flat solid colors, high contrast, professional composition, 8k resolution, minimalist aesthetic.`;

    if (base64Image) {
      const fidelityInstruction = strictMode 
        ? "STRICTLY COPY the reference image subject. Do not alter the pose, composition, or key features. High fidelity to source subject is required."
        : "Maintain the composition, pose, and main features of the reference image.";

      finalPrompt = `Vectorize this exact subject: ${prompt}.
      ${fidelityInstruction}
      Style: ${preset.basePrompt}.
      Technical details: ultra-clean vector lines, sharp edges, flat solid colors, high contrast, professional composition, 8k resolution, minimalist aesthetic.`;
    }
    
    return finalPrompt;
  },

  shouldSkipTurbo: (context: GenerationContext) => {
    // Analyzer is primarily for analysis, but if generating, Gemini is better for understanding the input.
    return !!context.base64Image;
  }
};
