# Logislo: PROJECT.md (single source of truth)

Attach this file at the start of EVERY new AI Studio chat. If anything elsewhere disagrees with this file, this file wins.

## 1. What Logislo is
A SaaS for freight agencies that ship goods by sea from a **receiving end** (e.g. Guangzhou, China) to a **delivery end** (e.g. Douala, Cameroon). It replaces WhatsApp chats and Excel: track every box, bill by kg or CBM, record deposit and balance, release goods only when cleared, and give each client a tracking link.
Each customer agency is isolated. One agency never sees another agency's data.
Clients (the agency's customers) never log in. They get a tracking link.

## 2. People and menus
| Role | Where | Does | Sees money |
|---|---|---|---|
| Owner | any | everything, settings, staff, plan, dashboard | yes |
| Manager (Pro) | one office | like Front desk, plus Warehouse list, Unmatched, Containers | yes |
| Front desk | delivery end | clients, pre-alerts, records deposits and balances, final bill | yes |
| Warehouse worker | either end | receiving end: receive, weigh, photo, label, load, ship. Delivery end: mark arrived, scan-check, release goods | NO. Sees only "Cleared" / "Not cleared" |

Cashier is NOT in the MVP.
Each staff member has: role, office, WhatsApp number, optional custom title (a label only; permissions come from the role).

Bottom menus:
- Owner: Home, Clients, Scan (center), Shipments, More (Payments, Containers, Warehouse list, Unmatched, Dashboard, Tools, Settings)
- Manager: Home, Clients, Scan, Shipments, More (Payments, Containers, Warehouse list, Unmatched)
- Front desk: Home, Clients, Scan, Shipments, Payments
- Warehouse worker: Home, Shipments, Scan, Containers
- Account menu (every role): header with name, role and office, then Profile and Log out. Owner and Manager open it from More (which also lists their extra screens). Front desk and Warehouse open it from an avatar in the Home header.

## 3. Plans (set by hand in the database, no billing yet)
| | Basic | Pro | Enterprise |
|---|---|---|---|
| Routes | 1 | 3 | Coming soon |
| Staff | Owner + 3 | Owner + 10 | |
| Photos | Release photo only | + photo at Receive and Scan-check | |
| Storage fees | off | on | |
| Warehouse list, Unmatched list*, Manager role, profit per container | locked | on | |
*see Open decision 2.
Locked items show a small lock and "Pro". No prices are shown in the app.

## 4. Routes and offices
A **route** is one loop: one receiving office to one delivery office (Guangzhou to Douala). Each route has: price per kg, price per CBM, deposit %.
Each **office** has: free days and daily storage fee.
Basic: 1 route. Pro: 3 routes.

## 5. Status chain
Expected > Deposit paid > Received > In transit > Arrived > Ready > Collected
Exceptions: Unmatched (box received with no owner), Not found (box missing at delivery end).
Container status: Open > In transit > Arrived.

## 6. The flow (who does what)
1. **Front desk (Douala):** adds client (app generates unique code), creates pre-alert, app shows estimate and creates the tracking link, front desk sends it by WhatsApp. Status: Expected.
2. **Front desk:** records the deposit. Status: Deposit paid.
3. **Warehouse (Guangzhou):** Scan > Receive: finds the pre-alert by client code or supplier tracking number, enters boxes, weight, dimensions, billing method, prints one label per box. No match: "Unmatched". Status: Received.
4. **Warehouse (Guangzhou):** creates a container, loads shipments or boxes, taps Shipped. Every shipment inside becomes In transit.
5. **Warehouse (Douala):** taps Arrived on the container. Status: Arrived. Clients do NOT see "ready" yet.
6. **Warehouse (Douala):** scan-check: scans each box. Scanned boxes are OK, unscanned boxes are Not found. Shipment with all boxes scanned becomes Ready.
7. **Front desk:** final bill from the measured kg or CBM. Records the balance payment.
8. **Warehouse (Douala):** Release. Unlocks only when balance is 0 (or a credit). Needs a goods photo and the collector's name. Status: Collected.
The client can open the tracking link at any moment.

## 7. Money rules (all amounts are whole FCFA, never decimals)
- Shipping = billed measure x rate. Method kg: weight_kg x price_per_kg. Method CBM: cbm x price_per_cbm.
- CBM = (length_cm x width_cm x height_cm / 1,000,000) x boxes. Length/width/height are PER CARTON. Weight is the TOTAL for the shipment.
- Estimate at pre-alert uses the entered measures. Final bill uses the MEASURED values at the receiving end.
- Deposit due = deposit_pct x estimated shipping.
- Storage = max(0, whole days stored minus free days) x daily fee, summed over both offices. Receiving-office clock: Received until container Shipped. Delivery-office clock: Ready until Collected (or today). Pro only; Basic charges 0.
- Total = shipping + goods cost + storage. Goods cost defaults to 0 (see Open decision 1).
- Balance = total minus the sum of ALL payments. Payment types (Deposit, Balance, Storage) are labels only.
- Balance below 0 is shown as "Credit".
- Release needs: status Ready, balance <= 0, collected photo, collector name.
- Example: 10 CBM x 45,000 = 450,000. Deposit 20% = 90,000. 2 storage days x 5,000 = 10,000. Balance = 450,000 + 10,000 - 90,000 = 370,000 FCFA.
- Payment methods: Cash, Mobile money (recorded by hand, no integration).
- Payments are append-only. Never edited or deleted.

## 8. Identifiers
- Shipment reference: SHP-1001, SHP-1002 ... counted per agency.
- Client code: first name, letters only, uppercase, max 5 letters, then a dash and a 3-digit agency-wide counter (JEAN-017). Unique per agency. WhatsApp number is unique per agency (duplicate shows an error).
- Box barcode: short random code, unique everywhere. The label shows the shipment ref, client code, "3/12" and a QR of the barcode, plus the barcode's short code in small text (for manual entry if a QR is damaged).
- Tracking link: long random token (32+ chars). Never the shipment ref or client code.

## 9. Public tracking page
Needs no login. Shows: agency name, shipment ref, status, route, timeline with dates, arrival photo (only if the agency is on Pro and the photo exists). Shows NO money and NO client details. A bad or unknown link shows "Link not valid".

## 10. Decisions already made
- Staff log in with email + password. The owner activates staff by invite link OR a temporary password (forced change on first login).
- Database: Supabase (Postgres, Auth, Storage, row level security).
- App name: Logislo. English only for now (all text kept in one strings file so French can be added).
- FCFA only. One currency.
- Tools menu holds "Coming soon" cards only (first: Business update agent, waitlist).
- Enterprise is a "Coming soon" card only.
- A confirm dialog appears before: shipping a container, releasing goods, deactivating staff, logging out. Shipping also shows how many shipments have no deposit (warning only, never blocks).
- Hitting a plan limit (routes, staff) shows a "Limit reached" sheet with an Upgrade button. The database enforces the limit too.
- A new agency with no shipments and no clients sees a "Get started" Home (add staff, add client, new pre-alert).
- Nothing works offline. A thin "No connection" banner warns the user; scanning and saving need a connection.

## 11. Open decisions (defaults used until the owner decides)
1. **Goods cost line on the invoice.** Default: optional "Goods cost" row on the final bill, hidden when 0.
2. **Unmatched list on Basic.** Designed as Pro. Risk: on Basic a warehouse worker has nowhere to put a box with no owner. Default: built per design (Pro), controlled by one flag in PLAN_FEATURES so it can move to Basic in one line.
3. **Partial shipments (some boxes missing).** Default: all-or-nothing. A shipment is Ready only when all its boxes are scanned. Test this in agency demos.
4. **Receiving a box with no deposit recorded.** Default: warn, do not block.
5. **Storage day counting.** Default: whole 24h days elapsed.
6. **Release override by owner (Pro).** Deferred.

## 12. NOT in the MVP
Mobile money integration, CAMCIS/e-GUCE file (a plain goods file export may come later), SMS, offline scanning, staff audit trail, Cashier role, branded client portal, client accounts, Excel import, payment reminders, profit and margin reports (only profit per container), second currency, AI tools (waitlist card only).
