# JIAJIELI Content Expansion Source Audit

## Delivery scope

- Customer: 浙江佳洁塑胶有限公司
- Brand: JIAJIELI
- Production domain: `https://jiajiebathmat.com`
- Customer repository: `luqite-ux/jiajieli`
- Tenant ID: `a1471a06-d1a8-4fe8-a12d-59cc6fe2b12b`
- Alibaba source: `https://jiajie.en.alibaba.com/zh_CN/company_profile.html`
- Factory image source: customer-provided archive `浙江佳洁塑胶 新增工厂图片.rar`

## Baseline

- Verified GitHub owner: `luqite-ux`
- Verified remote `main`: `5280a9e93e448ea16e978bd90850575dbb687ad3`
- Isolated branch: `codex/jiajieli-content-expansion`
- `pnpm install --frozen-lockfile`: passed on 2026-08-21.
- Initial `pnpm lint`: failed because the repository declared `eslint .` without `eslint`, `eslint-config-next`, or a flat ESLint configuration.
- Baseline repair: add ESLint 9, matching Next.js 16.2.6 configuration, and rerun lint/build before content changes.

## Source rules

- Publish only facts traceable to the Alibaba source, customer archive, or already verified customer records.
- Exclude prohibited service-promise terms in every language and every content layer.
- Keep a source URL, capture timestamp, content hash, and image provenance for every imported product.
- Treat duplicate Alibaba listings as source records to reconcile, not as separate products by default.

## Audit results

### Alibaba catalog capture

- Capture timestamp: `2026-08-21T11:51:51.734Z`
- Advertised public product count: 342
- Public product-list pages captured: 22 of 22
- Unique Alibaba product IDs captured: 342
- Duplicate Alibaba product IDs: 0
- Exact normalized duplicate titles: 3 groups; these require business-level reconciliation rather than automatic ID deletion.
- Source image references: 7,288 before image-size and hash deduplication.
- Source group distribution: 121 ungrouped; 95 in `827489371`; 84 in `827470310`; 18 in `827210554`; 7 each in `827416846` and `827724478`; 5 each in `827301973` and `828986461`.
- The capture manifest excludes price/MOQ as publishable product specifications because those values are time-sensitive commercial terms.

Product detail, image, content, database, and production verification results will be appended as each implementation task completes.

### Image processing and R2

- Product image references selected after URL normalization: 1,704 across 342 source listings, with at most five per listing.
- Factory images processed: 6 of 6.
- Output format: WebP, sRGB, EXIF orientation corrected, maximum 1600×1600 without enlargement.
- Invalid local outputs: 0.
- Total local processed size: 145,111,060 bytes before hash deduplication.
- Unique product output hashes: 1,017; duplicate physical product images avoided: 687.
- Unique R2 uploads: 1,023, including six stable factory-role objects.
- Public verification: all six factory URLs plus representative first/middle/last product URLs returned HTTP 200 with `image/webp` content type and matching content length.
- Physical asset namespace: `tenants/jiajieli/catalog/shared/` and `tenants/jiajieli/factory/`; no other tenant namespace was written.

### Catalog import

- Conservative business merge rule: same primary image hash, same title-derived material, and same title-derived size.
- Source listings: 342.
- Active imported products: 298.
- Merged source links retained in provenance: 44 across 36 consolidated products.
- Active buyer-facing categories: 7.
- Old demo products deactivated: 8, limited to the exact tenant and known `delivery_key` values.
- Old launch categories deactivated: 7, limited to the exact tenant and known legacy slugs.
- Database readback: 298 active products and 7 active categories; every row belongs to tenant `a1471a06-d1a8-4fe8-a12d-59cc6fe2b12b`.
- Tenant readback: `admin_group=2`, `default_language=en`, `supported_languages=[en]`.
- Products with no material explicitly present in the public title: 25; material remains unset instead of being inferred.

### Production data layer

- Root cause of the eight-product fallback: the old product query requested nonexistent `gallery` and `material` columns, while the old category query requested nonexistent `image_url`; both errors were swallowed and replaced with demo data.
- Correct source fields: product gallery from `extra_data.images`, material from `specs.Material`, category image from the first active product image, and category relation from `category_slug`.
- Demo product fallback removed; a query failure can no longer silently republish unverified launch content.
- Locale resolution implemented as requested locale → default locale → first nonempty locale → explicit fallback.
- Local production build passed with temporary environment injection from the approved local env source; no secrets were written to the worktree.
