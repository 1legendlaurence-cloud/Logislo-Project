# Logislo Build Log

## Batches Completed
- **Batch 0: Foundation**
  - Design tokens (`src/design/tokens.css`) with strict color palette
  - Phone shell (430px max-width, 100dvh, ScreenLayout with 4 fixed/scrolling zones)
  - Core components (`Logo`, `Icon`, `Button`, `Field`, `Segmented`, `Chip`, `StatusChip`, `Tile`, `Row`, `Card`, `Header`, `ScreenLayout`, `BottomNav`, `MoreSheet`, `PhotoTile`, `Timeline`, `LockBadge`, `ConfirmDialog`, `AccountMenu`, `LimitSheet`, `OfflineBanner`, `QrPlaceholder`, `SearchableSelect`)
  - Fake data store (`src/data/mock.ts`) and strings dictionary (`src/strings.ts`)
  - Demo state context (`src/context/Demo.tsx`) for roles, plans, navigation stack, and modals
  - Screen registry (`src/nav.tsx`) covering all 57 screens + variants with clean placeholder fallback
  - Animated Splash screen 00 (480ms L-bar grow, 320ms L-foot extend, 360ms wordmark slide, tap skip)

- **Batch 1: Account (Refined)**
  - 01 Sign up (`src/screens/S01SignUp.tsx`): 100% full view height non-scrollable, extra bold title, clean input stack, Sign up button, Log in link, logo removed as requested
  - 02 Login (`src/screens/S02Login.tsx`): 100% full view height non-scrollable, extra bold title, Email, Password with eye toggle, role-based reset, tight link spacing, logo removed
  - 03 Reset password (`src/screens/S03ResetPassword.tsx`): Email input, Send link, Back to login, logo removed
  - 04 Set password (`src/screens/S04SetPassword.tsx`): New & Confirm password, Continue, logo removed

- **Batch 2: Setup (Refined)**
  - 05 Create route (`src/screens/S05CreateRoute.tsx`): Header title beside back arrow, type-to-filter branded searchable dropdowns, clean empty initial state, disabled city logic
  - 06 Route settings (`src/screens/S06RouteSettings.tsx`): Editable price per kg & CBM inputs starting at 0, editable deposit %, editable Guangzhou and Douala office storage fees
  - 07 Routes (`src/screens/S07Routes.tsx`): Back button added, Guangzhou to Douala route card with per kg/CBM pricing (taps to 06), Pro banner on Basic, Add route button with limit modal integration
  - 08 Settings (`src/screens/S08Settings.tsx`): Back button added, Profile, Agency, Routes, Staff, and Plan rows with Basic plan badge and chevron navigation

- **Batch 3: Settings**
  - 09 Profile (`src/screens/S09Profile.tsx`): Name, Email, WhatsApp inputs, Change password action row (taps to 04), Save button
  - 10 Agency (`src/screens/S10Agency.tsx`): Agency name, flat logo upload tile, Currency (FCFA), Save button
  - 11 Staff (`src/screens/S11Staff.tsx`): Staff list with avatar initials, Add staff button with Basic plan limit trigger (opens 56), rows tap to 53 (owner Marie inactive)
  - 12 Add staff (`src/screens/S12AddStaff.tsx`): Name, Email, WhatsApp, Role dropdown (Warehouse worker, Front desk, Manager Pro lock), Custom title, Office toggle, Invite method toggle, Create button

- **Batch 4: Access & Dashboard**
  - 13 Staff created (`src/screens/S13StaffCreated.tsx`): Paul profile card, 7F3K-9D2M temporary password with copy button, Share link button
  - 14 Join agency (`src/screens/S14JoinAgency.tsx`): Email & Temporary password fields, Join button, clean non-scrollable 100% full view height
  - 15 Plan (`src/screens/S15Plan.tsx`): Basic, Pro, and Enterprise plan feature cards with lock indicators, interactive Upgrade action
  - 16 Home (Owner) (`src/screens/S16HomeOwner.tsx`): 2x2 metric tiles (Shipments 16, Clients 12, Containers 8, Owed 1,350,000 FCFA), Recent activity list, Owner bottom navigation

- **Batch 5: Operations & Clients**
  - 17 Home Front desk (`src/screens/S17HomeFrontDesk.tsx`): Expected, Ready, Balances metric tiles, Balances client row (JD 370,000 FCFA), Front desk navigation
  - 18 Home Warehouse (`src/screens/S18HomeWarehouse.tsx`): To receive, Received today, Unmatched tiles with Basic plan lock, Recent scan items with live statuses
  - 19 Clients (`src/screens/S19Clients.tsx`): Search filter input, Add button, client list with avatars and codes (JEAN-017, MK-042, TL-088, AS-221)
  - 20 Add client (`src/screens/S20AddClient.tsx`): Name, WhatsApp, Email fields, Save button, duplicate phone error variant with View client link

- **Batch 6: Shipments & Account Full Pages**
  - More menu full page (`src/screens/S51AccountMenu.tsx`): Screens 51 and 52 converted to dedicated full-page screens; Staff moved back to Settings
  - 21 Client detail (`src/screens/S21ClientDetail.tsx`): Profile header, WhatsApp link, metric tiles, recent shipments list, Pre-alert & Message actions, edit client trigger
  - 22 Edit client (`src/screens/S22EditClient.tsx`): Avatar header, Name, WhatsApp, Email fields, and locked Client code field with Save action
  - 23 Shipments (`src/screens/S23Shipments.tsx`): Filter chips (All, Expected, In transit, Arrived, Ready, Collected), search input, shipment cards, floating add pre-alert button
  - 24 New pre-alert (`src/screens/S24NewPreAlert.tsx`): Client selector, description, supplier tracking, weight, L/W/H dimensions, rate mode toggle, and live estimate card

- **Batch 7: Pre-alert & Receiving**
  - 25 Pre-alert saved (`src/screens/S25PreAlertSaved.tsx`): Check icon, SHP-1005 summary card, tracking link with Copy button, Share on WhatsApp soft button, Done button
  - 26 Shipment detail (`src/screens/S26ShipmentDetail.tsx`): SHP-1005 with In transit chip, horizontal timeline stepper, 3 photo tiles, Deposit payment row, tracking link with Copy/WhatsApp, locked Release button
  - 27 Edit shipment (`src/screens/S27EditShipment.tsx`): Description, Boxes, Weight, L/W/H dimensions, kg/CBM toggle, Save button
  - 28 Receive (`src/screens/S28Receive.tsx`): Search with scan icon, Matched SHP-1005 card, Boxes/Weight/Dimensions fields, Add photo soft button, Print label primary button, Unmatched soft button

- **Batch 8: Receiving & Unmatched & Containers**
  - 29 Receive confirmation (`src/screens/S29ReceiveConfirmation.tsx`): Green check badge, SHP-1005 card with Received chip, 2x2 QR label cards (1/4 to 4/4, tap to 54), Print all (Pro) and Done buttons
  - 30 Unmatched (`src/screens/S30Unmatched.tsx`): U-001, U-002, U-003 cards with Unmatched status chips, boxes, dates, and descriptions (tap to 31)
  - 31 Unmatched item (`src/screens/S31UnmatchedItem.tsx`): U-001 detail card, 2 photo tiles, Link to client searchable dropdown, Assign button (taps to 26)
  - 32 Containers (`src/screens/S32Containers.tsx`): Add button, CNT-024 (Loading), CNT-023 (Departed), CNT-022 (Arrived) cards with progress bars

- **Batch 9: Container Loading & Camera Scan**
  - 33 New container (`src/screens/S33NewContainer.tsx`): Code, Seal, Vessel, Departure date, Arrival date fields, Route card, Create button
  - 34 Container detail (`src/screens/S34ContainerDetail.tsx`): CNT-024 summary card, Shipments inside list (SHP-1005, SHP-1004, SHP-1003), Add shipment button, Mark departed button (opens confirm dialog 55)
  - 35 Add to container (`src/screens/S35AddToContainer.tsx`): Search input, selectable shipment checkboxes, dynamic Add selected button
  - 36 Scan camera (`src/screens/S36ScanCamera.tsx`): Full-bleed dark camera view (`#0E1726`), back and torch buttons, white corner brackets, green laser scan line, Scanned SHP-1005 card

- **Batch 10: Arrival Scan-Check & Payments**
  - 37 Scan-check (`src/screens/S37ScanCheck.tsx`): CNT-022 progress card (14 of 18 boxes scanned), Scan box button (taps to 36), box checklist with green checks and grey circle, Finish button (taps to 38)
  - 38 Missing items (`src/screens/S38MissingItems.tsx`): CNT-022 4 boxes missing card, missing box list (SHP-1004 Box 4/4, SHP-1001 Box 1/2 & 2/2, SHP-0998 Box 3/3), Confirm & notify owner button
  - 39 Payments (`src/screens/S39Payments.tsx`): Unpaid / Paid segmented toggle, client balance rows (Jean Dupont, Marie Kamga, Thomas Lee) and paid records
  - 40 Record payment (`src/screens/S40RecordPayment.tsx`): SHP-1005 balance summary card, Deposit / Final / Other type selector, Amount input, Cash / Mobile money / Bank transfer method selector, Note input, photo tile, Save button

- **Batch 11: Billing & Release**
  - 41 Final bill (`src/screens/S41FinalBill.tsx`): SHP-1005 itemized invoice card (Freight, Storage, Total, Deposit paid, Balance due), Share on WhatsApp and Record payment buttons
  - 42 Payment detail (`src/screens/S42PaymentDetail.tsx`): 150,000 FCFA Deposit receipt card, metadata rows, receipt photo tile, Void payment red action (opens confirm dialog 55)
  - 43 Release locked (`src/screens/S43ReleaseLocked.tsx`): Red lock badge, Release blocked title, SHP-1005 balance due card, Record payment button
  - 44 Release goods (`src/screens/S44ReleaseGoods.tsx`): Ready to releaseSHP-1005 card (Balance 0 FCFA), Collector name & ID number inputs, ID photo tile, Release button

- **Batch 12: Warehouse Lists, Dashboard & Tools**
  - 45 & 46 Warehouse list Pro & Basic (`src/screens/S45WarehouseList.tsx`): Grouped by Ready / Arrived / Expected on Pro (with Print PDF button), flat list with Upgrade banner on Basic
  - 47 Dashboard (`src/screens/S47Dashboard.tsx`): Month / Quarter / Year selector, Revenue & Profit cards, Shipments & Clients tiles, Top clients list
  - 48 Tools (`src/screens/S48Tools.tsx`): Export CSV, Audit log, API access, White-label domain cards with Pro/Enterprise badges

- **Batch 13: Public Tracking**
  - 49 Public tracking (`src/screens/S49PublicTracking.tsx`): Top-bar-less public page for SHP-1005, status chip, route, 5-step horizontal timeline, 3 photos, Freight / Deposit / Balance due card, Contact agency on WhatsApp button
  - 50 Invalid link (`src/screens/S50InvalidLink.tsx`): Centered warning icon, Link not found title, Contact your agency subtitle

- **Batch 14: Staff Detail & Label Preview**
  - 51 & 52 Account menu Owner & Front desk (`src/screens/S51AccountMenu.tsx`): Full-page account screens
  - 53 Staff detail (`src/screens/S53StaffDetail.tsx`): Paul Nkemeni avatar card, edit pencil button, Role/Office/Status card, Reset password button, Deactivate red button
  - 54 Label preview (`src/screens/S54LabelPreview.tsx`): Large printable label card with agency header, SHP-1005, Box 1 of 4, JEAN-017, route, weight/CBM, QR code, Print and Share PDF buttons

- **Batch 15 & 16: Modals, First-run Home & Verification**
  - 55 Confirm dialog (`src/screens/S55ConfirmDialogScreen.tsx`): Mark container departed modal over dimmed Container detail background
  - 56 Limit reached (`src/screens/S56LimitReachedScreen.tsx`): Limit reached sheet over dimmed Staff list background with Upgrade button
  - 57 First-run Home (`src/screens/S57FirstRunHome.tsx`): Zeroed 2x2 metric tiles, Welcome to Logislo onboarding card, Add client and New pre-alert action buttons
  - Full 58-screen (`00`–`57`) navigation registration in `src/nav.tsx`

