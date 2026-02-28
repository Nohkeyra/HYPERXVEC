export interface Preset {
  readonly name: string;
  readonly basePrompt: string;
  readonly aspectRatio: string;
  readonly negativePrompt: string;
  readonly system?: boolean;
  readonly locked?: boolean;
}

export interface PresetCategory {
  readonly category: string;
  readonly presets: readonly Preset[];
}

const rawVectorPresets = [
  {
    category: "Clean & Geometric",
    presets: [
      { name: "Flat Design", basePrompt: "flat 2D vector, minimalist shapes, solid colors, professional graphic design, solid background", aspectRatio: "1:1", negativePrompt: "3D, shadows, depth, blurry, photographic" },
      { name: "Isometric", basePrompt: "isometric vector art, 30-degree orthographic, technical illustration, clean edges, solid background", aspectRatio: "1:1", negativePrompt: "perspective, organic, blurry, messy" },
      { name: "Corporate Memphis", basePrompt: "memphis style vector, playful long limbs, pastel geometric shapes, flat illustration, solid background", aspectRatio: "1:1", negativePrompt: "realistic, textures, dark, gradients" },
      { name: "Minimalist", basePrompt: "minimalist vector, high whitespace, essential geometric forms, clean paths, solid background", aspectRatio: "1:1", negativePrompt: "cluttered, complex, detailed, messy" },
      { name: "Geometric", basePrompt: "geometric vector, perfect circles and squares, mathematical symmetry, sharp forms, solid background", aspectRatio: "1:1", negativePrompt: "hand-drawn, organic, irregular, blurry" },
      { name: "Bento Grid", basePrompt: "bento grid UI, rounded blocks, modular layout, clean icons, solid background", aspectRatio: "1:1", negativePrompt: "organic, messy, asymmetrical, blurry" },
      { name: "Neo-Minimalism", basePrompt: "neo-minimalist vector, thin lines, desaturated colors, spacious composition, solid background", aspectRatio: "1:1", negativePrompt: "heavy, thick, cluttered, bright" },
      { name: "Material", basePrompt: "material design, layered surfaces, soft shadows, paper-like colors, solid background", aspectRatio: "1:1", negativePrompt: "flat, no shadows, messy, blurry" },
      { name: "Low Poly", basePrompt: "low poly vector, triangular polygons, faceted lighting, geometric mosaic, solid background", aspectRatio: "1:1", negativePrompt: "smooth, organic, blurry, realistic" },
      { name: "Semi-Flat", basePrompt: "semi-flat vector, subtle depth, clean professional design, modern graphic, solid background", aspectRatio: "1:1", negativePrompt: "ultra-flat, 3D, messy, blurry" }
    ]
  },
  {
    category: "Line & Outline",
    presets: [
      { name: "Monoline", basePrompt: "monoline vector, consistent line weight, minimalist outline, uniform stroke, solid background", aspectRatio: "1:1", negativePrompt: "shading, filled, complex, textures" },
      { name: "Tech Blueprint", basePrompt: "blueprint vector, white lines on blue, technical drafting, engineering style, solid background", aspectRatio: "1:1", negativePrompt: "fills, organic, soft, artistic" },
      { name: "Line Art", basePrompt: "black line art, minimalist outlines, no fills, clean vector paths, solid background", aspectRatio: "1:1", negativePrompt: "colors, shading, 3D, blurry" },
      { name: "Outline Icons", basePrompt: "outline icon vector, 2px consistent stroke, hollow shapes, minimalist, solid background", aspectRatio: "1:1", negativePrompt: "filled, colorful, 3D, blurry" }
    ]
  },
  {
    category: "Retro & Vintage",
    presets: [
      { name: "Pop Art", basePrompt: "pop art vector, high-contrast flat colors, thick black outlines, screen-print style, solid background", aspectRatio: "1:1", negativePrompt: "muted, soft, realistic, blurry" },
      { name: "Risograph", basePrompt: "risograph print, grainy ink texture, neon color overlap, retro vector, solid background", aspectRatio: "1:1", negativePrompt: "clean gradients, perfect alignment, sharp focus" },
      { name: "Vintage Travel", basePrompt: "vintage poster vector, retro grainy texture, sun-bleached palette, lithograph style, solid background", aspectRatio: "1:1", negativePrompt: "modern, neon, sharp, photographic" },
      { name: "Propaganda", basePrompt: "propaganda poster, bold red and teal, dramatic shadows, heroic lighting, solid background", aspectRatio: "1:1", negativePrompt: "soft, muted, realistic, small" },
      { name: "Grainy", basePrompt: "grainy vector, stippled shading, noise texture, vintage print, solid background", aspectRatio: "1:1", negativePrompt: "smooth, flat, plastic, modern" },
      { name: "Rubber Hose", basePrompt: "rubber hose cartoon, 1930s style, flexible limbs, vintage animation, solid background", aspectRatio: "1:1", negativePrompt: "realistic, modern, 3D, blurry" },
      { name: "Neo-Vintage", basePrompt: "neo-vintage fashion, color blocking, screen-print poster, clean vector, solid background", aspectRatio: "1:1", negativePrompt: "modern, messy, blurry, realistic" }
    ]
  },
  {
    category: "Artistic & Hand-Drawn",
    presets: [
      { name: "Papercut", basePrompt: "papercut vector, layered depth, soft drop shadows, clean cut edges, solid background", aspectRatio: "1:1", negativePrompt: "flat, blurry, photographic, messy" },
      { name: "Oil Pastel", basePrompt: "oil pastel vector, waxy thick strokes, crayon texture, vibrant colors, solid background", aspectRatio: "1:1", negativePrompt: "clean lines, smooth, flat, geometric" },
      { name: "Watercolor", basePrompt: "watercolor vector, fluid pigment, soft wet edges, transparent layering, solid background", aspectRatio: "1:1", negativePrompt: "hard edges, geometric, plastic, blurry" },
      { name: "Linocut", basePrompt: "linocut vector, hand-carved edges, high-contrast ink, woodblock texture, solid background", aspectRatio: "1:1", negativePrompt: "smooth, colorful, soft, blurry" },
      { name: "Woodcut", basePrompt: "woodcut vector, carved lines, rustic grain, traditional print, solid background", aspectRatio: "1:1", negativePrompt: "modern, clean, colorful, smooth" },
      { name: "Stippling", basePrompt: "stippling vector, dot-work shading, fine ink, monochromatic, solid background", aspectRatio: "1:1", negativePrompt: "solid fills, gradients, blurry, colorful" },
      { name: "Cross-Hatch", basePrompt: "cross-hatch vector, etched shading, pen and ink, clean lines, solid background", aspectRatio: "1:1", negativePrompt: "smooth, solid fills, blurry, colorful" },
      { name: "Scribble", basePrompt: "scribble vector, loose chaotic lines, pen strokes, artistic sketch, solid background", aspectRatio: "1:1", negativePrompt: "clean, geometric, flat, blurry" },
      { name: "Folk Art", basePrompt: "folk art vector, symmetrical patterns, traditional motifs, flat shapes, solid background", aspectRatio: "1:1", negativePrompt: "modern, 3D, asymmetrical, blurry" },
      { name: "Studio Ghibli", basePrompt: "ghibli style vector, soft pencil, warm tones, whimsical illustration, solid background", aspectRatio: "1:1", negativePrompt: "sharp, neon, 3D, blurry" }
    ]
  },
  {
    category: "3D & Textured",
    presets: [
      { name: "Bionic Design", basePrompt: "bionic vector, mechanical plates, circuit patterns, sleek robotic design, solid background", aspectRatio: "1:1", negativePrompt: "skin, flesh, messy, blurry, gradients" },
      { name: "Glassmorphism", basePrompt: "glassmorphism vector, translucent layers, frosted glass, soft highlights, solid background", aspectRatio: "1:1", negativePrompt: "opaque, matte, rough, sharp shadows" },
      { name: "Puffy 3D", basePrompt: "puffy 3D vector, inflated plastic, soft shadows, glossy highlights, solid background", aspectRatio: "1:1", negativePrompt: "flat, matte, rough, dark" },
      { name: "3D Clay", basePrompt: "claymation vector, soft molded edges, matte texture, studio lighting, solid background", aspectRatio: "1:1", negativePrompt: "metallic, sharp, flat, blurry" },
      { name: "High-Contrast", basePrompt: "high-contrast vector, hard shadows, cinematic lighting, deep blacks, solid background", aspectRatio: "1:1", negativePrompt: "low contrast, soft, blurry, gray" }
    ]
  },
  {
    category: "Characters & Experimental",
    presets: [
      { name: "Flat Portrait", basePrompt: "flat portrait vector, minimalist features, solid color blocks, 2D illustration, solid background", aspectRatio: "1:1", negativePrompt: "photorealistic, skin texture, hair strands, blurry" },
      { name: "Avatar Grid", basePrompt: "avatar vector, front-facing, simplified shadows, uniform grid, solid background", aspectRatio: "1:1", negativePrompt: "side view, complex, blurry, realistic" },
      { name: "Psychedelic", basePrompt: "psychedelic vector, melting fluid shapes, rainbow neon, vibrant dreamscape, solid background", aspectRatio: "1:1", negativePrompt: "geometric, grayscale, muted, stable" }
    ]
  },
  {
    category: "Hyper Vector & Modern",
    presets: [
      { name: "Hyper-Gradient Glass", basePrompt: "hyper-detailed vector glassmorphism, complex multi-stop gradients, translucent layers, vibrant modern color palette, clean geometric shapes, 8k resolution vector style, solid background", aspectRatio: "1:1", negativePrompt: "flat, opaque, dull, raster, pixelated" },
      { name: "Neo-Memphis 3.0", basePrompt: "ultra-modern neo-memphis vector, high saturation, complex geometric composition, 3D-effect vector elements, abstract patterns, clean sharp lines, solid background", aspectRatio: "1:1", negativePrompt: "vintage, muted, simple, flat, boring" },
      { name: "Cyber-Vector Glitch", basePrompt: "clean vector glitch art, distorted geometry, RGB split effects using vector shapes, neon color palette, digital corruption aesthetic, sharp edges, solid background", aspectRatio: "1:1", negativePrompt: "soft, blurry, analog, grunge, textured" },
      { name: "Fluid Vector Mesh", basePrompt: "organic fluid vector mesh, vibrant gradient meshes, smooth flowing curves, liquid abstract shapes, modern ui aesthetic, clean vector paths, solid background", aspectRatio: "1:1", negativePrompt: "geometric, rigid, sharp, flat, solid colors" },
      { name: "Isometric Hyper-Detail", basePrompt: "extremely detailed isometric vector art, complex mechanical or architectural structure, vibrant tech colors, precise orthographic projection, clean lines, solid background", aspectRatio: "1:1", negativePrompt: "simple, flat, 2D, perspective, organic" },
      { name: "Vector Hyper-Realism", basePrompt: "hyper-realistic vector illustration, photorealistic lighting simulated with clean vector shapes, gradient mesh technique, high fidelity, sharp edges, solid background", aspectRatio: "1:1", negativePrompt: "cartoon, flat, outline, sketch, low poly" },
      { name: "Holographic Chrome", basePrompt: "holographic vector chrome, iridescent color shifts, metallic gradients, futuristic reflective surfaces, clean vector rendering, solid background", aspectRatio: "1:1", negativePrompt: "matte, dull, flat, rustic, textured" },
      { name: "Origami Tech", basePrompt: "futuristic origami vector, folded geometric planes, sharp creases, high-tech material simulation, complex faceted shapes, clean lines, solid background", aspectRatio: "1:1", negativePrompt: "curved, soft, organic, messy, paper texture" },
      { name: "Synthwave Grid", basePrompt: "synthwave vector aesthetic, retro-futurist neon grids, chrome effects, 80s sunset gradients, clean geometric lines, solid background", aspectRatio: "1:1", negativePrompt: "modern, flat, pastel, minimal, corporate" },
      { name: "Data Viz Complexity", basePrompt: "hyper-complex data visualization vector, floating UI nodes, connecting lines, abstract information architecture, hud interface style, clean thin lines, solid background", aspectRatio: "1:1", negativePrompt: "simple, solid, blocky, organic, messy" }
    ]
  }
];

const rawTypographyPresets = [
  {
    category: "Industrial & Brutalist",
    presets: [
      { name: "Soft Brutalism", basePrompt: "Soft brutalist mass, heavy block letters, rounded pill-shaped terminals, squishy matte texture, friendly monolithic presence", aspectRatio: "1:1", negativePrompt: "sharp, jagged, thin, industrial, realistic, environment" },
      { name: "Ink-Trap Tech", basePrompt: "Industrial display typography, exaggerated ink traps, 45-degree shears, technical precision, brutalist engineering", aspectRatio: "1:1", negativePrompt: "soft, rounded, script, messy, organic" },
      { name: "Bento Modular", basePrompt: "Modular grid layout, letters locked into geometric cells, technical data aesthetic, clean alignment", aspectRatio: "1:1", negativePrompt: "organic, messy, loose, handwritten, chaotic" },
      { name: "Micro Code", basePrompt: "Tiny monospaced typography, technical code aesthetic, micro-printing details, sharp industrial precision", aspectRatio: "1:1", negativePrompt: "large, bold, soft, colorful, organic" },
      { name: "Laser Cut", basePrompt: "Laser cut steel, brushed metal texture, burnt industrial edges, manufacturing aesthetic, stencil influence", aspectRatio: "1:1", negativePrompt: "soft, plastic, organic, colorful" },
      { name: "Heavy Metal", basePrompt: "Interlocking industrial metal plates, rusted iron texture, heavy rivets, weathered mechanical mass", aspectRatio: "1:1", negativePrompt: "light, flimsy, digital, clean, plastic" }
    ]
  },
  {
    category: "Liquid & Organic",
    presets: [
      { name: "Liquid Mercury", basePrompt: "Molten metal typography, flowing chrome, mirror reflections, high-gloss mercury texture, melting Y2K aesthetic", aspectRatio: "1:1", negativePrompt: "matte, dry, rough, stone, vintage, wood, scene" },
      { name: "Puffy ASMR", basePrompt: "Inflated 3D letters, squishy marshmallow texture, glossy soft-touch finish, tactile sensory design, playful bubbles", aspectRatio: "1:1", negativePrompt: "flat, hard, metallic, industrial, dark, landscape" },
      { name: "Jelly Glass", basePrompt: "Translucent glassy letters, colorful refraction, frosted edges, inner glow, hyper-realistic translucent material", aspectRatio: "1:1", negativePrompt: "opaque, metallic, matte, rough, paper" },
      { name: "Waxy Melt", basePrompt: "Candle-wax texture, semi-translucent light scattering, organic melting shapes, warm amber glow, tactile physical presence", aspectRatio: "1:1", negativePrompt: "metallic, chrome, digital, sharp, cold" },
      { name: "Bubbly Pop", basePrompt: "Bouncy liquid baselines, playful rounded distortion, high-gloss pop aesthetic, vibrant energy", aspectRatio: "1:1", negativePrompt: "serious, rigid, straight, thin, industrial" },
      { name: "Toxic Slime", basePrompt: "Melting goo texture, vibrant toxic green, detailed liquid drips, urban street art aesthetic", aspectRatio: "1:1", negativePrompt: "dry, clean, corporate, rigid, metallic" }
    ]
  },
  {
    category: "Tech & Cyberpunk",
    presets: [
      { name: "Kinetic Pulse", basePrompt: "Kinetic typography, rhythmic vertical stretching, liquid motion blur, high-energy distortion, neon on deep charcoal, motion-led branding", aspectRatio: "1:1", negativePrompt: "static, thin, organic, realistic background, room, table" },
      { name: "Cyber Glitch", basePrompt: "Digital data corruption, sliced letterforms, RGB color split, matrix code overlay, high-tech distortion", aspectRatio: "1:1", negativePrompt: "vintage, retro, handwritten, organic, serif" },
      { name: "Hologram Foil", basePrompt: "Iridescent holographic letters, rainbow foil reflection, metallic shifting colors, futuristic Y3K aesthetic", aspectRatio: "1:1", negativePrompt: "matte, dull, flat, earthy, rustic" },
      { name: "Data Flow", basePrompt: "AI-drawn paths weaving through characters, fiber-optic lines, glowing data streams, futuristic tech-art", aspectRatio: "1:1", negativePrompt: "static, plain, simple, traditional, wood" },
      { name: "Neon Tube", basePrompt: "Glowing neon gas tubes, electric glass filaments, vibrant light bloom, 80s retro-futurism", aspectRatio: "1:1", negativePrompt: "flat, matte, daylight, printed, vector" },
      { name: "Pixel Sort", basePrompt: "Vertical data stretching, digital noise artifacts, corrupted file aesthetic, high-tech glitch", aspectRatio: "1:1", negativePrompt: "clean, perfect, analog, smooth, rounded" }
    ]
  },
  {
    category: "Nature & Elements",
    presets: [
      { name: "Fired Up", basePrompt: "Illustrative lettering forged from realistic flames, internal heat glow, floating embers, rhythmic heat distortion", aspectRatio: "1:1", negativePrompt: "cold, water, ice, blue, clean vector, white background" },
      { name: "Tactile Wood", basePrompt: "Hand-carved wood grain lettering, interlocking organic shapes, deep 3D relief shadows, physical artisanal craft", aspectRatio: "1:1", negativePrompt: "digital, neon, plastic, smooth, flat 2D, metal" },
      { name: "Eco-Gothic", basePrompt: "Modern blackletter formed by intertwined tree branches, moss-covered stone, organic forest aesthetic", aspectRatio: "1:1", negativePrompt: "digital, neon, smooth, bright, plastic, office" },
      { name: "Burning Ember", basePrompt: "Letters formed from glowing red-hot coals, intense internal fire, floating ash, realistic heat effects", aspectRatio: "1:1", negativePrompt: "cold, water, ice, blue, clean, vector" },
      { name: "Hyper Bloom", basePrompt: "Floral typography, blooming petals and vines, vibrant organic growth, high-detail nature aesthetic", aspectRatio: "1:1", negativePrompt: "digital, metallic, industrial, cold, tech" }
    ]
  },
  {
    category: "Elegant & Editorial",
    presets: [
      { name: "Pharma Luxury", basePrompt: "High-contrast razor-sharp serif, luxury clinical aesthetic, razor-thin elegant terminals, scientific precision branding", aspectRatio: "1:1", negativePrompt: "rounded, messy, colorful, graffiti, chunky, dark background" },
      { name: "Global Lingua", basePrompt: "Cross-cultural script rhythms, elegant calligraphic connections, unified visual flow, modern global branding", aspectRatio: "1:1", negativePrompt: "messy, separate, chunky, brutalist" },
      { name: "Digital Filigree", basePrompt: "Ornamental patterns inside letterforms, complex fine-line detailing, high-tech decorative aesthetic, gold on black", aspectRatio: "1:1", negativePrompt: "simple, plain, thick, chunky, messy" },
      { name: "Frosted Glass", basePrompt: "Frosted glass depth, blurred refraction, soft inner light, elegant luxury tech aesthetic", aspectRatio: "1:1", negativePrompt: "opaque, solid, matte, rough, stone" },
      { name: "Editorial Serif", basePrompt: "High-contrast dramatic serif, fashion magazine style, razor-sharp terminals, elegant sophisticated mass", aspectRatio: "1:1", negativePrompt: "sans-serif, bold, chunky, messy, tech" }
    ]
  },
  {
    category: "Retro & Grunge",
    presets: [
      { name: "Halftone Blur", basePrompt: "Intentional smudge motion, halftone dot patterns, dreamlike grain, nostalgic digital distortion, emotional depth", aspectRatio: "1:1", negativePrompt: "pixel perfect, sharp, clean, corporate, white background" },
      { name: "Risograph Zine", basePrompt: "Risograph print style, overlapping ink, grainy texture, misaligned layers, punk DIY aesthetic, vibrant primary colors", aspectRatio: "1:1", negativePrompt: "smooth, perfect alignment, clean, digital, 3D" },
      { name: "Xerox Scandi", basePrompt: "Low-fidelity Xerox copy, grainy black ink, scan-line distortion, minimal Scandinavian layout, raw analogue feel", aspectRatio: "1:1", negativePrompt: "colorful, smooth, luxury, 3D, neon" },
      { name: "Film Noir", basePrompt: "Dramatic noir typography, heavy shadows, high-contrast spotlight, smoky atmosphere, 1940s moody letterforms", aspectRatio: "1:1", negativePrompt: "bright, colorful, happy, pop-art, flat" },
      { name: "Urban Wildstyle", basePrompt: "Interlocking arrows, sharp aggressive angles, vibrant spray paint fills, street art masterpiece, vector precision", aspectRatio: "1:1", negativePrompt: "simple, legible, corporate, serif, minimal, soft" },
      { name: "Chrome Gothic", basePrompt: "Sharp metallic blackletter, high-gloss silver, aggressive flourishes, modern tattoo aesthetic", aspectRatio: "1:1", negativePrompt: "flat, matte, soft, round, friendly" },
      { name: "Sumi Brush", basePrompt: "Sharp aggressive brush strokes, wet ink splatter, speed and stealth aesthetic, high contrast black on white", aspectRatio: "1:1", negativePrompt: "round, bubble, western, digital, 3D" }
    ]
  },
  {
    category: "Atmospheric & Cinematic",
    presets: [
      { name: "Marble Chiseled", basePrompt: "Chiseled raw marble, deep relief shadows, ancient monumental aesthetic, high-contrast stone texture", aspectRatio: "1:1", negativePrompt: "digital, plastic, colorful, modern, flat" },
      { name: "Forward Italic", basePrompt: "Extreme varying slants, italicized motion, sharp leaning angles, speed-focused branding", aspectRatio: "1:1", negativePrompt: "upright, slow, static, rounded" },
      { name: "Shattered Glass", basePrompt: "Broken glass shards forming letters, realistic cracks, dynamic destruction, high contrast depth", aspectRatio: "1:1", negativePrompt: "smooth, intact, soft, rounded, organic" },
      { name: "Deep Fog", basePrompt: "Typography emerging from dense fog, soft diffused light, silhouette edges, mysterious moody perspective", aspectRatio: "1:1", negativePrompt: "sharp, bright, colorful, flat, vector" },
      { name: "Abstract Ghost", basePrompt: "Semi-transparent spectral lettering, ethereal light trails, ghostly distortion, haunting elegant aesthetic", aspectRatio: "1:1", negativePrompt: "solid, opaque, heavy, industrial, bright" }
    ]
  },
  {
    category: "Street Art & Graffiti",
    presets: [
      { name: "Wildstyle Master", basePrompt: "Complex interlocking wildstyle graffiti, sharp arrows, mechanical connections, aggressive flow, vibrant street art aesthetic", aspectRatio: "1:1", negativePrompt: "simple, legible, corporate, serif, minimal, soft" },
      { name: "Bubble Throw-up", basePrompt: "Rounded bubble letters, inflated throw-up style, thick outline, two-tone fill, classic street bombing aesthetic", aspectRatio: "1:1", negativePrompt: "sharp, thin, complex, wildstyle, serif" },
      { name: "Stencil Spray", basePrompt: "Multi-layer stencil typography, overspray texture, bridge tabs, urban street art style, raw spray paint finish", aspectRatio: "1:1", negativePrompt: "clean, digital, brush, pen, smooth" },
      { name: "Drip Marker", basePrompt: "Permanent marker tag style, heavy ink drips, chisel tip strokes, raw handstyle flow, urban vandalism aesthetic", aspectRatio: "1:1", negativePrompt: "clean, dry, digital, serif, geometric" },
      { name: "Calligraffiti", basePrompt: "Hybrid calligraphy and graffiti, ornate gothic strokes, circular mandala composition, sharp chisel tip, street elegance", aspectRatio: "1:1", negativePrompt: "simple, bubble, messy, random, sans-serif" },
      { name: "Blockbuster", basePrompt: "Massive block letters, 3D extruded depth, heavy outline, wall-to-wall coverage, imposing street presence", aspectRatio: "1:1", negativePrompt: "thin, small, delicate, script, flat" }
    ]
  },
  {
    category: "Complete Typography Arsenal v2",
    presets: [
      { name: "Core Locked Mix (Original)", basePrompt: "Foundation blending trippy distortions, chrome wildstyle chaos, neon glitch glow, doodle playfulness, and minimalist elegance. Styles: Psychedelic Typography, Wildstyle Graffiti, Cyberpunk Neon Glitch, Hand-Drawn Doodle, Minimalist Typography. Base layer for hybrids.", aspectRatio: "1:1", negativePrompt: "boring, static, plain, standard, corporate, clean, simple" },
      { name: "Glitchy Glam + Y2K Super-Glitch", basePrompt: "Ultimate digital rebellion fusion: RGB splits, scan lines, metallic Y2K chrome decay, pixel glitches, glamorous friction. High-fashion dystopia with ironic 2000s hyper-nostalgia. Extreme glitch + metallic gloss, Clashing fonts/asymmetry, Pixel decay + neon glam shines.", aspectRatio: "1:1", negativePrompt: "clean, smooth, perfect, traditional, retro, vintage, matte" },
      { name: "Liquid Fluid Melting Chrome", basePrompt: "Elastic chrome goo, melting distortions, holographic liquid flows. Psychedelic swirling meets glitchy organic movement with metallic shine. Stretching/melting forms, Fluid gradients + bubble waves, Chrome/holographic liquid effects. Alive surreal motion.", aspectRatio: "1:1", negativePrompt: "solid, rigid, dry, matte, static, sharp edges" },
      { name: "Punk Grunge + Chaotic Script", basePrompt: "Raw distressed scrawls, grunge textures, ransom-note overlaps, anti-design attitude. Hand-drawn doodles + wildstyle street energy cranked to confrontational max. Uneven distressed lines, Overlapping collage chaos, 90s grunge bleed + spray effects.", aspectRatio: "1:1", negativePrompt: "clean, neat, organized, corporate, smooth, vector" },
      { name: "Neo-Retro Mutant Heritage", basePrompt: "Hacked Art Deco/serifs/grotesks twisted with glitch mutations + retro-futurist waves. Nostalgic bases + psychedelic/wildstyle chaos for rebellious past-future hybrids. Warped heritage forms, Off-kilter mutant extensions, Retro + tech/glitch overlays.", aspectRatio: "1:1", negativePrompt: "modern, clean, minimal, standard, authentic vintage" },
      { name: "Type Collage Maximalist Chaos", basePrompt: "Frame-filling layered clashing type, bold repetition, ransom-note excess. Minimal negative space flipped into joyful over-the-top disorder. Mixed weights/colors/angles, Overlapping maximal layers, Deliberate excess + collage energy.", aspectRatio: "1:1", negativePrompt: "minimal, empty, clean, organized, balanced, simple" },
      { name: "Neo-Brutalist Raw Confrontation", basePrompt: "Oversized raw friction, asymmetry, low-fi textures, intentional harshness. Minimalist elegance contrasted with brutal wildstyle/cyberpunk aggression. Confrontational scale, Raw grids + anti-slick textures, Dystopian functional rebellion.", aspectRatio: "1:1", negativePrompt: "soft, elegant, refined, smooth, polished, pretty" },
      { name: "Exaggerated Playful Bubble Excess", basePrompt: "Puffy bubbly wavy oversized letters, absurd joyful distortions. Psychedelic trippiness + hand-drawn whimsy into high-saturation rule-breaking fun. Bubbly/puffy forms, Oversized playful waves, Bright saturated chaos.", aspectRatio: "1:1", negativePrompt: "sharp, thin, serious, dark, gloomy, industrial" },
      { name: "Pick-and-Mix Collaged Disorder", basePrompt: "Mismatched patchwork letters, expression-over-legibility, tape-like disruptions. Doodle + wildstyle interlocking pushed to experimental anarchy. Collaged mismatched chars, Unruly patchwork freedom, Anti-uniform creativity.", aspectRatio: "1:1", negativePrompt: "uniform, consistent, legible, standard, clean" },
      { name: "Motion-Led Kinetic Glow", basePrompt: "Built-for-movement typography: pulsing glows, elastic stretches, glitch transitions, rhythmic pulses. Glitch/cyber + psychedelic alive energy into dynamic responsive life. Motion illusion + pulsing, Glowing elastic transitions, Rhythm + engineered dynamism.", aspectRatio: "1:1", negativePrompt: "static, still, flat, dead, dull, matte" },
      { name: "Hyper-Distorted Chrome-Liquid", basePrompt: "Extreme chrome melting, liquid distortions, heavy psychedelic glitches, neon drips. Chrome chaos meets fluid surreal excess for immersive dystopia. Heavy chrome liquid melt, Distorted neon drips + bubbles, Psychedelic glitch overlay.", aspectRatio: "1:1", negativePrompt: "solid, dry, matte, clean, simple, static" },
      { name: "Brutal-Maximal Fusion Overload", basePrompt: "Neo-brutalist raw grids, maximal collage chaos, oversized confrontation, grunge textures. Clean minimal flipped into brutal excess for stark rebellious impact. Oversized brutal scale, Maximal layered friction, Raw low-fi + collage aggression.", aspectRatio: "1:1", negativePrompt: "minimal, small, delicate, soft, clean, organized" },
      { name: "Retro-Cyber Mutant Wave", basePrompt: "Y2K/retro heritage waves, cyber mutant distortions, neon glitch mutations. Nostalgic 80s/00s bases warped into futuristic chaotic rebellion. Retro wave bases + mutant twists, Cyber chrome + glitch waves, Nostalgic-futuristic hybrid chaos.", aspectRatio: "1:1", negativePrompt: "authentic retro, clean modern, standard, static" },
      { name: "Immersive Kinetic-Glow Pulse", basePrompt: "Kinetic motion, glowing neon pulses, elastic glitch transitions, holographic life. Cyber/glitch + psychedelic alive pushed to full immersive rhythmic energy. Pulsing holographic glow, Kinetic elastic rhythm, Glitch-motion immersion.", aspectRatio: "1:1", negativePrompt: "static, dull, matte, flat, dead, still" },
      { name: "Ultimate Hybrid Master", basePrompt: "All-in master blend: Wildstyle chrome base + Liquid melt overlay + Glitch RGB + Doodle accents + Minimal negative space flips. Custom layering rules, Chaos + polish balance, High-impact hybrid freedom. Multi-vibe signature explosion.", aspectRatio: "1:1", negativePrompt: "single style, simple, plain, standard, boring" }
    ]
  }
];

export const VECTOR_PRESETS: readonly PresetCategory[] = Object.freeze(
  rawVectorPresets.map(cat => Object.freeze({
    category: cat.category,
    presets: Object.freeze(
      cat.presets.map(p => Object.freeze({
        ...p,
        system: true,
        locked: true
      }))
    )
  }))
);

export const TYPOGRAPHY_PRESETS: readonly PresetCategory[] = Object.freeze(
  rawTypographyPresets.map(cat => Object.freeze({
    category: cat.category,
    presets: Object.freeze(
      cat.presets.map(p => Object.freeze({
        ...p,
        system: true,
        locked: true
      }))
    )
  }))
);
