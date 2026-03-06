export interface StylePreset {
  id: string;
  name: string;
  modifiers: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  { id: "none", name: "None", modifiers: "" },
  { id: "anime", name: "Anime", modifiers: "anime style, vibrant colors, clean line art, cel shaded" },
  { id: "cinematic", name: "Cinematic", modifiers: "cinematic lighting, dramatic composition, ultra detailed, epic movie scene, 8k resolution" },
  { id: "logo", name: "Logo Design", modifiers: "minimalist logo, vector graphics, flat design, clean lines, white background" },
  { id: "fantasy", name: "Fantasy Art", modifiers: "fantasy art, magical atmosphere, intricate details, digital painting, artstation" },
  { id: "cyberpunk", name: "Cyberpunk", modifiers: "cyberpunk style, neon lights, futuristic, high tech, dark atmosphere, sci-fi" },
  { id: "pixel", name: "Pixel Art", modifiers: "pixel art, 16-bit, retro game style, dithering" },
  { id: "watercolor", name: "Watercolor", modifiers: "watercolor painting, soft edges, artistic, wet on wet, paper texture" },
  { id: "realistic", name: "Realistic Photo", modifiers: "photorealistic, 8k, raw photo, dslr, sharp focus, highly detailed" },
  { id: "concept", name: "Concept Art", modifiers: "concept art, digital illustration, creative, rough brush strokes, atmospheric" },
  { id: "3d", name: "3D Render", modifiers: "3d render, blender, octane render, ray tracing, high fidelity" },
];
