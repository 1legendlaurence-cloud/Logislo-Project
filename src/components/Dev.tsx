import React, { useState } from "react";
import { useDemo, Role, Plan } from "../context/Demo";
import { SCREEN_REGISTRY } from "../nav";
import { Icon } from "./Icon";

export const SHOW_DEV = false;

export const Dev: React.FC = () => {
  const [open, setOpen] = useState(false);
  const {
    role,
    setRole,
    plan,
    setPlan,
    screenId,
    offlineBanner,
    setOfflineBanner,
    reset,
    showConfirm,
    showLimit,
    setVariant,
    getHomeForRole,
    user,
    signInWithGoogle,
    logout,
  } = useDemo();

  if (!SHOW_DEV) return null;

  // Group screens by batch
  const batches: Record<number, typeof SCREEN_REGISTRY[string][]> = {};
  Object.values(SCREEN_REGISTRY).forEach((scr) => {
    if (!batches[scr.batch]) batches[scr.batch] = [];
    batches[scr.batch].push(scr);
  });

  const handleSelectScreen = (id: string, variant?: string) => {
    setVariant(variant || null);
    reset(id);
    setOpen(false);
  };

  const handleVariant = (name: string) => {
    setOpen(false);
    if (name === "20_error") {
      setVariant("error");
      reset("20");
    } else if (name === "55_release") {
      reset("44");
      showConfirm({
        variant: "release",
        title: "Release SHP-1005?",
        line1: "Collector: Samuel Dupont",
        cancelLabel: "Cancel",
        confirmLabel: "Release",
        onConfirm: () => reset("23"),
      });
    } else if (name === "55_deactivate") {
      reset("53");
      showConfirm({
        variant: "deactivate",
        title: "Deactivate Paul?",
        cancelLabel: "Cancel",
        confirmLabel: "Deactivate",
        onConfirm: () => reset("11"),
      });
    } else if (name === "55_logout") {
      showConfirm({
        variant: "logout",
        title: "Log out?",
        cancelLabel: "Cancel",
        confirmLabel: "Log out",
        onConfirm: () => reset("02"),
      });
    } else if (name === "56_routes") {
      reset("07");
      showLimit("routes");
    }
  };

  return (
    <>
      {/* Dev floating button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed top-2.5 right-2.5 z-50 w-7 h-7 rounded-full flex items-center justify-center opacity-35 hover:opacity-100 transition-opacity cursor-pointer shadow-md select-none"
        style={{
          backgroundColor: "var(--ink)",
          color: "#FFFFFF",
        }}
        title="Open Dev Gallery"
        aria-label="Open Dev Gallery"
      >
        <span className="text-[10px] font-bold tracking-wider">DEV</span>
      </button>

      {/* Gallery Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[420px] max-h-[90vh] rounded-[24px] bg-[var(--surface)] p-5 flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--field)] shrink-0">
              <span className="text-[17px] font-semibold text-[var(--ink)]">
                Screen Gallery & Controls
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            {/* Quick Controls */}
            <div className="py-3 flex flex-col gap-3 shrink-0 border-b border-[var(--field)] text-[13px]">
              {/* Firebase Cloud Sync status */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-[var(--muted)]">
                  Firebase Cloud:
                </span>
                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-[var(--accent)] truncate max-w-[160px]">
                      {user.email}
                    </span>
                    <button
                      type="button"
                      onClick={() => logout()}
                      className="px-2 py-1 rounded-[8px] text-[11px] font-medium bg-[var(--field)] text-[var(--ink)] cursor-pointer"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => signInWithGoogle().catch(() => {})}
                    className="px-2.5 py-1 rounded-[8px] text-[12px] font-medium bg-[var(--accent)] text-white cursor-pointer"
                  >
                    Connect Google Auth
                  </button>
                )}
              </div>

              {/* Role */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-[var(--muted)]">Role:</span>
                <div className="flex gap-1">
                  {(["Owner", "Manager", "Front desk", "Warehouse worker"] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRole(r);
                        if (["16", "17", "18", "51", "52", "57"].includes(screenId)) {
                          reset(getHomeForRole(r));
                        }
                      }}
                      className={`px-2 py-1 rounded-[8px] text-[12px] font-medium transition-colors cursor-pointer ${
                        role === r
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--field)] text-[var(--ink)]"
                      }`}
                    >
                      {r.replace(" worker", "")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-[var(--muted)]">Plan:</span>
                <div className="flex gap-1">
                  {(["Basic", "Pro"] as Plan[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlan(p)}
                      className={`px-2.5 py-1 rounded-[8px] text-[12px] font-medium transition-colors ${
                        plan === p
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--field)] text-[var(--ink)]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Offline Banner Toggle */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-[var(--muted)]">Offline banner:</span>
                <button
                  type="button"
                  onClick={() => setOfflineBanner(!offlineBanner)}
                  className={`px-2.5 py-1 rounded-[8px] text-[12px] font-medium transition-colors ${
                    offlineBanner
                      ? "bg-[var(--alert)] text-white"
                      : "bg-[var(--field)] text-[var(--ink)]"
                  }`}
                >
                  {offlineBanner ? "Active" : "Off"}
                </button>
              </div>

              {/* Special Variants */}
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="font-medium text-[var(--muted)] text-[12px]">Special Variants:</span>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => handleVariant("20_error")}
                    className="px-2 py-1 bg-[var(--field)] hover:bg-[var(--accent-tint)] text-[11px] font-medium rounded-[6px]"
                  >
                    20 Add client (error)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVariant("55_release")}
                    className="px-2 py-1 bg-[var(--field)] hover:bg-[var(--accent-tint)] text-[11px] font-medium rounded-[6px]"
                  >
                    55 Confirm (Release)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVariant("55_deactivate")}
                    className="px-2 py-1 bg-[var(--field)] hover:bg-[var(--accent-tint)] text-[11px] font-medium rounded-[6px]"
                  >
                    55 Confirm (Deactivate)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVariant("55_logout")}
                    className="px-2 py-1 bg-[var(--field)] hover:bg-[var(--accent-tint)] text-[11px] font-medium rounded-[6px]"
                  >
                    55 Confirm (Log out)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVariant("56_routes")}
                    className="px-2 py-1 bg-[var(--field)] hover:bg-[var(--accent-tint)] text-[11px] font-medium rounded-[6px]"
                  >
                    56 Limit reached (routes)
                  </button>
                </div>
              </div>
            </div>

            {/* Screen List by Batch */}
            <div className="flex-1 overflow-y-auto pt-3 flex flex-col gap-3">
              {Object.keys(batches)
                .map(Number)
                .sort((a, b) => a - b)
                .map((b) => (
                  <div key={b} className="flex flex-col gap-1">
                    <span className="text-[12px] font-semibold text-[var(--accent)] uppercase tracking-wider">
                      Batch {b}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {batches[b].map((scr) => (
                        <button
                          key={scr.id}
                          type="button"
                          onClick={() => handleSelectScreen(scr.id)}
                          className="flex items-center gap-2 p-2 rounded-[10px] bg-[var(--field)] hover:bg-[var(--accent-tint)] text-left cursor-pointer transition-colors"
                        >
                          <span className="w-6 text-[12px] font-semibold text-[var(--muted)]">
                            {scr.id}
                          </span>
                          <span className="text-[12px] font-medium text-[var(--ink)] truncate">
                            {scr.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
