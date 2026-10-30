import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useDemo } from "../context/Demo";

export const S15Plan: React.FC = () => {
  const { back, go, plan, setPlan } = useDemo();

  const handleUpgrade = () => {
    setPlan("Pro");
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Plan"
      hasNav={false}
      footer={
        plan === "Basic" ? (
          <Button variant="primary" className="w-full" onClick={handleUpgrade}>
            Upgrade to Pro
          </Button>
        ) : (
          <div className="flex items-center gap-2.5 w-full">
            <Button
              variant="soft"
              className="flex-1"
              onClick={() => setPlan("Basic")}
            >
              Switch to Basic
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => go("10")}
            >
              White-label logo
            </Button>
          </div>
        )
      }
    >
      <div className="flex flex-col gap-4 pt-1 pb-4">
        {/* Current plan card */}
        <div
          className="p-4 rounded-[16px] flex items-center justify-between gap-3.5 select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              <Icon name="crown" size={22} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-[var(--muted)]">
                Current plan
              </span>
              <span className="text-[18px] font-bold text-[var(--ink)] leading-snug">
                {plan}
              </span>
            </div>
          </div>

          {plan === "Pro" && (
            <button
              type="button"
              onClick={() => go("10")}
              className="px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              Configure logo →
            </button>
          )}
        </div>

        {/* Basic Plan Card */}
        <div
          onClick={() => setPlan("Basic")}
          className={`p-5 rounded-[18px] flex flex-col gap-3 select-none cursor-pointer transition-all ${
            plan === "Basic" ? "ring-2 ring-[var(--accent)]" : ""
          }`}
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--accent-tint)",
                  color: "var(--accent)",
                }}
              >
                <Icon name="user" size={18} color="var(--accent)" />
              </div>
              <span className="text-[16px] font-bold text-[var(--ink)]">
                Basic
              </span>
            </div>
            {plan === "Basic" && (
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                style={{
                  backgroundColor: "var(--accent-tint)",
                  color: "var(--accent)",
                }}
              >
                Current
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-1 text-[14px]">
            <div className="flex items-center gap-2 text-[var(--ink)]">
              <Icon name="check" size={16} color="var(--accent)" />
              <span>1 route</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--ink)]">
              <Icon name="check" size={16} color="var(--accent)" />
              <span>Owner + 3 staff</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--ink)]">
              <Icon name="check" size={16} color="var(--accent)" />
              <span>Logislo branded tracking & receipts</span>
            </div>
          </div>
        </div>

        {/* Pro Plan Card */}
        <div
          onClick={() => setPlan("Pro")}
          className={`p-5 rounded-[18px] flex flex-col gap-3 select-none cursor-pointer transition-all ${
            plan === "Pro" ? "ring-2 ring-[var(--accent)]" : ""
          }`}
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--accent-tint)",
                  color: "var(--accent)",
                }}
              >
                <Icon name="crown" size={18} color="var(--accent)" />
              </div>
              <span className="text-[16px] font-bold text-[var(--ink)]">
                Pro
              </span>
            </div>
            {plan === "Pro" ? (
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                style={{
                  backgroundColor: "var(--accent-tint)",
                  color: "var(--accent)",
                }}
              >
                Current
              </span>
            ) : (
              <Icon name="lock" size={16} color="var(--accent)" />
            )}
          </div>

          <div className="flex flex-col gap-2 pt-1 text-[14px]">
            <div className="flex items-center gap-2 text-[var(--ink)]">
              <Icon name="check" size={16} color="var(--accent)" />
              <span>3 routes</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--ink)]">
              <Icon name="check" size={16} color="var(--accent)" />
              <span>Owner + 10 staff</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--ink)] font-semibold">
              <Icon name="check" size={16} color="var(--accent)" />
              <span>White-label tracking & receipts (your logo)</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--ink)]">
              <Icon name="check" size={16} color="var(--accent)" />
              <span>Photo proof & storage fees</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--ink)]">
              <Icon name="check" size={16} color="var(--accent)" />
              <span>Warehouse list & unmatched cargo</span>
            </div>
          </div>
        </div>

        {/* Enterprise Plan Card */}
        <div
          className="p-5 rounded-[18px] flex flex-col gap-2.5 select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--field)",
                  color: "var(--muted)",
                }}
              >
                <Icon name="building" size={18} color="var(--muted)" />
              </div>
              <span className="text-[16px] font-bold text-[var(--ink)]">
                Enterprise
              </span>
            </div>
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
              style={{
                backgroundColor: "var(--field)",
                color: "var(--muted)",
              }}
            >
              Coming soon
            </span>
          </div>
          <p className="text-[13px] text-[var(--muted)] leading-snug">
            Advanced features for large organizations.
          </p>
        </div>
      </div>
    </ScreenLayout>
  );
};
