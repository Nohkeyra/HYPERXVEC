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
  },
  // CATEGORY 8: TECH & FUTURIST LOGOS (8)
  // Focus: Cyberpunk, Circuitry, Glitch, Data
  {
    category: "Tech & Futurist Logos",
    presets: [
      {
        name: "Circuit Node",
        basePrompt: "tech circuit logo, connected nodes, printed circuit board aesthetic, data flow lines, cybernetic vector, solid background",
        aspectRatio: "1:1",
        negativePrompt: "organic, messy, hand-drawn, rustic"
      },
      {
        name: "Glitch Mark",
        basePrompt: "glitch art logo, digital distortion, pixel sorting effect, cyber error aesthetic, raw data visualization, solid background",
        aspectRatio: "1:1",
        negativePrompt: "clean, smooth, classic, traditional"
      },
      {
        name: "Cyber Hexagon",
        basePrompt: "hexagon tech logo, honeycomb data structure, futuristic hive mind, precision geometry, sci-fi interface, solid background",
        aspectRatio: "1:1",
        negativePrompt: "round, soft, organic, vintage"
      },
      {
        name: "Pixel Art Icon",
        basePrompt: "8-bit pixel art logo, retro gaming aesthetic, blocky grid structure, digital nostalgia, crisp square edges, solid background",
        aspectRatio: "1:1",
        negativePrompt: "smooth, vector curves, high resolution, realistic"
      },
      {
        name: "Quantum Dot",
        basePrompt: "quantum dot logo, particle cloud geometry, atomic structure, scientific precision, molecular connection, solid background",
        aspectRatio: "1:1",
        negativePrompt: "solid mass, heavy, blocky, simple"
      },
      {
        name: "Neon Wireframe",
        basePrompt: "neon wireframe logo, 3D grid structure, retro-futurist synthwave, glowing vector lines, cybernetic blueprint, solid background",
        aspectRatio: "1:1",
        negativePrompt: "flat, filled shapes, matte, organic"
      },
      {
        name: "Data Stream",
        basePrompt: "data stream logo, cascading digital lines, matrix rain aesthetic, vertical information flow, cyber rain, solid background",
        aspectRatio: "1:1",
        negativePrompt: "horizontal, static, solid block, traditional"
      },
      {
        name: "AI Neural Net",
        basePrompt: "neural network logo, interconnected brain nodes, artificial intelligence symbol, deep learning geometry, synaptic web, solid background",
        aspectRatio: "1:1",
        negativePrompt: "simple, disconnected, organic, rustic"
      }
    ]
  },
  // CATEGORY 9: CYBER-STREET BRUTAL (30)
  // Focus: Neo-Brutalist, Glitch, Urban Decay, KL Cyberpunk
  {
    category: "Cyber-Street Brutal",
    presets: [
      {
        name: "Glitched Concrete Tag",
        basePrompt: "neo-brutalist distorted grotesque sans logo, rough hand-sprayed graffiti stencil edges with drips, matte concrete gray base, electric cyan and magenta neon glitch offsets and chromatic aberration, strong negative space hiding circuit board pattern in letter voids, high-contrast black background, urban decay texture, extreme kerning, raw dystopian cyber-street energy, gritty alley atmosphere",
        aspectRatio: "1:1",
        negativePrompt: "clean, minimal, flat, smooth, 3D render, shadows, depth, realistic photo, cute, pastel, elegant, corporate, blurry, low contrast"
      },
      {
        name: "Spray Cyber Void",
        basePrompt: "hand-drawn graffiti tag lettering with wobbly marker strokes, brutal thick outlines clashing in acid lime and toxic purple, negative space forming hidden city skyline silhouette, subtle digital glitch lines weaving through letters, concrete crack texture overlay, dystopian street tech feel, neon glow, raw imperfection",
        aspectRatio: "1:1",
        negativePrompt: "symmetrical, polished, vector perfect, soft edges, bright daylight, photographic, minimalist flat, luxury, pastel colors, cute illustration"
      },
      {
        name: "Brutal Barcode Hustle",
        basePrompt: "neo-brutalist uppercase wordmark, heavy distorted letters with hand-scratched texture, negative space inside letters revealing barcode stripes or binary code, neon green glow edges, black/rust orange palette, urban grid fragmentation, intentional misalignment for raw energy, concrete texture, cyberpunk street grit",
        aspectRatio: "1:1",
        negativePrompt: "elegant typography, thin lines, balanced composition, smooth gradients, realistic metal, 3D depth, soft lighting, corporate clean, vintage retro"
      },
      {
        name: "Stencil Circuit Drip",
        basePrompt: "stencil-cut brutal minimal letters, hand-drawn spray paint drips and overspray, tech circuit lines threading through forms, negative space creating hidden arrow or data stream symbol, concrete gray + electric cyan accents, high-contrast shadows, cyber alley vibe, humid night atmosphere",
        aspectRatio: "1:1",
        negativePrompt: "clear readable text, symmetrical, flat design, no texture, bright happy colors, photographic realism, smooth vector, cute cartoon"
      },
      {
        name: "Tag Glitch Monogram",
        basePrompt: "interlocked brutal monogram in hand-tagged lowercase graffiti style, glitch distortion and pixel halftone noise, negative space hiding urban wireframe or spider web, neon magenta outlines on black concrete base, asymmetric chaos, street-tech rebellion",
        aspectRatio: "1:1",
        negativePrompt: "perfect alignment, clean lines, minimal negative space, soft glow, pastel, luxury metallic, realistic photo, balanced harmony"
      },
      {
        name: "Urban Wireframe Brutal",
        basePrompt: "wireframe-inspired tech lines forming brutal block letters, hand-drawn imperfections and marker bleed, negative space revealing city grid or hidden tag symbol, toxic green and purple neon glow, concrete texture background, dystopian urban fusion, glitch chromatic aberration",
        aspectRatio: "1:1",
        negativePrompt: "organic curves, smooth gradients, 3D isometric, photographic detail, cute elements, bright cheerful, elegant script"
      },
      {
        name: "Hidden Neon Alley",
        basePrompt: "distorted sans brutalism with extreme spacing, hand-sprayed rough edges, neon cyan/magenta glow with chromatic aberration, negative space in letters forming hidden alley skyline or graffiti arrow, matte black + rust drips, cyber-street gritty dystopia",
        aspectRatio: "1:1",
        negativePrompt: "crisp sharp edges, flat solid colors, symmetrical balance, soft shadows, realistic city photo, minimalist simple, vintage"
      },
      {
        name: "Marker Concrete Glitch",
        basePrompt: "loose hand-drawn marker tags on brutal minimalist base, glitch offset duplicates in acid colors, concrete crack texture, negative space hiding circuit pattern or barcode, high-contrast black/neon palette, intentional raw imperfection, dystopian urban energy",
        aspectRatio: "1:1",
        negativePrompt: "polished finish, vector clean, no distortion, bright uniform lighting, cute doodle, elegant typography, photographic realism"
      },
      {
        name: "Brutalist Tag Void",
        basePrompt: "heavy brutalist typography with stencil cuts, hand-drawn drips and scratches, deep negative space voids revealing tech symbols like binary rain or hidden symbol, electric lime accents on concrete gray, urban dystopia energy, raw aggression",
        aspectRatio: "1:1",
        negativePrompt: "readable elegant font, soft curves, pastel tones, smooth surface, 3D render, luxury brand feel, balanced composition"
      },
      {
        name: "Cyber Graffiti Frame",
        basePrompt: "framed brutal minimal block letters, inner chaotic hand-drawn graffiti sprays and drips, glitch effects and neon outlines, negative space creating hidden urban icon like train tracks or barcode, black + magenta/cyan high contrast, streetwear tech hybrid",
        aspectRatio: "1:1",
        negativePrompt: "empty clean space, flat 2D vector, symmetrical frame, soft pastel, realistic photo, corporate professional, minimal negative space"
      },
      {
        name: "Petronas Glitch Tag",
        basePrompt: "brutalist distorted monogram in rough hand-sprayed graffiti style, extreme kerning, neon cyan glitch offsets duplicating edges, negative space in letters subtly hiding twin tower silhouettes, concrete gray base with rust drips, acid magenta accents, high-contrast cyber-alley dystopia, raw urban tech fusion",
        aspectRatio: "1:1",
        negativePrompt: "clean, minimal, flat, smooth, 3D render, shadows, depth, realistic photo, cute, pastel, elegant, corporate, blurry, low contrast"
      },
      {
        name: "Alley Circuit Scratch",
        basePrompt: "hand-scratched brutal sans wordmark, marker bleed and stencil imperfections, integrated circuit lines glowing electric lime, negative space voids revealing hidden street grid or barcode arrow, matte black + toxic purple/neon green palette, concrete crack texture, glitch chromatic aberration, street hacker energy",
        aspectRatio: "1:1",
        negativePrompt: "symmetrical, polished, vector perfect, soft edges, bright daylight, photographic, minimalist flat, luxury, pastel colors, cute illustration"
      },
      {
        name: "Drip Neon Void",
        basePrompt: "heavy neo-brutalist initials with hand-drawn spray drips cascading down, brutal blocky forms clashing, deep negative space gaps forming glowing circuit pattern or hidden skyline fragment, acid cyan/magenta neon outlines on dark concrete, intentional misalignment, cyber-street rebellion vibe",
        aspectRatio: "1:1",
        negativePrompt: "elegant typography, thin lines, balanced composition, smooth gradients, realistic metal, 3D depth, soft lighting, corporate clean, vintage retro"
      },
      {
        name: "Stenciled Glitch Hustle",
        basePrompt: "industrial stencil-cut wordmark in brutal minimal style, hand-sprayed overspray and wobbly edges, heavy glitch duplication in neon colors, negative space inside letters hiding urban wireframe or arrow tag, concrete shadows + rust orange drips, high-contrast dystopian night market feel",
        aspectRatio: "1:1",
        negativePrompt: "clear readable text, symmetrical, flat design, no texture, bright happy colors, photographic realism, smooth vector, cute cartoon"
      },
      {
        name: "Concrete Code Tag",
        basePrompt: "loose graffiti tag with brutal thick strokes, hand-etched concrete texture overlay, data stream/binary code lines woven through, negative space creating hidden peak or circuit void, electric lime glow on black/rust base, asymmetric chaos, underground tech grit",
        aspectRatio: "1:1",
        negativePrompt: "perfect alignment, clean lines, minimal negative space, soft glow, pastel, luxury metallic, realistic photo, balanced harmony"
      },
      {
        name: "Marker Cyber Frame",
        basePrompt: "framed brutal monogram, inner chaotic hand-marker tags and drips, glitch halftone noise + neon chromatic edges, negative space revealing hidden alley arrow or barcode, toxic magenta/cyan on concrete gray, extreme spacing, cyberpunk streetwear aggression",
        aspectRatio: "1:1",
        negativePrompt: "organic curves, smooth gradients, 3D isometric, photographic detail, cute elements, bright cheerful, elegant script"
      },
      {
        name: "Brutal Neon Scratch",
        basePrompt: "distorted grotesque monogram in neo-brutalist raw style, hand-scratched marker texture, neon cyan glow with glitch offsets, strong negative space hiding skyline fragment or circuit symbol, matte black + acid green accents, urban decay + digital distortion fusion",
        aspectRatio: "1:1",
        negativePrompt: "crisp sharp edges, flat solid colors, symmetrical balance, soft shadows, realistic city photo, minimalist simple, vintage"
      },
      {
        name: "Grid Drip Negative",
        basePrompt: "fragmented city grid base in brutal minimal lines, hand-sprayed tag overlay with drips, glitch effects distorting forms, negative space gaps forming hidden arrow or wireframe icon, neon purple/lime pops on concrete texture, cyber-alley rawness",
        aspectRatio: "1:1",
        negativePrompt: "polished finish, vector clean, no distortion, bright uniform lighting, cute doodle, elegant typography, photographic realism"
      },
      {
        name: "Void Stencil Glitch",
        basePrompt: "brutalist stencil wordmark with extreme proportions, hand-cut imperfections and spray overspray, deep negative space voids glowing with hidden circuit or tower silhouette, electric magenta outlines + concrete shadows, high-contrast dark mode cyber-street",
        aspectRatio: "1:1",
        negativePrompt: "readable elegant font, soft curves, pastel tones, smooth surface, 3D render, luxury brand feel, balanced composition"
      },
      {
        name: "Tag Wireframe Brutal",
        basePrompt: "interlocked wireframe tech lines with hand-drawn graffiti chaos, brutal spacing and misalignment, negative space revealing urban tag symbol or data flow, neon cyan glow + rust drips on black concrete, dystopian hacker tag energy",
        aspectRatio: "1:1",
        negativePrompt: "empty clean space, flat 2D vector, symmetrical frame, soft pastel, realistic photo, corporate professional, minimal negative space"
      },
      {
        name: "Acid Concrete Moniker",
        basePrompt: "warped brutal moniker, concrete etch + marker bleed texture, acid palette neon accents, negative space hiding barcode or skyline void, glitch noise overlay, raw urban tech fusion with humid-night grit",
        aspectRatio: "1:1",
        negativePrompt: "clean, minimal, flat, smooth, 3D render, shadows, depth, realistic photo, cute, pastel, elegant, corporate, blurry, low contrast"
      },
      {
        name: "Glitched Spray Void",
        basePrompt: "heavy spray-paint tag in neo-brutalist style, glitch duplication and pixel halftone, negative space forming hidden circuit arrow or alley element, toxic green/magenta on matte concrete, asymmetric drips, street-cyber aggression",
        aspectRatio: "1:1",
        negativePrompt: "symmetrical, polished, vector perfect, soft edges, bright daylight, photographic, minimalist flat, luxury, pastel colors, cute illustration"
      },
      {
        name: "Brutal Circuit Fusion",
        basePrompt: "blocky brutal wordmark interwoven with hand-drawn circuit doodles, negative space gaps glowing with skyline hint or hidden tag, neon electric glow + concrete crack texture, extreme kerning, cyber-street raw fusion",
        aspectRatio: "1:1",
        negativePrompt: "elegant typography, thin lines, balanced composition, smooth gradients, realistic metal, 3D depth, soft lighting, corporate clean, vintage retro"
      },
      {
        name: "Hustler Neon Scratch",
        basePrompt: "hand-marker hustler-style monogram on brutal frame, neon chromatic glitch, voids in forms hiding urban icon or circuit pattern, acid purple/lime on gray concrete, intentional wobble and drips, underground vibe",
        aspectRatio: "1:1",
        negativePrompt: "clear readable text, symmetrical, flat design, no texture, bright happy colors, photographic realism, smooth vector, cute cartoon"
      },
      {
        name: "Distorted Tag Grid",
        basePrompt: "distorted graffiti tag over fragmented brutal grid, hand-sprayed edges, glitch offsets in neon, negative space creating hidden arrow or wireframe, magenta/cyan glow + rust concrete, cyber alley tag energy",
        aspectRatio: "1:1",
        negativePrompt: "perfect alignment, clean lines, minimal negative space, soft glow, pastel, luxury metallic, realistic photo, balanced harmony"
      },
      {
        name: "Raw Stencil Dystopia",
        basePrompt: "neo-brutalist stencil wordmark with raw hand imperfections, neon glow chromatic aberration, negative space forming barcode skyline void, high-contrast black + acid colors, urban decay digital rebellion",
        aspectRatio: "1:1",
        negativePrompt: "organic curves, smooth gradients, 3D isometric, photographic detail, cute elements, bright cheerful, elegant script"
      },
      {
        name: "Circuit Graffiti Negative",
        basePrompt: "hand-drawn tag + circuit fusion monogram, brutal thick strokes and spacing, negative space revealing hidden urban element or data stream, glitch noise + concrete texture, electric palette, dystopian street-tech",
        aspectRatio: "1:1",
        negativePrompt: "crisp sharp edges, flat solid colors, symmetrical balance, soft shadows, realistic city photo, minimalist simple, vintage"
      },
      {
        name: "Drip Brutal Void Tech",
        basePrompt: "brutal wordmark with cascading hand-drip effects, tech glitch overlays, deep negative space hiding circuit or tower fragment, matte concrete + neon cyan/magenta pops, ultimate cyber-street brutal",
        aspectRatio: "1:1",
        negativePrompt: "polished finish, vector clean, no distortion, bright uniform lighting, cute doodle, elegant typography, photographic realism"
      },
      {
        name: "Glitch Concrete Monogram",
        basePrompt: "extreme brutal monogram, concrete texture base, heavy glitch and neon outlines, negative space voids forming urban skyline or arrow symbol, acid lime accents, raw cyberpunk grit",
        aspectRatio: "1:1",
        negativePrompt: "readable elegant font, soft curves, pastel tones, smooth surface, 3D render, luxury brand feel, balanced composition"
      },
      {
        name: "Urban Neon Tag Chaos",
        basePrompt: "chaotic hand-tagged wordmark in neo-brutalist distortion, neon cyan/magenta spray glow, glitch halftone + concrete cracks, negative space hiding circuit grid or hidden icon, asymmetric dystopian urban tech masterpiece",
        aspectRatio: "1:1",
        negativePrompt: "empty clean space, flat 2D vector, symmetrical frame, soft pastel, realistic photo, corporate professional, minimal negative space"
      },
      {
        name: "Neon Drip Concrete",
        basePrompt: "brutalist letters dripping neon paint, hand-sprayed overspray, concrete base with crack texture, glitch distortion on edges, negative space forming hidden circuit or skyline, acid cyan/magenta glow, raw cyber-street aggression",
        aspectRatio: "1:1",
        negativePrompt: "clean lines, balanced typography, soft lighting, pastel, luxury, realistic, 3D depth, corporate minimal"
      },
      {
        name: "Barcode Alley Void",
        basePrompt: "neo-brutalist wordmark with barcode integrated into negative space voids, hand-scratched texture, neon glitch outlines, concrete gray + rust palette, urban decay drips, dystopian alley tech energy",
        aspectRatio: "1:1",
        negativePrompt: "elegant, smooth, flat vector, symmetrical, bright colors, photographic, cute, vintage"
      },
      {
        name: "Glitch Stencil Grid",
        basePrompt: "stencil brutal letters over fragmented grid, heavy glitch duplication, hand-drawn spray edges, negative space revealing arrow or wireframe, toxic neon pops on concrete, cyber-alley raw chaos",
        aspectRatio: "1:1",
        negativePrompt: "polished, clean alignment, soft glow, pastel tones, realistic photo, minimal flat design"
      },
      {
        name: "Marker Neon Decay",
        basePrompt: "loose marker tag on brutal block base, neon chromatic aberration and glitch, concrete decay texture, negative space hiding circuit pattern, high-contrast acid palette, intentional imperfection dystopian vibe",
        aspectRatio: "1:1",
        negativePrompt: "vector perfect, symmetrical, elegant font, bright uniform light, cute illustration, corporate clean"
      },
      {
        name: "Brutal Wireframe Tag",
        basePrompt: "brutal monogram built from wireframe lines, hand-tagged graffiti overlay, neon glow + glitch noise, negative space creating hidden urban symbol, black concrete base, cyber-street hacker aesthetic",
        aspectRatio: "1:1",
        negativePrompt: "smooth curves, soft shadows, pastel, luxury metallic, realistic detail, balanced harmony"
      },
      {
        name: "Acid Void Hustle",
        basePrompt: "heavy brutal wordmark, deep negative space voids with acid neon glow, hand-drip effects, glitch halftone, concrete crack texture, magenta/lime palette, raw underground tech energy",
        aspectRatio: "1:1",
        negativePrompt: "readable clean text, flat design, no distortion, bright cheerful, photographic realism, elegant"
      },
      {
        name: "Cyber Tag Fragment",
        basePrompt: "fragmented brutal tag, cyber glitch pieces, hand-sprayed drips, negative space forming skyline or circuit fragment, neon cyan/magenta on dark concrete, asymmetric dystopian street fusion",
        aspectRatio: "1:1",
        negativePrompt: "symmetrical composition, polished finish, soft edges, pastel, corporate minimal, vintage retro"
      },
      {
        name: "Stencil Neon Crack",
        basePrompt: "industrial stencil brutalism, neon overspray cracks, hand-cut raw edges, negative space hiding barcode or arrow, high-contrast black + electric colors, urban decay cyber grit",
        aspectRatio: "1:1",
        negativePrompt: "crisp perfect lines, smooth surface, bright happy tones, realistic photo, cute cartoon, luxury feel"
      },
      {
        name: "Glitch Concrete Chaos",
        basePrompt: "extreme glitch on brutal concrete letters, hand-marker chaos, neon outlines, negative space revealing hidden grid or tag symbol, acid palette drips, raw cyber-alley masterpiece",
        aspectRatio: "1:1",
        negativePrompt: "clean vector, balanced spacing, soft lighting, pastel, elegant typography, photographic realism"
      },
      {
        name: "Brutal Drip Circuit",
        basePrompt: "cascading brutal drip letters interwoven with circuit lines, neon glitch glow, concrete texture base, negative space hiding urban icon, toxic cyan/magenta pops, ultimate dystopian street-tech brutalism",
        aspectRatio: "1:1",
        negativePrompt: "minimal flat, symmetrical, smooth gradients, 3D render, cute elements, corporate professional"
      }
    ]
  }
];

export const LogoModule: ModuleStrategy = {
  id: 'logo design',
  name: 'Logo Design',
  
  constructPrompt: (context: GenerationContext) => {
    const { prompt, preset, base64Image, strictMode, isIllustrated, isSubjectOnly, selectedPalette } = context;
    
    const usePalette = selectedPalette && selectedPalette.name !== 'Default';

    const logoRules = `
    CRITICAL LOGO RULES:
    1. Scalable at 24px: The design must be legible at very small sizes. Bold, simple shapes.
    ${usePalette ? `2. Color Palette Enforcement: STRICTLY adhere to the requested color palette. Do not use default black/white unless specified in the palette.` : `2. Monochrome-first logic: The design must work in black and white. High contrast.`}
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
