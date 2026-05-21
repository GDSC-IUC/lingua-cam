# Design System Specification: The Vibrant Griot

## 1. Overview & Creative North Star
The digital landscape is often cluttered with rigid grids and clinical borders. This design system breaks away from that "template" aesthetic to embrace a **Creative North Star: The Vibrant Griot.** 

A Griot is a West African storyteller, a repository of oral tradition. This system functions as a modern, digital storyteller. We move beyond standard UI by treating the interface as a **Tonal Tapestry**. Instead of boxes and lines, we use organic shapes, intentional asymmetry, and deep tonal layering to guide the user’s eye. This approach is specifically curated for Cameroon’s diverse linguistic landscape, prioritizing high visual-to-text ratios to ensure the experience is inclusive for low-literacy users while maintaining an award-winning, editorial high-end feel.

## 2. Colors: The Tonal Tapestry
The palette is a sophisticated evolution of the Cameroonian flag, utilizing a "warm-earth" foundation to prevent the vibrant primary colors from feeling overwhelming.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. A section should be distinguished by moving from `surface` to `surface-container-low` or `surface-container-highest`. Lines create visual noise; tonal shifts create harmony.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of hand-pressed paper. 
- **Base Layer:** `surface` (#d6fff4).
- **Secondary Content:** `surface-container-low` (#bcfeee).
- **Floating Interactive Elements:** `surface-container-lowest` (#ffffff).
By nesting these tiers, we create "soft" hierarchy. For example, a vocabulary card should sit as a `surface-container-lowest` element on a `surface-container` background.

### The Glass & Gradient Rule
To move beyond "flat" design, use Glassmorphism for floating navigation and overlay modals. Use `surface_variant` with a 60% opacity and a `20px` backdrop blur. 
- **Signature Gradients:** For primary CTAs, use a subtle linear gradient from `primary` (#006850) to `primary_container` (#90efcd) at a 135-degree angle. This adds "soul" and depth to the interaction.

## 3. Typography: Editorial Clarity
We utilize **Plus Jakarta Sans** for its friendly, approachable curves that mimic the rounded nature of traditional Cameroonian motifs.

- **Display Scales (`display-lg` to `display-sm`):** Reserved for singular, high-impact words or numbers. These should be treated as "Art Elements" rather than just text.
- **Headline Scales (`headline-lg` to `headline-sm`):** Used for lesson titles. Pair these with high-contrast imagery to anchor the page.
- **Body & Labels:** In low-literacy contexts, body text is secondary. Use `body-lg` for short, punchy instructions and `label-md` for metadata. 

**The Hierarchy Rule:** Never use more than 10 words per screen for primary learning paths. Let the typography's scale and color (`on_surface`) do the heavy lifting of instruction.

## 4. Elevation & Depth: Atmospheric Weight
Traditional shadows are often "dirty" (black/grey). In this design system, depth is achieved through **Tonal Layering** and **Ambient Light**.

- **The Layering Principle:** Depth is "stacked." To elevate an element, change its surface token rather than adding a shadow first.
- **Ambient Shadows:** When a "floating" effect is necessary (e.g., for a "Play Audio" button), shadows must be extra-diffused. 
    - **Blur:** 24px - 40px.
    - **Opacity:** 6% - 10%.
    - **Color:** Use a tinted shadow based on `on_surface` (#00362e) to ensure the shadow feels like a natural part of the environment.
- **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in a high-glare environment), use the `outline_variant` token at **15% opacity**. Never use a 100% opaque border.

## 5. Components: Tactile Interactivity

### Buttons
- **Primary:** Pill-shaped (`rounded-full`), utilizing the Signature Gradient. Large padding (1.5rem horizontal).
- **Secondary:** `surface-container-highest` background with `on_primary_container` text. 
- **Tertiary:** Ghost style—no background, just `primary` text with a `rounded-md` shape.

### Cards & Lists
- **The No-Divider Rule:** Explicitly forbid horizontal divider lines. Use `1.5rem` to `2rem` of vertical whitespace to separate items.
- **Visual-First Cards:** Cards should prioritize an image or icon (60% of card area) over text. Use `surface-container-low` for the card body.

### Inputs & Selection
- **Inputs:** Use `surface_container_highest` with a `rounded-md` corner. No borders. The focus state is a subtle `primary` glow.
- **Chips:** For language selection, use `tertiary_fixed` (#fbd115) for the selected state to provide a warm, sun-drenched highlight that contrasts against the green base.

### Custom App Components
- **The Progress Orb:** Instead of a flat progress bar, use a series of overlapping circles in `secondary` (#ba001e) and `tertiary` (#6e5a00) that fill with color as the user learns.
- **Audio Visualizers:** Large, rounded vertical bars using `primary_fixed` to indicate spoken word playback.

## 6. Do's and Don'ts

### Do:
- **Do** use intentional asymmetry. Place a large image off-center to create a modern, editorial feel.
- **Do** leverage the high-contrast typography scale. Make your headlines significantly larger than body text.
- **Do** use the `secondary` (#ba001e) red sparingly as a "heartbeat" color for errors or critical feedback.

### Don't:
- **Don't** use 1px solid dividers or borders.
- **Don't** use pure black for shadows. Use the tinted `on_surface` (#00362e) shadow.
- **Don't** overcrowd the screen. If a user can't understand the screen's intent through icons alone, there is too much text.
- **Don't** use "Default" roundedness (4px-8px). Commit to the scale: use `lg` (2rem) or `xl` (3rem) to maintain the friendly, bespoke Cameroonian aesthetic.