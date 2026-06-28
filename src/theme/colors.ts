export const Colors = {
  // Base backgrounds
  background: '#09090E',
  backgroundSecondary: '#10101A',
  backgroundTertiary: '#18182A',
  backgroundQuaternary: '#22223A',

  // Glass surfaces
  surface: 'rgba(255, 255, 255, 0.055)',
  surfaceElevated: 'rgba(255, 255, 255, 0.085)',
  surfaceBorder: 'rgba(255, 255, 255, 0.09)',
  surfaceBorderStrong: 'rgba(255, 255, 255, 0.15)',

  // Text
  textPrimary: '#F2EDE4',
  textSecondary: '#9E9898',
  textTertiary: '#6A6470',
  textInverse: '#0A0A0F',

  // Brand accents
  gold: '#C9A96E',
  goldLight: '#E0C080',
  goldDim: 'rgba(201, 169, 110, 0.20)',
  pearl: '#E4DCD0',
  // InnerType identity color — pushed toward ivory/champagne to stay distinct from gold CTAs
  innerType: '#DDD3BE',
  innerTypeDim: 'rgba(221, 211, 190, 0.20)',
  lavender: '#9B8EC4',
  lavenderLight: '#B5AADC',
  lavenderDim: 'rgba(155, 142, 196, 0.20)',
  softBlue: '#7A9EC4',
  softBlueDim: 'rgba(122, 158, 196, 0.20)',

  // Semantic
  success: '#6BAF8B',
  successDim: 'rgba(107, 175, 139, 0.20)',
  error: '#C47B7B',
  errorDim: 'rgba(196, 123, 123, 0.20)',

  // Assessment colors — each dimension has a distinct hue
  // Personality: warm amber, clearly distinct from the pearl-champagne home color
  personality: '#C4874A',
  personalityDim: 'rgba(196, 135, 74, 0.15)',
  relationship: '#9B8EC4',
  relationshipDim: 'rgba(155, 142, 196, 0.15)',
  communication: '#7A9EC4',
  communicationDim: 'rgba(122, 158, 196, 0.15)',
  type: '#6AADB8',
  typeDim: 'rgba(106, 173, 184, 0.15)',

  // Tab bar
  tabActive: '#C9A96E',
  tabInactive: '#4A4550',

  // Overlays
  overlay: 'rgba(9, 9, 14, 0.85)',
  overlayLight: 'rgba(9, 9, 14, 0.50)',

  // Gradients (use with LinearGradient)
  gradientBackground: ['#09090E', '#10101A'] as const,
  gradientGold: ['#E0C080', '#B8924A'] as const,
  gradientLavender: ['#B5AADC', '#7B6BA8'] as const,
  gradientBlue: ['#A0BFD8', '#5B7EA8'] as const,
  gradientCard: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.025)'] as const,
  gradientCardPersonality: ['rgba(196,135,74,0.12)', 'rgba(196,135,74,0.04)'] as const,
  gradientCardRelationship: ['rgba(155,142,196,0.12)', 'rgba(155,142,196,0.04)'] as const,
  gradientCardCommunication: ['rgba(122,158,196,0.12)', 'rgba(122,158,196,0.04)'] as const,
  gradientCardType: ['rgba(106,173,184,0.12)', 'rgba(106,173,184,0.04)'] as const,
};

export type ColorKey = keyof typeof Colors;
