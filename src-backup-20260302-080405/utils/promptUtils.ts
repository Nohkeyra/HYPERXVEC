
/**
 * Utility to handle prompt weighting and attention mechanisms.
 * Supports syntax like (word:1.5) or [word] for emphasis.
 */

export interface WeightedPrompt {
  original: string;
  cleaned: string;
  weights: Array<{ word: string; weight: number }>;
}

export const parsePromptWeights = (prompt: string): WeightedPrompt => {
  const weights: Array<{ word: string; weight: number }> = [];
  
  // Match (word:1.5) or (word)
  const weightRegex = /\(([^:)]+)(?::([\d.]+))?\)/g;
  let match;
  
  // Create a copy to find matches without modifying the original yet
  const tempPrompt = prompt;

  while ((match = weightRegex.exec(tempPrompt)) !== null) {
    const word = match[1].trim();
    const weight = match[2] ? parseFloat(match[2]) : 1.2;
    weights.push({ word, weight });
  }

  // Also match [word] as a shorthand for (word:1.5)
  const bracketRegex = /\[([^\]]+)\]/g;
  while ((match = bracketRegex.exec(tempPrompt)) !== null) {
    const word = match[1].trim();
    weights.push({ word, weight: 1.5 });
  }

  // Clean the prompt for models that don't support this syntax natively
  const cleanedPrompt = prompt
    .replace(/\(([^:)]+)(?::([\d.]+))?\)/g, '$1')
    .replace(/\[([^\]]+)\]/g, '$1');

  return {
    original: prompt,
    cleaned: cleanedPrompt,
    weights
  };
};

/**
 * Formats the prompt for Gemini to explicitly handle attention/weighting.
 */
export const formatForGeminiAttention = (prompt: string): string => {
  const { cleaned, weights } = parsePromptWeights(prompt);
  
  if (weights.length === 0) return prompt;

  let attentionInstruction = "\n\nCRITICAL ATTENTION INSTRUCTIONS:";
  weights.forEach(({ word, weight }) => {
    const level = weight > 1.5 ? "EXTREME" : weight > 1.2 ? "HIGH" : "MODERATE";
    attentionInstruction += `\n- Focus ${level} attention on: "${word}" (Priority Weight: ${weight})`;
  });

  return `${cleaned}${attentionInstruction}`;
};

/**
 * Formats the prompt for Stable Diffusion (NVIDIA/BytePlus) which often supports (word:weight) natively.
 */
export const formatForSDAttention = (prompt: string): string => {
  // Most SD implementations support (word:weight)
  // We'll ensure it's in a standard format: (word:weight)
  // We convert [word] to (word:1.5)
  return prompt.replace(/\[([^\]]+)\]/g, '($1:1.5)');
};
