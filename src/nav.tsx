import React from "react";
import { S00Splash } from "./screens/S00Splash";
import { S01SignUp } from "./screens/S01SignUp";
import { S02Login } from "./screens/S02Login";
import { S03ResetPassword } from "./screens/S03ResetPassword";
import { S04SetPassword } from "./screens/S04SetPassword";
import { S05CreateRoute } from "./screens/S05CreateRoute";
import { S06RouteSettings } from "./screens/S06RouteSettings";
import { S07Routes } from "./screens/S07Routes";
import { S08Settings } from "./screens/S08Settings";
import { S09Profile } from "./screens/S09Profile";
import { S10Agency } from "./screens/S10Agency";
import { S11Staff } from "./screens/S11Staff";
import { S12AddStaff } from "./screens/S12AddStaff";
import { S13StaffCreated } from "./screens/S13StaffCreated";
import { S14JoinAgency } from "./screens/S14JoinAgency";
import { S15Plan } from "./screens/S15Plan";
import { S16HomeOwner } from "./screens/S16HomeOwner";
import { S17HomeFrontDesk } from "./screens/S17HomeFrontDesk";
import { S18HomeWarehouse } from "./screens/S18HomeWarehouse";
import { S19Clients } from "./screens/S19Clients";
import { S20AddClient } from "./screens/S20AddClient";
import { S21ClientDetail } from "./screens/S21ClientDetail";
import { S22EditClient } from "./screens/S22EditClient";
import { S23Shipments } from "./screens/S23Shipments";
import { S24NewPreAlert } from "./screens/S24NewPreAlert";
import { S25PreAlertSaved } from "./screens/S25PreAlertSaved";
import { S26ShipmentDetail } from "./screens/S26ShipmentDetail";
import { S27EditShipment } from "./screens/S27EditShipment";
import { S28Receive } from "./screens/S28Receive";
import { S29ReceiveConfirmation } from "./screens/S29ReceiveConfirmation";
import { S30Unmatched } from "./screens/S30Unmatched";
import { S31UnmatchedItem } from "./screens/S31UnmatchedItem";
import { S32Containers } from "./screens/S32Containers";
import { S33NewContainer } from "./screens/S33NewContainer";
import { S34ContainerDetail } from "./screens/S34ContainerDetail";
import { S35AddToContainer } from "./screens/S35AddToContainer";
import { S36ScanCamera } from "./screens/S36ScanCamera";
import { S37ScanCheck } from "./screens/S37ScanCheck";
import { S38MissingItems } from "./screens/S38MissingItems";
import { S39Payments } from "./screens/S39Payments";
import { S40RecordPayment } from "./screens/S40RecordPayment";
import { S41FinalBill } from "./screens/S41FinalBill";
import { S42PaymentDetail } from "./screens/S42PaymentDetail";
import { S43ReleaseLocked } from "./screens/S43ReleaseLocked";
import { S44ReleaseGoods } from "./screens/S44ReleaseGoods";
import { S45WarehouseList, S46WarehouseListBasic } from "./screens/S45WarehouseList";
import { S47Dashboard } from "./screens/S47Dashboard";
import { S48Tools } from "./screens/S48Tools";
import { S49PublicTracking } from "./screens/S49PublicTracking";
import { S50InvalidLink } from "./screens/S50InvalidLink";
import { S51AccountMenuOwner, S52AccountMenuFrontDesk } from "./screens/S51AccountMenu";
import { S53StaffDetail } from "./screens/S53StaffDetail";
import { S54LabelPreview } from "./screens/S54LabelPreview";
import { S55ConfirmDialogScreen } from "./screens/S55ConfirmDialogScreen";
import { S56LimitReachedScreen } from "./screens/S56LimitReachedScreen";
import { S57FirstRunHome } from "./screens/S57FirstRunHome";
import { S58EditStaff } from "./screens/S58EditStaff";
import { S59LogUnmatched } from "./screens/S59LogUnmatched";
import { S60Copilot } from "./screens/S60Copilot";
import { PlaceholderScreen } from "./screens/PlaceholderScreen";

export interface ScreenDef {
  id: string;
  name: string;
  batch: number;
  hasNav: boolean;
  component?: React.ComponentType<any>;
}

export const SCREEN_REGISTRY: Record<string, ScreenDef> = {
  "00": { id: "00", name: "Splash", batch: 0, hasNav: false, component: S00Splash },
  "01": { id: "01", name: "Sign up", batch: 1, hasNav: false, component: S01SignUp },
  "02": { id: "02", name: "Login", batch: 1, hasNav: false, component: S02Login },
  "03": { id: "03", name: "Reset password", batch: 1, hasNav: false, component: S03ResetPassword },
  "04": { id: "04", name: "Set password", batch: 1, hasNav: false, component: S04SetPassword },
  "05": { id: "05", name: "Create route", batch: 2, hasNav: false, component: S05CreateRoute },
  "06": { id: "06", name: "Route settings", batch: 2, hasNav: false, component: S06RouteSettings },
  "07": { id: "07", name: "Routes", batch: 2, hasNav: true, component: S07Routes },
  "08": { id: "08", name: "Settings", batch: 2, hasNav: true, component: S08Settings },
  "09": { id: "09", name: "Profile", batch: 3, hasNav: false, component: S09Profile },
  "10": { id: "10", name: "Agency", batch: 3, hasNav: false, component: S10Agency },
  "11": { id: "11", name: "Staff", batch: 3, hasNav: true, component: S11Staff },
  "12": { id: "12", name: "Add staff", batch: 3, hasNav: false, component: S12AddStaff },
  "13": { id: "13", name: "Staff created", batch: 4, hasNav: false, component: S13StaffCreated },
  "14": { id: "14", name: "Join agency", batch: 4, hasNav: false, component: S14JoinAgency },
  "15": { id: "15", name: "Plan", batch: 4, hasNav: false, component: S15Plan },
  "16": { id: "16", name: "Home (Owner)", batch: 4, hasNav: true, component: S16HomeOwner },
  "17": { id: "17", name: "Home (Front desk)", batch: 5, hasNav: true, component: S17HomeFrontDesk },
  "18": { id: "18", name: "Home (Warehouse)", batch: 5, hasNav: true, component: S18HomeWarehouse },
  "19": { id: "19", name: "Clients", batch: 5, hasNav: true, component: S19Clients },
  "20": { id: "20", name: "Add client", batch: 5, hasNav: false, component: S20AddClient },
  "21": { id: "21", name: "Client detail", batch: 6, hasNav: false, component: S21ClientDetail },
  "22": { id: "22", name: "Edit client", batch: 6, hasNav: false, component: S22EditClient },
  "23": { id: "23", name: "Shipments", batch: 6, hasNav: true, component: S23Shipments },
  "24": { id: "24", name: "New pre-alert", batch: 6, hasNav: false, component: S24NewPreAlert },
  "25": { id: "25", name: "Pre-alert saved", batch: 7, hasNav: false, component: S25PreAlertSaved },
  "26": { id: "26", name: "Shipment detail", batch: 7, hasNav: false, component: S26ShipmentDetail },
  "27": { id: "27", name: "Edit shipment", batch: 7, hasNav: false, component: S27EditShipment },
  "28": { id: "28", name: "Receive", batch: 7, hasNav: false, component: S28Receive },
  "29": { id: "29", name: "Receive confirmation", batch: 8, hasNav: false, component: S29ReceiveConfirmation },
  "30": { id: "30", name: "Unmatched", batch: 8, hasNav: true, component: S30Unmatched },
  "31": { id: "31", name: "Unmatched item", batch: 8, hasNav: false, component: S31UnmatchedItem },
  "32": { id: "32", name: "Containers", batch: 8, hasNav: true, component: S32Containers },
  "33": { id: "33", name: "New container", batch: 9, hasNav: false, component: S33NewContainer },
  "34": { id: "34", name: "Container detail", batch: 9, hasNav: false, component: S34ContainerDetail },
  "35": { id: "35", name: "Add to container", batch: 9, hasNav: false, component: S35AddToContainer },
  "36": { id: "36", name: "Scan camera", batch: 9, hasNav: false, component: S36ScanCamera },
  "37": { id: "37", name: "Scan-check", batch: 10, hasNav: false, component: S37ScanCheck },
  "38": { id: "38", name: "Missing items", batch: 10, hasNav: false, component: S38MissingItems },
  "39": { id: "39", name: "Payments", batch: 10, hasNav: true, component: S39Payments },
  "40": { id: "40", name: "Record payment", batch: 10, hasNav: false, component: S40RecordPayment },
  "41": { id: "41", name: "Final bill", batch: 11, hasNav: false, component: S41FinalBill },
  "42": { id: "42", name: "Payment detail", batch: 11, hasNav: false, component: S42PaymentDetail },
  "43": { id: "43", name: "Release locked", batch: 11, hasNav: false, component: S43ReleaseLocked },
  "44": { id: "44", name: "Release goods", batch: 11, hasNav: false, component: S44ReleaseGoods },
  "45": { id: "45", name: "Warehouse list (Pro)", batch: 12, hasNav: true, component: S45WarehouseList },
  "46": { id: "46", name: "Warehouse list (Basic)", batch: 12, hasNav: true, component: S46WarehouseListBasic },
  "47": { id: "47", name: "Dashboard", batch: 12, hasNav: true, component: S47Dashboard },
  "48": { id: "48", name: "Tools", batch: 12, hasNav: true, component: S48Tools },
  "49": { id: "49", name: "Public tracking", batch: 13, hasNav: false, component: S49PublicTracking },
  "50": { id: "50", name: "Invalid link", batch: 13, hasNav: false, component: S50InvalidLink },
  "51": { id: "51", name: "Account menu (Owner)", batch: 14, hasNav: true, component: S51AccountMenuOwner },
  "52": { id: "52", name: "Account menu (Front desk)", batch: 14, hasNav: true, component: S52AccountMenuFrontDesk },
  "53": { id: "53", name: "Staff detail", batch: 14, hasNav: false, component: S53StaffDetail },
  "54": { id: "54", name: "Label preview", batch: 14, hasNav: false, component: S54LabelPreview },
  "55": { id: "55", name: "Confirm dialog", batch: 15, hasNav: false, component: S55ConfirmDialogScreen },
  "56": { id: "56", name: "Limit reached", batch: 15, hasNav: false, component: S56LimitReachedScreen },
  "57": { id: "57", name: "First-run Home", batch: 15, hasNav: true, component: S57FirstRunHome },
  "58": { id: "58", name: "Edit staff", batch: 16, hasNav: false, component: S58EditStaff },
  "59": { id: "59", name: "Log unmatched cargo", batch: 16, hasNav: false, component: S59LogUnmatched },
  "60": { id: "60", name: "Logislo Copilot", batch: 16, hasNav: false, component: S60Copilot },
};

export const getScreen = (id: string): React.ComponentType<any> => {
  const def = SCREEN_REGISTRY[id];
  if (def && def.component) {
    return def.component;
  }
  // Return placeholder
  return () => (
    <PlaceholderScreen
      id={id}
      name={def ? def.name : `Screen ${id}`}
      batch={def ? def.batch : 0}
      hasNav={def ? def.hasNav : true}
    />
  );
};
