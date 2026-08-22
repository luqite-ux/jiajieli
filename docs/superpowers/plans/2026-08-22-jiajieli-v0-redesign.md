# JIAJIELI v0 Full-Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current JIAJIELI frontend with a bright, premium v0-designed B2B inquiry website featuring three polished hero slides while preserving the verified catalog, tenant data, inquiry persistence, multilingual expansion, SEO, and production delivery chain.

**Architecture:** Generate and download a presentation-only Next.js frontend from v0, then integrate its visual system into the existing `luqite-ux/jiajieli` application rather than replacing the production data layer. New image assets live in the customer repository and R2; reusable client components own carousel and motion behavior, while async Server Components continue to fetch Supabase products and articles.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/Radix primitives, Embla Carousel, Lucide React, Supabase, Cloudflare R2, v0 Platform API, Vercel, Node test runner, ESLint 9.

**Spec:** `docs/superpowers/specs/2026-08-22-jiajieli-v0-redesign-design.md`

## Global Constraints

- English is the only enabled launch language; locale-aware reads and multilingual JSONB fields remain intact for future expansion.
- B2B inquiry only: no prices, cart, checkout, account registration, or online payment.
- Preserve tenant `a1471a06-d1a8-4fe8-a12d-59cc6fe2b12b`, 298 active products, seven categories, R2 galleries, real inquiry persistence, and the existing production domain.
- Do not publish unverified production counts, factory area, export share, years, patents, certifications, customers, awards, testing claims, or special qualifications.
- Prohibit warranty/guarantee terminology and equivalent service commitments in code, data, metadata, structured data, images, and every language.
- The third hero uses production equipment, not an unverified qualification or certificate.
- Footer copyright is dynamically rendered as `© <current year> Zhejiang Jiajie Plastic Co., Ltd. All rights reserved.` with normalized punctuation.
- All text/background combinations meet WCAG AA; animations respect `prefers-reduced-motion`.
- v0 may change presentation code only. Supabase, R2, tenant identity, admin authentication, DeepSeek, inquiries, GitHub, Vercel, Cloudflare, and environment variables remain under Codex control.

---

### Task 1: Produce and validate the three hero assets

**Files:**
- Create: `public/images/hero/product-bathroom.webp`
- Create: `public/images/hero/factory-line.webp`
- Create: `public/images/hero/production-equipment.webp`
- Create: `data/sources/jiajieli-hero-assets.json`
- Create: `tests/hero-assets.test.mjs`

**Interfaces:**
- Consumes: customer-supplied factory photos, official product images, and the image-generation prompt contract in the design spec.
- Produces: `HeroAssetManifest` entries `{ id, localPath, r2Key, subject, source, width, height, sha256 }[]` for Task 5.

- [ ] **Step 1: Write the manifest validation test**

```js
test('defines exactly three bright hero subjects without qualification claims', async () => {
  const manifest = JSON.parse(await readFile('data/sources/jiajieli-hero-assets.json', 'utf8'))
  assert.deepEqual(manifest.map((item) => item.id), ['product-bathroom', 'factory-line', 'production-equipment'])
  assert.equal(manifest.length, 3)
  for (const item of manifest) {
    assert.match(item.localPath, /^public\/images\/hero\/.+\.webp$/)
    assert.match(item.r2Key, /^tenants\/jiajieli\/hero\/.+\.webp$/)
    assert.doesNotMatch(JSON.stringify(item), /certificate|qualification|warrant|guarantee/i)
  }
})
```

- [ ] **Step 2: Run the test and confirm it fails before assets exist**

Run: `node --test tests/hero-assets.test.mjs`  
Expected: FAIL because `jiajieli-hero-assets.json` is missing.

- [ ] **Step 3: Generate or edit each banner separately**

Use the built-in image-generation tool once per asset with the following final subjects:

```text
product-bathroom: bright premium contemporary bathroom, JIAJIELI-style anti-slip bath mat as the focal product, clean commercial interior photography, wide website hero, natural daylight, restrained aqua and warm-white palette, usable negative space, no text, logo, badge, certificate, watermark, people, medical or safety claim

factory-line: edit a customer-supplied production-line photo; preserve plausible factory identity, equipment geometry, perspective and documentary nature; improve exposure, white balance, floor and equipment cleanliness, visual order and crop; wide bright commercial manufacturing photograph; remove incidental clutter only; add no workers, machines, scale, clean-room conditions, text, logos, certificates or watermark

production-equipment: bright orderly injection-molding production-equipment scene derived from customer factory evidence, modern commercial manufacturing photography, plausible machinery, clean aisle, soft daylight and controlled highlights, wide hero composition with usable negative space, no text, logos, certificates, claims, people or watermark
```

- [ ] **Step 4: Convert selected outputs to WebP and record immutable metadata**

Run a Sharp-based conversion to 1920×1080 WebP quality 86, preserving aspect ratio with a center/attention crop. Calculate SHA-256 and write the three manifest objects with exact final dimensions and source descriptions.

- [ ] **Step 5: Inspect all three final files**

Use the local image viewer on each WebP. Reject any dark, cluttered, distorted, text-bearing, logo-bearing, certificate-bearing, implausible, or visibly generated-looking output.

- [ ] **Step 6: Run the focused test and commit**

Run: `node --test tests/hero-assets.test.mjs`  
Expected: PASS with three validated entries.

```powershell
git add public/images/hero data/sources/jiajieli-hero-assets.json tests/hero-assets.test.mjs
git commit -m "feat: add polished JIAJIELI hero imagery"
```

### Task 2: Generate the full visual frontend in v0

**Files:**
- Create: `scripts/run-v0-redesign.mjs`
- Create: `data/sources/jiajieli-v0-redesign.json`
- Create: `tests/v0-redesign-source.test.mjs`
- Create locally then remove after integration: `.tmp/v0-jiajieli-redesign/`

**Interfaces:**
- Consumes: approved spec, current route inventory, official logo, and the three Task 1 assets.
- Produces: `{ projectId, chatId, versionId, webUrl, downloadedArchive, extractedDirectory, attachments }` with no token values.

- [ ] **Step 1: Write the v0 provenance test**

```js
test('records a complete downloaded v0 version without secrets', async () => {
  const record = JSON.parse(await readFile('data/sources/jiajieli-v0-redesign.json', 'utf8'))
  for (const key of ['projectId', 'chatId', 'versionId', 'downloadedArchive', 'extractedDirectory']) assert.ok(record[key])
  assert.equal(record.teamId, 'team_v0pxRIIzSUGJleUTRNSz6GS4')
  assert.doesNotMatch(JSON.stringify(record), /V0_(API_KEY|TOKEN)|Bearer\s/i)
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test tests/v0-redesign-source.test.mjs`  
Expected: FAIL because the provenance record is missing.

- [ ] **Step 3: Implement the v0 orchestration script**

`scripts/run-v0-redesign.mjs` must:

```js
// 1. Read V0_API_KEY or V0_TOKEN only from the approved project env files.
// 2. Create one project named "JIAJIELI Bright B2B Redesign".
// 3. Send the complete approved spec plus route, asset and data-boundary instructions.
// 4. Poll the chat until the version is complete.
// 5. Download the exact completed version and every referenced attachment.
// 6. Validate ZIP readability and required route files.
// 7. Write only non-secret ids and local paths to the provenance JSON.
```

The v0 prompt must require Home, About, Products, Product Detail, Manufacturing, OEM/ODM, Quality Control, FAQ, News, News Detail, and Contact; exact three-slide hero behavior; bright palette; larger logo; real inquiry CTAs; no prices; no fabricated claims; no backend replacement.

- [ ] **Step 4: Run v0 generation and download**

Run: `node scripts/run-v0-redesign.mjs generate`  
Expected: a completed v0 version, readable ZIP, readable attachment files, and extracted Next.js source under `.tmp/v0-jiajieli-redesign/`.

- [ ] **Step 5: Review the downloaded source before any deletion**

Confirm all required routes, logo references, carousel, responsive navigation, reduced-motion behavior, inquiry UI, and bright design tokens exist. Scan the download for forbidden terms and unverified statistics.

- [ ] **Step 6: Run the provenance test and commit**

Run: `node --test tests/v0-redesign-source.test.mjs`  
Expected: PASS with the approved team id and no secrets.

```powershell
git add scripts/run-v0-redesign.mjs data/sources/jiajieli-v0-redesign.json tests/v0-redesign-source.test.mjs
git commit -m "chore: capture JIAJIELI v0 redesign source"
```

### Task 3: Normalize the v0 design system and brand shell

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `components/site-header.tsx`
- Modify: `components/site-footer.tsx`
- Modify: `components/section-shell.tsx`
- Create: `lib/design-tokens.ts`
- Create: `tests/design-contract.test.mjs`

**Interfaces:**
- Consumes: selected v0 visual tokens and official `/images/logo.png`.
- Produces: shared CSS tokens, `designTokens`, enlarged responsive logo shell, normalized footer copyright, and section theme variants.

- [ ] **Step 1: Write static design-contract tests**

Test for explicit Home navigation, header logo height at least `h-10` desktop, footer logo height at least `h-10`, runtime year, official legal name, absence of price/cart/payment strings, and explicit light/dark foreground definitions.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `node --test tests/design-contract.test.mjs`  
Expected: FAIL on current logo sizing and missing redesigned tokens.

- [ ] **Step 3: Integrate normalized design tokens**

Define a bright warm-white/aqua/teal/coral system in `app/globals.css` and export its semantic names from `lib/design-tokens.ts`. Keep reusable motion durations and easing values in CSS variables.

- [ ] **Step 4: Rebuild the header and footer shell**

Use the official logo with preserved ratio, `h-10 sm:h-11` in the header and `h-10 sm:h-12` in the footer, sufficient width, home link, focus ring, and mobile maximum width. Keep the dynamic copyright with `company.legalName`.

- [ ] **Step 5: Run tests, lint, TypeScript, and commit**

Run: `node --test tests/design-contract.test.mjs && pnpm lint && pnpm exec tsc --noEmit`  
Expected: PASS.

```powershell
git add app/globals.css app/layout.tsx components/site-header.tsx components/site-footer.tsx components/section-shell.tsx lib/design-tokens.ts tests/design-contract.test.mjs
git commit -m "feat: establish bright JIAJIELI design system"
```

### Task 4: Build the accessible hero carousel

**Files:**
- Create: `components/home/hero-carousel.tsx`
- Create: `lib/hero-slides.ts`
- Create: `tests/hero-carousel.test.mjs`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: Task 1 hero URLs and Task 3 motion/design tokens.
- Produces: `HeroSlide` and `<HeroCarousel slides={heroSlides} />`.

```ts
export type HeroSlide = {
  id: 'product-bathroom' | 'factory-line' | 'production-equipment'
  image: string
  eyebrow: string
  title: string
  description: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  alt: string
}
```

- [ ] **Step 1: Write tests for exactly three compliant slides**

Assert ids, CTA destinations, no price/qualification/certification/forbidden service terms, and one production-equipment slide.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `node --test tests/hero-carousel.test.mjs`  
Expected: FAIL because `lib/hero-slides.ts` is missing.

- [ ] **Step 3: Implement slide data and the client carousel**

Use Embla with six-second autoplay, previous/next buttons, pagination, progress, pause on hover/focus, keyboard controls, ARIA live status, first-image priority, and reduced-motion handling. Keep overlays independent from content opacity.

- [ ] **Step 4: Replace the current homepage hero**

Keep `app/page.tsx` as an async Server Component and render the client carousel with static slide data before dynamic catalog sections.

- [ ] **Step 5: Run tests and commit**

Run: `node --test tests/hero-carousel.test.mjs && pnpm lint && pnpm exec tsc --noEmit`  
Expected: PASS.

```powershell
git add components/home/hero-carousel.tsx lib/hero-slides.ts tests/hero-carousel.test.mjs app/page.tsx
git commit -m "feat: add accessible three-slide homepage hero"
```

### Task 5: Rebuild homepage content and connect R2 hero assets

**Files:**
- Create: `components/home/category-showcase.tsx`
- Create: `components/home/product-showcase.tsx`
- Create: `components/home/oem-process.tsx`
- Create: `components/home/manufacturing-story.tsx`
- Modify: `app/page.tsx`
- Modify: `lib/factory-content.ts`
- Create: `scripts/upload-hero-assets.mjs`
- Create: `tests/home-content.test.mjs`

**Interfaces:**
- Consumes: `ProductCategory[]`, `Product[]`, `FaqItem[]`, `HeroAssetManifest`, existing inquiry form, and factory content.
- Produces: editorial category/product/manufacturing/process sections and stable public R2 hero URLs.

- [ ] **Step 1: Write homepage content-contract tests**

Assert the page fetches categories/products/news server-side, renders the real inquiry form, hides news when empty, imports all four focused homepage components, and contains no hard-coded statistics or commerce strings.

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test tests/home-content.test.mjs`  
Expected: FAIL because the focused components do not exist.

- [ ] **Step 3: Upload hero assets safely**

`scripts/upload-hero-assets.mjs` reads R2 credentials only from approved env files, uploads exactly the manifest keys under `tenants/jiajieli/hero/`, uses `image/webp`, and verifies each public URL with an HTTP HEAD request.

- [ ] **Step 4: Implement the editorial homepage sections**

Use asymmetric category composition, eight real selected products, application imagery, five-step OEM process, documented manufacturing photos, four neutral quality checkpoints, FAQ preview, conditional real news, and final inquiry area.

- [ ] **Step 5: Run focused and global checks, then commit**

Run: `node --test tests/home-content.test.mjs && pnpm test && pnpm lint && pnpm exec tsc --noEmit`  
Expected: PASS.

```powershell
git add components/home app/page.tsx lib/factory-content.ts scripts/upload-hero-assets.mjs tests/home-content.test.mjs
git commit -m "feat: redesign JIAJIELI homepage storytelling"
```

### Task 6: Apply the v0 visual system to every independent route

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `app/products/page.tsx`
- Modify: `app/products/[slug]/page.tsx`
- Modify: `app/manufacturing/page.tsx`
- Modify: `app/oem-odm/page.tsx`
- Modify: `app/quality-control/page.tsx`
- Modify: `app/faq/page.tsx`
- Modify: `app/news/page.tsx`
- Modify: `app/news/[slug]/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `components/product-card.tsx`
- Modify: `components/product-gallery.tsx`
- Modify: `components/inquiry-form.tsx`
- Create: `components/page-hero.tsx`
- Create: `tests/route-design-contract.test.mjs`

**Interfaces:**
- Consumes: Task 3 design shell, existing locale-aware data access, products, articles, factory assets, and inquiry API.
- Produces: independently composed pages sharing `PageHero` and approved tokens without sharing identical layouts.

- [ ] **Step 1: Write the route design-contract test**

Assert all ten route files exist, each has a canonical URL and one page-level H1 path, product detail retains JSON-LD and product-aware inquiry props, news supports empty state, and no page contains price/cart/payment or unverified claim terms.

- [ ] **Step 2: Run the test and confirm it fails on the new shared hero contract**

Run: `node --test tests/route-design-contract.test.mjs`  
Expected: FAIL because `components/page-hero.tsx` is missing and current pages do not use it.

- [ ] **Step 3: Implement the shared page hero and unique page compositions**

Use distinct image/copy arrangements by route while retaining shared color, typography, button, breadcrumb, and responsive rules. Keep Server Components for products and news queries; isolate only interactive UI as client components.

- [ ] **Step 4: Normalize product and inquiry presentation**

Preserve filters, pagination, gallery, specifications, features, applications, related products, form validation, product slug/name propagation, and real POST behavior. Remove no data capability during visual integration.

- [ ] **Step 5: Run all checks and commit**

Run: `pnpm test && pnpm lint && pnpm exec tsc --noEmit && pnpm build` with the exact production tenant env.  
Expected: PASS and every required route in the build table.

```powershell
git add app components lib tests/route-design-contract.test.mjs
git commit -m "feat: redesign all JIAJIELI inquiry pages"
```

### Task 7: Verify accessibility, responsiveness, imagery, and inquiry behavior

**Files:**
- Create: `docs/verification/2026-08-22-jiajieli-v0-redesign.md`
- Create: `tests/forbidden-content.test.mjs`

**Interfaces:**
- Consumes: complete local site and real tenant configuration.
- Produces: recorded desktop/mobile verification, contrast results, route checks, and forbidden-content results.

- [ ] **Step 1: Add the repository forbidden-content test**

Scan production source, static fallback data, metadata, structured-data code, and public textual assets while explicitly excluding the guard regex and negative test fixtures themselves.

- [ ] **Step 2: Run full automated verification**

Run: `pnpm test && pnpm lint && pnpm exec tsc --noEmit && pnpm build`  
Expected: all tests, lint, TypeScript and production build pass.

- [ ] **Step 3: Run real-browser desktop and mobile checks**

At 1440×900 and 390×844, inspect Home plus every static route, representative products from all seven categories, product detail UI states, news empty state, header, footer, carousel controls, form validation, focus states, and horizontal overflow. Record screenshots for the homepage/footer Logo and representative page states.

- [ ] **Step 4: Run contrast and runtime checks**

Use axe or Lighthouse when available, inspect browser console errors, broken images, lazy/eager behavior, motion reduction, H1 count, accessible names, and button/input boundaries. Fix all WCAG AA failures before recording PASS.

- [ ] **Step 5: Verify real inquiry persistence without sending customer-facing content**

Use a clearly labeled internal test inquiry only through an approved test path or database transaction. Confirm exact tenant insertion and product context; clean up the test record only after recording its id and result. Do not trigger an external email without action-time authorization.

- [ ] **Step 6: Scan tenant data and the generated Sitemap**

Scan exact-tenant products, articles, tenant settings, every Sitemap URL, all product details and all published news details for prohibited service terms. Verify 298 product URLs, zero fabricated news URLs, HTTPS 200 responses, canonical URLs, and no broken images.

- [ ] **Step 7: Commit the verification record**

```powershell
git add tests/forbidden-content.test.mjs docs/verification/2026-08-22-jiajieli-v0-redesign.md
git commit -m "test: verify JIAJIELI v0 redesign"
```

### Task 8: Validate admin translation extensibility

**Files:**
- Modify: `docs/verification/2026-08-22-jiajieli-v0-redesign.md`

**Interfaces:**
- Consumes: unified admin login, one existing product, one temporary unpublished article, DeepSeek server integration, multilingual JSONB columns.
- Produces: evidence that product and article one-click translation persists and remains editable.

- [ ] **Step 1: Confirm admin identity and language baseline**

Read back `admin_users`, `tenants.default_language`, and `tenants.supported_languages` for the exact tenant. Do not reset an existing password or create a duplicate administrator.

- [ ] **Step 2: Temporarily enable one additional language using the supported admin workflow**

Use a reversible target language such as Spanish and record the previous language configuration.

- [ ] **Step 3: Translate and save one product**

Open an existing product, invoke one-click translation from English to Spanish, make a small human edit, save, reopen, and confirm the translated `name_i18n`, `description_i18n`, `overview_i18n`, `features_i18n`, `applications_i18n`, and `advantages_i18n` values persist.

- [ ] **Step 4: Translate and save one unpublished article**

Create or use an unpublished test article, invoke one-click translation, make a small human edit, save, reopen, and confirm `title_i18n`, `excerpt_i18n`, and `content_i18n` persist. Keep it unpublished and remove the test article after evidence is recorded.

- [ ] **Step 5: Restore the original enabled-language configuration**

Restore the launch site to English-only while retaining the demonstrated schema and admin capability. Confirm the public site does not expose empty Spanish routes.

- [ ] **Step 6: Update verification evidence and commit**

```powershell
git add docs/verification/2026-08-22-jiajieli-v0-redesign.md
git commit -m "test: verify JIAJIELI translation workflow"
```

### Task 9: Push, deploy, verify production, and remove the v0 project

**Files:**
- Modify: `docs/verification/2026-08-22-jiajieli-v0-redesign.md`
- Remove after verified integration: `.tmp/v0-jiajieli-redesign/`

**Interfaces:**
- Consumes: verified local HEAD, v0 provenance record, company GitHub token, company Vercel project, production domain.
- Produces: matching GitHub `main`, READY Vercel Production, verified domain, deleted v0 project/chat, and clean local repository.

- [ ] **Step 1: Re-run the final verification suite**

Run tests, lint, TypeScript, production build, source/DB forbidden scans, browser checks, contrast checks, and Sitemap checks immediately before publishing.

- [ ] **Step 2: Verify the company GitHub identity and remote main SHA**

Read `GITHUB_TOKEN` only from `D:\Cursor\Grand\huanqiu-admin\_migrate-batch\.env`, call GitHub `GET /user`, require exact login `luqite-ux`, and query `luqite-ux/jiajieli` plus remote `main` through the API.

- [ ] **Step 3: Push through one-time Basic authentication**

Use `git -c credential.helper= -c "http.extraHeader=Authorization: Basic <temporary-base64>" push origin HEAD:main`. Never store the token in a remote, config, source file, or log.

- [ ] **Step 4: Verify Vercel and production domain**

Require the deployment commit SHA to equal local HEAD, Vercel status READY, aliases to include `jiajiebathmat.com` and `www.jiajiebathmat.com`, HTTPS 200, valid Cloudflare nameservers, correct DNS targets, and working production pages.

- [ ] **Step 5: Validate the v0 download one final time, then delete the complete v0 project**

Confirm the recorded ZIP and attachments exist, are readable, and all retained work is committed in `luqite-ux/jiajieli`. Delete the v0 project and all chats through the API, then query the v0 project list and chat endpoints to confirm absence.

- [ ] **Step 6: Remove temporary extraction data and update the record**

Remove only `.tmp/v0-jiajieli-redesign/` after validating its resolved absolute path is within this customer worktree. Update the verification document with deletion and deployment evidence.

- [ ] **Step 7: Commit final delivery evidence if changed and repeat push/deploy verification**

```powershell
git add docs/verification/2026-08-22-jiajieli-v0-redesign.md
git commit -m "docs: record JIAJIELI redesign delivery"
```

If this creates a new commit, push and verify Vercel again so production and `main` match the final recorded HEAD.

### Task 10: Clean the temporary customer worktree and branch

**Files:**
- Remove worktree after verification: `D:\Cursor\Grand\jiajieli-content-expansion`

**Interfaces:**
- Consumes: matching customer `main`, READY Production, verified tenant/R2/domain, retained commits, and no pending shared-admin changes.
- Produces: no temporary customer worktree or local/remote `codex/jiajieli-content-expansion` branch.

- [ ] **Step 1: Confirm cleanup preconditions**

Require a clean worktree, local HEAD equal remote `main`, Production equal local HEAD, no unpushed commits, and no shared `huanqiu-admin` changes stored in the customer branch.

- [ ] **Step 2: Remove the worktree from its parent repository**

From `D:\Cursor\Grand\jiajieli`, verify the resolved worktree path is exactly `D:\Cursor\Grand\jiajieli-content-expansion`, then run `git worktree remove D:\Cursor\Grand\jiajieli-content-expansion`.

- [ ] **Step 3: Delete the local temporary branch**

Run: `git branch -d codex/jiajieli-content-expansion`  
Expected: branch deleted because every retained commit is reachable from `main`.

- [ ] **Step 4: Query and remove a matching remote temporary branch only if it exists**

Use the verified `luqite-ux` token and GitHub API. Do not touch `main` or any unrelated branch.

- [ ] **Step 5: Re-read worktrees and branches**

Run: `git worktree list` and `git branch --list 'codex/jiajieli-content-expansion'`.  
Expected: no temporary worktree or branch remains.
