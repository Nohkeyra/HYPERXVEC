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
    category: "Vector Art",
    presets: [
      { name: "Ultra-Flat 2.0", basePrompt: "flat vector illustration, minimalist, 2D solid color blocking, no gradients, no shadows, sharp geometric edges, Adobe Illustrator aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Corporate Memphis", basePrompt: "modern corporate illustration, exaggerated limbs, playful flat shapes, lottie animation style, clean vector lines, whimsical", aspectRatio: "1:1", negativePrompt: "realistic human proportions, shadows, painting, photography, hyper-detailed, complex textures, blurry, depth" },
      { name: "Low Poly Faceted", basePrompt: "low poly vector art, faceted geometric triangles, angular 3D aesthetic, sharp edges, bold color segments, architectural precision", aspectRatio: "1:1", negativePrompt: "smooth curves, realistic skin, gradients, soft lighting, photographic, blurry background, painting, messy strokes" },
      { name: "Isometric Technical", basePrompt: "isometric vector perspective, 45-degree grid, clean technical drawing, solid fills, no depth of field, architectural blueprint style", aspectRatio: "1:1", negativePrompt: "perspective distortion, shadows, realistic lighting, blur, depth of field, organic shapes, messy lines, painting" },
      { name: "Ligne Claire", basePrompt: "ligne claire style, uniform line weight, bold black outlines, flat color fills, tintin aesthetic, clear crisp lines, zero shading", aspectRatio: "1:1", negativePrompt: "gradients, shadows, crosshatching, realistic textures, blurry, fuzzy lines, 3d render, soft edges, painting" },
      { name: "WPA Poster Art", basePrompt: "vintage travel poster, screen print aesthetic, layered flat color planes, bold graphic shapes, WPA style, retro vector finish", aspectRatio: "1:1", negativePrompt: "photorealistic, modern 3d render, thin lines, intricate detail, blurry, gradients, shadows, realistic lighting" },
      { name: "Thick Outline Pop", basePrompt: "pop art vector, thick bold black outlines, saturated flat colors, high contrast, clean comic book style, Ben-Day dot textures", aspectRatio: "1:1", negativePrompt: "realistic lighting, soft shadows, thin lines, gradients, blurry, 3d, realistic skin, photographic" },
      { name: "Monoline Icon", basePrompt: "monoline vector illustration, single stroke weight, rounded caps, minimalist graphic, simple path art, iconographic", aspectRatio: "1:1", negativePrompt: "varying line weights, shadows, gradients, realistic detail, complex textures, 3d, blurry, colorful backgrounds" },
      { name: "Papercut Layers", basePrompt: "papercut vector art, layered paper shapes, clean cutouts, subtle depth shadows, flat craft aesthetic, hand-cut feel", aspectRatio: "1:1", negativePrompt: "realistic textures, smooth gradients, 3d render, photographic, blurry, messy edges, complex lighting" },
      { name: "Bauhaus Geometric", basePrompt: "bauhaus style, primary colors, abstract geometric shapes, minimalist vector composition, circle square triangle, functional art", aspectRatio: "1:1", negativePrompt: "organic shapes, realistic textures, shadows, gradients, 3d render, photography, blurry, soft edges" },
      { name: "Die-Cut Sticker", basePrompt: "die-cut sticker style, thick white border, bold outlines, vinyl aesthetic, flat vector colors, centered, die-cut path", aspectRatio: "1:1", negativePrompt: "no border, shadows, realistic textures, blurry, gradients, complex background, 3d render, painting" },
      { name: "DuoTone Graphic", basePrompt: "duotone vector art, high contrast two-color palette, clean silhouettes, sharp transitions, spotify aesthetic, minimalist", aspectRatio: "1:1", negativePrompt: "multicolor, gradients, shadows, realistic detail, 3d render, blurry, photographic, soft transitions" },
      { name: "Ukiyo-e Modern", basePrompt: "modern ukiyo-e vector, japanese woodblock print style, clean lines, flat muted colors, traditional aesthetic, woodcut finish", aspectRatio: "1:1", negativePrompt: "neon colors, realistic 3d, gradients, shadows, photorealistic, modern digital noise, blurry, complex lighting" },
      { name: "Cyberpunk Flat", basePrompt: "cyberpunk neon vector, glowing flat shapes, high contrast, futuristic lines, solid neon color blocking, synthwave aesthetic", aspectRatio: "1:1", negativePrompt: "realistic smoke, lens flare, photorealistic, 3d render, blurry, shadows, gradients, realistic textures" },
      { name: "Groovy 70s Retro", basePrompt: "70s retro vector, bubbly organic shapes, warm earth tones, psychedelic swirls, flat groovy aesthetic, vintage sticker style", aspectRatio: "1:1", negativePrompt: "sharp modern edges, neon colors, 3d render, realistic, shadows, gradients, photography, digital noise" },
      { name: "Vaporwave Wireframe", basePrompt: "vaporwave vector, digital wireframe grid, pastel pink and teal, greek statue silhouette, 90s lo-fi digital aesthetic", aspectRatio: "1:1", negativePrompt: "high resolution realistic, modern 3d render, shadows, photorealistic, blurry, earthy tones, organic lines" },
      { name: "Minimalist Silhouette", basePrompt: "solid silhouette vector art, negative space design, clean cutouts, high impact minimalism, dual-tone black and white", aspectRatio: "1:1", negativePrompt: "internal detail, shadows, gradients, realistic textures, 3d render, blurry, colorful, complex shapes" },
      { name: "Kawaii Pastel", basePrompt: "kawaii vector style, rounded cute shapes, pastel color palette, minimalist facial features, clean flat art, sanrio aesthetic", aspectRatio: "1:1", negativePrompt: "scary, realistic anatomy, dark colors, shadows, gradients, 3d render, photorealistic, blurry, sharp angles" },
      { name: "Golden Ratio Logo", basePrompt: "geometric animal logo style, golden ratio construction, symmetrical vector lines, clean professional finish, balanced shapes", aspectRatio: "1:1", negativePrompt: "asymmetrical, messy lines, realistic fur, gradients, shadows, 3d render, blurry, photorealistic" },
      { name: "Streetwear Graphic", basePrompt: "skate brand aesthetic, edgy vector lines, high contrast bold graphics, streetwear screen print finish, stencil art", aspectRatio: "1:1", negativePrompt: "soft colors, gradients, realistic lighting, thin lines, 3d render, blurry, photorealistic, feminine aesthetic" },
      { name: "Infographic Flat", basePrompt: "clean infographic vector, professional icon style, data visualization aesthetic, simple solid shapes, uncluttered", aspectRatio: "1:1", negativePrompt: "complex artwork, shadows, gradients, 3d render, realistic textures, blurry, messy layout, photography" },
      { name: "Folklore Decorative", basePrompt: "modern folk art vector, symmetrical floral patterns, decorative motifs, flat traditional shapes, vibrant scandinavian style", aspectRatio: "1:1", negativePrompt: "asymmetrical, realistic flowers, 3d render, shadows, gradients, photorealistic, blurry, depth of field" },
      { name: "Glitch Vector", basePrompt: "vector glitch aesthetic, shifted color planes, sharp geometric fragments, digital distortion, clean paths, tech-wear style", aspectRatio: "1:1", negativePrompt: "soft blur, realistic smoke, gradients, shadows, photorealistic, organic shapes, 3d render, painting" },
      { name: "Blueprint Technical", basePrompt: "vector blueprint style, white technical lines on blue background, architectural grid, clean mathematical paths, schematic", aspectRatio: "1:1", negativePrompt: "colorful, realistic textures, shadows, 3d render, blurry, organic shapes, photographic, gradients" },
      { name: "Mid-Century Modern", basePrompt: "mid-century modern vector, atomic age shapes, muted vintage colors, minimalist abstract illustration, saul bass style", aspectRatio: "1:1", negativePrompt: "neon colors, high-tech, 3d render, realistic, shadows, gradients, photorealistic, blurry, complex detail" },
      { name: "Celtic Knotwork", basePrompt: "celtic knot vector art, interlacing lines, symmetrical geometric paths, clean line-work, traditional knotting, vector paths", aspectRatio: "1:1", negativePrompt: "messy lines, asymmetrical, shadows, gradients, 3d render, realistic textures, blurry, photorealistic" },
      { name: "Glassmorphism Flat", basePrompt: "glassmorphism vector, frosted glass effect, soft colorful backgrounds, semi-transparent flat shapes, modern UI aesthetic", aspectRatio: "1:1", negativePrompt: "realistic glass, messy textures, shadows, photorealistic, 3d render, blurry foreground, high contrast lines" },
      { name: "Stained Glass Vector", basePrompt: "stained glass aesthetic, thick black lead lines, vibrant translucent color segments, geometric mosaic, leaded glass finish", aspectRatio: "1:1", negativePrompt: "no outlines, realistic glass, shadows, gradients, photorealistic, blurry, messy lines, 3d render" },
      { name: "Negative Space Art", basePrompt: "negative space vector illustration, hidden meanings, dual-subject silhouette, sharp minimalist edges, clever composition", aspectRatio: "1:1", negativePrompt: "internal detail, shadows, gradients, 3d render, realistic textures, blurry, complex coloring" },
      { name: "Voxel Art 2D", basePrompt: "2D voxel art style, pixel-block vector, isometric cubes, clean digital blocks, retro gaming aesthetic, minecraft style", aspectRatio: "1:1", negativePrompt: "smooth surfaces, realistic textures, shadows, gradients, photorealistic, blurry, 3d lighting" },
      { name: "Neon Glitch Wireframe", basePrompt: "cybernetic grid vector, distorted neon wireframe, electric purple and lime cyan, digital interference lines, retro-future tech aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Bauhaus Geometric II", basePrompt: "bauhaus style vector, primary colors red yellow blue, bold circular and rectangular shapes, high-contrast balanced composition, minimalist Swiss design", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Eco-Minimalist Mono", basePrompt: "single-line leaf vector, continuous monoline stroke, organic curves, sage green on off-white, botanical simplicity, clean professional mark", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Retro-Duo Grainy Flat", basePrompt: "flat 1970s vector illustration, burnt orange and cream, rounded thick typography shapes, heavy stipple texture effect, vintage groovy aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "ASCII Terminal Art", basePrompt: "monospaced character vector, terminal green on black, grid-aligned typographic symbols, digital matrix aesthetic, clean technical lines", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Prism Isometric", basePrompt: "3D isometric block vector, translucent glass-like planes, light refraction color shifts, clean sharp edges, architectural geometric clarity", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Pop-Art Halftone", basePrompt: "bold vector comic art, vibrant primary color blocking, thick black outlines, oversized halftone dot patterns, 1960s pop aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Abstract Blob-Work", basePrompt: "amorphous organic shapes, overlapping translucent blobs, muted earthy tones, fluid minimalist vector, modern gallery aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Technical Circuitry", basePrompt: "motherboard schematic vector, 45-degree angled paths, circular solder nodes, high-tech industrial aesthetic, clean geometric line-work", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Deconstructed Cubism", basePrompt: "abstract facial features deconstructed into geometric planes, asymmetrical vector composition, high-contrast earth tones, sharp modern art aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Swiss Typographic Grid", basePrompt: "heavy sans-serif letterforms integrated into geometric shapes, rigid grid alignment, red and black color palette, clean industrial Swiss design aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Risograph Texture Flat", basePrompt: "flat vector illustration, grainy risograph ink texture, overlapping translucent soy-ink colors, vibrant fluorescent pink and teal, tactile print aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Minimalist Zen Ink", basePrompt: "digital sumi-e vector, bold black brushstroke paths, high-pressure tapering lines, negative space focus, clean minimalist japanese ink aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Art Deco Geometric", basePrompt: "opulent art deco vector, symmetrical gold metallic lines on charcoal, repeating fan and sunburst patterns, sharp verticality, roaring twenties aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Sticker-Bomb Flat", basePrompt: "clustered vector stickers, thick white offset borders, vibrant cartoon color palette, 2D flat graphic icons, high-density overlapping composition", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Monochrome Linocut", basePrompt: "hand-carved linocut vector, high-contrast black and white, rough organic edges, rhythmic gouge marks, traditional folk print aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Retro-Future Synthwave", basePrompt: "80s synthwave vector, chrome-effect horizons, glowing pink sun, retro-grid floor, electric blue outlines, digital sunset aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Flat Claymorphism", basePrompt: "rounded 2D shapes with inner shadow depth, soft pastel 'clay' look, inflated geometric forms, friendly minimalist UI aesthetic, no gradients", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Optical Op-Art", basePrompt: "black and white repeating vector lines, illusory movement, warping geometric patterns, high-contrast mathematical precision, psychedelic 60s aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Drafting Paper Vellum", basePrompt: "architectural graphite vector, blueprint blue ink on translucent vellum texture, construction lines, precise measurement notations, technical hand-drafted look", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Bento Grid Minimalist", basePrompt: "clean bento grid layout, rectangular modular segments, rounded corners, soft pastel UI aesthetic, minimalist iconography in each cell, organized professional vector", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Rubberhose Retro-Toon", basePrompt: "1930s rubberhose animation style, elastic limbs, gloved hands, pie-cut eyes, thick black ink outlines, high-contrast monochrome, vintage cartoon aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Biomorphic Abstract", basePrompt: "organic flowing vector forms, lava-lamp aesthetic, smooth liquid transitions, vibrant neon gradients, surreal cellular shapes, modern digital art", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Brutalist Wireframe", basePrompt: "industrial wireframe vector, raw black outlines, bold utilitarian typography, high-impact technical nodes, anti-design aesthetic, stark white background", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Paper-Cut Shadowbox", basePrompt: "2D layered paper-cut vector, deep drop-shadows between layers, crisp physical edges, vibrant color stacking, diorama depth effect, clean craft aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Anamorphic Glitch", basePrompt: "stretched vector letterforms, horizontal chromatic aberration, digital sliced effects, high-tech kinetic energy, cyan and magenta shifts, futuristic graphic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Celtic Line-Work", basePrompt: "intricate celtic knotwork vector, continuous interlocking lines, symmetrical geometric complexity, sharp clean strokes, ancient manuscript aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Luxury Gold Filigree", basePrompt: "ornate vector filigree, golden metallic swirls on black, victorian engraving style, hyper-detailed flourishes, symmetrical luxury branding aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Low-Poly Sunset", basePrompt: "triangular facet vector, low-poly landscape, warm orange and purple sky, sharp geometric terrain, minimalist digital polygon art", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" },
      { name: "Etched Cross-Hatch", basePrompt: "fine vector cross-hatching, hand-drawn ink etching style, rhythmic parallel lines for shading, high-contrast woodblock feel, traditional print aesthetic", aspectRatio: "1:1", negativePrompt: "photorealistic, 3d render, shadows, blur, gradients, depth of field, textures, grainy, messy lines, realistic lighting" }
    ]
  }
];

const rawTypographyPresets = [
  {
    category: "Typography Art",
    presets: [
      { name: "Silhouette Fill", basePrompt: "typography of '[WORD]' tightly packed into a [SHAPE] silhouette, no gaps, flat vector", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Kinetic Warp", basePrompt: "letters of '[WORD]' warped and elongated to form a [SHAPE], fluid motion, clean edges", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Negative Space", basePrompt: "minimalist typography, negative space forming a [SHAPE] between letters of '[WORD]'", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Monoline Path", basePrompt: "single monoline stroke forming the word '[WORD]' into the outline of a [SHAPE], minimalist", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Isometric Stack", basePrompt: "isometric typography, letters of '[WORD]' stacked like 3D blocks to build a [SHAPE], geometric", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Liquid Pour", basePrompt: "liquid typography, '[WORD]' melting and flowing to fill the form of a [SHAPE], vibrant colors", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Ribbon Wrap", basePrompt: "typography of '[WORD]' as a folding 3D ribbon creating a [SHAPE], flat vector style", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Cut-Out", basePrompt: "solid [SHAPE], word '[WORD]' cut out of the center, high contrast, sharp vector finish", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Topographic", basePrompt: "topographic lines forming the word '[WORD]' into a 3D terrain shape, flat vector colors", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Smoke Wisp", basePrompt: "stylized vector smoke wisps forming the word '[WORD]' into a cloud shape, elegant lines", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Botanical Overgrowth", basePrompt: "bold sans-serif typography of '[WORD]', intertwined with organic vines and floral motifs, layered depth", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Urban Skyline", basePrompt: "heavy block text '[WORD]', integrated city skyline silhouette in the bottom half, minimalist vector", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Liquid Splash", basePrompt: "typography of '[WORD]', submerged in stylized liquid splashes breaking out of letter boundaries", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Mountain Range", basePrompt: "bold typography '[WORD]', integrated mountain range silhouette along the top edge, topographic style", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Circuit Board", basePrompt: "typography of '[WORD]', internal fill of electronic circuit board patterns, tech-vector aesthetic", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Integrated Masking", basePrompt: "bold heavy sans-serif '[WORD]', stylized waves masked inside bottom half and overlapping strokes", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Geometric Monoline", basePrompt: "SMILE style, thin consistent geometric lines, futuristic tech aesthetic, ultra-minimalist", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Retro Groovy", basePrompt: "70s bubble typography, warped rounded letters, psychedelic aesthetic, thick bold forms", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Street Graffiti", basePrompt: "BORN style, layered graffiti tagging, neon outlines, paint drips, aggressive street art aesthetic", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Minimalist Block", basePrompt: "PULSE style, ultra-thick sans-serif, negative space defining the letters, solid color blocking", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Flame Kinetic", basePrompt: "FIRED UP style, letters melting upward into fire licking shapes, flickering orange and red", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Full-Frame Modular", basePrompt: "EXPRESS style, letters stretched to fill a perfect square frame, zero gaps, geometric puzzle", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Vertical Script", basePrompt: "STREETWEAR style, vertical handwritten script tagging, 90-degree rotation, skater aesthetic", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Horizon Split", basePrompt: "HORIZON style, sharp horizontal line slicing through the middle of the text, split color palette", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Bulb Silhouette", basePrompt: "LIGHT style, text packed inside lightbulb shape, varying font weights to define the glass form", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Cyber-Glitch", basePrompt: "glitch typography, sliced and shifted letter planes, digital distortion, sharp cyan and magenta offsets", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Art Deco Geometric", basePrompt: "art deco style, elegant tall letters, gold monoline accents, symmetrical geometric patterns, 1920s luxury", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Brutalist Swiss", basePrompt: "swiss style, massive helvetica, overlapping letters, stark black and white, extreme grid alignment", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Gothic Blackletter", basePrompt: "modern blackletter, sharp calligraphy strokes, aggressive gothic lines, flat vector, high contrast", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Neon Tube", basePrompt: "neon sign style, glowing glass tubes, single continuous line, vibrant light on solid dark background", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Street Handstyle Tag", basePrompt: "STREETTAG style, aggressive graffiti handstyle, markers-style strokes, sharp chisel-tip flair, long fluid swashes, urban tagging aesthetic, minimalist black and white", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Negative Space Mask", basePrompt: "bold heavy sans-serif '[WORD]', a [SHAPE] silhouette seamlessly carved out of the negative space of the letters, minimalist clever composition", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Brutalist Grid", basePrompt: "raw brutalist typography, '[WORD]' stretched and distorted to fit a rigid square grid, overlapping blocks, anti-design aesthetic, high-impact", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Split Horizon", basePrompt: "split typography, '[WORD]' sliced perfectly in half by a horizontal line, top and bottom halves in contrasting solid colors, sharp divide", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Liquid Melting", basePrompt: "melting typography, '[WORD]' letters dripping downward like viscous liquid, organic distorted forms, flat vibrant color fills", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Intertwined Ribbon", basePrompt: "continuous ribbon typography, '[WORD]' formed by a single folding 3D-effect flat ribbon, elegant intertwined paths, vector finish", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Geometric Fragment", basePrompt: "shattered typography, '[WORD]' broken into sharp geometric fragments and shards, exploded view, kinetic energy, clean vector", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Eco-Organic Script", basePrompt: "botanical typography, '[WORD]' where strokes transform into delicate leaves and vines, soft organic flow, minimalist line art", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Stencil Industrial", basePrompt: "heavy military stencil typography, '[WORD]' with clean bridge gaps, industrial spray-paint aesthetic (but clean vector), high contrast", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Optical Illusion Warp", basePrompt: "hypnotic warped typography, '[WORD]' distorted into a spherical or vortex shape, concentric lines, trippy geometric aesthetic", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Cyber-Glitch Slice", basePrompt: "glitch typography, '[WORD]' with horizontal slices and digital shifts, sharp cyan and magenta color offsets, tech-forward", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Kawaii Bubble Gum", basePrompt: "ultra-rounded bubble typography, '[WORD]' looking like inflated balloons, soft pastel colors, cute playful aesthetic, no shadows", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Japanese Stamp (Hanko)", basePrompt: "square hanko stamp typography, '[WORD]' converted into traditional Japanese block characters, distressed vector edges, red ink aesthetic", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Retro-Futurist Chrome", basePrompt: "80s synthwave typography, '[WORD]' with sharp metallic beveled edges, flat vector chrome effect, vibrant neon pink and cyan outlines", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Bauhaus Modular", basePrompt: "bauhaus school typography, '[WORD]' built strictly from circles, squares, and triangles, primary colors (red, yellow, blue), heavy lines", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Outline Stack", basePrompt: "stacked outline typography, '[WORD]' repeated vertically with hollow centers and thick consistent borders, modern streetwear aesthetic", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Geometric Mosaic", basePrompt: "mosaic typography, '[WORD]' built from small uniform vector tiles and squares, rigid geometric grid, vibrant color blocks, modern pixel-mosaic aesthetic", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Shattered Glass Fractal", basePrompt: "fractal typography, '[WORD]' viewed through a shattered glass pane, sharp triangular shards, overlapping transparent color segments, high-speed kinetic energy", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Liquid Chrome (Flat)", basePrompt: "liquid metal typography, '[WORD]' as a single continuous bead of molten chrome, high-gloss flat vector finish, metallic sheen, organic fluid connections", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Shadow-Play Silhouette", basePrompt: "minimalist flat-shadow typography, '[WORD]' with a single exaggerated long hard-edge shadow at a 45-degree angle, high-contrast 2D depth, solid colors", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Oceanic Wave-Breaker", basePrompt: "bold heavy sans-serif '[WORD]', stylized crashing ocean waves integrated into the bottom half and overlapping letter strokes, high-contrast blue and white, clean vector", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Flame-Drop Silhouette", basePrompt: "typography of '[WORD]' warped into a perfect teardrop flame silhouette, letters stretching and curving to fill the shape, vibrant orange to pink gradient aesthetic, clean vector", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Cosmic Nebula Mask", basePrompt: "bold blocky '[WORD]', internal fill of swirling cosmic nebula and stars, celestial motifs breaking out of letter boundaries, deep purple and gold accents", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Glitch-Core Distortion", basePrompt: "heavy sans-serif '[WORD]', extreme horizontal slicing and pixel-sorting effects, digital noise artifacts integrated into strokes, high-tech cybernetic aesthetic", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Organic Root-System", basePrompt: "typography of '[WORD]', where the base of each letter transforms into a complex network of spreading tree roots, earthy tones, detailed vector line-work", aspectRatio: "1:1", negativePrompt: "" },
      { name: "Prismatic Glass Refraction", basePrompt: "bold '[WORD]' viewed through a prism, letters split into refracted rainbow color planes, sharp geometric offsets, translucent overlapping segments", aspectRatio: "1:1", negativePrompt: "" }
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
