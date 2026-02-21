# Section-Level Theming System

## Overview

This document describes the section-level theming system that allows individual sections to switch between light and dark themes by changing a single CSS class.

## Key Features

- **Single class toggle**: Change theme by adding `.section-theme-light` or `.section-theme-dark` to a section
- **Semantic tokens**: Use consistent naming (bg, fg, muted, card, border, pill) instead of raw colors
- **Independent of global theme**: Works regardless of the overall page theme setting.
- **Tailwind v4 compatible**: Uses CSS variables with HSL values and `@theme inline` 

## CSS Variables

The system provides six semantic tokens that are set differently for each theme:

| Token | Usage | Light Value | Dark Value |
|-------|-------|-------------|------------|
| `--section-bg` | Section background | Very light blue-grey | Deep navy |
| `--section-fg` | Primary text color | Deep navy | Light grey |
| `--section-muted` | Secondary/muted text | Medium grey | Light grey @ 70% |
| `--section-card` | Card/surface backgrounds | Pure white | Light @ 5% |
| `--section-border` | Borders and dividers | Light grey @ 70% | White @ 10% |
| `--section-pill` | Pill/badge backgrounds | Muted blue @ 20% | Light @ 5% |

## Usage

### 1. Apply Theme Class to Section

Add either `.section-theme-light` or `.section-theme-dark` to your section element:

```tsx
// Light section
<section className="section-theme-light py-24 bg-section-bg">
  {/* content */}
</section>

// Dark section
<section className="section-theme-dark py-24 bg-section-bg text-section-fg">
  {/* content */}
</section>
```

### 2. Use Semantic Tokens in Components

Replace hardcoded color utilities with semantic section tokens:

**Before:**
```tsx
<div className="bg-background text-foreground border-border/70">
  <h2 className="text-foreground">Title</h2>
  <p className="text-muted-foreground">Description</p>
</div>
```

**After:**
```tsx
<div className="bg-section-card text-section-fg border-section-border">
  <h2 className="text-section-fg">Title</h2>
  <p className="text-section-muted">Description</p>
</div>
```

### 3. Complete Token Mapping

| Old Pattern | New Token | Use Case |
|-------------|-----------|----------|
| `bg-background` | `bg-section-bg` | Section main background |
| `text-foreground` | `text-section-fg` | Primary headings and strong text |
| `text-muted-foreground` | `text-section-muted` | Secondary/body text |
| `bg-card` | `bg-section-card` | Card surfaces, raised panels |
| `border-border/70` | `border-section-border` | Borders, dividers |
| `bg-muted/20` | `bg-section-pill` | Subtle backgrounds for pills, badges |
| `bg-foreground` (dark) | `bg-section-bg` | Dark section background |
| `text-background` (dark) | `text-section-fg` | Dark section text |
| `bg-background/5` (dark) | `bg-section-card` or `bg-section-pill` | Dark section surfaces |
| `border-white/10` (dark) | `border-section-border` | Dark section borders |

## Examples

### Example 1: Light Process Section

```tsx
export function Process() {
  return (
    <section className="section-theme-light py-24 bg-section-bg">
      <div className="container">
        <h2 className="text-section-fg">How I work</h2>
        <p className="text-section-muted">Description text</p>
        
        <div className="border border-section-border bg-section-card p-6">
          <h3 className="text-section-fg">Step 1</h3>
          <span className="bg-section-pill border-section-border">Badge</span>
          <p className="text-section-muted">Details</p>
        </div>
      </div>
    </section>
  );
}
```

### Example 2: Dark Pricing Section

```tsx
export function Pricing() {
  return (
    <section className="section-theme-dark py-24 bg-section-bg text-section-fg">
      <div className="container">
        <div className="border border-section-border bg-section-pill">
          <span className="text-section-muted">Badge text</span>
        </div>
        
        <h2 className="text-section-fg">Pricing</h2>
        <p className="text-section-muted">Choose your plan</p>
        
        <div className="bg-section-card border-section-border">
          <h3 className="text-section-fg">Starter</h3>
          <p className="text-section-muted">Perfect for small projects</p>
        </div>
      </div>
    </section>
  );
}
```

## Benefits

1. **Maintainability**: Change theme by modifying one class instead of dozens of utilities
2. **Consistency**: Semantic tokens ensure consistent color usage across components
3. **Flexibility**: Easy to add new theme variants or modify existing ones
4. **No Global Impact**: Section themes work independently of site-wide dark mode
5. **Type Safety**: Component-level tokens prevent mixing incompatible colors

## Adding New Theme Variants

To add a new theme variant (e.g., `.section-theme-accent`):

1. Add the class definition in `globals.css`:

```css
.section-theme-accent {
  --section-bg: 217 91% 60%;      /* Bright blue */
  --section-fg: 0 0% 100%;        /* White text */
  --section-muted: 0 0% 100% / 0.8;
  --section-card: 0 0% 100% / 0.1;
  --section-border: 0 0% 100% / 0.2;
  --section-pill: 0 0% 100% / 0.05;
}
```

2. Use it on any section:

```tsx
<section className="section-theme-accent py-24 bg-section-bg text-section-fg">
  {/* content automatically styled with accent theme */}
</section>
```

## Migration Guide

When converting existing sections:

1. Add `.section-theme-light` or `.section-theme-dark` to the `<section>` element
2. Replace `bg-background` → `bg-section-bg`
3. Replace `text-foreground` → `text-section-fg`
4. Replace `text-muted-foreground` → `text-section-muted`
5. Replace `bg-card` → `bg-section-card`
6. Replace `border-border/*` → `border-section-border`
7. Replace `bg-muted/*` or `bg-background/*` (for pills) → `bg-section-pill`
8. Test the section in both themes to verify appearance

## Compatibility

- ✅ Tailwind CSS v4
- ✅ Next.js 16+
- ✅ Works with existing global dark mode
- ✅ Compatible with HSL color system
- ✅ Supports opacity modifiers (e.g., `text-section-fg/80`)
