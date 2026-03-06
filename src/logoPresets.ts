export interface LogoTypePreset {
  name: string;
  description: string;
  prompt: string;
}

export interface LogoLayoutPreset {
  name: string;
  description: string;
  prompt: string;
}

export const LOGO_TYPE_PRESETS: LogoTypePreset[] = [
  { name: 'Wordmark', description: 'Text-only logo', prompt: 'typographic wordmark logo, custom font, no icon' },
  { name: 'Pictorial Mark', description: 'Icon-only logo', prompt: 'pictorial icon logo, recognizable symbol, no text' },
  { name: 'Combination Mark', description: 'Icon + Text', prompt: 'combination mark logo, icon and text together' },
  { name: 'Monogram', description: 'Letter-based icon', prompt: 'monogram logo, initials-based icon, elegant ligature' },
  { name: 'Abstract Mark', description: 'Geometric shape icon', prompt: 'abstract geometric logo, non-representational shape' },
  { name: 'Mascot', description: 'Character-based logo', prompt: 'mascot character logo, friendly or aggressive' },
  { name: 'Emblem', description: 'Badge-style logo', prompt: 'emblem badge logo, text inside shape' },
  { name: 'Negative Space', description: 'Hidden icon logo', prompt: 'negative space logo, hidden symbol inside shape' }
];

export const LOGO_LAYOUT_PRESETS: LogoLayoutPreset[] = [
  { name: 'Stacked', description: 'Icon above text', prompt: 'stacked layout, icon centered above text' },
  { name: 'Side-by-Side', description: 'Icon left of text', prompt: 'side-by-side layout, icon to the left of text' },
  { name: 'Enclosed', description: 'Icon inside text', prompt: 'enclosed layout, icon integrated into text' },
  { name: 'Circular', description: 'Text around icon', prompt: 'circular layout, text following a path around icon' },
  { name: 'Minimalist Rail', description: 'Small text on a line', prompt: 'minimalist rail layout, icon above a thin line with small text' },
  { name: 'Diagonal Dynamic', description: '45-degree tilt', prompt: 'dynamic diagonal layout, 45-degree shear' },
  { name: 'Mirrored Symmetrical', description: 'Balanced symmetry', prompt: 'mirrored symmetrical layout, perfectly balanced' },
  { name: 'Asymmetrical Modern', description: 'Unbalanced but clean', prompt: 'asymmetrical modern layout, clean but dynamic' }
];
