---
name: Nirvik Intelligence System
colors:
  surface: '#f5fafa'
  surface-dim: '#d6dbdb'
  surface-bright: '#f5fafa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f5f4'
  surface-container: '#eaefef'
  surface-container-high: '#e4e9e9'
  surface-container-highest: '#dee3e3'
  on-surface: '#171d1d'
  on-surface-variant: '#43474b'
  inverse-surface: '#2c3132'
  inverse-on-surface: '#edf2f2'
  outline: '#73777c'
  outline-variant: '#c3c7cc'
  surface-tint: '#4e616f'
  primary: '#10232f'
  on-primary: '#ffffff'
  primary-container: '#263845'
  on-primary-container: '#8ea1b1'
  inverse-primary: '#b6c9d9'
  secondary: '#964900'
  on-secondary: '#ffffff'
  secondary-container: '#fd974e'
  on-secondary-container: '#6d3300'
  tertiary: '#182227'
  on-tertiary: '#ffffff'
  tertiary-container: '#2e373d'
  on-tertiary-container: '#96a0a7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e5f6'
  primary-fixed-dim: '#b6c9d9'
  on-primary-fixed: '#0a1d2a'
  on-primary-fixed-variant: '#374956'
  secondary-fixed: '#ffdcc7'
  secondary-fixed-dim: '#ffb787'
  on-secondary-fixed: '#311300'
  on-secondary-fixed-variant: '#723600'
  tertiary-fixed: '#dae4eb'
  tertiary-fixed-dim: '#bec8cf'
  on-tertiary-fixed: '#131d22'
  on-tertiary-fixed-variant: '#3e484e'
  background: '#f5fafa'
  on-background: '#171d1d'
  surface-variant: '#dee3e3'
typography:
  page-title:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  section-heading:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  metadata:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 240px
  gutter: 16px
  margin-page: 24px
  panel-padding: 16px
  stack-tight: 8px
  stack-md: 12px
---

## Brand & Style

The design system is engineered for high-stakes intelligence environments, prioritizing clarity, authority, and rapid data synthesis. It eschews decorative flourishes in favor of a **Corporate Modern** aesthetic that feels like a precision instrument rather than a consumer application.

The visual narrative is "Restrained Power." By using a muted, institutional palette of Light Grey and Dark Navy, we create a calm environment for complex investigative work. The strategic use of Orange acts as a signal fire—drawing the eye immediately to critical AI insights, criminal links, or system alerts. 

The interface should feel architectural: structured, reliable, and deeply functional. It is designed to foster trust among law enforcement professionals through rigorous alignment, information density without clutter, and a deliberate absence of trend-driven styling.

## Colors

The color system is tiered to facilitate a clear visual hierarchy between the application framework and the data intelligence layer.

- **Primary (Dark Navy - #263845):** Used for structural elements like the sidebar and top navigation. It serves as the "anchor" of the application, representing stability and authority.
- **Secondary (Orange - #FF994F):** Reserved strictly for action and attention. Use this for primary CTAs, active status indicators, and critical nodes in link-analysis graphs.
- **Tertiary (Grey - #BFC9D0):** Used for secondary UI elements including borders, inactive tabs, and subtle background panels to distinguish between content areas.
- **Neutral (Light - #EAEFEF):** The primary canvas color. It provides a soft, low-strain background for long-duration monitoring and investigative reading.

## Typography

This design system utilizes **Inter** exclusively to ensure maximum legibility across dense data tables and complex node maps. 

- **Scale & Contrast:** Large headings are used sparingly to maintain a professional, workstation feel. Most interface text resides in the 13-14px range to maximize the amount of information visible on screen.
- **Metadata & Labels:** Use the `metadata` and `label-caps` roles for timestamps, ID numbers, and category tags. These levels use a slightly heavier weight to remain legible at smaller sizes.
- **Color Application:** Use Dark Navy for all headings and primary body text. Use a 60% opacity of Dark Navy for secondary body text and metadata to maintain hierarchy without introducing a new color palette.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid model**. The navigation sidebar is fixed at 240px, while the content canvas is fluid to accommodate wide data tables and expansive intelligence graphs.

- **Information Density:** Spacing is intentionally tight (8px and 12px increments) to suit a professional workstation environment where users need to see as much data as possible without scrolling.
- **Content Panels:** Information is grouped into cards or panels. Use a 16px gutter between panels to prevent the interface from feeling cramped.
- **Breakpoints:** 
  - **Desktop (1440px+):** Full multi-column view with persistent sidebar and inspector panels.
  - **Tablet (1024px):** Sidebar collapses to icons; inspector panels become overlays.

## Elevation & Depth

This design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows to indicate depth. This ensures the UI feels "flat" and integrated, like a high-end dashboard.

- **Base Layer:** The application background uses the Neutral (#EAEFEF) color.
- **Surface Layer:** Primary content panels use a white background with a 1px border of Tertiary (#BFC9D0).
- **Shadows:** Use a single "Soft Lift" shadow for floating elements like dropdowns or tooltips: `0px 4px 12px rgba(38, 56, 69, 0.08)`. Avoid using shadows on standard page panels.
- **Interactive States:** When a panel or node is selected, replace the standard border with a 2px Orange (#FF994F) stroke.

## Shapes

The shape language balances the clinical nature of the work with modern accessibility.

- **Standard Radius:** 0.5rem (8px) is the default for buttons, input fields, and small UI components.
- **Panel Radius:** 1rem (16px) is used for main content containers and cards to provide a distinct structural definition.
- **Graph Nodes:** Use circles for entities (People, Locations) and rounded rectangles for events or documents to differentiate data types at a glance.
- **Icons:** Use 1.5px or 2px stroke-based icons. Avoid filled icons unless used for the active state in the sidebar navigation.

## Components

- **Sidebar:** Dark Navy background. Navigation items should have a hover state of 10% white opacity. Active items use an Orange left-border (4px) and white text.
- **Primary Buttons:** Solid Orange background with white text. High-contrast, sharp definition.
- **Secondary Buttons:** Dark Navy border (1px) with Dark Navy text. For low-priority actions.
- **Input Fields:** White background, 1px Grey (#BFC9D0) border. On focus, the border changes to Dark Navy.
- **Graph Nodes:** Dark Navy icons/text. If a node is "Flagged" by AI, it gains an Orange outer glow and an Orange alert badge.
- **Data Tables:** Use a 1px Grey horizontal divider between rows. Zebra striping is not required; use a light hover state on the entire row instead.
- **Intelligence Chips:** Small, rounded-pill tags used for case status (e.g., "Active," "Closed," "High Priority"). Use a Dark Navy background with white text for standard tags and Orange for high-priority alerts.