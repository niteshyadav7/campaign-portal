# 1to7 Media Portal — Professional Design Overhaul

Transform the portal from its current state into a calm, premium, trustworthy SaaS operations product. The codebase is already well-structured — this is a polish pass, not a rewrite.

## Current State Assessment

The codebase already has strong foundations:
- ✅ Font stack (`Inter`, `Aptos`, `Segoe UI Variable`) is correctly defined
- ✅ Color palette is mostly aligned (emerald/teal/sky/amber accents)
- ✅ GSAP animations exist with reduced-motion guards
- ✅ Component library (`premium-ui.tsx`) centralizes shared patterns
- ✅ Login page has split layout with floating cards

**Key gaps to close:**
- `font-semibold` and `font-bold` are overused where `font-medium` would be calmer
- Login right panel has excessive layered containers (borders-inside-borders)
- Some badges use `font-bold` instead of `font-medium`
- Table custom field badges use heavy styling
- Eyebrow labels use `font-semibold` at 11px uppercase — feels loud
- Sidebar has nested card-in-card pattern in the branding area

---

## Proposed Changes

### Step 1 — Login Page Polish

The login page is close but has visual noise from too many layered borders and containers on the right panel. The form feels "pasted" rather than integrated.

#### [MODIFY] [auth-experience.tsx](file:///d:/yash/may/portal-brands/src/components/auth-experience.tsx)

- Simplify the right panel: remove the inner `border-x border-white/[0.65]` container that creates a card-inside-card effect
- The right section already uses `bg-[#fffdf8]/[0.72]` — that's correct
- Keep the outer radial gradients but remove the redundant inner glow layer

#### [MODIFY] [login/page.tsx](file:///d:/yash/may/portal-brands/src/app/auth/login/page.tsx)

- Remove the nested container: the current form has `div > div (radial bg) > div (border-x, bg-white/[0.38], ring)` — collapse to a single clean container
- Reduce the login icon from a double-layered circle-in-square to a simple rounded icon badge
- Change `font-semibold` on labels to `font-medium` (weight 500)
- Change button text from `font-medium` to `font-medium` (already correct, keep it)
- Keep input height at `52px`, keep 8px radius — both match the spec
- Simplify the header: remove double gradient text on the subtitle (use plain `text-slate-500`)

---

### Step 2 — Global Typography Normalization

Systematically reduce font weight across the portal. The design spec says weights should mostly be 400, 500, and 600.

#### [MODIFY] [premium-ui.tsx](file:///d:/yash/may/portal-brands/src/components/premium-ui.tsx)

| Element | Current | Target |
|---------|---------|--------|
| `PageHeader` eyebrow | `font-semibold` 11px uppercase | `font-medium` 12px uppercase, tracking `0.06em` |
| `MetricCard` title | `font-semibold` 11px uppercase | `font-medium` 13px uppercase, tracking `0.05em` |
| `MetricCard` value | `text-3xl font-semibold` | `text-3xl font-semibold` (keep — stat values should be 600) |
| `MetricCard` detail | `font-medium` | Keep as-is |
| `PremiumActionCard` eyebrow | `font-semibold` 11px uppercase | `font-medium` 12px uppercase |
| `PremiumActionCard` action label | `font-semibold` | `font-medium` |
| `StatusPill` | `font-medium` | Keep as-is |

#### [MODIFY] [premium-dialog.tsx](file:///d:/yash/may/portal-brands/src/components/premium-dialog.tsx)

- Change sidebar eyebrow from `font-semibold` to `font-medium`
- Change "Premium setup" label from `font-semibold` to `font-medium`
- Change dialog title from `text-3xl` to `text-2xl` (spec says 20–24px)

---

### Step 3 — Sidebar & Topbar Refinement

Make navigation calmer and less visually heavy.

#### [MODIFY] [admin-sidebar.tsx](file:///d:/yash/may/portal-brands/src/components/admin-sidebar.tsx)

- Remove the `premium-grid` background pattern overlay — it adds noise to the sidebar
- Simplify the branding header: remove the inner `rounded-lg border border-white/80 bg-white/75 p-3 shadow-lg` card — embed content directly
- Change "Live" / "Agency" badge text from `font-medium` to `font-medium` (keep)
- Reduce nav item label from `font-semibold` to `font-medium`
- Reduce nav meta text — keep as-is (`font-medium text-xs`)
- Simplify the bottom user card: remove the nested `rounded-lg border` wrapper
- Change sign-out button from `font-semibold` to `font-medium`

#### [MODIFY] [brand-sidebar.tsx](file:///d:/yash/may/portal-brands/src/components/brand-sidebar.tsx)

- Apply the same changes as admin-sidebar for consistency

#### [MODIFY] [workspace-topbar.tsx](file:///d:/yash/may/portal-brands/src/components/workspace-topbar.tsx)

- Change breadcrumb from `font-medium uppercase` to `font-medium uppercase` (keep, but verify tracking is `0.05em`)
- The topbar is already clean — minimal changes needed

---

### Step 4 — Dashboard Stat Cards

#### [MODIFY] [admin/page.tsx](file:///d:/yash/may/portal-brands/src/app/admin/page.tsx)

- Change step number labels from `font-semibold` to `font-medium`
- Change step titles from `font-semibold` to `font-medium`
- The "Operational flow" heading uses `text-2xl font-semibold` — keep it

#### [MODIFY] [admin/campaigns/[id]/page.tsx](file:///d:/yash/may/portal-brands/src/app/admin/campaigns/%5Bid%5D/page.tsx)

- Card heading `font-semibold` → keep (card titles should be 500–600)
- No major changes needed — this page is already clean

---

### Step 5 — Tables Polish

#### [MODIFY] [admin/influencers/page.tsx](file:///d:/yash/may/portal-brands/src/app/admin/influencers/page.tsx)

- Table header: change from `font-semibold` to `font-semibold` (keep — spec says 600 for table headers)
- Table profile count badge: change `font-bold` → `font-semibold`
- Custom field badge: change `font-bold` → `font-medium`
- Overflow badge (`+N`): keep as-is
- "Talent intelligence" sidebar heading: change `text-3xl font-semibold` → `text-2xl font-semibold` (slightly smaller, per card heading spec)
- Instagram link: change `font-semibold` → `font-medium`
- Cell values: change `font-semibold` → `font-medium` for location and contact (secondary cell data)
- Row hover: already `hover:bg-blue-50/50` — change to `hover:bg-emerald-50/30` for palette consistency

---

### Step 6 — Dialogs & Forms

All create dialogs already use `PremiumDialogFrame` — the changes from Step 2 will cascade. Additional per-dialog fixes:

#### [MODIFY] All dialog components (6 files)

- [create-brand-dialog.tsx](file:///d:/yash/may/portal-brands/src/components/create-brand-dialog.tsx)
- [create-campaign-dialog.tsx](file:///d:/yash/may/portal-brands/src/components/create-campaign-dialog.tsx)
- [create-influencer-dialog.tsx](file:///d:/yash/may/portal-brands/src/components/create-influencer-dialog.tsx)
- [create-brand-user-dialog.tsx](file:///d:/yash/may/portal-brands/src/components/create-brand-user-dialog.tsx)
- [add-influencer-to-campaign.tsx](file:///d:/yash/may/portal-brands/src/components/add-influencer-to-campaign.tsx)

Changes across all:
- Form label: `font-semibold` → `font-medium` (spec says labels should be weight 500)
- Input height stays at `h-12` (48px for admin forms, matches spec)
- Button label: `font-semibold` → `font-medium`
- Trigger button: `font-semibold` → `font-medium`
- "Add User" trigger button: `font-bold` → `font-medium`

---

### Step 7 — Color & Badge Consistency Sweep

#### [MODIFY] [admin/campaigns/page.tsx](file:///d:/yash/may/portal-brands/src/app/admin/campaigns/page.tsx)

- Dynamic field badges: `font-semibold` → `font-medium`

#### [MODIFY] [admin/brands/page.tsx](file:///d:/yash/may/portal-brands/src/app/admin/brands/page.tsx)

- Dynamic field badges: `font-semibold` → `font-medium`
- "Team access" label: `font-semibold uppercase` → `font-medium uppercase`

#### [MODIFY] [dashboard/campaigns/[id]/page.tsx](file:///d:/yash/may/portal-brands/src/app/dashboard/campaigns/%5Bid%5D/page.tsx)

- No major changes needed — already uses premium-ui components consistently

#### [MODIFY] [admin/workflow/page.tsx](file:///d:/yash/may/portal-brands/src/app/admin/workflow/page.tsx)

- Step phase badge: `font-medium` — keep
- Step title: `font-semibold` — keep (section title, 600 is correct)
- Bottom CTA heading: `font-semibold tracking-tight` → `font-semibold tracking-normal` (spec says letter-spacing 0)

#### [MODIFY] [influencer-status-actions.tsx](file:///d:/yash/may/portal-brands/src/components/influencer-status-actions.tsx)

- No changes needed — already uses correct weights

---

## Summary of Cross-Cutting Changes

| Pattern | Before | After | Rationale |
|---------|--------|-------|-----------|
| Eyebrow labels | `font-semibold text-[11px]` | `font-medium text-xs` | Calmer, less shouty |
| Form labels | `font-semibold` | `font-medium` | Spec says 500 |
| Button labels | `font-semibold` | `font-medium` | Spec says 500–600, using 500 |
| Nav item labels | `font-semibold` | `font-medium` | Less heavy sidebar |
| Badges / pills | `font-bold` | `font-medium` | Dramatic weight reduction |
| Card heading values | `font-semibold` | Keep | Stat values stay 600 |
| Page H1 | `font-semibold` | Keep | Page titles stay 600 |
| `tracking-tight` usage | Some places | `tracking-normal` | Spec says default 0 |

---

## Verification Plan

### Automated Tests
```bash
npm run build
```
Build must complete with no errors.

### Browser Testing
1. Open login page — verify no scroll, form fills right panel cleanly, no nested card appearance
2. Open admin dashboard — verify stat cards look clean, typography is consistent
3. Open influencers page — verify table rows have calmer typography
4. Open a create dialog — verify labels use medium weight
5. Check sidebar — verify branding area is simpler, nav items are calmer
6. Check mobile viewport — verify login page shows only form, no overflow

### Visual Checklist (from design spec)
- [ ] Does the page feel calm and premium?
- [ ] Are weights mostly 400, 500, and 600?
- [ ] Are colors from the approved palette?
- [ ] Are cards simple but polished?
- [ ] Does the UI avoid pure black?
- [ ] Are buttons consistent?
- [ ] Do forms feel usable and clear?
- [ ] Is there no unwanted scroll on login?
- [ ] Are animations smooth and subtle?
