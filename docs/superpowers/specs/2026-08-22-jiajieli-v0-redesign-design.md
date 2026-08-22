# JIAJIELI v0 Full-Site Redesign

Date: 2026-08-22  
Customer: 浙江佳洁塑胶有限公司 / Zhejiang Jiajie Plastic Co., Ltd.  
Brand: JIAJIELI  
Production domain: `https://jiajiebathmat.com`  
Delivery repository: `luqite-ux/jiajieli`

## 1. Objective

Redesign the complete English B2B inquiry website in v0, replacing the current generic card-heavy presentation with a bright, premium product-and-manufacturing visual system. The redesign must improve perceived product quality, factory credibility, catalog discovery, mobile usability, and inquiry conversion without changing verified business facts or the existing production data architecture.

v0 is the visual-design and frontend-generation source only. Codex remains responsible for integrating the approved frontend with the existing Supabase tenant, R2 assets, inquiry API, multilingual JSONB fields, GitHub repository, Vercel project, domain, and verification workflow.

## 2. Reference Direction

The internal manufacturing-site case library was reviewed on 2026-08-22. The redesign may learn from, but must not copy, these patterns:

- Fibocom and Goertek, design score 90: large visual storytelling, restrained typography, clear navigation, and polished transitions.
- DOBOT, design score 88: strong equipment imagery, technology-led composition, and confident motion.
- Lianyi Bags, Kangye International, and Langdeng Sanitary Ware, design score 85: clear OEM/ODM paths, product evidence, factory credibility, and B2B contact architecture.

No text, claims, certifications, layouts, images, or brand assets may be copied from reference companies.

## 3. Visual Direction

The chosen direction is **bright international home-product editorial design with documented manufacturing evidence**.

### Palette

- Warm white and pale aqua as primary backgrounds.
- Clear turquoise and deep teal for brand actions and legible foregrounds.
- Restrained coral or warm orange for highlights and active states.
- Light gradients, translucent layers, water-inspired texture, and real photography replace large flat-color surfaces.
- Dark sections are limited and must use explicit white or high-contrast foreground tokens.

### Typography and spacing

- Strong editorial headings with shorter line lengths than the current homepage.
- Calm, readable body copy with clear hierarchy and generous whitespace.
- Consistent radii, borders, shadows, button shapes, and icon stroke weight.
- Avoid dense grids, repetitive small cards, oversized statistics, template-like badges, and decorative effects without a conversion purpose.

### Logo and favicon

- Use only the customer's supplied official JIAJIELI logo.
- Increase the visible header logo approximately 1.5 times while preserving its aspect ratio and home link.
- Increase the footer logo approximately 1.25–1.5 times after checking actual transparent padding.
- Create the favicon from the official logo asset; do not invent or redraw a new brand mark.
- Verify desktop and mobile clarity, surrounding spacing, contrast, focus state, and click target.

## 4. Homepage Architecture

### 4.1 Header

- Sticky light header with subtle translucency and blur after scroll.
- Explicit Home link plus About Us, Products, Manufacturing, OEM/ODM, Quality Control, FAQ, News, and Contact.
- Persistent Request a Quote action.
- Mobile drawer retains all navigation and CTA entries.

### 4.2 Three-slide hero carousel

The hero uses three wide, bright, polished raster images. Text and buttons are HTML overlays, never baked into the images.

1. **Product in use** — a clean contemporary bathroom showing a bath or shower mat as the focal product.
2. **Factory line** — customer-supplied factory evidence enhanced with AI for brightness, cleanliness, color balance, and visual order while preserving plausible equipment and site identity.
3. **Production equipment** — a clean modern production-equipment scene. This replaces the optional qualification/certificate concept because no special qualification has been verified.

Carousel behavior:

- Approximately six seconds per slide.
- Slow image scale and layered text entrance.
- Previous/next controls, pagination indicators, and progress display.
- Pause on hover and when controls receive focus.
- Keyboard accessible controls and descriptive accessible names.
- Respect `prefers-reduced-motion` and avoid autoplay animation for users requesting reduced motion.
- Recompose or crop each image for mobile rather than merely shrinking the desktop frame.
- Maintain readable foreground contrast using an independent gradient/overlay layer with `pointer-events-none`.

### 4.3 Product-category discovery

Use an editorial composition rather than an equal card wall: one visually dominant category and supporting staggered category tiles. Categories come from the verified seven-category catalog and link to filtered product listing URLs.

### 4.4 Selected products

- Use real R2 product images and real product records.
- Show name, material when available, and category; never show price.
- Provide View Details and Send Inquiry affordances.
- Product cards link to independent product detail pages.

### 4.5 Application scenes

Use bright, plausible scenes for bathroom, shower, sink, family/children, and entryway contexts. Application imagery must not imply unverified safety, certification, medical, antibacterial, or performance claims.

### 4.6 OEM/ODM process

Use a horizontal or alternating process narrative:

1. Product Selection
2. Specification Review
3. Sample or Reference Review
4. Order and Production Alignment
5. Inspection and Packing

The process may animate progressively on scroll but must remain understandable with animation disabled.

### 4.7 Manufacturing evidence

Use customer-supplied factory images after appropriate visual cleanup. Present a large lead image with supporting details rather than a repetitive gallery. Copy is limited to observable facts and order-specific processes.

### 4.8 Quality-control summary

Use four neutral order-oriented checkpoints: Requirement Review, Appearance Check, Size & Detail Check, and Packing Check. Do not show invented laboratories, test instruments, standards, badges, or certificates.

### 4.9 FAQ and news

- FAQ uses real sourcing questions and links to the full FAQ page.
- If no verified news is published, the homepage news area remains hidden and the news page uses a concise empty state.
- Once real news is published through the backend, cards show both publication date and title.

### 4.10 Inquiry close

End the homepage with a bright image-backed inquiry section using an independent accessible overlay. It uses the same real inquiry workflow as product and contact pages.

## 5. Independent Pages

Every route remains independently designed and indexable:

- Home
- About Us
- Products
- Product Detail
- Manufacturing
- OEM/ODM
- Quality Control
- FAQ
- News
- News Detail
- Contact

Each page needs its own hero composition, metadata, canonical URL, meaningful H1, breadcrumb where appropriate, mobile layout, and B2B CTA. Shared brand tokens and components provide consistency without making every page visually identical.

## 6. Product and Inquiry Experience

- B2B inquiry only: no price, cart, checkout, account registration, or online payment.
- Product listing preserves keyword, category, material, and pagination behavior.
- Product detail preserves real gallery, specifications, features, applications, related products, metadata, and Product structured data.
- Product-page inquiries automatically carry the product slug and name.
- All CTAs converge on the existing real inquiry form and Supabase insert flow.
- Inquiry success and error states remain inline, accessible, and readable.

## 7. Motion System

Use restrained, premium motion:

- Hero background scale and text layering.
- Section reveal with small translate and opacity changes.
- Product-media hover scale and subtle CTA reveal.
- OEM/ODM process progress animation.
- Header state transition on scroll.

Avoid particle fields, aggressive parallax, cursor effects, flashing, continuous decorative motion, and heavy 3D. Animations must preserve Core Web Vitals and be disabled or simplified under reduced-motion preferences.

## 8. Image Production

Three final hero assets are required in a consistent bright commercial-photography style. They must be generated or edited with the built-in image-generation workflow and saved into the customer repository before v0 generation.

Factory edits must preserve site identity, plausible equipment geometry, and the documentary nature of the source. Permitted changes include exposure, white balance, color, local contrast, clutter removal, cropping, and visual cleanup. They must not add workers, machines, certificates, production scale, clean-room conditions, logos, or capabilities that are not present.

All hero assets must:

- contain no embedded text, logo, certification mark, or watermark;
- provide sufficient negative space for HTML copy;
- support desktop and mobile crops;
- remain bright and orderly without appearing unrealistically sterile;
- be optimized for web delivery and uploaded to the customer's R2 namespace before production.

## 9. Content and Compliance Constraints

- English is the only enabled launch language.
- Preserve locale-aware data access and multilingual JSONB fields so additional languages can be enabled later without schema or route redesign.
- Use only customer source material, verified Alibaba catalog facts, customer-supplied imagery, and already audited tenant data.
- Do not publish unverified production counts, factory area, export share, years, patents, certifications, customers, awards, or testing claims.
- Prohibit all warranty/guarantee terminology and equivalent service commitments across code, data, media, metadata, structured data, and every future language.
- Do not invent special qualifications. The third hero uses production equipment unless the customer later supplies verifiable qualification evidence.
- Footer copyright must be dynamically rendered as `© <current year> Zhejiang Jiajie Plastic Co., Ltd. All rights reserved.` with no duplicated terminal punctuation.

## 10. Accessibility, Contrast, and Performance

- WCAG AA contrast: 4.5:1 for normal text, 3:1 for large text and interactive boundaries.
- Explicit foreground tokens for every light and dark section.
- Visible keyboard focus, accessible carousel labels, correct heading order, alt text, and touch targets.
- Images use responsive sizing, modern formats, lazy loading outside the first hero, and an eager first hero asset.
- Avoid layout shift by reserving image and carousel dimensions.
- Verify hover, focus, active, disabled, validation, and carousel states.

## 11. v0 Generation and Integration Boundary

v0 receives:

- this approved design specification;
- the current route inventory and frontend source;
- the official logo and prepared banner assets;
- representative real product and factory assets;
- explicit B2B, compliance, language, contrast, and responsive constraints.

v0 may redesign layout, typography, interaction, Tailwind styles, and presentation components. It must not configure or replace Supabase, R2, tenant identity, admin authentication, DeepSeek, inquiry persistence, GitHub, Vercel, Cloudflare, or production environment variables.

After generation:

1. Download the complete source version and all attachments.
2. Verify the archive opens and required assets are readable.
3. Delete the complete v0 project and all chats, then verify they are absent.
4. Integrate the visual source into `luqite-ux/jiajieli` while retaining the production data layer.
5. Run tests, lint, TypeScript, build, contrast checks, responsive screenshots, inquiry verification, forbidden-term scans, and full Sitemap verification.
6. Push through the verified `luqite-ux` GitHub token workflow and deploy the existing company Vercel project.

## 12. Acceptance Criteria

- The design feels bright, premium, orderly, and product-led on desktop and mobile.
- Header and footer logos are clearly legible and correctly proportioned.
- The homepage contains exactly three polished hero slides matching the approved subjects.
- No hero uses dirty, cluttered, dark, misleading, or unverified qualification imagery.
- Every required route is independently designed and connected to real content.
- All product and contact CTAs use the real inquiry workflow; no commerce UI appears.
- Existing 298 active products, seven categories, R2 galleries, locale fallbacks, tenant isolation, news behavior, and SEO data continue to work.
- No prohibited service promise or unverified claim exists in source, tenant data, or production pages.
- Production passes automated tests, build, browser verification, contrast review, mobile/desktop screenshot review, HTTPS, Sitemap, and deployment checks.
