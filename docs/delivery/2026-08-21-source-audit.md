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

Product, image, content, database, and production verification results will be appended as each implementation task completes.
