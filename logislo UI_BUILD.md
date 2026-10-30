# Logislo: UI Build Brief (screens only)

Read this whole file first. Then reply with ONE line: "Read. Starting Batch 0." and begin.

## 1. Your job
Build every screen of Logislo as a clickable prototype. Logislo is a freight-agency app: goods shipped by sea from a receiving end (Guangzhou) to a delivery end (Douala).
- Screens only. NO logic, NO database, NO auth, NO API calls, NO AI features.
- All data is fake and lives in ONE file (`src/data/mock.ts`).
- Another pass adds the logic later, so keep the code clean and modular.
- Screens are design states, not a simulation. Each screen shows exactly the data written here, even if the same shipment appears with different statuses on different screens. Do NOT sync state between screens.

## 2. How we work (strict)
1. Build in batches: Batch 0, then Batches 1 to 15, then Batch 16. Section 8 lists them.
2. Before Batches 1 to 15: if the user has not attached that batch's image, say "Attach Batch N image." and wait.
3. After each batch reply in at most 4 lines, exactly in this shape, then STOP and wait:
   "Batch N done. Screens X to Y. [one short note, only if something differs from the image]. Continue to Batch N+1? (yes / list fixes)"
4. Never build ahead. Never touch finished screens unless asked. Edit files; never regenerate the whole project.
5. Save tokens: output only new or changed files. No explanations, no design commentary, no code pasted in chat.
6. Keep `BUILD_LOG.md` in the project root: batches done, and "Next: Batch N". In a new chat, if `BUILD_LOG.md` exists, read it, say which batch is next, and ask to confirm.
7. If the image and this file disagree: CONTENT (names, data, behavior) = this file. LOOK = the image, unless the image breaks section 3 (borders, extra colors, long text). Then section 3 wins.
8. Before reporting a batch, silently check: every word spelled correctly, no borders, placeholders lighter and smaller than labels, no overlapping buttons, matches the image, logo only where allowed, no console errors.

## 3. Design rules (apply everywhere)
Philosophy: minimal, quiet, premium (think Linear, Stripe, Revolut). When in doubt, remove.

Copy: fewest words possible. Titles 1 to 3 words, buttons 1 to 2 words. No helper sentences, taglines, descriptions, captions, instructions. No "OR" separators.

Colors (CSS variables in `src/design/tokens.css`, nothing hard-coded elsewhere):
- --ink #0E1116 · --bg #F6F7F9 · --surface #FFFFFF · --muted #7A818C
- --accent #4F46E5 (primary button, active tab, Scan button, selected states)
- --accent-tint #EEF0FF (chips, soft buttons, selected rows)
- --field #F0F2F5 (input fill) · --placeholder #A3A9B3
- --alert #D64545 and --alert-tint #FBEAEA: only for errors, warnings, Not found, Unmatched, unmet requirements and the offline banner
- No other colors. No gradients. No orange. No green.

No borders: no stroke borders, outlined cards, outlined inputs, or divider lines anywhere. Separate with spacing, soft background tones and very subtle shadows (e.g. 0 1px 2px rgba(14,17,22,.06)). Inputs are filled --field rounded rectangles. Secondary buttons are soft tint fills.

Type: Inter (Google Fonts, `display=swap`, system-ui fallback).
- Title 24px / 600. Field label 14px / 500 ink. Body 15px / 400. Chip 12px / 500.
- Input text 16px (prevents iOS zoom). Placeholder 13px / 400 / --placeholder (set with `::placeholder`). Placeholder must be clearly smaller and lighter than the label.

Shape and size: radius 16 for cards, 14 for inputs and buttons, pill for chips. Button and input height 52. Minimum tap target 48. Page side padding 20. Header height 56. List row height 64. Icons: simple line icons, 1.75 stroke, one inline SVG `Icon` component (no icon packages).

Photos: flat gray placeholder tile (--field) with a small camera icon. No external images, no network images.

Money format: `370,000 FCFA`.

Logo (use exactly): a sleek geometric L. Two shapes, one color (accent), viewBox 0 0 32 40:
```
<svg viewBox="0 0 32 40" aria-hidden="true">
  <g class="l-bar"><rect x="0" y="0" width="10" height="40"/></g>
  <g class="l-foot"><polygon points="10,30 32,30 26,40 10,40"/></g>
</svg>
```
Wordmark "Logislo" beside it, ink, 600 weight. The logo appears ONLY on screens 01, 02, 03, 04, 14 and the splash. Nowhere else.

## 4. No-glitch rules (non-negotiable)
- One phone shell: max-width 430px, centered, height 100dvh, background --bg. On viewports 430px or narrower it fills the screen. Set html and body background to --bg so there is no white flash.
- Every screen uses ONE `ScreenLayout`: [header fixed height] [scroll area flex:1, overflow-y:auto, overscroll-behavior:contain] [footer slot for the main button] [bottom nav when the screen has one]. Pinned buttons live in the footer slot, never as absolute overlays, so nothing ever covers a field or a list row. Respect `env(safe-area-inset-bottom)`.
- Reserve space for photos and chips (fixed height or aspect-ratio) so nothing shifts after render.
- Animate only `transform` and `opacity`. Durations 160 to 240ms, ease-out. Press feedback: `scale(.98)`. No hover-only effects. `touch-action: manipulation`. No layout animation.
- Screen change: 180ms fade plus 8px slide, handled once in a single `ScreenHost` keyed by screen id.
- Respect `prefers-reduced-motion` (no slides, instant fades, splash shows the static logo for 800ms).
- Same header, same paddings, same row heights, same bottom nav on every screen. Build shared components first and reuse them. If a screen file grows past about 150 lines, extract components.
- No console errors or warnings. No missing keys. No unused imports.
- Keep all user-facing text in `src/strings.ts` (English only for now).
- Do not add routing libraries, state libraries, animation libraries, or icon packages.

## 5. Stack and structure
Use AI Studio Build's default stack (React + TypeScript + Tailwind). Keep it a normal project that can be exported.
```
src/
  App.tsx                  shell + ScreenHost
  nav.ts                   registry: id, name, batch, component, hasNav
  strings.ts               all text
  design/tokens.css
  data/mock.ts             ALL fake data
  context/Demo.tsx         { role, plan, stack, go(), back(), reset() }
  components/              Logo, Icon, Button, Field, Segmented, Chip, StatusChip, Tile, Row,
                           Card, Header, ScreenLayout, BottomNav, MoreSheet, PhotoTile,
                           Timeline, LockBadge, ConfirmDialog, AccountMenu, LimitSheet, OfflineBanner,
                           QrPlaceholder, Dev (toolbar + gallery)
  screens/S01SignUp.tsx ... S57FirstRunHome.tsx   one file per screen
BUILD_LOG.md
```

## 6. Demo behavior (the only "state" allowed)
- `role`: Owner, Manager, Front desk, Warehouse. Changes the bottom menu and role variants.
- `plan`: Basic or Pro. Changes the lock states.
- `go(id)`, `back()`, `reset(id)`: navigation stack. Header back arrow calls `back()`.
- Segmented toggles and chips switch their selected look. Checkboxes toggle. Text fields are editable. Nothing else is interactive.
- Public routes use the URL hash only: `#/track/demo` shows screen 49, any other `#/track/...` shows screen 50. Public screens have no splash and no bottom nav.

Dev toolbar: a small round button (28px, 35% opacity, top-right of the viewport). It opens the Gallery: every screen grouped by batch (number + name), a Role switcher, a Plan switcher, and these variant entries: "20 Add client (error)", "55 Confirm (Release)", "55 Confirm (Deactivate)", "55 Confirm (Log out)", "56 Limit reached (routes)", and an "Offline banner" on/off switch. Every screen must be reachable from the Gallery. Wrap the toolbar in a constant `SHOW_DEV = true` so it can be switched off later.

Role effects:
- Warehouse sees NO money anywhere. On 26 the payments row is hidden. On 43 and 44 amounts are replaced: 43 shows "Not cleared" (red card, no amount); 44 shows "Cleared". Money tiles are absent on its Home.
- Manager uses the Front desk Home (17).

Plan effects (Basic shows a small `LockBadge` "Pro" and muted controls):
- 06: the two office storage sections (Free days, Daily fee)
- 07: Add route button (tap opens 56, routes variant)
- 11: Add staff button when 3 staff already exist (tap opens 56, staff variant)
- 12: Manager role option
- 28 and 37: Add photo button. 29: photo tile shows a lock
- 33: the optional Cost field
- 45 renders 46 instead
- 47: Profit per container row
- Pro plan: no locks.

Bottom nav by role (Scan is a round accent button in the center, opens 36):
- Owner: Home 16 · Clients 19 · [Scan] · Shipments 23 · More (sheet)
- Manager: Home 17 · Clients 19 · [Scan] · Shipments 23 · More (sheet)
- Front desk: Home 17 · Clients 19 · [Scan] · Shipments 23 · Payments 39
- Warehouse: Home 18 · Shipments 23 · [Scan] · Containers 32
Account menu (images 51 and 52, finished in Batch 14; Batch 0 builds a plain placeholder): a bottom sheet over a dimmed screen. White, 24px top radius, dim overlay (--ink at 40%), 200ms slide, closes on overlay tap. Header: initial avatar (accent tint), name, "Role, Office". Rows are 56px: icon, label of 1 to 2 words, chevron. The last two rows are always Profile (goes to 09) and Log out (ink text, NOT red, no chevron, no divider; opens 55 Log out confirm, whose Confirm goes to 02 using `reset`). Rows above Profile: Owner: Payments 39, Containers 32, Warehouse list 45, Unmatched 30, Dashboard 47, Tools 48, Settings 08. Manager: Payments 39, Containers 32, Warehouse list 45, Unmatched 30. Front desk and Warehouse: none (header, Profile, Log out only). Warehouse list and Unmatched show a small lock and "Pro" on Basic.
The Account menu opens from More (Owner, Manager) or from a 36px initial avatar at the top right of the Home header (Front desk and Warehouse only; Owner and Manager have no avatar).
Offline banner (no image, build from this text in Batch 0): a 32px strip pinned under the header on any screen, --alert-tint background, --alert text 13px "No connection" with a small wifi-off icon. Controlled by the Dev "Offline banner" switch now; the logic pass wires it to the real connection.

## 7. Sample data (use only this, in `src/data/mock.ts`)
Agency: Douala Express. Route: Guangzhou to Douala. Dates in Oct 2026.
Staff: Marie (Owner, Douala), Paul (Warehouse worker, Guangzhou), Aïcha (Front desk, Douala), Li Wei (Warehouse worker, Douala).
Clients: Jean Dupont JEAN-017, Marie Kone MK-042, Thomas Laurent TL-088, Anna Smith AS-221.
Container C-001 (40ft, 40 boxes): SHP-1005 Jean 12 boxes, SHP-1006 Marie 10, SHP-1007 Thomas 8, SHP-1008 Anna 10.
Jean's money: shipping 10 CBM x 45,000 = 450,000 FCFA; deposit 90,000; storage 2 days x 5,000 = 10,000; balance 370,000 FCFA.
Rates: 1,200 per kg, 45,000 per CBM, deposit 20%. Guangzhou office: free days 14, daily fee 0. Douala office: free days 3, daily fee 5,000.
Statuses (only these): Expected, Deposit paid, Received, In transit, Arrived, Ready, Collected, Unmatched, Not found.
Payment types: Deposit, Balance, Storage. Methods: Cash, Mobile money.

## 8. Batches

### BATCH 0: Foundation (no image needed)
Build: tokens.css and global styles; phone shell and `ScreenLayout`; all shared components; `mock.ts`; `strings.ts`; Demo context and navigation; Gallery and dev toolbar; OfflineBanner; a plain placeholder Account menu (finished in Batch 14); the registry with a plain placeholder for every screen not yet built (so the Gallery lists all 57 from the start); `BUILD_LOG.md`.
Splash (screen 00): background --bg, centered logo mark plus wordmark. Timeline (single source of truth, cleaned up on unmount):
- 0 to 480ms: `.l-bar` grows upward (scaleY 0 to 1, origin bottom)
- 420 to 740ms: `.l-foot` extends right (scaleX 0 to 1, origin left)
- 800 to 1160ms: wordmark fades in and slides 8px from the left
- 2000ms: whole splash fades out over 280ms
- 2300ms: go to screen 02 (Login)
Use `animation-fill-mode: both`, `transform-box: fill-box`. Tap anywhere skips to Login. It plays once per page load and is skipped on `#/track/...`.
Done when: the app loads, the splash plays smoothly, Login placeholder appears, the Gallery lists all screens, role and plan switchers work.

### BATCH 1: Account
01 Sign up. Logo, title "Create account". Fields: Full name, Email, WhatsApp, Password, Agency name. Button Sign up, goes to 05. Text link "Log in" goes to 02.
02 Login. Logo, title "Welcome back". Fields: Email, Password (eye icon). Button Log in, goes to the Home of the current role (16, 17, 17, 18) using `reset`. Text links "Forgot password" goes to 03, "Create account" goes to 01.
03 Reset password. Logo, title "Reset password". Field Email. Button Send link, goes to 02. Text link "Back to login" goes to 02.
04 Set password. Logo, title "Set password". Fields: New password, Confirm password. Button Continue, goes to the Home of the current role.

### BATCH 2: Setup
05 Create route. Title "Create route". Section "Receiving end": Country (China), City (Guangzhou). Section "Delivery end": Country (Cameroon), City (Douala). Fields look like selects with a chevron (display only). Button Create, goes to 06.
06 Route settings. Sections: Price (Per kg 1,200 FCFA; Per CBM 45,000 FCFA), Deposit (20 %), "Guangzhou office" (Free days 14; Daily fee 0 FCFA), "Douala office" (Free days 3; Daily fee 5,000 FCFA). Save pinned in the footer. Save goes to 57 (first-run Home) if the user came from 05, otherwise back.
07 Routes. Title Routes. One card "Guangzhou to Douala" (with an arrow icon) showing Per kg 1,200 and Per CBM 45,000, taps to 06. Button Add route with a lock and "Pro" on Basic. Basic tap opens 56 (routes variant); Pro tap goes to 05.
08 Settings. Rows: Profile 09, Agency 10, Routes 07, Staff 11, Plan 15. A small "Basic" chip beside Plan. Nothing else.

### BATCH 3: Settings
09 Profile. Fields: Name, Email, WhatsApp. Row "Change password" (goes to 04). Button Save, goes back.
10 Agency. Fields: Agency name, Logo (upload tile), Currency (FCFA). Button Save, goes back.
11 Staff. Title Staff, button Add staff (goes to 12; with 3 staff on Basic it opens 56, staff variant). Staff rows go to 53 (Marie's row does nothing). Rows: Marie (Owner, Douala), Paul (Warehouse, Guangzhou), Aïcha (Front desk, Douala), Li Wei (Warehouse, Douala).
12 Add staff. Fields: Name, Email, WhatsApp, Role (Warehouse worker, Front desk, Manager with lock "Pro" on Basic), Custom title (optional), Office (Guangzhou, Douala). Segmented: Invite link / Temporary password. Button Create, goes to 13.

### BATCH 4
13 Staff created. Paul, Warehouse worker, Guangzhou. Temporary password 7F3K-9D2M with a Copy button. Button Share link. No envelope icon. Back goes to 11.
14 Join agency. Logo, title "Join agency". Fields: Email, Temporary password. Button Join, goes to 04.
15 Plan. Current plan Basic. Cards: Basic (1 route, Owner + 3 staff, chip "Current"); Pro (3 routes, Owner + 10 staff, Photo proof, Storage fees, Warehouse list, Unmatched list, each with a small lock); Enterprise (Coming soon). Button Upgrade. No prices.
16 Home (Owner). Title Home. Tiles: Shipments 16 (goes to 23), Clients 12 (19), Containers 8 (32), Owed 1,350,000 FCFA (39). List "Recent" with 3 rows: Payment received, New shipment SHP-1005, Client added. Owner nav.

### BATCH 5
17 Home (Front desk). Header avatar "A" at top right opens 52 (hidden when the role is Manager). Tiles: Expected 5 and Ready 3 (both go to 23), Balances 4 (goes to 39). List "Balances" with rows like "Jean Dupont, JEAN-017, 370,000 FCFA" (goes to 26). Front desk nav.
18 Home (Warehouse, Guangzhou). Header avatar "P" at top right opens 52 (Warehouse variant: Paul, Warehouse worker, Guangzhou). Tiles: To receive 6 and Received today 14 (go to 23), Unmatched 2 (goes to 30). List "Recent" with status chips. No money, no Team tile. Warehouse nav.
19 Clients. Title Clients, button Add (goes to 20), search field. Rows (initials, name, code, city): Jean Dupont JEAN-017, Marie Kone MK-042, Thomas Laurent TL-088, Anna Smith AS-221. Rows go to 21.
20 Add client. Fields: Name, WhatsApp, Email (optional). No client code field. Button Save, goes to 21. Gallery variant "error": under WhatsApp show muted red "Number already used" with a small link "View client".

### BATCH 6
21 Client detail. Jean Dupont, JEAN-017, WhatsApp number, tiles Shipments 5 and Balance 370,000 FCFA, list "Recent" with 3 shipments and status chips (rows go to 26). Pencil icon in the header goes to 22. Button Message.
22 Edit client. Fields: Name, WhatsApp, Email, Client code (read-only, grayed). Button Save, goes to 21.
23 Shipments. Title Shipments, search field, chips: All, Expected, In transit, Arrived, Ready, Unmatched (goes to 30). Rows: SHP-1005 In transit, SHP-1006 Received, SHP-1007 Expected, SHP-1008 Arrived (rows go to 26). Round New button goes to 24.
24 New pre-alert. Fields: Client, Description, Supplier tracking number, Boxes, Weight (kg), Length / Width / Height (cm) in one row, segmented kg / CBM. Estimate card: Shipping 450,000 FCFA, Deposit 90,000 FCFA. Button Save, goes to 25. No tracking link field.

### BATCH 7
25 Pre-alert saved. Check icon, SHP-1005, a row with the tracking link and a Copy button, soft button "Share on WhatsApp", button Done (goes to 23).
26 Shipment detail. SHP-1005, chip In transit, "Jean Dupont, JEAN-017", Guangzhou to Douala, 12 boxes, 10 CBM. Timeline: Expected, Received, In transit (current), Arrived, Ready, Collected, with dates. Photos row (3 placeholder tiles). Payment row "Deposit 90,000 FCFA" (goes to 42). Tracking link row with Copy and WhatsApp buttons. Pencil icon in the header goes to 27. Release button disabled with a lock; tapping it goes to 43.
27 Edit shipment. SHP-1005. Fields: Description, Boxes, Weight (kg), Length / Width / Height, segmented kg / CBM. Button Save, goes to 26.
28 Receive. Title Receive. Search field with a scan icon (goes to 36). Matched card "SHP-1005, Jean Dupont". Fields: Boxes, Weight (kg), Length / Width / Height (cm), segmented kg / CBM. Soft button Add photo. Primary button Print label (goes to 54; 54 Done goes to 29). Soft secondary button Unmatched (goes to 30).

### BATCH 8
29 Receive confirmation. SHP-1005, Jean Dupont, chip Received. Tiles Expected 12, Received 12. Goods photo tile. Button Confirm, goes to 23.
30 Unmatched. Title Unmatched. Muted red card "2 items". Rows: "U-001, 5 boxes, 12 CBM, Oct 18" and "U-002, 8 boxes, 20 CBM, Oct 17" (rows go to 31).
31 Unmatched item. U-001, chip Unmatched, photo tile, tiles Boxes 5 and Weight 250 kg. Section "Match shipment": search field and 3 rows (SHP-1005, SHP-1006, SHP-1007). Button Match in the footer slot (never overlapping the rows), goes to 30.
32 Containers. Chips: All, Open, In transit, Arrived. Cards: "C-001, 40ft, 40 boxes, In transit" and two more of your choice (one Open, one Arrived). No shipment IDs on cards. Cards go to 34. Round New button goes to 33.

### BATCH 9
33 New container. Fields: Container number, Size (20ft / 40ft), Route (Guangzhou to Douala), Cost (optional, FCFA; lock "Pro" on Basic). Button Create, goes to 34.
34 Container detail. C-001, Guangzhou to Douala, 40 boxes. List of its shipments (SHP-1005 Jean Dupont 12 boxes, SHP-1006 10, SHP-1007 8, SHP-1008 10). A "+" icon in the header goes to 35. Three states by container status: Open shows chip Open and buttons Scan boxes (soft, goes to 36) and Shipped (primary, opens 55 Ship confirm; its Confirm goes to 32); In transit shows chip In transit and button Arrived (goes to 37); Arrived shows chip Arrived and button Scan-check (goes to 37). Default view: Open.
35 Add to container. Header C-001. Search field. Only shipments with status Received, with checkboxes, 3 selected (SHP-1005, SHP-1006, SHP-1007). Footer line "Selected 30 boxes". Button Add, goes to 34.
36 Scan camera. Full-screen dark camera view (the only dark screen), square scan frame in the middle, counter "38 / 40" at the top, torch icon, button Done (goes back). No bottom nav. No real camera.

### BATCH 10
37 Scan-check. C-001, chip Arrived. Tiles Expected 40, Scanned 38, Missing 2 (red). Row "Missing items" with an arrow (goes to 38). Button Add photo. Button Confirm (goes to 32).
38 Missing items. Title "Missing items", chip Not found. Rows: "SHP-1006, Marie Kone, 1 box" and "SHP-1008, Anna Smith, 1 box". Button Done, goes back.
39 Payments. Title Payments. Chips: All, Deposit, Balance, Storage. Rows: SHP-1005 Deposit 90,000 FCFA (goes to 42); SHP-1005 Balance 370,000 FCFA remaining (goes to 41); SHP-1006 Paid 0 FCFA; SHP-1007 Credit -20,000 FCFA.
40 Record payment. SHP-1005, Jean Dupont. Balance 370,000 FCFA. Segmented Deposit / Balance / Storage (Balance selected). Amount 370,000. Segmented Cash / Mobile money. Reference (optional). Button Save, goes to 42.

### BATCH 11
41 Final bill. SHP-1005. Rows: Shipping (10 CBM x 45,000) 450,000; Storage (2 days x 5,000) 10,000; Deposit -90,000. Total row "Balance 370,000 FCFA". Button Record payment, goes to 40.
42 Payment detail. 370,000 FCFA. Rows: Shipment SHP-1005, Type Balance, Method Mobile money, Date Oct 21 2026, Recorded by Aïcha. Back goes to 39.
43 Release locked. SHP-1005, chip Ready. Red card "Balance due 370,000 FCFA" (Warehouse role: "Not cleared", no amount). Checklist: Balance 0 FCFA (red, not met), Goods photo (gray, pending), Collector name (gray, pending). Release button disabled.
44 Release goods. SHP-1005, chip Ready, "Balance 0 FCFA" (Warehouse role: "Cleared"). Goods photo filled in. Collector name "Samuel Dupont". Button Release, enabled, opens 55 (Release variant); its Confirm goes to 23.

### BATCH 12
45 Warehouse list (Pro). Title "Warehouse list", small Pro chip. Segmented Guangzhou / Douala. Rows are goods in storage, not buildings: "Thomas Laurent, TL-088, 12 days, 45,000 FCFA"; "Jean Dupont, JEAN-017, 5 days, 10,000 FCFA"; "Anna Smith, AS-221, 2 days, 0 FCFA". Each row has a WhatsApp icon button. On Basic render 46 instead.
46 Warehouse list on Basic. The same screen dimmed behind a centered card with a lock, "Pro", and button Upgrade (goes to 15).
47 Dashboard. Title Dashboard (no logo). Small bars "Shipments by status". Collected 4,200,000 FCFA. Owed 1,350,000 FCFA. In storage 6. "Profit per container": C-001 +1,100,000 FCFA (locked on Basic). Owner nav.
48 Tools. One card "Business update agent" with chip "Soon" and button "Join waitlist". Nothing else.

### BATCH 13: Public (no splash, no bottom nav)
49 Public tracking. No back arrow, no search field. Agency name "Douala Express" at the top. SHP-1005, chip In transit, Guangzhou to Douala. Timeline Expected, Received, In transit, Arrived, Ready, Collected with dates. A photo slot that appears once Arrived. No money, no client details.
50 Invalid link. Simple icon, title "Link not valid". No input, no button.

### BATCH 14: Menus, staff, labels (images 51 to 54)
51 Account menu (Owner). Owner Home (16) dimmed behind. Sheet header: avatar "M", "Marie", "Owner, Douala". Rows with icons: Payments, Containers, Warehouse list (lock and "Pro" on Basic), Unmatched (lock and "Pro" on Basic), Dashboard, Tools, Settings, Profile, Log out. Follows the Account menu spec in section 6 and replaces the Batch 0 placeholder. The Manager variant uses the same component with the Manager rows.
52 Account menu (Front desk). Front desk Home (17) dimmed behind, with the avatar "A" in its header. Sheet header: avatar "A", "Aïcha", "Front desk, Douala". Rows: Profile, Log out. The Warehouse variant uses the same component (Paul, "Warehouse worker, Guangzhou").
53 Staff detail. Title Staff. Pencil icon in the header goes to 12 in edit mode (title "Edit staff", button Save, no Invite/Temporary toggle). Large initial avatar "P", "Paul", chip Active. Read-only filled rows (label above value): Role Warehouse worker; Office Guangzhou; WhatsApp +86 139 0000 1234; Email paul@example.com. Footer: soft button "Reset password" (goes to 13) and soft gray button "Deactivate" (opens 55, Deactivate variant). For Marie (Owner) both buttons are hidden. No bottom nav.
54 Label preview. Title Label. A centered white label card (portrait, subtle shadow, no border): "SHP-1005" large, "JEAN-017", QR placeholder (a generic QR-style pattern in an inline SVG, not a real code), short code "K7P2X9" small and muted, "3/12" large. Below the card a stepper: left chevron, "3 / 12", right chevron (pages through labels, display only). Footer: primary "Print all" (does nothing in the prototype) and soft "Done" (goes to 29). No bottom nav.

### BATCH 15: Dialogs and states (images 55 to 57)
55 Confirm dialog. Container detail (34) dimmed behind. Centered white card, 24px radius, subtle shadow, no border, no icon, no close X. Title "Ship C-001?", muted line "40 boxes", small --alert line "1 without deposit". Two buttons side by side: "Cancel" (soft) and "Ship" (primary). One reusable ConfirmDialog (title, up to two lines, cancel label, confirm label). Variants: Ship (34); Release (44: "Release SHP-1005?", line "Collector: Samuel Dupont", buttons Cancel and Release); Deactivate (53: "Deactivate Paul?", buttons Cancel and Deactivate); Log out (51 and 52: "Log out?", buttons Cancel and Log out). Tapping the overlay or Cancel closes it. Confirm does what the original button did.
56 Limit reached. Staff list (11) dimmed behind. Bottom sheet: round accent-tint circle with a lock, title "Staff limit reached", muted line "3 of 3 staff", primary "Upgrade" (goes to 15), soft "Not now" (closes). Routes variant: "Route limit reached", "1 of 1 route", opened from 07.
57 First-run Home (Owner). A new agency with no data. Title Home. Tiles at zero with muted numbers: Shipments 0, Clients 0, Containers 0, Owed 0 FCFA. Section "Get started" with three rows, each with an icon in a tint circle and a chevron: "Add staff" (goes to 12), "Add client" (goes to 20), "New pre-alert" (goes to 24). Owner nav. Shown after 06 when the user came from 05.

### BATCH 16: Finish
Walk every screen from the Gallery in Owner/Pro, then Warehouse/Basic. Fix typos, overlaps, console errors, unused code. Update `BUILD_LOG.md` with the file tree. Then tell the user in 3 lines: the screens are complete, how to download or export the project (use AI Studio's own export or download), and to upload the project together with LOGIC_BUILD.md and PROJECT.md to the Pro account.
