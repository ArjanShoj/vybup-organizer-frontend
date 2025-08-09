# Vybup Design System Export

## 🎨 Complete Color Palette

### Primary Colors (Warm Orange/Amber)
```javascript
primary: {
  50: '#fefdf9',   // Lightest cream
  100: '#fef7ed',  // Light cream
  200: '#fdecc8',  // Soft amber
  300: '#fbd997',  // Light amber
  400: '#f7c55a',  // Medium amber
  500: '#f3a833',  // Base amber
  600: '#d97706',  // Strong amber
  700: '#b45309',  // Dark amber
  800: '#92400e',  // Darker amber
  900: '#78350f',  // Darkest amber
}
```

### Secondary Colors (Purple/Violet)
```javascript
secondary: {
  50: '#faf7ff',   // Lightest lavender
  100: '#f3ebff',  // Light lavender
  200: '#e9d5ff',  // Soft purple
  300: '#d8b4fe',  // Light purple
  400: '#c084fc',  // Medium purple
  500: '#a855f7',  // Base purple
  600: '#9333ea',  // Strong purple
  700: '#7c3aed',  // Dark purple
  800: '#6b21a8',  // Darker purple
  900: '#581c87',  // Darkest purple
}
```

### Gold Colors (Accent/Luxury)
```javascript
gold: {
  50: '#fffdf7',   // Lightest gold
  100: '#fffbeb',  // Light gold
  200: '#fef3c7',  // Soft gold
  300: '#fde68a',  // Light gold
  400: '#fcd34d',  // Medium gold
  500: '#fbbf24',  // Base gold
  600: '#f59e0b',  // Strong gold
  700: '#d97706',  // Dark gold
  800: '#b45309',  // Darker gold
  900: '#92400e',  // Darkest gold
}
```

### Dark Colors (Backgrounds/Text)
```javascript
dark: {
  50: '#f8fafc',   // Almost white
  100: '#f1f5f9',  // Very light gray
  200: '#e2e8f0',  // Light gray
  300: '#cbd5e1',  // Medium light gray
  400: '#94a3b8',  // Medium gray
  500: '#64748b',  // Base gray
  600: '#475569',  // Dark gray
  700: '#334155',  // Darker gray
  800: '#1e293b',  // Very dark blue-gray
  900: '#0f172a',  // Darkest navy
}
```

## 🛠️ Usage Examples

### 1. For Tailwind CSS Projects
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fefdf9', 100: '#fef7ed', 200: '#fdecc8', 300: '#fbd997',
          400: '#f7c55a', 500: '#f3a833', 600: '#d97706', 700: '#b45309',
          800: '#92400e', 900: '#78350f',
        },
        secondary: {
          50: '#faf7ff', 100: '#f3ebff', 200: '#e9d5ff', 300: '#d8b4fe',
          400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7c3aed',
          800: '#6b21a8', 900: '#581c87',
        },
        gold: {
          50: '#fffdf7', 100: '#fffbeb', 200: '#fef3c7', 300: '#fde68a',
          400: '#fcd34d', 500: '#fbbf24', 600: '#f59e0b', 700: '#d97706',
          800: '#b45309', 900: '#92400e',
        },
        dark: {
          50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
          400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
          800: '#1e293b', 900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
}
```

### 2. CSS Variables (Any Framework)
```css
:root {
  /* Primary Colors */
  --primary-50: #fefdf9;
  --primary-100: #fef7ed;
  --primary-200: #fdecc8;
  --primary-300: #fbd997;
  --primary-400: #f7c55a;
  --primary-500: #f3a833;
  --primary-600: #d97706;
  --primary-700: #b45309;
  --primary-800: #92400e;
  --primary-900: #78350f;

  /* Secondary Colors */
  --secondary-50: #faf7ff;
  --secondary-100: #f3ebff;
  --secondary-200: #e9d5ff;
  --secondary-300: #d8b4fe;
  --secondary-400: #c084fc;
  --secondary-500: #a855f7;
  --secondary-600: #9333ea;
  --secondary-700: #7c3aed;
  --secondary-800: #6b21a8;
  --secondary-900: #581c87;

  /* Gold Colors */
  --gold-50: #fffdf7;
  --gold-100: #fffbeb;
  --gold-200: #fef3c7;
  --gold-300: #fde68a;
  --gold-400: #fcd34d;
  --gold-500: #fbbf24;
  --gold-600: #f59e0b;
  --gold-700: #d97706;
  --gold-800: #b45309;
  --gold-900: #92400e;

  /* Dark Colors */
  --dark-50: #f8fafc;
  --dark-100: #f1f5f9;
  --dark-200: #e2e8f0;
  --dark-300: #cbd5e1;
  --dark-400: #94a3b8;
  --dark-500: #64748b;
  --dark-600: #475569;
  --dark-700: #334155;
  --dark-800: #1e293b;
  --dark-900: #0f172a;

  /* Typography */
  --font-family: 'Inter', sans-serif;
}
```

### 3. JavaScript/TypeScript Object (React/Styled Components)
```typescript
// theme.ts
export const vybupTheme = {
  colors: {
    primary: {
      50: '#fefdf9', 100: '#fef7ed', 200: '#fdecc8', 300: '#fbd997',
      400: '#f7c55a', 500: '#f3a833', 600: '#d97706', 700: '#b45309',
      800: '#92400e', 900: '#78350f',
    },
    secondary: {
      50: '#faf7ff', 100: '#f3ebff', 200: '#e9d5ff', 300: '#d8b4fe',
      400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7c3aed',
      800: '#6b21a8', 900: '#581c87',
    },
    gold: {
      50: '#fffdf7', 100: '#fffbeb', 200: '#fef3c7', 300: '#fde68a',
      400: '#fcd34d', 500: '#fbbf24', 600: '#f59e0b', 700: '#d97706',
      800: '#b45309', 900: '#92400e',
    },
    dark: {
      50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
      400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
      800: '#1e293b', 900: '#0f172a',
    }
  },
  fonts: {
    sans: "'Inter', sans-serif",
  },
  gradients: {
    primary: 'linear-gradient(to right, #f3a833, #d97706)',
    secondary: 'linear-gradient(to right, #9333ea, #7c3aed)',
    gold: 'linear-gradient(to right, #fbbf24, #f59e0b)',
    text: 'linear-gradient(to right, #fcd34d, #fbbf24, #f59e0b)',
    background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #581c87)',
  },
  shadows: {
    glow: '0 0 20px rgba(251, 191, 36, 0.3)',
    luxury: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    goldGlow: '0 10px 40px rgba(251, 191, 36, 0.2)',
  }
} as const;

// Usage in styled-components
import styled from 'styled-components';
import { vybupTheme } from './theme';

const Button = styled.button`
  background: ${vybupTheme.gradients.gold};
  color: ${vybupTheme.colors.dark[900]};
  box-shadow: ${vybupTheme.shadows.goldGlow};
`;
```

### 4. SCSS Variables
```scss
// _vybup-theme.scss
$primary-50: #fefdf9;
$primary-100: #fef7ed;
$primary-200: #fdecc8;
$primary-300: #fbd997;
$primary-400: #f7c55a;
$primary-500: #f3a833;
$primary-600: #d97706;
$primary-700: #b45309;
$primary-800: #92400e;
$primary-900: #78350f;

$secondary-50: #faf7ff;
$secondary-100: #f3ebff;
$secondary-200: #e9d5ff;
$secondary-300: #d8b4fe;
$secondary-400: #c084fc;
$secondary-500: #a855f7;
$secondary-600: #9333ea;
$secondary-700: #7c3aed;
$secondary-800: #6b21a8;
$secondary-900: #581c87;

$gold-50: #fffdf7;
$gold-100: #fffbeb;
$gold-200: #fef3c7;
$gold-300: #fde68a;
$gold-400: #fcd34d;
$gold-500: #fbbf24;
$gold-600: #f59e0b;
$gold-700: #d97706;
$gold-800: #b45309;
$gold-900: #92400e;

$dark-50: #f8fafc;
$dark-100: #f1f5f9;
$dark-200: #e2e8f0;
$dark-300: #cbd5e1;
$dark-400: #94a3b8;
$dark-500: #64748b;
$dark-600: #475569;
$dark-700: #334155;
$dark-800: #1e293b;
$dark-900: #0f172a;

// Gradients
$gradient-primary: linear-gradient(to right, $primary-500, $primary-600);
$gradient-secondary: linear-gradient(to right, $secondary-600, $secondary-700);
$gradient-gold: linear-gradient(to right, $gold-500, $gold-600);
$gradient-text: linear-gradient(to right, $gold-400, $gold-500, $gold-600);
$gradient-background: linear-gradient(to bottom right, $dark-900, $dark-800, $secondary-900);

// Typography
$font-family-sans: 'Inter', sans-serif;
```

## 🎨 Component Classes (Vybup Style)

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(to right, #fbbf24, #f59e0b);
  background-hover: linear-gradient(to right, #f59e0b, #d97706);
  color: #000000;
  font-weight: 600;
  padding: 16px 32px;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
}

.btn-primary:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  background-hover: rgba(251, 191, 36, 0.1);
  color: #fcd34d;
  color-hover: #fde68a;
  font-weight: 600;
  padding: 16px 32px;
  border: 2px solid #fcd34d;
  border-hover: 2px solid #fde68a;
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* Luxury Button */
.btn-luxury {
  background: linear-gradient(to right, #9333ea, #7c3aed);
  background-hover: linear-gradient(to right, #7c3aed, #6b21a8);
  color: #ffffff;
  font-weight: 600;
  padding: 16px 32px;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
}

.btn-luxury:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

### Cards & Layouts
```css
/* Luxury Card */
.luxury-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.5));
  backdrop-filter: blur(12px);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
}

.luxury-card:hover {
  border-color: rgba(251, 191, 36, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(251, 191, 36, 0.1);
}

/* Container */
.container-custom {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 640px) {
  .container-custom { padding: 0 24px; }
}

@media (min-width: 1024px) {
  .container-custom { padding: 0 32px; }
}

/* Section Padding */
.section-padding {
  padding: 80px 0;
}

@media (min-width: 768px) {
  .section-padding { padding: 128px 0; }
}
```

### Text Effects
```css
/* Gradient Text */
.gradient-text {
  background: linear-gradient(to right, #fcd34d, #fbbf24, #f59e0b);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

/* Glow Text */
.glow-text {
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
}
```

## 🌈 Design Principles

### Color Usage Guidelines
- **Gold (#fbbf24 - #f59e0b)**: Primary actions, accents, highlights
- **Dark (#0f172a - #1e293b)**: Backgrounds, containers
- **Secondary Purple (#9333ea - #7c3aed)**: Secondary actions, variety
- **Gray (#64748b - #cbd5e1)**: Text, borders, disabled states

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900
- **Import**: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');`

### Common Gradients
```css
/* Background Gradients */
--gradient-hero: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #581c87 100%);
--gradient-card: linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%);

/* Button Gradients */
--gradient-gold: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
--gradient-purple: linear-gradient(90deg, #9333ea 0%, #7c3aed 100%);

/* Text Gradients */
--gradient-text: linear-gradient(90deg, #fcd34d 0%, #fbbf24 50%, #f59e0b 100%);
```

---

## 📋 Quick Reference

### Most Used Colors
- **Primary Gold**: `#fbbf24` (gold-500)
- **Dark Background**: `#0f172a` (dark-900)
- **Card Background**: `#1e293b` (dark-800)
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#cbd5e1` (dark-300)
- **Accent Purple**: `#9333ea` (secondary-600)
- **Border Gold**: `rgba(251, 191, 36, 0.2)`

### Font Sizes (Vybup Scale)
- **Hero**: `text-5xl md:text-7xl` (48px - 72px)
- **H1**: `text-4xl md:text-5xl` (36px - 48px)
- **H2**: `text-3xl md:text-4xl` (30px - 36px)
- **H3**: `text-2xl` (24px)
- **Body Large**: `text-lg md:text-xl` (18px - 20px)
- **Body**: `text-base` (16px)
- **Small**: `text-sm` (14px)

This complete theme export gives you everything you need to maintain Vybup's luxury brand aesthetic across all your React applications! 🎨✨
