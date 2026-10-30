import { Shipment, Container, Payment, Client } from "../data/mock";

export type ExportSheetType =
  | "all"
  | "shipments"
  | "containers"
  | "payments"
  | "clients";

export interface AgencyExportPayload {
  agencyName: string;
  currency?: string;
  shipments: Shipment[];
  containers: Container[];
  payments: Payment[];
  clients: Client[];
}

function escapeXml(unsafe: string | number | undefined | null): string {
  const str = String(unsafe ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeCsvCell(val: string | number | undefined | null): string {
  const str = String(val ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function triggerFileDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function getDateStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildWorksheetXml(
  sheetName: string,
  headers: string[],
  rows: (string | number | undefined | null)[][]
): string {
  const headerCells = headers
    .map(
      (h) =>
        `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`
    )
    .join("");

  const bodyRows = rows
    .map((row) => {
      const cells = row
        .map((cell) => {
          const isNum = typeof cell === "number" && !Number.isNaN(cell);
          return `<Cell><Data ss:Type="${isNum ? "Number" : "String"}">${escapeXml(
            cell ?? ""
          )}</Data></Cell>`;
        })
        .join("");
      return `<Row>${cells}</Row>`;
    })
    .join("");

  return `<Worksheet ss:Name="${escapeXml(sheetName.slice(0, 31))}">
    <Table>
      <Row>${headerCells}</Row>
      ${bodyRows}
    </Table>
  </Worksheet>`;
}

/**
 * Exports a multi-tab Microsoft Excel (.xls) workbook containing:
 * 1. Executive Summary
 * 2. Shipments & Cargo Manifest (including goods bought/shipped descriptions)
 * 3. Containers & Profit
 * 4. Financial & Payments Ledger
 * 5. Clients & Balances
 */
export function exportAgencyExcel(
  payload: AgencyExportPayload,
  type: ExportSheetType = "all"
): string {
  const {
    agencyName = "Logislo Agency",
    currency = "FCFA",
    shipments = [],
    containers = [],
    payments = [],
    clients = [],
  } = payload;

  const cleanAgency = agencyName.replace(/[^a-zA-Z0-9_-]/g, "_") || "Logislo";
  const dateStamp = getDateStamp();

  // If a single CSV sheet is requested:
  if (type !== "all") {
    return exportSingleSheetCsv(payload, type);
  }

  const totalBilled = shipments.reduce((sum, s) => sum + (s.shippingFee || 0), 0);
  const totalCollected = payments
    .filter((p) => p.amount > 0)
    .reduce((sum, p) => sum + p.amount, 0);
  const totalOwed = shipments.reduce(
    (sum, s) => sum + (s.balance > 0 ? s.balance : 0),
    0
  );
  const totalContainerProfit = containers.reduce(
    (sum, c) => sum + (c.profit || 0),
    0
  );

  // Sheet 1: Executive Summary
  const summarySheet = buildWorksheetXml(
    "Executive Summary",
    ["Metric", "Value", "Unit / Notes"],
    [
      ["Agency Name", agencyName, `Generated ${dateStamp}`],
      ["Total Shipments", shipments.length, "All statuses"],
      ["Total Clients", clients.length, "Active client codes"],
      ["Total Containers", containers.length, "Sea & Air containers"],
      ["Total Freight Billed", totalBilled, currency],
      ["Total Cash Collected", totalCollected, currency],
      ["Total Outstanding Owed", totalOwed, currency],
      ["Net Container Profit", totalContainerProfit, currency],
    ]
  );

  // Sheet 2: Shipments & Cargo Manifest
  const shipmentsSheet = buildWorksheetXml(
    "Shipments & Cargo",
    [
      "Tracking ID",
      "Client Name",
      "Client Code",
      "Goods / Cargo Description",
      "Route",
      "Status",
      "Boxes",
      "Weight (kg)",
      "Volume (CBM)",
      `Total Fee (${currency})`,
      `Paid (${currency})`,
      `Balance Owed (${currency})`,
      "Date",
    ],
    shipments.map((s) => [
      s.id,
      s.clientName,
      s.clientCode,
      s.description || "General merchandise",
      s.route,
      s.status,
      s.boxes,
      s.weightKg ?? 0,
      s.cbm ?? 0,
      s.shippingFee,
      Math.max(0, (s.shippingFee || 0) - (s.balance || 0)),
      s.balance,
      s.dateLabel || dateStamp,
    ])
  );

  // Sheet 3: Containers & Margin
  const containersSheet = buildWorksheetXml(
    "Containers",
    [
      "Container ID",
      "Container Number",
      "Size",
      "Route",
      "Status",
      "Boxes",
      "Shipments Count",
      `Operating Cost (${currency})`,
      `Net Profit (${currency})`,
    ],
    containers.map((c) => [
      c.id,
      c.number,
      c.size,
      c.route,
      c.status,
      c.boxes,
      c.shipments ? c.shipments.length : 0,
      c.cost ?? 0,
      c.profit ?? 0,
    ])
  );

  // Sheet 4: Payments & Sales Ledger
  const paymentsSheet = buildWorksheetXml(
    "Payments & Sales",
    [
      "Receipt ID",
      "Shipment ID",
      "Client Name",
      "Payment Type",
      "Payment Method",
      `Amount (${currency})`,
      "Date",
      "Recorded By",
    ],
    payments.map((p) => [
      p.id,
      p.shipmentId,
      p.clientName || "",
      p.type,
      p.method,
      p.amount,
      p.date,
      p.recordedBy || "Owner",
    ])
  );

  // Sheet 5: Clients
  const clientsSheet = buildWorksheetXml(
    "Clients",
    [
      "Client Code",
      "Full Name",
      "WhatsApp / Phone",
      "City",
      "Total Shipments",
      `Total Billed (${currency})`,
      `Outstanding Balance (${currency})`,
    ],
    clients.map((c) => {
      const clientShipments = shipments.filter(
        (s) => s.clientCode === c.code || s.clientName === c.name
      );
      const clientBilled = clientShipments.reduce((sum, s) => sum + s.shippingFee, 0);
      const clientOwed = clientShipments.reduce(
        (sum, s) => sum + (s.balance > 0 ? s.balance : 0),
        0
      );
      return [
        c.code,
        c.name,
        c.whatsapp,
        c.city,
        clientShipments.length || c.shipmentCount || 0,
        clientBilled,
        clientOwed,
      ];
    })
  );

  // Assemble Excel XML workbook
  const workbookXml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center"/>
      <Borders/>
      <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#111827"/>
      <Interior/>
      <NumberFormat/>
      <Protection/>
    </Style>
    <Style ss:ID="Header">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
      <Interior ss:Color="#0F172A" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  ${summarySheet}
  ${shipmentsSheet}
  ${containersSheet}
  ${paymentsSheet}
  ${clientsSheet}
</Workbook>`;

  const filename = `${cleanAgency}_Full_Export_${dateStamp}.xls`;
  const blob = new Blob([workbookXml], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  triggerFileDownload(blob, filename);

  return filename;
}

/**
 * Exports a single-table CSV file for focused downloads (e.g., just Shipments, Containers, Payments, or Clients)
 */
export function exportSingleSheetCsv(
  payload: AgencyExportPayload,
  type: ExportSheetType
): string {
  const {
    agencyName = "Logislo Agency",
    currency = "FCFA",
    shipments = [],
    containers = [],
    payments = [],
    clients = [],
  } = payload;

  const cleanAgency = agencyName.replace(/[^a-zA-Z0-9_-]/g, "_") || "Logislo";
  const dateStamp = getDateStamp();

  let filename = `${cleanAgency}_Export_${dateStamp}.csv`;
  let headers: string[] = [];
  let rows: (string | number | undefined | null)[][] = [];
  let suffix = "Report";

  if (type === "shipments") {
    suffix = "Shipments_Cargo";
    headers = [
      "Tracking ID",
      "Client Name",
      "Client Code",
      "Cargo / Merchandise",
      "Route",
      "Status",
      "Boxes",
      "Weight (kg)",
      "Volume (CBM)",
      `Total Fee (${currency})`,
      `Paid (${currency})`,
      `Balance (${currency})`,
      "Date",
    ];
    rows = shipments.map((s) => [
      s.id,
      s.clientName,
      s.clientCode,
      s.description || "General merchandise",
      s.route,
      s.status,
      s.boxes,
      s.weightKg ?? 0,
      s.cbm ?? 0,
      s.shippingFee,
      Math.max(0, (s.shippingFee || 0) - (s.balance || 0)),
      s.balance,
      s.dateLabel || dateStamp,
    ]);
  } else if (type === "containers") {
    suffix = "Containers_Profit";
    headers = [
      "Container ID",
      "Container Number",
      "Size",
      "Route",
      "Status",
      "Boxes",
      "Shipments Count",
      `Operating Cost (${currency})`,
      `Net Profit (${currency})`,
    ];
    rows = containers.map((c) => [
      c.id,
      c.number,
      c.size,
      c.route,
      c.status,
      c.boxes,
      c.shipments ? c.shipments.length : 0,
      c.cost ?? 0,
      c.profit ?? 0,
    ]);
  } else if (type === "payments") {
    suffix = "Sales_Payments_Ledger";
    headers = [
      "Receipt ID",
      "Shipment ID",
      "Client Name",
      "Payment Type",
      "Method",
      `Amount (${currency})`,
      "Date",
      "Recorded By",
    ];
    rows = payments.map((p) => [
      p.id,
      p.shipmentId,
      p.clientName || "",
      p.type,
      p.method,
      p.amount,
      p.date,
      p.recordedBy || "Owner",
    ]);
  } else {
    suffix = "Clients_Directory";
    headers = [
      "Client Code",
      "Full Name",
      "WhatsApp / Phone",
      "City",
      "Total Shipments",
      `Total Billed (${currency})`,
      `Outstanding Balance (${currency})`,
    ];
    rows = clients.map((c) => {
      const clientShipments = shipments.filter(
        (s) => s.clientCode === c.code || s.clientName === c.name
      );
      const clientBilled = clientShipments.reduce((sum, s) => sum + s.shippingFee, 0);
      const clientOwed = clientShipments.reduce(
        (sum, s) => sum + (s.balance > 0 ? s.balance : 0),
        0
      );
      return [
        c.code,
        c.name,
        c.whatsapp,
        c.city,
        clientShipments.length || c.shipmentCount || 0,
        clientBilled,
        clientOwed,
      ];
    });
  }

  filename = `${cleanAgency}_${suffix}_${dateStamp}.csv`;

  const csvContent = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  triggerFileDownload(blob, filename);

  return filename;
}
