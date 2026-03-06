import { ModuleStrategy, GenerationContext } from "./types";
import { Preset, PresetCategory } from "../presets";
import { ConditionEngine } from "../core/ConditionEngine";
import { GLOBAL_NEGATIVE_PROMPT } from "../constants";

export const LOGO_PRESETS: PresetCategory[] = [
  {
    category: "1. Minimalist",
    presets: [
      { name: "Ultra-Thin", basePrompt: "hairline thin vector strokes, maximum negative space, delicate geometric mark, clean sharp edges", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Bold Reductive", basePrompt: "single thick iconic shape, high-impact minimalist silhouette, solid black, heavy visual weight", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Swiss Modern", basePrompt: "grid-based design, sans-serif clarity, professional flat vector, no-frills corporate aesthetic", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Zen Reductive", basePrompt: "minimalist ink-brush stroke icon, balanced asymmetry, red sun circle motif, traditional-modern fusion", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Geometric Shape-Mark", basePrompt: "logo built from a single primitive geometric shape, clean mathematical lines, maximum white space", aspectRatio: "1:1", negativePrompt: "" }
    ]
  },
  {
    category: "2. Geometric",
    presets: [
      { name: "Golden Ratio", basePrompt: "mathematical logo, perfect circles and arcs, sacred geometry, precise symmetrical vector paths", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Fractal Shard", basePrompt: "geometric prism logo, sharp triangular shards, crystalline structure, fractal precision, 2D flat", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Bauhaus Primary", basePrompt: "basic geometric shapes (circle, square, triangle), red yellow blue primary colors, heavy thick lines", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Overlapping Arcs", basePrompt: "interlocking semi-circles, vibrant color-blocking, sharp geometric intersections, modern abstract", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Isometric Block", basePrompt: "3D-effect geometric cube logo, 2D flat shading, clean architectural lines, solid colors", aspectRatio: "1:1", negativePrompt: "" }
    ]
  },
  {
    category: "3. Vintage / Retro",
    presets: [
      { name: "1950s Badge", basePrompt: "retro circular badge logo, classic typography, nostalgic Americana, weathered vector edges", aspectRatio: "1:1", negativePrompt: "" },
      { name: "70s Groovy", basePrompt: "psychedelic rounded forms, warm sunset palette, bubble-letter aesthetic, groovy vintage finish", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Rough Stamp", basePrompt: "vintage rubber stamp style, circular border, textured ink-press edges, authentic handmade look", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Antique Heraldry", basePrompt: "minimalist ornate shield, classic line-art engraving style, professional heritage, black and white", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Art Deco Gatsby", basePrompt: "symmetrical geometric crest, gold monoline patterns, elegant 1920s opulence, sharp vector", aspectRatio: "1:1", negativePrompt: "" }
    ]
  },
  {
    category: "4. Mascot",
    presets: [
      { name: "Esports Vector", basePrompt: "aggressive mascot head, bold thick outlines, cel-shaded, vibrant high-contrast, professional gaming style", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Kawaii Flat", basePrompt: "cute Japanese character, rounded friendly shapes, pastel color palette, minimalist facial features", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Retro Cartoon", basePrompt: "1930s rubber-hose style, pie-eyes, vintage character illustration, clean vector outlines", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Streetwear Bear", basePrompt: "urban character mascot, hoodie aesthetic, thick bold graphics, streetwear screen-print style", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Minimalist Animal", basePrompt: "single-line animal silhouette, reductive features, clean geometric character, modern pictorial", aspectRatio: "1:1", negativePrompt: "" }
    ]
  },
  {
    category: "5. Monogram",
    presets: [
      { name: "Interlocking Luxury", basePrompt: "high-end interlocking letters, intertwined initials, elegant serif strokes, symmetrical fashion aesthetic", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Geometric Block", basePrompt: "modern blocky monogram, initials built from thick squares, architectural precision, solid flat color", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Monoline Script", basePrompt: "continuous line script letters, elegant fluid strokes, minimalist calligraphic ligature, single path", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Mirrored Symmetry", basePrompt: "symmetrical mirrored monogram, two letters flipped horizontally to create a unique pattern, balanced", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Stacked Initials", basePrompt: "vertically stacked initials, elegant high-contrast font, centered alignment, minimalist luxury", aspectRatio: "1:1", negativePrompt: "" }
    ]
  },
  {
    category: "6. Negative Space",
    presets: [
      { name: "Hidden Icon", basePrompt: "clever negative space logo, secondary symbol hidden inside primary shape, high-impact minimalist", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Cut-Out Block", basePrompt: "solid geometric block, subject cut out of center using empty space, sharp aliased edges", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Split-Silhouette", basePrompt: "dual-subject silhouette, two images sharing one edge, high-contrast negative space art", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Enclosed Initial", basePrompt: "geometric shape where the internal white space forms a specific letter, clever masking", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Shadow Play", basePrompt: "logo where the shadow of the object forms a completely different subject, high-impact vector", aspectRatio: "1:1", negativePrompt: "" }
    ]
  },
  {
    category: "7. Line Art",
    presets: [
      { name: "Monoline", basePrompt: "single continuous stroke logo, consistent line weight, elegant minimalist path, modern sophisticated", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Technical Wireframe", basePrompt: "3D wireframe line art, perspective blueprint paths, mathematical technical aesthetic, grid lines", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Dual-Line Flow", basePrompt: "logo made of two parallel lines, minimalist pathways, clean geometric flow, modern infrastructure", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Stippled Line", basePrompt: "monoline art with vector stipple shading, hand-etched ink style, high-detail stippling, heritage look", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Contour Mapping", basePrompt: "topographic line art, concentric geometric paths forming a subject, technical and clean", aspectRatio: "1:1", negativePrompt: "" }
    ]
  },
  {
    category: "8. Gradient / Glass",
    presets: [
      { name: "Glassmorphism", basePrompt: "soft frosted glass effect, semi-transparent layered shapes, modern 2D UI/UX aesthetic, pastel", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Vibrant Mesh", basePrompt: "vibrant aura gradient, soft color transitions, holographic liquid effect, sleek 2D vector finish", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Hard-Edge Gradient", basePrompt: "stepped color transitions, vector geometric shading, sharp 2D depth, modern tech palette", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Neon Glow (Flat)", basePrompt: "vibrant neon tube lighting effect, glowing color segments on dark background, 2D vector", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Duo-Tone Fade", basePrompt: "high-contrast two-color gradient, sharp transition, modern brand aesthetic, flat depth", aspectRatio: "1:1", negativePrompt: "" }
    ]
  },
  {
    category: "9. Brutalist",
    presets: [
      { name: "Industrial Block", basePrompt: "heavy raw typography, thick blocky letters, anti-design aesthetic, sharp unpolished edges", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Cyber-Glitch", basePrompt: "sliced and shifted geometric logo, digital distortion, tech-forward futuristic glitch aesthetic", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Neo-Grunge", basePrompt: "aggressive industrial logo, distressed vector edges, high-impact black and white, raw punk energy", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Y2K Bubbly", basePrompt: "inflated rounded bubble shapes, glossy 2D finish, playful streetwear aesthetic, late 90s digital vibe", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Acid Graphic", basePrompt: "distorted melting shapes, high-vibrancy neon colors, warped technical lines, experimental streetwear", aspectRatio: "1:1", negativePrompt: "" }
    ]
  },
  {
    category: "10. Pictorial",
    presets: [
      { name: "Flat 2.0", basePrompt: "modern flat pictorial icon, vibrant solid colors, bold shapes, no gradients, clean digital finish", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Zen Japanese", basePrompt: "minimalist ink-brush icon, balanced asymmetry, red sun circle motif, traditional-modern fusion", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Die-Cut Sticker", basePrompt: "bold pictorial icon with thick white border, vinyl sticker aesthetic, solid colors, centered", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Geometric Animal", basePrompt: "stylized animal icon built from triangles and squares, modern tech aesthetic, clean sharp edges", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Silhouetted Object", basePrompt: "high-contrast solid silhouette of a [Subject], perfectly recognizable, minimalist graphic", aspectRatio: "1:1", negativePrompt: "" }
    ]
  }
];

export const LogoModule: ModuleStrategy = {
  id: 'logo design',
  name: 'Logo Design',
  
  constructPrompt: (context: GenerationContext) => {
    const { prompt, preset, base64Image, strictMode, isIllustrated, isSubjectOnly, selectedPalette, logoType, logoLayout } = context;
    
    const usePalette = selectedPalette && selectedPalette.name !== 'Default';
    let colorRule = "8. Monochrome-first logic: The design must work in black and white. High contrast.";
    if (usePalette && selectedPalette) {
      colorRule = `8. Color Palette Enforcement: STRICTLY USE ONLY THESE COLORS: ${selectedPalette.name} (${selectedPalette.colors.join(', ')}). Do not use default black/white unless specified in the palette.`;
    }

    const typeRule = logoType ? `9. LOGO TYPE DNA: ${logoType}` : "";
    const layoutRule = logoLayout ? `10. LOGO LAYOUT DNA: ${logoLayout}` : "";

    // Find the category for this preset
    const categoryObj = LOGO_PRESETS.find(c => c.presets.some(p => p.name === preset.name));
    const categoryName = categoryObj ? categoryObj.category : 'Logo Design';

    const logoRules = `
### LOGO DESIGN MASTER DIRECTIVE
1. PRIMARY ACTION: Generate a professional logo for the subject: "${prompt}".
2. ART STYLE CATEGORY: ${categoryName}.
3. STYLE PRESET: Apply Preset (${preset.name}). 
4. BACKGROUND RULE: Place the logo on a PURE SOLID COLOR BACKGROUND. Absolute zero scenery, textures, or mockups.
5. COMPOSITION: Perfectly centered and symmetrical. Use balanced negative space. Isolated in frame.
6. TECHNICAL FINISH: Razor-sharp vector edges. Solid color blocking. No gradients (unless Category 8). No shadows. No 3D rendering.
7. LINGUISTIC PROCESSING (CRITICAL): Treat text as a structured linguistic system, not just a visual shape. Use specialized font tokens encoded through a variational autoencoder (VAE) to represent the fundamental characteristics of each character. Do not attempt to "paint" letters from random noise.
${colorRule}
${typeRule}
${layoutRule}
    `;

    let finalPrompt = `${logoRules}\n\nStyle Details: ${preset.basePrompt}`;

    if (isIllustrated) {
      finalPrompt += `\n\n### ILLUSTRATION MODE ACTIVE\nRendered in high-fidelity illustrated vector finish. Add subtle textures, depth, and polish while maintaining vector clean lines.`;
    }

    if (isSubjectOnly) {
      finalPrompt += `\n\n### SUBJECT ISOLATION ACTIVE\nSubject isolation, transparent-style solid background, zero background clutter. Focus ONLY on the logo mark.`;
    }

    if (base64Image) {
      const fidelityInstruction = strictMode 
        ? "STRICTLY COPY the reference logo structure/composition, but REDRAW it in the requested style."
        : "Use the reference image as a structural guide, but modernize and stylize it according to the preset.";

      finalPrompt = `Redesign this logo/image into a professional vector logo.\n${fidelityInstruction}\n\n${logoRules}\n\nStyle Details: ${preset.basePrompt}`;
    }

    // Apply KSD Rules
    finalPrompt = ConditionEngine.applyKSD(finalPrompt, 'logo design');

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
