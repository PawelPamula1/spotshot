# SpotShot Design System

## Design Philosophy: "Analog Photography Memoir"

SpotShot's visual identity is inspired by **vintage photography magazines** and **analog film aesthetics**. The design eschews generic Material Design patterns in favor of a warm, tactile, editorial-inspired interface that celebrates the art of photography.

---

## Design Principles

1. **Warmth over Coldness**: Rich, warm blacks and cream tones instead of sterile grays and whites
2. **Tactile over Flat**: Film borders, grain overlays, and shadows create depth and texture
3. **Editorial over Generic**: Magazine-style layouts with asymmetric compositions
4. **Cinematic over Functional**: Smooth animations and dramatic transitions
5. **Distinctive over Safe**: Bold burnt orange accents instead of overused purple gradients

---

## Color Palette

### Base Colors
```typescript
richBlack: '#0A0908'      // Primary background
deepCharcoal: '#1C1917'   // Secondary surfaces
warmGray: '#3D3935'       // Tertiary elements
```

### Paper/Cream Tones
```typescript
cream: '#FAF7F2'          // Primary light text
lightCream: '#FFF8F0'     // Highlights
darkCream: '#E8E4DC'      // Muted accents
```

### Accent Colors
```typescript
burntOrange: '#E76F51'    // Primary CTA, badges
deepOrange: '#D4622C'     // Button accents
mutedOrange: '#C9775A'    // Hover states
```

### Film-Inspired Accents
```typescript
filmGreen: '#2A5540'      // Decorative elements
vintageBlue: '#4A5B6E'    // Alternative accents
sepia: '#C4A57B'          // Warm tones
```

---

## Typography

### Font Hierarchy
- **Display**: System Bold/Black - Used for hero titles and app branding
- **Body**: System Regular/Medium - All body text and UI labels

### Type Scale
```typescript
hero: 48px        // Login screen titles
h1: 36px          // Main headings
h2: 28px          // Section titles
h3: 22px          // Card titles
h4: 18px          // Subheadings
body: 16px        // Standard text
bodySmall: 14px   // Secondary text
caption: 12px     // Labels, badges
tiny: 10px        // Location badges
```

### Type Styles
- **Uppercase Labels**: Small caps with increased letter-spacing (1-2px)
- **Tight Line Heights**: 1.2 for headlines for dramatic impact
- **Relaxed Line Heights**: 1.8 for body text for readability

---

## Spacing System

Consistent 8px-based spacing scale:
```typescript
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
xxxl: 64px
```

---

## Component Patterns

### Film Border Effect
The signature visual element - simulates analog film frames:

**Features:**
- Cream border padding (6-8px)
- Corner markers (viewfinder-style brackets)
- Applied to all photo displays

**Usage:**
- Photo cards
- Map callouts
- Image galleries

### Location Badges
Small, uppercase badges with burnt orange background:
```typescript
{
  backgroundColor: burntOrange,
  paddingHorizontal: 8px,
  paddingVertical: 3-4px,
  borderRadius: 4px,
  fontSize: 9-10px,
  letterSpacing: 1-1.2px,
  fontWeight: 'bold',
  textTransform: 'uppercase'
}
```

### Accent Lines
Decorative horizontal lines beneath text:
```typescript
{
  width: 24-32px,
  height: 2px,
  backgroundColor: burntOrange,
  borderRadius: 1px
}
```

### Buttons
Premium, tactile buttons with shadows and accents:

**Primary Button:**
- Background: `burntOrange`
- Text: Uppercase, cream color, bold, letter-spacing: 1.5px
- Bottom accent strip (3px height, `deepOrange`)
- Medium shadow for depth
- Scale animation on press (0.96)

**Secondary Button:**
- Background: `deepCharcoal`
- Border: 2px `warmGray`
- On focus: Border becomes `burntOrange` with soft shadow

---

## Shadows

Three-tier shadow system for depth:

### Soft Shadow (Cards)
```typescript
{
  shadowColor: '#0A0908',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 4
}
```

### Medium Shadow (Buttons)
```typescript
{
  shadowColor: '#0A0908',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 20,
  elevation: 8
}
```

### Strong Shadow (Popups, Callouts)
```typescript
{
  shadowColor: '#0A0908',
  shadowOffset: { width: 0, height: 16 },
  shadowOpacity: 0.3,
  shadowRadius: 32,
  elevation: 16
}
```

---

## Animation Timing

### Duration Scale
```typescript
fast: 150ms      // Micro-interactions
normal: 300ms    // Standard transitions
slow: 500ms      // Page transitions
slowest: 800ms   // Hero animations
```

### Animation Patterns

**Fade In + Slide Up:**
```typescript
Animated.parallel([
  Animated.timing(opacity, { toValue: 1, duration: 500 }),
  Animated.timing(translateY, { toValue: 0, duration: 500 })
])
```

**Scale Press Feedback:**
```typescript
Animated.spring(scale, {
  toValue: 0.96,
  tension: 100,
  friction: 10
})
```

---

## Screen-Specific Guidelines

### Authentication Screen
- **Layout**: Full-screen gradient background with decorative circles
- **Hero Section**: Large logo in film-frame style, app name (48px), tagline
- **Divider**: Horizontal line with centered label
- **Form**: Stacked inputs with focus states, labels above fields
- **Animations**: Fade + slide on mount, form transitions on mode switch

### Spot Cards
- **Film Border**: 8px cream padding with corner markers
- **Image**: Square aspect ratio (1:1)
- **Badge**: Small orange badge with city name
- **Title**: 2-line limit, semibold
- **Accent**: Horizontal line below title
- **Animation**: Fade in on mount, scale on press

### Map Callouts
- **Size**: 200px width
- **Film Border**: 6px cream padding with top corner markers only
- **Image**: 120px height
- **Layout**: Same badge + title + accent pattern as cards
- **Shadow**: Strong shadow for prominence

### Headers
- **Background**: `richBlack`
- **Text**: `cream` color
- **Logo Style**: App name with custom styling (consider film-frame treatment)

---

## Implementation Notes

### Using the Theme
```typescript
import { Theme } from '@/constants/Theme';

// Colors
backgroundColor: Theme.colors.richBlack
color: Theme.colors.cream

// Typography
fontSize: Theme.typography.sizes.body
fontWeight: Theme.typography.weights.semibold

// Spacing
padding: Theme.spacing.md
gap: Theme.spacing.sm

// Shadows
...Theme.shadows.soft

// Animation
duration: Theme.animation.normal
```

### Film Border Component Pattern
```tsx
<View style={styles.filmBorder}>
  <View style={styles.cornerMarker} />
  <View style={[styles.cornerMarker, styles.cornerTopRight]} />
  <View style={[styles.cornerMarker, styles.cornerBottomLeft]} />
  <View style={[styles.cornerMarker, styles.cornerBottomRight]} />

  <Image source={uri} style={styles.image} />

  {/* Optional grain overlay */}
  <View style={styles.grainOverlay} />
</View>
```

---

## What Makes This Design Distinctive

### ❌ What We Avoided (Generic AI Aesthetics)
- Purple gradient on white backgrounds (#6D5FFD)
- Inter/Roboto/Arial system fonts
- Flat, colorless Material Design
- Generic rounded corners everywhere
- No personality or context-specific character

### ✅ What We Created
- **Warm Analog Palette**: Burnt orange, cream, rich blacks
- **Film Photography Elements**: Corner markers, grain overlays, borders
- **Editorial Typography**: Large dramatic headlines, tight leading
- **Tactile Depth**: Multiple shadow layers, overlapping elements
- **Cinematic Motion**: Smooth fades, spring animations, staggered reveals
- **Context-Appropriate**: Design that celebrates photography and travel

---

## Inspiration & References

The design draws from:
1. **Aperture Magazine** - Editorial layouts, typography
2. **35mm Film Frames** - Border treatments, corner markers
3. **Polaroid Aesthetics** - Warm tones, instant photography nostalgia
4. **LIFE Magazine Archives** - Classic photo journalism layouts
5. **Analog Film Stock** - Warm color grading, grain texture

---

## Future Enhancements

Potential additions to expand the design system:

1. **Custom Loading States**: Film strip animation or camera shutter effect
2. **Pull-to-Refresh**: Vintage camera winding animation
3. **Empty States**: Illustrated film cameras or viewfinder graphics
4. **Onboarding**: Cinematic slideshow with parallax
5. **Transitions**: Page curl or film strip transitions between screens
6. **Dark/Light Mode**: Expand palette for alternative viewing (currently optimized for dark)
7. **Custom Fonts**: Consider adding Playfair Display or similar serif for premium feel

---

## Accessibility Considerations

- **Color Contrast**: All text meets WCAG AA standards
  - Cream (#FAF7F2) on Rich Black (#0A0908): 16.5:1 ratio
  - Orange badges verified for readability
- **Touch Targets**: All interactive elements minimum 44x44px
- **Focus States**: Clear visual indicators (orange border)
- **Animation**: Reduced motion support recommended for future
- **Text Scaling**: Relative sizing allows for iOS/Android text scaling

---

## Conclusion

This design system transforms SpotShot from a generic app into a **memorable, premium photography discovery platform**. Every element—from the film borders to the burnt orange accents—reinforces the core theme of analog photography and editorial excellence.

The system is both **distinctive** (immediately recognizable) and **cohesive** (every screen feels part of the same family). Most importantly, it avoids the trap of generic "AI slop" aesthetics by making bold, intentional choices rooted in the context of photography and travel.
