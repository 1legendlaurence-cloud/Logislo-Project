export interface Agency {
  name: string;
  currency: string;
  logo: string;
}

export interface Staff {
  id: string;
  name: string;
  role: "Owner" | "Manager" | "Front desk" | "Warehouse worker";
  office: string;
  whatsapp: string;
  email: string;
  customTitle?: string;
  status: "Active" | "Inactive";
  tempPassword?: string;
  agencyName?: string;
  ownerId?: string;
}

export interface Client {
  id: string;
  name: string;
  code: string;
  city: string;
  whatsapp: string;
  email?: string;
  shipmentCount: number;
  balance: number;
}

export type ShipmentStatus =
  | "Expected"
  | "Deposit paid"
  | "Received"
  | "In transit"
  | "Arrived"
  | "Ready"
  | "Collected"
  | "Unmatched"
  | "Not found";

export interface Shipment {
  id: string;
  clientName: string;
  clientCode: string;
  route: string;
  routeId?: string;
  boxes: number;
  cbm?: number;
  weightKg?: number;
  status: ShipmentStatus;
  description?: string;
  supplierTracking?: string;
  trackingLink: string;
  shippingFee: number;
  depositFee: number;
  storageFee: number;
  balance: number;
  collectorName?: string;
  dateLabel?: string;
  agencyName?: string;
  agencyLogoUrl?: string;
  whiteLabelEnabled?: boolean;
  timeline: {
    status: ShipmentStatus;
    date: string;
    completed: boolean;
    current?: boolean;
  }[];
}

export interface Container {
  id: string;
  number: string;
  size: "20ft" | "40ft";
  route: string;
  boxes: number;
  status: "Open" | "In transit" | "Arrived";
  cost?: number;
  profit?: number;
  shipments: {
    id: string;
    clientName: string;
    boxes: number;
  }[];
}

export interface Payment {
  id: string;
  shipmentId: string;
  clientName?: string;
  type: "Deposit" | "Balance" | "Storage";
  method: "Cash" | "Mobile money";
  amount: number;
  remaining?: number;
  date: string;
  recordedBy: string;
  reference?: string;
}

export interface UnmatchedItem {
  id: string;
  boxes: number;
  cbm?: number;
  weightKg?: number;
  date: string;
}

export const mockAgency: Agency = {
  name: "Douala Express",
  currency: "FCFA",
  logo: "",
};

// All initial arrays are empty for a 100% fresh app experience
export const mockStaff: Staff[] = [];
export const mockClients: Client[] = [];
export const mockShipments: Shipment[] = [];
export const mockContainers: Container[] = [];
export const mockPayments: Payment[] = [];
export const mockUnmatched: UnmatchedItem[] = [];

export const mockRouteSettings = {
  name: "Guangzhou to Douala",
  fromCountry: "China",
  fromCity: "Guangzhou",
  toCountry: "Cameroon",
  toCity: "Douala",
  pricePerKg: 1200,
  pricePerCbm: 45000,
  depositPct: 20,
  guangzhouOffice: {
    freeDays: 14,
    dailyFee: 0,
  },
  doualaOffice: {
    freeDays: 3,
    dailyFee: 5000,
  },
};

export interface MissingItem {
  id: string;
  clientName: string;
  boxes: number;
}

export const mockMissingItems: MissingItem[] = [];

export interface StorageItem {
  id: string;
  clientName: string;
  clientCode: string;
  days: number;
  fee: number;
}

export const mockStorageItems: StorageItem[] = [];
