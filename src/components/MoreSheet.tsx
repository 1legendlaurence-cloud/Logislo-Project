import React from "react";
import { Icon, IconName } from "./Icon";
import { LockBadge } from "./Chip";
import { useDemo } from "../context/Demo";

interface MenuItem {
  id: string;
  label: string;
  icon: IconName;
  proOnly?: boolean;
}

export const MoreSheet: React.FC = () => {
  const {
    role,
    plan,
    moreSheetOpen,
    setMoreSheetOpen,
    go,
    reset,
    showConfirm,
  } = useDemo();

  if (!moreSheetOpen) return null;

  const staffName =
    role === "Owner"
      ? "Marie"
      : role === "Manager"
      ? "Marie"
      : role === "Front desk"
      ? "Aïcha"
      : "Paul";

  const staffInfo =
    role === "Owner"
      ? "Owner, Douala"
      : role === "Manager"
      ? "Manager, Douala"
      : role === "Front desk"
      ? "Front desk, Douala"
      : "Warehouse worker, Guangzhou";

  const avatar = staffName[0];

  let menuRows: MenuItem[] = [];

  if (role === "Owner") {
    menuRows = [
      { id: "39", label: "Payments", icon: "credit-card" },
      { id: "32", label: "Containers", icon: "layers" },
      { id: "45", label: "Warehouse list", icon: "box", proOnly: true },
      { id: "30", label: "Unmatched", icon: "search", proOnly: true },
      { id: "47", label: "Dashboard", icon: "file-text" },
      { id: "48", label: "Tools", icon: "settings" },
      { id: "08", label: "Settings", icon: "settings" },
    ];
  } else if (role === "Manager") {
    menuRows = [
      { id: "39", label: "Payments", icon: "credit-card" },
      { id: "32", label: "Containers", icon: "layers" },
      { id: "45", label: "Warehouse list", icon: "box", proOnly: true },
      { id: "30", label: "Unmatched", icon: "search", proOnly: true },
    ];
  }

  const handleRowClick = (item: MenuItem) => {
    setMoreSheetOpen(false);
    if (item.id === "45" && plan === "Basic") {
      go("46"); // Warehouse list locked on Basic
    } else {
      go(item.id);
    }
  };

  const handleLogout = () => {
    setMoreSheetOpen(false);
    showConfirm({
      variant: "logout",
      title: "Log out?",
      cancelLabel: "Cancel",
      confirmLabel: "Log out",
      onConfirm: () => reset("02"),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor: "rgba(14, 17, 22, 0.40)" }}
      onClick={() => setMoreSheetOpen(false)}
    >
      <div
        className="w-full max-w-[430px] mx-auto rounded-t-[24px] p-5 pb-8 flex flex-col select-none overflow-hidden max-h-[85vh] animate-in slide-in-from-bottom duration-200"
        style={{
          backgroundColor: "var(--surface)",
          boxShadow: "var(--shadow-sheet)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3.5 pb-4 mb-2">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-[17px] shrink-0"
            style={{
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
            }}
          >
            {avatar}
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-semibold text-[var(--ink)] leading-tight">
              {staffName}
            </span>
            <span className="text-[13px] text-[var(--muted)] leading-tight mt-0.5">
              {staffInfo}
            </span>
          </div>
        </div>

        {/* Rows */}
        <div className="flex flex-col overflow-y-auto">
          {menuRows.map((item) => (
            <button
              key={item.id + item.label}
              type="button"
              onClick={() => handleRowClick(item)}
              className="h-[56px] flex items-center justify-between text-left cursor-pointer active:opacity-70 transition-opacity"
            >
              <div className="flex items-center gap-3.5">
                <Icon name={item.icon} size={20} color="var(--ink)" />
                <span className="text-[15px] font-medium text-[var(--ink)]">
                  {item.label}
                </span>
                {item.proOnly && plan === "Basic" && <LockBadge label="Pro" />}
              </div>
              <Icon name="chevron-right" size={18} color="var(--muted)" />
            </button>
          ))}

          {/* Profile row */}
          <button
            type="button"
            onClick={() => {
              setMoreSheetOpen(false);
              go("09");
            }}
            className="h-[56px] flex items-center justify-between text-left cursor-pointer active:opacity-70 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <Icon name="user" size={20} color="var(--ink)" />
              <span className="text-[15px] font-medium text-[var(--ink)]">
                Profile
              </span>
            </div>
            <Icon name="chevron-right" size={18} color="var(--muted)" />
          </button>

          {/* Log out row */}
          <button
            type="button"
            onClick={handleLogout}
            className="h-[56px] flex items-center text-left cursor-pointer active:opacity-70 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <Icon name="close" size={20} color="var(--ink)" />
              <span className="text-[15px] font-medium text-[var(--ink)]">
                Log out
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export const AccountMenu = MoreSheet;
