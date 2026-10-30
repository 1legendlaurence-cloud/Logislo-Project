import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  handleFirestoreError,
  OperationType,
} from "../firebase";
import {
  Staff,
  Client,
  Shipment,
  ShipmentStatus,
  Container,
  Payment,
  UnmatchedItem,
  mockAgency,
  mockRouteSettings,
} from "../data/mock";

import { Language, TUTO_LESSONS_BY_ROLE } from "../i18n";

export type Role = "Owner" | "Manager" | "Front desk" | "Warehouse worker";
export type Plan = "Basic" | "Pro";

export interface RouteItem {
  id: string;
  name: string;
  fromCountry: string;
  fromCity: string;
  toCountry: string;
  toCity: string;
  pricePerKg: number;
  pricePerCbm: number;
  depositPct: number;
  gzFreeDays: number;
  gzDailyFee: number;
  dlaFreeDays: number;
  dlaDailyFee: number;
}

export interface UserProfileData {
  name: string;
  email: string;
  whatsapp: string;
  agencyName: string;
  agencyId?: string;
  agencyLogoUrl?: string;
  whiteLabelEnabled?: boolean;
  currency: string;
  role: Role;
  plan: Plan;
  waitlistJoined: boolean;
}

interface ConfirmState {
  isOpen: boolean;
  variant?: "ship" | "release" | "deactivate" | "logout";
  title?: string;
  line1?: string;
  line2?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
}

interface LimitState {
  isOpen: boolean;
  variant?: "routes" | "staff";
}

interface DraftRoute {
  fromCountry: string;
  fromCity: string;
  toCountry: string;
  toCity: string;
}

interface DemoContextType {
  role: Role;
  setRole: (role: Role) => void;
  plan: Plan;
  setPlan: (plan: Plan) => void;
  screenId: string;
  stack: string[];
  go: (id: string) => void;
  back: () => void;
  reset: (id: string) => void;
  offlineBanner: boolean;
  setOfflineBanner: (show: boolean) => void;
  variant: string | null;
  setVariant: (variant: string | null) => void;
  moreSheetOpen: boolean;
  setMoreSheetOpen: (open: boolean) => void;
  confirmDialog: ConfirmState;
  showConfirm: (state: Omit<ConfirmState, "isOpen">) => void;
  hideConfirm: () => void;
  limitSheet: LimitState;
  showLimit: (variant: "routes" | "staff") => void;
  hideLimit: () => void;
  getHomeForRole: (r?: Role) => string;

  // Language & Progressive Tuto
  language: Language;
  setLanguage: (lang: Language) => void;
  tutoActive: boolean;
  setTutoActive: (active: boolean) => void;
  tutoStepByRole: Record<Role, number>;
  setTutoStepForRole: (role: Role, step: number) => void;
  tutoCompletedByRole: Record<Role, string[]>;
  markTutoLessonDone: (role: Role, lessonId: string) => void;
  resetTutoForRole: (role: Role) => void;
  startTutoLesson: (role: Role, stepIndex?: number) => void;

  // Firebase Auth, Multi-Device Agency Join, & Workspace Reset
  user: User | null;
  authReady: boolean;
  userProfile: UserProfileData;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<UserProfileData>) => Promise<void>;
  joinAgency: (
    email: string,
    tempPassword: string
  ) => Promise<{ ok: boolean; error?: string; role?: Role; agencyName?: string }>;
  clearAllWorkspaceData: () => Promise<void>;
  lookupPublicShipment: (trackingId: string) => Promise<Shipment | null>;

  // Routes
  routes: RouteItem[];
  selectedRouteId: string;
  setSelectedRouteId: (id: string) => void;
  draftRoute: DraftRoute | null;
  setDraftRoute: (draft: DraftRoute | null) => void;
  saveRouteSettings: (settings: {
    pricePerKg: number;
    pricePerCbm: number;
    depositPct: number;
    gzFreeDays: number;
    gzDailyFee: number;
    dlaFreeDays: number;
    dlaDailyFee: number;
  }) => Promise<void>;

  // Staff
  staffList: (Staff & { tempPassword?: string })[];
  selectedStaffId: string;
  setSelectedStaffId: (id: string) => void;
  addStaff: (member: {
    name: string;
    email: string;
    whatsapp: string;
    role: Role;
    office: string;
    customTitle?: string;
  }) => Promise<Staff & { tempPassword?: string }>;
  updateStaff: (id: string, patch: Partial<Staff>) => Promise<void>;
  deactivateStaff: (id: string) => Promise<void>;

  // Clients
  clients: Client[];
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  addClient: (data: {
    name: string;
    whatsapp: string;
    email?: string;
    city?: string;
  }) => Promise<Client>;
  updateClient: (id: string, patch: Partial<Client>) => Promise<void>;

  // Shipments
  shipments: Shipment[];
  selectedShipmentId: string;
  setSelectedShipmentId: (id: string) => void;
  addShipment: (data: {
    clientName: string;
    description?: string;
    supplierTracking?: string;
    weightKg: number;
    cbm: number;
    boxes?: number;
    rateMode: "kg" | "CBM";
  }) => Promise<Shipment>;
  updateShipment: (id: string, patch: Partial<Shipment>) => Promise<void>;
  receiveShipment: (
    id: string,
    data: { boxes: number; weightKg: number; cbm?: number }
  ) => Promise<void>;
  releaseShipment: (id: string, collectorName: string) => Promise<void>;

  // Containers
  containers: Container[];
  selectedContainerId: string;
  setSelectedContainerId: (id: string) => void;
  addContainer: (data: {
    number: string;
    size: "20ft" | "40ft";
    route: string;
    cost?: number;
  }) => Promise<Container>;
  updateContainer: (id: string, patch: Partial<Container>) => Promise<void>;
  assignShipmentsToContainer: (
    containerId: string,
    shipmentIds: string[]
  ) => Promise<void>;

  // Payments
  payments: Payment[];
  selectedPaymentId: string;
  setSelectedPaymentId: (id: string) => void;
  recordPayment: (data: {
    shipmentId: string;
    type: "Deposit" | "Balance" | "Storage";
    method: "Cash" | "Mobile money";
    amount: number;
    reference?: string;
  }) => Promise<Payment>;

  // Unmatched
  unmatchedItems: (UnmatchedItem & { route?: string; markings?: string })[];
  selectedUnmatchedId: string;
  setSelectedUnmatchedId: (id: string) => void;
  logUnmatched: (data: {
    boxes: number;
    weightKg: number;
    cbm: number;
    route: string;
    markings: string;
  }) => Promise<UnmatchedItem>;
  matchUnmatchedToShipment: (
    unmatchedId: string,
    shipmentId: string
  ) => Promise<void>;
}

const DEFAULT_ROUTE: RouteItem = {
  id: "route-1",
  name: mockRouteSettings.name,
  fromCountry: mockRouteSettings.fromCountry,
  fromCity: mockRouteSettings.fromCity,
  toCountry: mockRouteSettings.toCountry,
  toCity: mockRouteSettings.toCity,
  pricePerKg: mockRouteSettings.pricePerKg,
  pricePerCbm: mockRouteSettings.pricePerCbm,
  depositPct: mockRouteSettings.depositPct,
  gzFreeDays: mockRouteSettings.guangzhouOffice.freeDays,
  gzDailyFee: mockRouteSettings.guangzhouOffice.dailyFee,
  dlaFreeDays: mockRouteSettings.doualaOffice.freeDays,
  dlaDailyFee: mockRouteSettings.doualaOffice.dailyFee,
};

const DEFAULT_PROFILE: UserProfileData = {
  name: "Owner",
  email: "",
  whatsapp: "",
  agencyName: mockAgency.name,
  agencyLogoUrl: "preset:#0B5FFF",
  whiteLabelEnabled: false,
  currency: mockAgency.currency,
  role: "Owner",
  plan: "Basic",
  waitlistJoined: false,
};

function formatShortDate(d = new Date()): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function makeTimeline(currentStatus: ShipmentStatus) {
  const order: ShipmentStatus[] = [
    "Expected",
    "Received",
    "In transit",
    "Arrived",
    "Ready",
    "Collected",
  ];
  const currentIdx = Math.max(0, order.indexOf(currentStatus));
  const todayLabel = formatShortDate();
  return order.map((st, idx) => ({
    status: st,
    date: idx <= currentIdx ? todayLabel : "Pending",
    completed: idx <= currentIdx,
    current: idx === currentIdx,
  }));
}

/**
 * Generates sequential, company-ordered IDs (e.g., SHP-1001, SHP-1002, STF-001, CNT-001, RCP-1001)
 */
function nextSequentialId(
  existingIds: string[],
  prefix: string,
  startNum: number,
  padLength: number
): string {
  let maxNum = startNum - 1;
  const regex = new RegExp(`^${prefix}-(\\d+)$`, "i");
  for (const id of existingIds) {
    const m = id.match(regex);
    if (m) {
      const n = parseInt(m[1], 10);
      if (!isNaN(n) && n > maxNum) {
        maxNum = n;
      }
    }
  }
  const next = maxNum + 1;
  return `${prefix}-${String(next).padStart(padLength, "0")}`;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfileData>(DEFAULT_PROFILE);

  const [role, setRoleState] = useState<Role>("Owner");
  const [plan, setPlanState] = useState<Plan>("Basic");
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("logislo_lang");
      if (saved === "en" || saved === "fr" || saved === "zh") return saved;
    } catch {}
    return "en";
  });
  const [tutoActive, setTutoActive] = useState<boolean>(false);
  const [tutoStepByRole, setTutoStepByRole] = useState<Record<Role, number>>(() => {
    try {
      const saved = localStorage.getItem("logislo_tuto_steps");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      Owner: 0,
      Manager: 0,
      "Front desk": 0,
      "Warehouse worker": 0,
    };
  });
  const [tutoCompletedByRole, setTutoCompletedByRole] = useState<Record<Role, string[]>>(() => {
    try {
      const saved = localStorage.getItem("logislo_tuto_completed");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      Owner: [],
      Manager: [],
      "Front desk": [],
      "Warehouse worker": [],
    };
  });
  // Detect if the user is visiting via track.logislo.com or /track path
  const isTrackingDomain = (() => {
    if (typeof window === "undefined") return false;
    const hostname = window.location.hostname.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    return (
      hostname.startsWith("track.") ||
      pathname.startsWith("/track") ||
      window.location.hash.startsWith("#/track")
    );
  })();

  const [stack, setStack] = useState<string[]>(() => (isTrackingDomain ? ["49"] : ["00"]));
  const [offlineBanner, setOfflineBanner] = useState<boolean>(false);
  const [variant, setVariant] = useState<string | null>(null);
  const [moreSheetOpen, setMoreSheetOpen] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmState>({ isOpen: false });
  const [limitSheet, setLimitSheet] = useState<LimitState>({ isOpen: false });

  // Domain Data State — 100% Fresh (Zero Mock Data)
  const [routes, setRoutes] = useState<RouteItem[]>([DEFAULT_ROUTE]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("route-1");
  const [draftRoute, setDraftRoute] = useState<DraftRoute | null>(null);

  const [staffList, setStaffList] = useState<(Staff & { tempPassword?: string })[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>("");

  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainerId, setSelectedContainerId] = useState<string>("");

  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");

  const [unmatchedItems, setUnmatchedItems] = useState<
    (UnmatchedItem & { route?: string; markings?: string })[]
  >([]);
  const [selectedUnmatchedId, setSelectedUnmatchedId] = useState<string>("");

  const screenId = stack[stack.length - 1] || "00";

  // Active workspace ID: if this user joined an existing agency as staff, use the agency's ownerId
  const activeWorkspaceId = userProfile.agencyId || user?.uid || "";

  const getHomeForRole = useCallback(
    (r?: Role): string => {
      const target = r || role;
      if (target === "Owner") return "16";
      if (target === "Manager" || target === "Front desk") return "17";
      return "18"; // Warehouse
    },
    [role]
  );

  // Sync hostname and hash routing on mount / change
  useEffect(() => {
    const checkRoute = () => {
      const hostname = window.location.hostname.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash;

      if (hostname.startsWith("track.") || pathname.startsWith("/track")) {
        // Read tracking id from path (e.g. /SHP-1001 or /track/SHP-1001), query, or hash
        const rawPath = pathname
          .replace(/^\/track\/?/, "")
          .replace(/^\/+/, "")
          .replace(/\/+$/, "")
          .trim();
        const pathPart =
          rawPath && rawPath !== "index.html" ? rawPath : "";
        const hashPart = hash
          .replace(/^#\/track\/?/, "")
          .replace(/^#\/?/, "")
          .trim();
        const params = new URLSearchParams(window.location.search);
        const queryId = (params.get("id") || params.get("tracking") || "").trim();
        const targetId = (pathPart || hashPart || queryId).toUpperCase();

        if (targetId && targetId !== "INVALID") {
          setSelectedShipmentId(targetId);
        }
        setStack(["49"]);
        return;
      }

      if (hash.startsWith("#/track/")) {
        const code = decodeURIComponent(hash.replace("#/track/", "")).trim();
        if (code && code !== "invalid") {
          setSelectedShipmentId(code.toUpperCase());
          setStack(["49"]);
        } else {
          setStack(["50"]);
        }
      }
    };
    checkRoute();
    window.addEventListener("hashchange", checkRoute);
    window.addEventListener("popstate", checkRoute);
    return () => {
      window.removeEventListener("hashchange", checkRoute);
      window.removeEventListener("popstate", checkRoute);
    };
  }, []);

  /**
   * Purges any legacy mock data documents that were seeded in earlier versions
   * so existing accounts start completely fresh with 0 fake records.
   */
  const purgeLegacyMockDataOnce = useCallback(async (uid: string) => {
    const flagKey = `logislo_fresh_purged_v2_${uid}`;
    try {
      if (localStorage.getItem(flagKey) === "true") return;
    } catch {}

    const legacyCollectionsAndIds: [string, string[]][] = [
      ["staff", ["staff-1", "staff-2", "staff-3", "staff-4"]],
      ["clients", ["cli-1", "cli-2", "cli-3", "cli-4"]],
      ["shipments", ["SHP-1005", "SHP-1006", "SHP-1007", "SHP-1008"]],
      ["containers", ["C-001", "C-002", "C-003"]],
      ["payments", ["pay-1", "pay-2", "pay-3", "pay-4"]],
      ["unmatched", ["U-001", "U-002"]],
    ];

    try {
      const batch = writeBatch(db);
      for (const [colName, ids] of legacyCollectionsAndIds) {
        for (const rawId of ids) {
          batch.delete(doc(db, colName, `${uid}_${rawId}`));
        }
      }
      await batch.commit();
      try {
        localStorage.setItem(flagKey, "true");
      } catch {}
    } catch {
      // Ignore if documents didn't exist
    }
  }, []);

  // Initialize authenticated user profile & default route ONLY (zero mock clients/shipments)
  const ensureUserSeeded = useCallback(
    async (currentUser: User) => {
      const uid = currentUser.uid;
      await purgeLegacyMockDataOnce(uid);

      try {
        const userSnap = await getDocs(
          query(collection(db, "users"), where("ownerId", "==", uid))
        );
        if (!userSnap.empty) {
          return;
        }

        const batch = writeBatch(db);
        const ownerName = (currentUser.displayName || "Agency Owner").slice(0, 120);
        const ownerEmail = (currentUser.email || "owner@company.com").slice(0, 160);

        const profileDoc = {
          ownerId: uid,
          agencyId: uid,
          name: ownerName,
          email: ownerEmail,
          whatsapp: "+237 6 00 00 00 00",
          agencyName: mockAgency.name,
          agencyLogoUrl: "preset:#0B5FFF",
          whiteLabelEnabled: false,
          currency: mockAgency.currency,
          role: "Owner",
          plan: "Basic",
          waitlistJoined: false,
        };
        batch.set(doc(db, "users", uid), profileDoc);

        // Default route configuration so the agency can immediately price cargo
        const routeDocId = `${uid}_route-1`;
        batch.set(doc(db, "routes", routeDocId), {
          id: routeDocId,
          ownerId: uid,
          name: DEFAULT_ROUTE.name,
          fromCountry: DEFAULT_ROUTE.fromCountry,
          fromCity: DEFAULT_ROUTE.fromCity,
          toCountry: DEFAULT_ROUTE.toCountry,
          toCity: DEFAULT_ROUTE.toCity,
          pricePerKg: DEFAULT_ROUTE.pricePerKg,
          pricePerCbm: DEFAULT_ROUTE.pricePerCbm,
          depositPct: DEFAULT_ROUTE.depositPct,
          gzFreeDays: DEFAULT_ROUTE.gzFreeDays,
          gzDailyFee: DEFAULT_ROUTE.gzDailyFee,
          dlaFreeDays: DEFAULT_ROUTE.dlaFreeDays,
          dlaDailyFee: DEFAULT_ROUTE.dlaDailyFee,
        });

        await batch.commit();
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, "seed");
      }
    },
    [purgeLegacyMockDataOnce]
  );

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      if (currentUser) {
        await ensureUserSeeded(currentUser);
      }
    });
    return () => unsub();
  }, [ensureUserSeeded]);

  // Listen to user's own profile document
  useEffect(() => {
    if (!authReady || !user) return;
    const uid = user.uid;

    const unsubUser = onSnapshot(
      doc(db, "users", uid),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          const newRole = (d.role as Role) || "Owner";
          const newPlan = (d.plan as Plan) || "Basic";
          setRoleState(newRole);
          setPlanState(newPlan);
          setUserProfile({
            name: d.name || "Owner",
            email: d.email || "",
            whatsapp: d.whatsapp || "",
            agencyName: d.agencyName || "",
            agencyId: d.agencyId || uid,
            agencyLogoUrl: d.agencyLogoUrl || "preset:#0B5FFF",
            whiteLabelEnabled: Boolean(d.whiteLabelEnabled),
            currency: d.currency || "FCFA",
            role: newRole,
            plan: newPlan,
            waitlistJoined: Boolean(d.waitlistJoined),
          });
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, `users/${uid}`)
    );

    return () => unsubUser();
  }, [authReady, user]);

  // Listen to shared company workspace collections scoped by `activeWorkspaceId`
  useEffect(() => {
    if (!authReady || !user || !activeWorkspaceId) return;
    const wsId = activeWorkspaceId;

    const stripPrefix = (docId: string) =>
      docId.startsWith(`${wsId}_`) ? docId.slice(wsId.length + 1) : docId;

    const unsubRoutes = onSnapshot(
      query(collection(db, "routes"), where("ownerId", "==", wsId)),
      (snap) => {
        if (!snap.empty) {
          const items: RouteItem[] = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: stripPrefix(data.id),
              name: data.name,
              fromCountry: data.fromCountry,
              fromCity: data.fromCity,
              toCountry: data.toCountry,
              toCity: data.toCity,
              pricePerKg: data.pricePerKg,
              pricePerCbm: data.pricePerCbm,
              depositPct: data.depositPct,
              gzFreeDays: data.gzFreeDays ?? 14,
              gzDailyFee: data.gzDailyFee ?? 0,
              dlaFreeDays: data.dlaFreeDays ?? 3,
              dlaDailyFee: data.dlaDailyFee ?? 5000,
            };
          });
          setRoutes(items);
        } else {
          setRoutes([DEFAULT_ROUTE]);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "routes")
    );

    const unsubStaff = onSnapshot(
      query(collection(db, "staff"), where("ownerId", "==", wsId)),
      (snap) => {
        const items = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: stripPrefix(data.id),
            ownerId: data.ownerId,
            agencyName: data.agencyName,
            name: data.name,
            role: data.role as Role,
            office: data.office,
            whatsapp: data.whatsapp,
            email: data.email,
            customTitle: data.customTitle,
            status: data.status as "Active" | "Inactive",
            tempPassword: data.tempPassword,
          };
        });
        items.sort((a, b) => a.id.localeCompare(b.id));
        setStaffList(items);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "staff")
    );

    const unsubClients = onSnapshot(
      query(collection(db, "clients"), where("ownerId", "==", wsId)),
      (snap) => {
        const items: Client[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: stripPrefix(data.id),
            name: data.name,
            code: data.code,
            city: data.city,
            whatsapp: data.whatsapp,
            email: data.email,
            shipmentCount: data.shipmentCount,
            balance: data.balance,
          };
        });
        items.sort((a, b) => a.code.localeCompare(b.code));
        setClients(items);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "clients")
    );

    const unsubShipments = onSnapshot(
      query(collection(db, "shipments"), where("ownerId", "==", wsId)),
      (snap) => {
        const items: Shipment[] = snap.docs.map((d) => {
          const data = d.data();
          const status = (data.status as ShipmentStatus) || "Expected";
          return {
            id: stripPrefix(data.id),
            clientName: data.clientName,
            clientCode: data.clientCode,
            route: data.route,
            boxes: data.boxes,
            cbm: data.cbm,
            weightKg: data.weightKg,
            status,
            description: data.description,
            supplierTracking: data.supplierTracking,
            trackingLink: data.trackingLink,
            shippingFee: data.shippingFee,
            depositFee: data.depositFee,
            storageFee: data.storageFee,
            balance: data.balance,
            collectorName: data.collectorName,
            dateLabel: data.dateLabel,
            agencyName: data.agencyName,
            agencyLogoUrl: data.agencyLogoUrl,
            whiteLabelEnabled: Boolean(data.whiteLabelEnabled),
            timeline: makeTimeline(status),
          };
        });
        items.sort((a, b) => b.id.localeCompare(a.id));
        setShipments(items);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "shipments")
    );

    const unsubContainers = onSnapshot(
      query(collection(db, "containers"), where("ownerId", "==", wsId)),
      (snap) => {
        const items: Container[] = snap.docs.map((d) => {
          const data = d.data();
          const shpIds = data.shipmentIds
            ? String(data.shipmentIds)
                .split(",")
                .filter(Boolean)
            : [];
          return {
            id: stripPrefix(data.id),
            number: data.number,
            size: data.size as "20ft" | "40ft",
            route: data.route,
            boxes: data.boxes,
            status: data.status as "Open" | "In transit" | "Arrived",
            cost: data.cost,
            profit: data.profit,
            shipments: shpIds.map((sid) => ({
              id: sid,
              clientName: "Assigned shipment",
              boxes: 1,
            })),
          };
        });
        items.sort((a, b) => b.id.localeCompare(a.id));
        setContainers(items);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "containers")
    );

    const unsubPayments = onSnapshot(
      query(collection(db, "payments"), where("ownerId", "==", wsId)),
      (snap) => {
        const items: Payment[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: stripPrefix(data.id),
            shipmentId: data.shipmentId,
            clientName: data.clientName,
            type: data.type,
            method: data.method,
            amount: data.amount,
            remaining: data.remaining,
            date: data.date,
            recordedBy: data.recordedBy,
            reference: data.reference,
          };
        });
        items.sort((a, b) => b.id.localeCompare(a.id));
        setPayments(items);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "payments")
    );

    const unsubUnmatched = onSnapshot(
      query(collection(db, "unmatched"), where("ownerId", "==", wsId)),
      (snap) => {
        const items = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: stripPrefix(data.id),
            boxes: data.boxes,
            cbm: data.cbm,
            weightKg: data.weightKg,
            date: data.date,
            route: data.route,
            markings: data.markings,
          };
        });
        setUnmatchedItems(items);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "unmatched")
    );

    return () => {
      unsubRoutes();
      unsubStaff();
      unsubClients();
      unsubShipments();
      unsubContainers();
      unsubPayments();
      unsubUnmatched();
    };
  }, [authReady, user, activeWorkspaceId]);

  const updateProfile = async (patch: Partial<UserProfileData>) => {
    const next = { ...userProfile, ...patch };
    setUserProfile(next);
    if (patch.role) setRoleState(patch.role);
    if (patch.plan) setPlanState(patch.plan);

    if (user) {
      const uid = user.uid;
      const wsId = next.agencyId || uid;
      try {
        await setDoc(doc(db, "users", uid), {
          ownerId: uid,
          agencyId: wsId.slice(0, 128),
          name: (next.name || "Owner").slice(0, 120),
          email: (next.email || user.email || "owner@company.com").slice(0, 160),
          whatsapp: (next.whatsapp || "").slice(0, 40),
          agencyName: (next.agencyName || "Douala Express").slice(0, 120),
          ...(next.agencyLogoUrl
            ? { agencyLogoUrl: next.agencyLogoUrl.slice(0, 150000) }
            : {}),
          whiteLabelEnabled: Boolean(next.whiteLabelEnabled),
          currency: (next.currency || "FCFA").slice(0, 16),
          role: next.role,
          plan: next.plan,
          waitlistJoined: Boolean(next.waitlistJoined),
        });

        // If agency branding or plan changed, propagate to active shipments so public tracking reflects it
        if (
          patch.agencyName !== undefined ||
          patch.agencyLogoUrl !== undefined ||
          patch.whiteLabelEnabled !== undefined ||
          patch.plan !== undefined
        ) {
          const isProWhiteLabel = Boolean(
            next.plan === "Pro" && next.whiteLabelEnabled
          );
          setShipments((prev) =>
            prev.map((s) => ({
              ...s,
              agencyName: next.agencyName,
              agencyLogoUrl: next.agencyLogoUrl,
              whiteLabelEnabled: isProWhiteLabel,
            }))
          );
          for (const shp of shipments) {
            const shpDocId = `${wsId}_${shp.id}`;
            await setDoc(
              doc(db, "shipments", shpDocId),
              {
                agencyName: (next.agencyName || "Douala Express").slice(0, 120),
                ...(next.agencyLogoUrl
                  ? { agencyLogoUrl: next.agencyLogoUrl.slice(0, 150000) }
                  : {}),
                whiteLabelEnabled: isProWhiteLabel,
              },
              { merge: true }
            ).catch(() => {});
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
      }
    }
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    updateProfile({ role: newRole });
  };

  const setPlan = (newPlan: Plan) => {
    setPlanState(newPlan);
    updateProfile({
      plan: newPlan,
      whiteLabelEnabled: newPlan === "Pro" ? userProfile.whiteLabelEnabled ?? true : false,
    });
  };

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    await ensureUserSeeded(cred.user);
  };

  const logout = async () => {
    if (user) {
      await signOut(auth);
    }
    reset("02");
  };

  /**
   * Links a staff member's device/account to their Owner's agency workspace
   * by matching their email + temporary password in the `staff` collection.
   */
  const joinAgency = async (
    emailInput: string,
    tempPasswordInput: string
  ): Promise<{ ok: boolean; error?: string; role?: Role; agencyName?: string }> => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanCode = tempPasswordInput.trim().toUpperCase();

    if (!cleanEmail || !cleanCode) {
      return { ok: false, error: "Please enter both your email and temporary password." };
    }

    // 1. Check local staffList first
    let matched = staffList.find(
      (s) =>
        s.email.trim().toLowerCase() === cleanEmail &&
        (s.tempPassword || "").trim().toUpperCase() === cleanCode
    );

    // 2. If not found locally and user is authenticated, query Firestore `staff` collection across agencies
    if (!matched && user) {
      try {
        const snap = await getDocs(
          query(collection(db, "staff"), where("tempPassword", "==", cleanCode))
        );
        if (!snap.empty) {
          for (const d of snap.docs) {
            const data = d.data();
            if (
              String(data.email || "").trim().toLowerCase() === cleanEmail ||
              snap.docs.length === 1
            ) {
              matched = {
                id: data.id,
                ownerId: data.ownerId,
                agencyName: data.agencyName || "Freight Agency",
                name: data.name,
                role: data.role as Role,
                office: data.office,
                whatsapp: data.whatsapp,
                email: data.email,
                status: data.status,
                tempPassword: data.tempPassword,
              };
              break;
            }
          }
        }
      } catch {
        // Fallback if query fails
      }
    }

    if (!matched) {
      return {
        ok: false,
        error:
          "No active staff invitation found with that email and temporary password. Check with your agency owner.",
      };
    }

    const targetAgencyId = matched.ownerId || activeWorkspaceId;
    const targetAgencyName =
      matched.agencyName || userProfile.agencyName || "Douala Express";

    await updateProfile({
      agencyId: targetAgencyId,
      agencyName: targetAgencyName,
      name: matched.name,
      email: matched.email,
      whatsapp: matched.whatsapp,
      role: matched.role,
    });

    return {
      ok: true,
      role: matched.role,
      agencyName: targetAgencyName,
    };
  };

  /**
   * Clears all shipments, clients, containers, payments, unmatched items, and non-owner staff
   * so the user can test the app from a 100% fresh state at any time.
   */
  const clearAllWorkspaceData = async () => {
    setStaffList([]);
    setClients([]);
    setShipments([]);
    setContainers([]);
    setPayments([]);
    setUnmatchedItems([]);
    setSelectedStaffId("");
    setSelectedClientId("");
    setSelectedShipmentId("");
    setSelectedContainerId("");
    setSelectedPaymentId("");
    setSelectedUnmatchedId("");

    if (user && activeWorkspaceId) {
      const wsId = activeWorkspaceId;
      const cols = ["staff", "clients", "shipments", "containers", "payments", "unmatched"];
      try {
        for (const colName of cols) {
          const snap = await getDocs(
            query(collection(db, colName), where("ownerId", "==", wsId))
          );
          if (!snap.empty) {
            const batch = writeBatch(db);
            snap.docs.forEach((d) => batch.delete(d.ref));
            await batch.commit();
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, "workspace-reset");
      }
    }
  };

  /**
   * Public tracking lookup that finds a shipment by ID in local state or Firestore.
   */
  const lookupPublicShipment = async (trackingId: string): Promise<Shipment | null> => {
    const clean = trackingId.trim().toUpperCase();
    if (!clean) return null;

    const localMatch = shipments.find((s) => s.id.toUpperCase() === clean);
    if (localMatch) return localMatch;

    try {
      const snap = await getDocs(collection(db, "shipments"));
      for (const d of snap.docs) {
        const data = d.data();
        const rawId = String(data.id || "");
        const shortId = rawId.includes("_")
          ? rawId.slice(rawId.indexOf("_") + 1)
          : rawId;
        if (shortId.toUpperCase() === clean) {
          const status = (data.status as ShipmentStatus) || "Expected";
          return {
            id: shortId,
            clientName: data.clientName,
            clientCode: data.clientCode,
            route: data.route,
            boxes: data.boxes,
            cbm: data.cbm,
            weightKg: data.weightKg,
            status,
            description: data.description,
            supplierTracking: data.supplierTracking,
            trackingLink: data.trackingLink,
            shippingFee: data.shippingFee,
            depositFee: data.depositFee,
            storageFee: data.storageFee,
            balance: data.balance,
            agencyName: data.agencyName || "",
            agencyLogoUrl: data.agencyLogoUrl || "",
            whiteLabelEnabled: Boolean(data.whiteLabelEnabled),
            timeline: makeTimeline(status),
          };
        }
      }
    } catch {
      // Ignore network/offline errors
    }
    return null;
  };

  const saveRouteSettings = async (settings: {
    pricePerKg: number;
    pricePerCbm: number;
    depositPct: number;
    gzFreeDays: number;
    gzDailyFee: number;
    dlaFreeDays: number;
    dlaDailyFee: number;
  }) => {
    const isNew = Boolean(draftRoute);
    const targetId = isNew
      ? nextSequentialId(
          routes.map((r) => r.id),
          "route",
          1,
          1
        )
      : selectedRouteId || "route-1";
    const existingRoute = routes.find((r) => r.id === targetId) || DEFAULT_ROUTE;

    const updatedRoute: RouteItem = {
      id: targetId,
      name: draftRoute
        ? `${draftRoute.fromCity} to ${draftRoute.toCity}`
        : existingRoute.name,
      fromCountry: draftRoute ? draftRoute.fromCountry : existingRoute.fromCountry,
      fromCity: draftRoute ? draftRoute.fromCity : existingRoute.fromCity,
      toCountry: draftRoute ? draftRoute.toCountry : existingRoute.toCountry,
      toCity: draftRoute ? draftRoute.toCity : existingRoute.toCity,
      pricePerKg: settings.pricePerKg,
      pricePerCbm: settings.pricePerCbm,
      depositPct: settings.depositPct,
      gzFreeDays: settings.gzFreeDays,
      gzDailyFee: settings.gzDailyFee,
      dlaFreeDays: settings.dlaFreeDays,
      dlaDailyFee: settings.dlaDailyFee,
    };

    setRoutes((prev) => {
      const exists = prev.some((r) => r.id === targetId);
      return exists
        ? prev.map((r) => (r.id === targetId ? updatedRoute : r))
        : [...prev, updatedRoute];
    });
    setSelectedRouteId(targetId);
    setDraftRoute(null);

    if (user && activeWorkspaceId) {
      const wsId = activeWorkspaceId;
      const docId = `${wsId}_${targetId}`;
      try {
        await setDoc(doc(db, "routes", docId), {
          id: docId,
          ownerId: wsId,
          name: updatedRoute.name.slice(0, 120),
          fromCountry: updatedRoute.fromCountry.slice(0, 64),
          fromCity: updatedRoute.fromCity.slice(0, 64),
          toCountry: updatedRoute.toCountry.slice(0, 64),
          toCity: updatedRoute.toCity.slice(0, 64),
          pricePerKg: updatedRoute.pricePerKg,
          pricePerCbm: updatedRoute.pricePerCbm,
          depositPct: updatedRoute.depositPct,
          gzFreeDays: updatedRoute.gzFreeDays,
          gzDailyFee: updatedRoute.gzDailyFee,
          dlaFreeDays: updatedRoute.dlaFreeDays,
          dlaDailyFee: updatedRoute.dlaDailyFee,
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `routes/${docId}`);
      }
    }
  };

  const addStaff = async (member: {
    name: string;
    email: string;
    whatsapp: string;
    role: Role;
    office: string;
    customTitle?: string;
  }) => {
    // Company-ordered sequential staff ID: STF-001, STF-002...
    const newId = nextSequentialId(
      staffList.map((s) => s.id),
      "STF",
      1,
      3
    );
    const agencyPrefix = (userProfile.agencyName || "LGS")
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 3)
      .toUpperCase() || "LGS";
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const tempPassword = `${agencyPrefix}-${randomPart}`;

    const newStaff: Staff & { tempPassword?: string } = {
      id: newId,
      ownerId: activeWorkspaceId || user?.uid,
      agencyName: userProfile.agencyName,
      name: member.name.trim() || "New Staff",
      email: member.email.trim() || "staff@company.com",
      whatsapp: member.whatsapp.trim() || "+237 6 00 00 00 00",
      role: member.role,
      office: member.office,
      customTitle: member.customTitle?.trim() || undefined,
      status: "Active",
      tempPassword,
    };

    setStaffList((prev) => [...prev, newStaff]);
    setSelectedStaffId(newId);

    if (user && activeWorkspaceId) {
      const wsId = activeWorkspaceId;
      const docId = `${wsId}_${newId}`;
      try {
        await setDoc(doc(db, "staff", docId), {
          id: docId,
          ownerId: wsId,
          agencyName: (userProfile.agencyName || "Douala Express").slice(0, 120),
          name: newStaff.name.slice(0, 120),
          role: newStaff.role,
          office: newStaff.office.slice(0, 64),
          whatsapp: newStaff.whatsapp.slice(0, 40),
          email: newStaff.email.slice(0, 160),
          ...(newStaff.customTitle ? { customTitle: newStaff.customTitle.slice(0, 80) } : {}),
          status: newStaff.status,
          tempPassword,
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `staff/${docId}`);
      }
    }
    return newStaff;
  };

  const updateStaff = async (id: string, patch: Partial<Staff>) => {
    const target = staffList.find((s) => s.id === id);
    if (!target) return;
    const updated = { ...target, ...patch };
    setStaffList((prev) => prev.map((s) => (s.id === id ? updated : s)));

    if (user && activeWorkspaceId) {
      const wsId = activeWorkspaceId;
      const docId = `${wsId}_${id}`;
      try {
        await setDoc(doc(db, "staff", docId), {
          id: docId,
          ownerId: wsId,
          agencyName: (updated.agencyName || userProfile.agencyName || "Douala Express").slice(0, 120),
          name: updated.name.slice(0, 120),
          role: updated.role,
          office: updated.office.slice(0, 64),
          whatsapp: updated.whatsapp.slice(0, 40),
          email: updated.email.slice(0, 160),
          ...(updated.customTitle ? { customTitle: updated.customTitle.slice(0, 80) } : {}),
          status: updated.status,
          ...(updated.tempPassword ? { tempPassword: updated.tempPassword } : {}),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `staff/${docId}`);
      }
    }
  };

  const deactivateStaff = async (id: string) => {
    await updateStaff(id, { status: "Inactive" });
  };

  const addClient = async (data: {
    name: string;
    whatsapp: string;
    email?: string;
    city?: string;
  }) => {
    const cleanName = data.name.trim() || "New Client";
    const firstWord = cleanName
      .split(/\s+/)[0]
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase()
      .slice(0, 4) || "CLI";
    const seqNum = String(clients.length + 1).padStart(3, "0");
    const code = `${firstWord}-${seqNum}`;
    const newId = nextSequentialId(
      clients.map((c) => c.id),
      "CLI",
      1,
      3
    );

    const newClient: Client = {
      id: newId,
      name: cleanName,
      code,
      city: data.city?.trim() || "Douala",
      whatsapp: data.whatsapp.trim() || "+237 6 00 00 00 00",
      email: data.email?.trim() || undefined,
      shipmentCount: 0,
      balance: 0,
    };

    setClients((prev) => [newClient, ...prev]);
    setSelectedClientId(newId);

    if (user && activeWorkspaceId) {
      const wsId = activeWorkspaceId;
      const docId = `${wsId}_${newId}`;
      try {
        await setDoc(doc(db, "clients", docId), {
          id: docId,
          ownerId: wsId,
          name: newClient.name.slice(0, 120),
          code: newClient.code.slice(0, 32),
          city: newClient.city.slice(0, 64),
          whatsapp: newClient.whatsapp.slice(0, 40),
          ...(newClient.email ? { email: newClient.email.slice(0, 160) } : {}),
          shipmentCount: newClient.shipmentCount,
          balance: newClient.balance,
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `clients/${docId}`);
      }
    }
    return newClient;
  };

  const updateClient = async (id: string, patch: Partial<Client>) => {
    const target = clients.find((c) => c.id === id);
    if (!target) return;
    const updated = { ...target, ...patch };
    setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));

    if (user && activeWorkspaceId) {
      const wsId = activeWorkspaceId;
      const docId = `${wsId}_${id}`;
      try {
        await setDoc(doc(db, "clients", docId), {
          id: docId,
          ownerId: wsId,
          name: updated.name.slice(0, 120),
          code: updated.code.slice(0, 32),
          city: updated.city.slice(0, 64),
          whatsapp: updated.whatsapp.slice(0, 40),
          ...(updated.email ? { email: updated.email.slice(0, 160) } : {}),
          shipmentCount: updated.shipmentCount,
          balance: updated.balance,
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `clients/${docId}`);
      }
    }
  };

  const addShipment = async (data: {
    clientName: string;
    description?: string;
    supplierTracking?: string;
    weightKg: number;
    cbm: number;
    boxes?: number;
    rateMode: "kg" | "CBM";
  }) => {
    const activeRoute = routes[0] || DEFAULT_ROUTE;
    const existingClient = clients.find((c) => c.name === data.clientName);

    const clientName = existingClient?.name || data.clientName.trim() || "Walk-in Client";
    const clientCode =
      existingClient?.code ||
      `${clientName.split(" ")[0].toUpperCase().slice(0, 4)}-001`;

    // Company-ordered sequential Shipment ID starting at SHP-1001
    const newId = nextSequentialId(
      shipments.map((s) => s.id),
      "SHP",
      1001,
      4
    );

    const shippingFee =
      data.rateMode === "kg"
        ? Math.round(data.weightKg * activeRoute.pricePerKg)
        : Math.round(data.cbm * activeRoute.pricePerCbm);
    const depositFee = Math.round((shippingFee * activeRoute.depositPct) / 100);
    const balance = shippingFee - depositFee;
    const isWhiteLabeled = Boolean(
      plan === "Pro" && userProfile.whiteLabelEnabled
    );

    const newShipment: Shipment = {
      id: newId,
      clientName,
      clientCode,
      route: activeRoute.name,
      boxes: data.boxes || 1,
      cbm: data.cbm || 1,
      weightKg: data.weightKg || 50,
      status: "Expected",
      description: data.description?.trim() || "General cargo",
      supplierTracking: data.supplierTracking?.trim() || undefined,
      trackingLink: `https://track.logislo.com/${newId}`,
      shippingFee,
      depositFee,
      storageFee: 0,
      balance,
      dateLabel: formatShortDate(),
      agencyName: userProfile.agencyName,
      agencyLogoUrl: userProfile.agencyLogoUrl,
      whiteLabelEnabled: isWhiteLabeled,
      timeline: makeTimeline("Expected"),
    };

    setShipments((prev) => [newShipment, ...prev]);
    setSelectedShipmentId(newId);

    if (existingClient) {
      await updateClient(existingClient.id, {
        shipmentCount: existingClient.shipmentCount + 1,
        balance: existingClient.balance + balance,
      });
    }

    if (user && activeWorkspaceId) {
      const wsId = activeWorkspaceId;
      const docId = `${wsId}_${newId}`;
      try {
        await setDoc(doc(db, "shipments", docId), {
          id: docId,
          ownerId: wsId,
          agencyName: (userProfile.agencyName || "Douala Express").slice(0, 120),
          ...(userProfile.agencyLogoUrl
            ? { agencyLogoUrl: userProfile.agencyLogoUrl.slice(0, 150000) }
            : {}),
          whiteLabelEnabled: isWhiteLabeled,
          clientName: newShipment.clientName.slice(0, 120),
          clientCode: newShipment.clientCode.slice(0, 32),
          route: newShipment.route.slice(0, 120),
          boxes: newShipment.boxes,
          cbm: newShipment.cbm ?? 1,
          weightKg: newShipment.weightKg ?? 50,
          status: newShipment.status,
          ...(newShipment.description
            ? { description: newShipment.description.slice(0, 240) }
            : {}),
          ...(newShipment.supplierTracking
            ? { supplierTracking: newShipment.supplierTracking.slice(0, 80) }
            : {}),
          trackingLink: newShipment.trackingLink.slice(0, 240),
          shippingFee: newShipment.shippingFee,
          depositFee: newShipment.depositFee,
          storageFee: newShipment.storageFee,
          balance: newShipment.balance,
          dateLabel: newShipment.dateLabel || formatShortDate(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `shipments/${docId}`);
      }
    }

    return newShipment;
  };

  const updateShipment = async (id: string, patch: Partial<Shipment>) => {
    const target = shipments.find((s) => s.id === id);
    if (!target) return;
    const nextStatus = patch.status || target.status;
    const isWhiteLabeled = Boolean(
      plan === "Pro" && userProfile.whiteLabelEnabled
    );
    const updated: Shipment = {
      ...target,
      ...patch,
      status: nextStatus,
      agencyName: target.agencyName || userProfile.agencyName,
      agencyLogoUrl: target.agencyLogoUrl || userProfile.agencyLogoUrl,
      whiteLabelEnabled: isWhiteLabeled,
      timeline: patch.status ? makeTimeline(nextStatus) : target.timeline,
    };
    setShipments((prev) => prev.map((s) => (s.id === id ? updated : s)));

    if (user && activeWorkspaceId) {
      const wsId = activeWorkspaceId;
      const docId = `${wsId}_${id}`;
      try {
        await setDoc(doc(db, "shipments", docId), {
          id: docId,
          ownerId: wsId,
          agencyName: (updated.agencyName || userProfile.agencyName || "Douala Express").slice(0, 120),
          ...(updated.agencyLogoUrl
            ? { agencyLogoUrl: updated.agencyLogoUrl.slice(0, 150000) }
            : {}),
          whiteLabelEnabled: isWhiteLabeled,
          clientName: updated.clientName.slice(0, 120),
          clientCode: updated.clientCode.slice(0, 32),
          route: updated.route.slice(0, 120),
          boxes: updated.boxes,
          cbm: updated.cbm ?? 1,
          weightKg: updated.weightKg ?? 50,
          status: updated.status,
          ...(updated.description ? { description: updated.description.slice(0, 240) } : {}),
          ...(updated.supplierTracking
            ? { supplierTracking: updated.supplierTracking.slice(0, 80) }
            : {}),
          trackingLink: updated.trackingLink.slice(0, 240),
          shippingFee: updated.shippingFee,
          depositFee: updated.depositFee,
          storageFee: updated.storageFee,
          balance: updated.balance,
          ...(updated.collectorName
            ? { collectorName: updated.collectorName.slice(0, 120) }
            : {}),
          dateLabel: updated.dateLabel || formatShortDate(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `shipments/${docId}`);
      }
    }
  };

  const receiveShipment = async (
    id: string,
    data: { boxes: number; weightKg: number; cbm?: number }
  ) => {
    await updateShipment(id, {
      boxes: data.boxes,
      weightKg: data.weightKg,
      ...(data.cbm !== undefined ? { cbm: data.cbm } : {}),
      status: "Received",
    });
  };

  const releaseShipment = async (id: string, collectorName: string) => {
    await updateShipment(id, {
      status: "Collected",
      balance: 0,
      collectorName: collectorName.trim() || undefined,
    });
  };

  const addContainer = async (data: {
    number: string;
    size: "20ft" | "40ft";
    route: string;
    cost?: number;
  }) => {
    const defaultNum = nextSequentialId(
      containers.map((c) => c.id),
      "CNT",
      1,
      3
    );
    const cleanNum = data.number.trim() || defaultNum;
    const newContainer: Container = {
      id: cleanNum,
      number: cleanNum,
      size: data.size,
      route: data.route,
      boxes: 0,
      status: "Open",
      cost: data.cost || 0,
      profit: 0,
      shipments: [],
    };

    setContainers((prev) => [newContainer, ...prev]);
    setSelectedContainerId(cleanNum);

    if (user && activeWorkspaceId) {
      const wsId = activeWorkspaceId;
      const docId = `${wsId}_${cleanNum}`;
      try {
        await setDoc(doc(db, "containers", docId), {
          id: docId,
          ownerId: wsId,
          number: newContainer.number.slice(0, 64),
          size: newContainer.size,
          route: newContainer.route.slice(0, 120),
          boxes: newContainer.boxes,
          status: newContainer.status,
          cost: newContainer.cost ?? 0,
          profit: newContainer.profit ?? 0,
          shipmentIds: "",
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `containers/${docId}`);
      }
    }
    return newContainer;
  };

  const updateContainer = async (id: string, patch: Partial<Container>) => {
    const target = containers.find((c) => c.id === id);
    if (!target) return;
    const updated: Container = { ...target, ...patch };
    setContainers((prev) => prev.map((c) => (c.id === id ? updated : c)));

    if (user && activeWorkspaceId) {
      const wsId = activeWorkspaceId;
      const docId = `${wsId}_${id}`;
      try {
        await setDoc(doc(db, "containers", docId), {
          id: docId,
          ownerId: wsId,
          number: updated.number.slice(0, 64),
          size: updated.size,
          route: updated.route.slice(0, 120),
          boxes: updated.boxes,
          status: updated.status,
          cost: updated.cost ?? 0,
          profit: updated.profit ?? 0,
          shipmentIds: updated.shipments
            .map((s) => s.id)
            .join(",")
            .slice(0, 1000),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `containers/${docId}`);
      }
    }
  };

  const assignShipmentsToContainer = async (
    containerId: string,
    shipmentIds: string[]
  ) => {
    const selectedShps = shipments.filter((s) => shipmentIds.includes(s.id));
    const totalBoxes = selectedShps.reduce((sum, s) => sum + s.boxes, 0);
    await updateContainer(containerId, {
      boxes: totalBoxes,
      shipments: selectedShps.map((s) => ({
        id: s.id,
        clientName: s.clientName,
        boxes: s.boxes,
      })),
    });
  };

  const recordPayment = async (data: {
    shipmentId: string;
    type: "Deposit" | "Balance" | "Storage";
    method: "Cash" | "Mobile money";
    amount: number;
    reference?: string;
  }) => {
    const targetShipment =
      shipments.find((s) => s.id === data.shipmentId) || shipments[0];
    // Company-ordered receipt ID: RCP-1001, RCP-1002...
    const newId = nextSequentialId(
      payments.map((p) => p.id),
      "RCP",
      1001,
      4
    );
    const newRemaining = Math.max(
      0,
      (targetShipment?.balance || 0) - data.amount
    );

    const newPayment: Payment = {
      id: newId,
      shipmentId: data.shipmentId,
      clientName: targetShipment?.clientName || "Client",
      type: data.type,
      method: data.method,
      amount: data.amount,
      remaining: newRemaining,
      date: formatShortDate(),
      recordedBy: userProfile.name || role,
      reference: data.reference?.trim() || undefined,
    };

    setPayments((prev) => [newPayment, ...prev]);
    setSelectedPaymentId(newId);

    if (targetShipment) {
      await updateShipment(targetShipment.id, {
        balance: newRemaining,
        status:
          newRemaining === 0 && targetShipment.status === "Arrived"
            ? "Ready"
            : targetShipment.status,
      });
      const clientObj = clients.find(
        (c) => c.name === targetShipment.clientName
      );
      if (clientObj) {
        await updateClient(clientObj.id, {
          balance: Math.max(0, clientObj.balance - data.amount),
        });
      }
    }

    if (user && activeWorkspaceId) {
      const wsId = activeWorkspaceId;
      const docId = `${wsId}_${newId}`;
      try {
        await setDoc(doc(db, "payments", docId), {
          id: docId,
          ownerId: wsId,
          shipmentId: newPayment.shipmentId.slice(0, 128),
          clientName: (newPayment.clientName || "Client").slice(0, 120),
          type: newPayment.type,
          method: newPayment.method,
          amount: newPayment.amount,
          remaining: newRemaining,
          date: newPayment.date.slice(0, 64),
          recordedBy: newPayment.recordedBy.slice(0, 80),
          ...(newPayment.reference
            ? { reference: newPayment.reference.slice(0, 120) }
            : {}),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `payments/${docId}`);
      }
    }

    return newPayment;
  };

  const logUnmatched = async (data: {
    boxes: number;
    weightKg: number;
    cbm: number;
    route: string;
    markings: string;
  }) => {
    const newId = nextSequentialId(
      unmatchedItems.map((u) => u.id),
      "UNM",
      1,
      3
    );
    const newItem = {
      id: newId,
      boxes: data.boxes,
      weightKg: data.weightKg,
      cbm: data.cbm,
      date: formatShortDate(),
      route: data.route,
      markings: data.markings,
    };

    setUnmatchedItems((prev) => [newItem, ...prev]);
    setSelectedUnmatchedId(newId);

    if (user && activeWorkspaceId) {
      const wsId = activeWorkspaceId;
      const docId = `${wsId}_${newId}`;
      try {
        await setDoc(doc(db, "unmatched", docId), {
          id: docId,
          ownerId: wsId,
          boxes: newItem.boxes,
          cbm: newItem.cbm,
          weightKg: newItem.weightKg,
          date: newItem.date,
          route: newItem.route.slice(0, 120),
          markings: newItem.markings.slice(0, 500),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `unmatched/${docId}`);
      }
    }

    return newItem;
  };

  const matchUnmatchedToShipment = async (
    unmatchedId: string,
    shipmentId: string
  ) => {
    const item = unmatchedItems.find((u) => u.id === unmatchedId);
    setUnmatchedItems((prev) => prev.filter((u) => u.id !== unmatchedId));

    if (item) {
      await receiveShipment(shipmentId, {
        boxes: item.boxes,
        weightKg: item.weightKg || 100,
        cbm: item.cbm,
      });
    }

    if (user && activeWorkspaceId) {
      const wsId = activeWorkspaceId;
      const docId = `${wsId}_${unmatchedId}`;
      try {
        await deleteDoc(doc(db, "unmatched", docId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `unmatched/${docId}`);
      }
    }
  };

  const go = (id: string) => {
    setMoreSheetOpen(false);
    setConfirmDialog({ isOpen: false });
    setLimitSheet({ isOpen: false });
    setStack((prev) => [...prev, id]);
  };

  const back = () => {
    setMoreSheetOpen(false);
    setConfirmDialog({ isOpen: false });
    setLimitSheet({ isOpen: false });
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const reset = (id: string) => {
    setMoreSheetOpen(false);
    setConfirmDialog({ isOpen: false });
    setLimitSheet({ isOpen: false });
    setStack([id]);
  };

  const showConfirm = (opts: Omit<ConfirmState, "isOpen">) => {
    setConfirmDialog({ ...opts, isOpen: true });
  };

  const hideConfirm = () => {
    setConfirmDialog({ isOpen: false });
  };

  const showLimit = (v: "routes" | "staff") => {
    setLimitSheet({ isOpen: true, variant: v });
  };

  const hideLimit = () => {
    setLimitSheet({ isOpen: false });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("logislo_lang", lang);
    } catch {}
  };

  const setTutoStepForRole = (targetRole: Role, step: number) => {
    setTutoStepByRole((prev) => {
      const next = { ...prev, [targetRole]: step };
      try {
        localStorage.setItem("logislo_tuto_steps", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const markTutoLessonDone = (targetRole: Role, lessonId: string) => {
    setTutoCompletedByRole((prev) => {
      const existing = prev[targetRole] || [];
      if (existing.includes(lessonId)) return prev;
      const next = { ...prev, [targetRole]: [...existing, lessonId] };
      try {
        localStorage.setItem("logislo_tuto_completed", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const resetTutoForRole = (targetRole: Role) => {
    setTutoStepForRole(targetRole, 0);
    setTutoCompletedByRole((prev) => {
      const next = { ...prev, [targetRole]: [] };
      try {
        localStorage.setItem("logislo_tuto_completed", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const startTutoLesson = (targetRole: Role, stepIndex?: number) => {
    const lessons = TUTO_LESSONS_BY_ROLE[targetRole] || TUTO_LESSONS_BY_ROLE.Owner;
    const completed = tutoCompletedByRole[targetRole] || [];
    let idx = stepIndex;
    if (idx === undefined) {
      const firstIncomplete = lessons.findIndex((l) => !completed.includes(l.id));
      idx = firstIncomplete >= 0 ? firstIncomplete : 0;
    }
    const safeIdx = Math.min(Math.max(0, idx), lessons.length - 1);
    setTutoStepForRole(targetRole, safeIdx);
    setTutoActive(true);
    const targetScreen = lessons[safeIdx].screenId;
    if (screenId !== targetScreen) {
      go(targetScreen);
    }
  };

  return (
    <DemoContext.Provider
      value={{
        role,
        setRole,
        plan,
        setPlan,
        screenId,
        stack,
        go,
        back,
        reset,
        offlineBanner,
        setOfflineBanner,
        variant,
        setVariant,
        moreSheetOpen,
        setMoreSheetOpen,
        confirmDialog,
        showConfirm,
        hideConfirm,
        limitSheet,
        showLimit,
        hideLimit,
        getHomeForRole,
        language,
        setLanguage,
        tutoActive,
        setTutoActive,
        tutoStepByRole,
        setTutoStepForRole,
        tutoCompletedByRole,
        markTutoLessonDone,
        resetTutoForRole,
        startTutoLesson,
        user,
        authReady,
        userProfile,
        signInWithGoogle,
        logout,
        updateProfile,
        joinAgency,
        clearAllWorkspaceData,
        lookupPublicShipment,
        routes,
        selectedRouteId,
        setSelectedRouteId,
        draftRoute,
        setDraftRoute,
        saveRouteSettings,
        staffList,
        selectedStaffId,
        setSelectedStaffId,
        addStaff,
        updateStaff,
        deactivateStaff,
        clients,
        selectedClientId,
        setSelectedClientId,
        addClient,
        updateClient,
        shipments,
        selectedShipmentId,
        setSelectedShipmentId,
        addShipment,
        updateShipment,
        receiveShipment,
        releaseShipment,
        containers,
        selectedContainerId,
        setSelectedContainerId,
        addContainer,
        updateContainer,
        assignShipmentsToContainer,
        payments,
        selectedPaymentId,
        setSelectedPaymentId,
        recordPayment,
        unmatchedItems,
        selectedUnmatchedId,
        setSelectedUnmatchedId,
        logUnmatched,
        matchUnmatchedToShipment,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
};
