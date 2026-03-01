export const KSD = {
  version: "2.1-merged",
  name: "KSD_Unified",
  description: "Unified Knowledge Structure Definition for Vector, Typography, and Logo Design",
  
  // From KSD V1: Global Rules
  globalRules: {
    no_text_response: true,
    geometry_priority: true,
    vector_safe: true,
    no_style_drift: true,
    logo_standards: "strict",
    path_quantization: "strict",
    color_limit: 16
  },

  // From KSD V2: Structural Layers
  structuralLayers: {
    vector_base: [
      "mathematically precise paths",
      "45-degree shears",
      "zero-gap terminals",
      "monolithic mass",
      "interlocking geometry"
    ],
    typography_base: [
      "experimental disruptive lettering",
      "solid block mass",
      "zero spacing",
      "sheared terminals",
      "visual friction over legibility"
    ]
  },

  // From KSD V1: Module-Specific Logic
  modules: {
    "core lettering": {
      layout: "grid",
      hierarchy: "weight_contrast",
      spacing: "balanced",
      additionalRules: [
        "Use specialized font tokens encoded through a variational autoencoder (VAE)",
        "Process text as a structured linguistic system",
        "Ensure character integrity"
      ]
    },
    "logo design": {
      merge: "anchor_based_overlap",
      symmetry: "vertical",
      stroke_uniform: true,
      path_fidelity: "High",
      additionalRules: [
        "Monochrome-first logic",
        "Perfectly centered and symmetrical",
        "Razor-sharp vector edges"
      ]
    },
    "vectorize": {
      shape_language: "geometric",
      anchor_precision: "high",
      scalable: true,
      additionalRules: [
        "Clean, closed-path strokes",
        "Consistent line weights",
        "No sketchy or organic brushstrokes"
      ]
    }
  }
};
