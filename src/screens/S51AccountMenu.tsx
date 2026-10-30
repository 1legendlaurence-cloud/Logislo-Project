import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon, IconName } from "../components/Icon";
import { LockBadge } from "../components/Chip";
import { useDemo } from "../context/Demo";
import { tr } from "../i18n";

interface MenuItem {
  id: string;
  label: string;
  icon: IconName;
  proOnly?: boolean;
}

export const S51AccountMenuOwner: React.FC = () => {
  const {
    go,
    back,
    reset,
    showConfirm,
    plan,
    user,
    userProfile,
    signInWithGoogle,
    logout,
    setRole,
    language,
    startTutoLesson,
    role,
  } = useDemo();

  const menuRows: MenuItem[] = [
    { id: "39", label: "Payments", icon: "credit-card" },
    { id: "32", label: "Containers", icon: "layers" },
    { id: "45", label: "Warehouse list", icon: "box", proOnly: true },
    { id: "30", label: "Unmatched", icon: "search", proOnly: true },
    { id: "47", label: "Dashboard", icon: "file-text" },
    { id: "48", label: "Tools", icon: "settings" },
    { id: "08", label: "Settings", icon: "settings" },
  ];

  const handleRowClick = (item: MenuItem) => {
    if (item.id === "45" && plan === "Basic") {
      go("46");
    } else {
      go(item.id);
    }
  };

  const handleLogout = () => {
    showConfirm({
      variant: "logout",
      title: "Log out?",
      cancelLabel: "Cancel",
      confirmLabel: "Log out",
      onConfirm: () => {
        logout();
      },
    });
  };

  return (
    <ScreenLayout showBack onBack={back} title="Account" hasNav={true}>
      <div className="flex flex-col gap-4 pt-1 pb-6">
        {/* Profile Header Card */}
        <div
          className="p-4 rounded-[18px] flex items-center justify-between gap-3.5 select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-[20px] shrink-0"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              {(userProfile.name || "Marie")[0]}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[18px] font-bold text-[var(--ink)] leading-tight truncate">
                {userProfile.name || "Marie"}
              </span>
              <span className="text-[13px] text-[var(--muted)] leading-tight mt-1 truncate">
                {tr(language, "Owner")} · Douala
              </span>
            </div>
          </div>

          {!user ? (
            <button
              type="button"
              onClick={() => signInWithGoogle().catch(() => {})}
              className="px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer shrink-0"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              Cloud Sync
            </button>
          ) : (
            <span
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              Synced
            </span>
          )}
        </div>

        {/* Menu Rows */}
        <div className="flex flex-col gap-2">
          {menuRows.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleRowClick(item)}
              className="h-[58px] px-4 rounded-[16px] flex items-center justify-between text-left cursor-pointer active:scale-[0.99] transition-all select-none"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div className="flex items-center gap-3.5">
                <Icon name={item.icon} size={20} color="var(--ink)" />
                <span className="text-[15px] font-medium text-[var(--ink)]">
                  {tr(language, item.label)}
                </span>
                {item.proOnly && plan === "Basic" && <LockBadge label="Pro" />}
              </div>
              <Icon name="chevron-right" size={18} color="var(--muted)" />
            </button>
          ))}

          {/* Quick Tuto row */}
          <button
            type="button"
            onClick={() => startTutoLesson(role)}
            className="h-[58px] px-4 rounded-[16px] flex items-center justify-between text-left cursor-pointer active:scale-[0.99] transition-all select-none"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <Icon name="file-text" size={20} color="var(--accent)" />
              <span className="text-[15px] font-medium text-[var(--ink)]">
                {tr(language, "Tuto")}
              </span>
            </div>
            <Icon name="chevron-right" size={18} color="var(--muted)" />
          </button>

          {/* Profile row */}
          <button
            type="button"
            onClick={() => go("09")}
            className="h-[58px] px-4 rounded-[16px] flex items-center justify-between text-left cursor-pointer active:scale-[0.99] transition-all select-none"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <Icon name="user" size={20} color="var(--ink)" />
              <span className="text-[15px] font-medium text-[var(--ink)]">
                {tr(language, "Profile")}
              </span>
            </div>
            <Icon name="chevron-right" size={18} color="var(--muted)" />
          </button>

          {/* Switch Role Card */}
          <div
            className="p-3.5 rounded-[16px] flex flex-col gap-2 select-none"
            style={{ backgroundColor: "var(--field)" }}
          >
            <span className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
              {tr(language, "Switch role view")}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setRole("Owner");
                  reset("16");
                }}
                className="py-1.5 px-2 rounded-[8px] bg-[var(--surface)] text-[12px] font-semibold text-[var(--accent)] text-center shadow-xs cursor-pointer"
              >
                {tr(language, "Owner")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("Front desk");
                  reset("17");
                }}
                className="py-1.5 px-2 rounded-[8px] bg-[var(--surface)] text-[12px] font-medium text-[var(--ink)] text-center shadow-xs cursor-pointer"
              >
                {tr(language, "Front desk")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("Warehouse worker");
                  reset("18");
                }}
                className="py-1.5 px-2 rounded-[8px] bg-[var(--surface)] text-[12px] font-medium text-[var(--ink)] text-center shadow-xs cursor-pointer"
              >
                {tr(language, "Warehouse")}
              </button>
            </div>
          </div>

          {/* Log out row */}
          <button
            type="button"
            onClick={handleLogout}
            className="h-[58px] px-4 rounded-[16px] flex items-center text-left cursor-pointer active:scale-[0.99] transition-all select-none"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="flex items-center gap-3.5 text-[var(--ink)]">
              <Icon name="close" size={20} color="var(--ink)" />
              <span className="text-[15px] font-medium">
                {tr(language, "Log out")}
              </span>
            </div>
          </button>
        </div>
      </div>
    </ScreenLayout>
  );
};

export const S52AccountMenuFrontDesk: React.FC = () => {
  const {
    go,
    back,
    reset,
    showConfirm,
    role,
    setRole,
    logout,
    language,
    startTutoLesson,
  } = useDemo();

  const name =
    role === "Warehouse worker"
      ? "Paul"
      : role === "Manager"
      ? "Jean"
      : "Aïcha";
  const initial = name[0];
  const subtitle =
    role === "Warehouse worker"
      ? `${tr(language, "Warehouse worker")} · Guangzhou`
      : role === "Manager"
      ? `${tr(language, "Manager")} · Douala`
      : `${tr(language, "Front desk")} · Douala`;

  const handleLogout = () => {
    showConfirm({
      variant: "logout",
      title: "Log out?",
      cancelLabel: "Cancel",
      confirmLabel: "Log out",
      onConfirm: () => {
        logout();
      },
    });
  };

  return (
    <ScreenLayout showBack onBack={back} title="Account" hasNav={true}>
      <div className="flex flex-col gap-4 pt-1 pb-6">
        {/* Profile Header Card */}
        <div
          className="p-4 rounded-[18px] flex items-center gap-3.5 select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-[20px] shrink-0"
            style={{
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
            }}
          >
            {initial}
          </div>
          <div className="flex flex-col">
            <span className="text-[18px] font-bold text-[var(--ink)] leading-tight">
              {name}
            </span>
            <span className="text-[13px] text-[var(--muted)] leading-tight mt-1">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Menu Rows */}
        <div className="flex flex-col gap-2">
          {/* Settings row (includes Tuto & Language for every profile) */}
          <button
            type="button"
            onClick={() => go("08")}
            className="h-[58px] px-4 rounded-[16px] flex items-center justify-between text-left cursor-pointer active:scale-[0.99] transition-all select-none"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <Icon name="settings" size={20} color="var(--ink)" />
              <span className="text-[15px] font-medium text-[var(--ink)]">
                {tr(language, "Settings")}
              </span>
            </div>
            <Icon name="chevron-right" size={18} color="var(--muted)" />
          </button>

          {/* Direct Tuto launcher for this profile */}
          <button
            type="button"
            onClick={() => startTutoLesson(role)}
            className="h-[58px] px-4 rounded-[16px] flex items-center justify-between text-left cursor-pointer active:scale-[0.99] transition-all select-none"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <Icon name="file-text" size={20} color="var(--accent)" />
              <span className="text-[15px] font-medium text-[var(--ink)]">
                {tr(language, "Tuto")}
              </span>
            </div>
            <Icon name="chevron-right" size={18} color="var(--muted)" />
          </button>

          {/* Profile row */}
          <button
            type="button"
            onClick={() => go("09")}
            className="h-[58px] px-4 rounded-[16px] flex items-center justify-between text-left cursor-pointer active:scale-[0.99] transition-all select-none"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <Icon name="user" size={20} color="var(--ink)" />
              <span className="text-[15px] font-medium text-[var(--ink)]">
                {tr(language, "Profile")}
              </span>
            </div>
            <Icon name="chevron-right" size={18} color="var(--muted)" />
          </button>

          {/* Switch Role Card */}
          <div
            className="p-3.5 rounded-[16px] flex flex-col gap-2 select-none"
            style={{ backgroundColor: "var(--field)" }}
          >
            <span className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">
              {tr(language, "Switch role view")}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setRole("Owner");
                  reset("16");
                }}
                className="py-1.5 px-2 rounded-[8px] bg-[var(--surface)] text-[12px] font-medium text-[var(--ink)] text-center shadow-xs cursor-pointer"
              >
                {tr(language, "Owner")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("Front desk");
                  reset("17");
                }}
                className="py-1.5 px-2 rounded-[8px] bg-[var(--surface)] text-[12px] font-medium text-[var(--ink)] text-center shadow-xs cursor-pointer"
              >
                {tr(language, "Front desk")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("Warehouse worker");
                  reset("18");
                }}
                className="py-1.5 px-2 rounded-[8px] bg-[var(--surface)] text-[12px] font-medium text-[var(--ink)] text-center shadow-xs cursor-pointer"
              >
                {tr(language, "Warehouse")}
              </button>
            </div>
          </div>

          {/* Log out row */}
          <button
            type="button"
            onClick={handleLogout}
            className="h-[58px] px-4 rounded-[16px] flex items-center text-left cursor-pointer active:scale-[0.99] transition-all select-none"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="flex items-center gap-3.5 text-[var(--ink)]">
              <Icon name="close" size={20} color="var(--ink)" />
              <span className="text-[15px] font-medium">
                {tr(language, "Log out")}
              </span>
            </div>
          </button>
        </div>
      </div>
    </ScreenLayout>
  );
};
