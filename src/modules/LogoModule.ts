import { ModuleStrategy, GenerationContext } from "./types";
import { Preset, PresetCategory } from "../presets";

export const LOGO_PRESETS: PresetCategory[] = [
  // CATEGORY 1: WORDMARK LOGOS (5)
  // Focus: Custom Typography and Spacing
  {
    category: "Wordmark Logos",
    presets: [
      {
        name: "Geometric Sans",
        basePrompt: "vector wordmark logo, custom sans-serif font, geometric precision, balanced letter spacing, modern brand identity, solid background",
        aspectRatio: "1:1",
        negativePrompt: "icons, symbols, script, messy, gradients"
      },
      {
        name: "Modern Serif",
        basePrompt: "serif typography logo, high-contrast modified letterforms, elegant font structure, sophisticated brand mark, solid background",
        aspectRatio: "1:1",
        negativePrompt: "sans-serif, thick lines, messy, raw, rustic"
      },
      {
        name: "Bold Block",
        basePrompt: "heavy block letter logo, monolithic wordmark, industrial aesthetic, t&t core vibe, massive presence, solid background",
        aspectRatio: "1:1",
        negativePrompt: "curves, thin lines, soft, colorful, ornate"
      },
      {
        name: "Modified Script",
        basePrompt: "custom script logotype, connected vector paths, uniform stroke width, professional signature style, solid background",
        aspectRatio: "1:1",
        negativePrompt: "messy handwriting, separate letters, jagged, complex"
      },
      {
        name: "Minimalist Inline",
        basePrompt: "inline typography logo, negative space within letterforms, dual-line wordmark, sophisticated vector geometry, solid background",
        aspectRatio: "1:1",
        negativePrompt: "filled letters, bold, messy, gradients"
      }
    ]
  },
  // CATEGORY 2: MONOGRAM LOGOS (5)
  // Focus: Initials, Negative Space, Interlocking
  {
    category: "Monogram Logos",
    presets: [
      {
        name: "Geometric Initial",
        basePrompt: "single letter monogram, golden ratio circle structure, minimalist vector icon, high symmetry, solid background",
        aspectRatio: "1:1",
        negativePrompt: "text, words, complex, asymmetrical, realistic"
      },
      {
        name: "Interlocking Letters",
        basePrompt: "dual letter monogram, interlocking vector paths, complex geometric weave, continuous line flow, solid background",
        aspectRatio: "1:1",
        negativePrompt: "separated letters, thin lines, messy, words"
      },
      {
        name: "Negative Space Monogram",
        basePrompt: "monogram with hidden symbol, negative space logic, dual-meaning lettermark, high-contrast silhouette, solid background",
        aspectRatio: "1:1",
        negativePrompt: "multiple colors, thin lines, messy, text"
      },
      {
        name: "Symmetric Initial",
        basePrompt: "symmetric monogram logo, mirror-image letter geometry, heraldic balance, vertical axis, solid background",
        aspectRatio: "1:1",
        negativePrompt: "asymmetrical, messy, raw, script"
      },
      {
        name: "Minimalist Apex",
        basePrompt: "apex monogram, sharp letter geometry, upward triangle focus, ambitious brand mark, precision vector, solid background",
        aspectRatio: "1:1",
        negativePrompt: "curves, soft, colorful, text"
      }
    ]
  },
  // CATEGORY 3: PICTORIAL MARKS (5)
  // Focus: Simplified Real-World Objects
  {
    category: "Pictorial Marks",
    presets: [
      {
        name: "Flat Icon",
        basePrompt: "flat vector icon, single literal object, bold silhouette, simplified geometry, no shading, solid background",
        aspectRatio: "1:1",
        negativePrompt: "3D, photorealistic, shadows, gradients, messy"
      },
      {
        name: "Outline Pictorial",
        basePrompt: "monoline object icon, continuous stroke weight, minimalist line art symbol, uniform path, solid background",
        aspectRatio: "1:1",
        negativePrompt: "fills, shading, complex detail, multiple colors"
      },
      {
        name: "Negative Space Icon",
        basePrompt: "pictorial mark with dual meaning, negative space logic, silhouette symbol, high-contrast, solid background",
        aspectRatio: "1:1",
        negativePrompt: "text, messy lines, gradients, blurry"
      },
      {
        name: "Geometric Object",
        basePrompt: "object icon from primitives, constructed using circles and squares, mathematical balance, high symmetry, solid background",
        aspectRatio: "1:1",
        negativePrompt: "hand-drawn, organic, realistic, gradients"
      },
      {
        name: "Dynamic Pictorial",
        basePrompt: "dynamic object symbol, kinetic energy, directional lines, forward-moving vector, stylized motion, solid background",
        aspectRatio: "1:1",
        negativePrompt: "static, flat, messy, rustic"
      }
    ]
  },
  // CATEGORY 4: ABSTRACT MARKS (5)
  // Focus: Primitives, Symmetry, Ratios
  {
    category: "Abstract Marks",
    presets: [
      {
        name: "Symmetric Geometric",
        basePrompt: "symmetric abstract logo, perfect circle geometry, mathematical alignment, primary primitives, high symmetry, solid background",
        aspectRatio: "1:1",
        negativePrompt: "asymmetrical, literal objects, organic, hand-drawn"
      },
      {
        name: "Kinetic Symbol",
        basePrompt: "kinetic abstract logo, overlapping shapes, color transparency, dynamic energy flow, futuristic vector, solid background",
        aspectRatio: "1:1",
        negativePrompt: "static, single color, opaque, classic"
      },
      {
        name: "Golden Ratio Form",
        basePrompt: "abstract symbol from golden ratio, calculated spiral geometry, perfect proportion, mathematical balance, solid background",
        aspectRatio: "1:1",
        negativePrompt: "messy, irregular, organic, hand-drawn"
      },
      {
        name: "Apex Abstract",
        basePrompt: "upward triangle abstract, geometric growth symbol, precision alignment, ambitious brand focus, solid background",
        aspectRatio: "1:1",
        negativePrompt: "curves, soft, messy, organic"
      },
      {
        name: "Modular Core",
        basePrompt: "modular block abstract, repeating geometric units, structural geometry, monolith mass, solid background",
        aspectRatio: "1:1",
        negativePrompt: "soft, messy, curves, rustic"
      }
    ]
  },
  // CATEGORY 5: COMBINATION MARKS (5)
  // Focus: Balanced Icon and Wordmark
  {
    category: "Combination Marks",
    presets: [
      {
        name: "Vertical Stack",
        basePrompt: "vertically stacked logo, geometric icon above custom wordmark, centered balance, high precision vector, solid background",
        aspectRatio: "1:1",
        negativePrompt: "horizontal, messy, hand-drawn, blurry"
      },
      {
        name: "Side-by-Side",
        basePrompt: "horizontal logo lockup, geometric icon left of custom wordmark, professional spacing, streamlined brand identity, solid background",
        aspectRatio: "1:1",
        negativePrompt: "vertical, complex, messy, rustic"
      },
      {
        name: "Integrated Mark",
        basePrompt: "integrated vector logo, icon replaces a letter, clever typography, high-contrast silhouette, solid background",
        aspectRatio: "1:1",
        negativePrompt: "text only, icon only, messy spacing, blur"
      },
      {
        name: "Symmetric Combination",
        basePrompt: "symmetric logo system, icon centered on wordmark, perfect visual balance, geometric precision, solid background",
        aspectRatio: "1:1",
        negativePrompt: "asymmetrical, messy, rustic, script"
      },
      {
        name: "Minimalist Split",
        basePrompt: "split combination mark, thin line icon separate from wordmark, spacious composition, neo-minimalist vector, solid background",
        aspectRatio: "1:1",
        negativePrompt: "cluttered, bold, messy, rustic"
      }
    ]
  },
  // CATEGORY 6: EMBLEM & BADGE LOGOS (5)
  // Focus: Contained Geometry, Heritage, Circles
  {
    category: "Emblem & Badge Logos",
    presets: [
      {
        name: "Geometric Circular",
        basePrompt: "circular vector badge, concentric ring geometry, balanced icon centerpiece, heraldic symmetry, solid background",
        aspectRatio: "1:1",
        negativePrompt: "irregular shapes, messy lines, text, blurry"
      },
      {
        name: "Heraldic Shield",
        basePrompt: "geometric shield emblem, classic heraldry silhouette, integrated primitives, authoritative presence, solid background",
        aspectRatio: "1:1",
        negativePrompt: "organic curves, soft, colorful, ornate"
      },
      {
        name: "Industrial Octagon",
        basePrompt: "octagonal badge, heavy block geometry, t&t core vibe, monolithic presence, professional corporate vector, solid background",
        aspectRatio: "1:1",
        negativePrompt: "curves, soft, messy, colorful"
      },
      {
        name: "Outline Badge",
        basePrompt: "monoline badge emblem, consistent line weight, minimalist wireframe container, clean vector paths, solid background",
        aspectRatio: "1:1",
        negativePrompt: "filled shapes, shadows, messy, gradients"
      },
      {
        name: "Symmetric Coat",
        basePrompt: "geometric coat of arms, stylized animal or object motif, mirror-image balance, precise vector symmetry, solid background",
        aspectRatio: "1:1",
        negativePrompt: "asymmetrical, messy, organic, colorful"
      }
    ]
  },
  // CATEGORY 7: STREET ART LOGOS (6)
  // Focus: Urban, Graffiti, Stencil
  {
    category: "Street Art Logos",
    presets: [
      {
        name: "Tag Signature",
        basePrompt: "Urban tag signature logo, fluid handstyle, chisel marker stroke, street credibility, raw vector finish, solid background",
        aspectRatio: "1:1",
        negativePrompt: "serif, digital, clean, corporate, geometric"
      },
      {
        name: "Stencil Icon",
        basePrompt: "Stencil art logo, disconnected bridges, overspray texture, military industrial urban vibe, solid background",
        aspectRatio: "1:1",
        negativePrompt: "connected, smooth, hand-drawn, soft"
      },
      {
        name: "Spray Paint Mascot",
        basePrompt: "Character mascot logo, spray paint texture, bold outline, street art character style, vibrant urban colors, solid background",
        aspectRatio: "1:1",
        negativePrompt: "flat, corporate, minimal, abstract"
      },
      {
        name: "Urban Sticker",
        basePrompt: "Slap sticker aesthetic, bold high-contrast graphics, hello-my-name-is vibe, street wear branding, solid background",
        aspectRatio: "1:1",
        negativePrompt: "complex, detailed, realistic, 3D"
      },
      {
        name: "Graffiti Lettermark",
        basePrompt: "Single letter graffiti logo, wildstyle complexity, sharp arrows and connections, urban brand mark, solid background",
        aspectRatio: "1:1",
        negativePrompt: "simple, serif, clean, corporate"
      },
      {
        name: "Grunge Emblem",
        basePrompt: "Distressed urban emblem, concrete texture overlay, eroded edges, underground streetwear aesthetic, solid background",
        aspectRatio: "1:1",
        negativePrompt: "clean, smooth, polished, corporate"
      }
    ]
  }
];

export const LogoModule: ModuleStrategy = {
  id: 'logo design',
  name: 'Logo Design',
  
  constructPrompt: (context: GenerationContext) => {
    const { prompt, preset, base64Image, strictMode, isIllustrated, isSubjectOnly } = context;
    
    const logoRules = `
    CRITICAL LOGO RULES:
    1. Scalable at 24px: The design must be legible at very small sizes. Bold, simple shapes.
    2. Monochrome-first logic: The design must work in black and white. High contrast.
    3. Geometric path quantization: Use perfect circles, squares, and lines. No irregular hand-drawn wobbles.
    4. Zero photographic noise: Absolutely no textures, gradients, or shading unless specified. Flat vector only.
    5. No text hallucinations: Do not attempt to render complex text unless it's a simple monogram or wordmark.
    `;

    let finalPrompt = `Professional Logo Design: ${prompt}.
    Style: ${preset.basePrompt}.
    ${logoRules}
    Technical details: solid background, vector file ready, centered composition.`;

    if (isIllustrated) {
      finalPrompt += ` Rendered in high-fidelity illustrated vector finish, subtle textures, depth, and polish.`;
    }

    if (isSubjectOnly) {
      finalPrompt += ` Subject isolation, transparent-style solid background, zero background clutter. Focus ONLY on the logo mark.`;
    }

    if (base64Image) {
      const fidelityInstruction = strictMode 
        ? "STRICTLY COPY the reference logo structure/composition, but REDRAW it in the requested style."
        : "Use the reference image as a structural guide, but modernize and stylize it according to the preset.";

      finalPrompt = `Redesign this logo/image into a professional vector logo.
      ${fidelityInstruction}
      Style: ${preset.basePrompt}.
      ${logoRules}
      Technical details: solid background, subject isolation, vector style.`;
    }

    return finalPrompt;
  },

  shouldSkipTurbo: (context: GenerationContext) => {
    return false;
  }
};
