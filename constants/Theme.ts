/**
 * SpotShot Design System
 * Aesthetic: Midnight Explorer - Urban Night Photography
 */

export const Theme = {
  // Color Palette - Inspired by night photography & urban exploration
  colors: {
    // Base colors - deep night tones
    richBlack: '#0A0A0F',
    deepCharcoal: '#1A1A24',
    darkNavy: '#1E1E2E',
    slate: '#2A2A3A',

    // Light tones
    offWhite: '#F5F5F7',
    lightGray: '#E8E8ED',
    silver: '#C7C7D1',

    // Primary purple - main accent
    primary: '#6D5FFD',
    primaryDark: '#5847D9',
    primaryLight: '#8B7FFE',
    primaryGlow: 'rgba(109, 95, 253, 0.2)',

    // Secondary accents
    electricBlue: '#4C9AFF',
    neonPink: '#FF6B9D',
    cosmicPurple: '#9D4EDD',

    // Gradient colors
    gradientStart: '#6D5FFD',
    gradientMiddle: '#8B7FFE',
    gradientEnd: '#B794F6',

    // Functional
    error: '#FF4757',
    success: '#2ED573',
    warning: '#FFA502',

    // Text
    textLight: '#F5F5F7',
    textDark: '#0A0A0F',
    textMuted: '#9B9BA7',
    textSecondary: '#6E6E7E',
  },

  // Typography
  typography: {
    // Font families (will use system fallbacks)
    display: 'Playfair Display', // For headings
    body: 'System',

    // Sizes
    sizes: {
      hero: 48,
      h1: 36,
      h2: 28,
      h3: 22,
      h4: 18,
      body: 16,
      bodySmall: 14,
      caption: 12,
      tiny: 10,
    },

    // Weights
    weights: {
      light: '300' as const,
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      black: '900' as const,
    },

    // Line heights
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // Border radius
  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // Shadows - organic, soft shadows
  shadows: {
    soft: {
      shadowColor: '#0A0908',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
    },
    medium: {
      shadowColor: '#0A0908',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 8,
    },
    strong: {
      shadowColor: '#0A0908',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.3,
      shadowRadius: 32,
      elevation: 16,
    },
  },

  // Animation durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
    slowest: 800,
  },
};

// Glow effect configuration
export const GlowEffect = {
  borderWidth: 2,
  glowRadius: 12,
  glowColor: Theme.colors.primaryGlow,
};

// Layout constants
export const Layout = {
  screenPadding: Theme.spacing.md,
  cardGap: Theme.spacing.md,
  maxWidth: 1200,
};
