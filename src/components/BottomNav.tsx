import React from "react";
import { Icon, IconName } from "./Icon";
import { useDemo } from "../context/Demo";
import { tr } from "../i18n";

interface NavItem {
  id: string; // destination screen id or action key
  label: string;
  icon: IconName;
  isCenter?: boolean;
}

export const BottomNav: React.FC = () => {
  const { role, screenId, go, getHomeForRole, language } = useDemo();

  const homeScreen = getHomeForRole(role);

  let items: NavItem[] = [];

  if (role === "Owner" || role === "Manager") {
    items = [
      { id: homeScreen, label: "Home", icon: "home" },
      { id: "19", label: "Clients", icon: "user" },
      { id: "36", label: "Scan", icon: "scan", isCenter: true },
      { id: "23", label: "Shipments", icon: "box" },
      { id: "more", label: "More", icon: "dots-horizontal" },
    ];
  } else if (role === "Front desk") {
    items = [
      { id: homeScreen, label: "Home", icon: "home" },
      { id: "19", label: "Clients", icon: "user" },
      { id: "36", label: "Scan", icon: "scan", isCenter: true },
      { id: "23", label: "Shipments", icon: "box" },
      { id: "39", label: "Payments", icon: "credit-card" },
    ];
  } else {
    // Warehouse
    items = [
      { id: homeScreen, label: "Home", icon: "home" },
      { id: "23", label: "Shipments", icon: "box" },
      { id: "36", label: "Scan", icon: "scan", isCenter: true },
      { id: "32", label: "Containers", icon: "layers" },
      { id: "more", label: "More", icon: "dots-horizontal" },
    ];
  }

  const handleNav = (item: NavItem) => {
    if (item.id === "more") {
      go(role === "Owner" ? "51" : "52");
      return;
    }
    go(item.id);
  };

  const isItemActive = (item: NavItem) => {
    if (item.id === "more") return ["51", "52", "08"].includes(screenId);
    if (item.id === homeScreen) {
      return ["16", "17", "18", "57"].includes(screenId);
    }
    return screenId === item.id;
  };

  return (
    <nav
      className="shrink-0 flex items-center justify-around h-[64px] px-2 select-none z-20"
      style={{
        backgroundColor: "var(--surface)",
        boxShadow: "0 -1px 3px rgba(14,17,22,0.04)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {items.map((item) => {
        const active = isItemActive(item);

        if (item.isCenter) {
          return (
            <button
              key="center-scan"
              type="button"
              onClick={() => handleNav(item)}
              className="w-12 h-12 -mt-3 rounded-full flex items-center justify-center cursor-pointer shadow-[var(--shadow-dialog)] active:scale-95 transition-transform"
              style={{
                backgroundColor: "var(--accent)",
                color: "#FFFFFF",
              }}
              aria-label={tr(language, "Scan")}
            >
              <Icon name="scan" size={22} color="#FFFFFF" />
            </button>
          );
        }

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => handleNav(item)}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 cursor-pointer transition-colors"
            style={{
              color: active ? "var(--accent)" : "var(--muted)",
            }}
          >
            <Icon
              name={item.icon}
              size={20}
              color={active ? "var(--accent)" : "var(--muted)"}
            />
            <span className="text-[11px] font-medium mt-1 leading-none">
              {tr(language, item.label)}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
