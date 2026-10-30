import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon, IconName } from "../components/Icon";
import { useDemo } from "../context/Demo";

interface GetStartedItem {
  id: string;
  label: string;
  icon: IconName;
}

const GET_STARTED_ROWS: GetStartedItem[] = [
  { id: "12", label: "Add staff", icon: "user" },
  { id: "20", label: "Add client", icon: "user" },
  { id: "24", label: "New pre-alert", icon: "file-text" },
];

export const S57FirstRunHome: React.FC = () => {
  const { go } = useDemo();

  return (
    <ScreenLayout title="Home" hasNav={true}>
      <div className="flex flex-col gap-5 pt-1 pb-4 select-none">
        {/* 2x2 Zeroed Metric Tiles */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => go("23")}
            className="p-4 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[110px]"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="text-[var(--accent)] mb-2">
              <Icon name="box" size={22} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-[var(--muted)]">
                Shipments
              </span>
              <span className="text-[22px] font-bold text-[var(--ink)] leading-none mt-1">
                0
              </span>
            </div>
          </div>

          <div
            onClick={() => go("19")}
            className="p-4 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[110px]"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="text-[var(--accent)] mb-2">
              <Icon name="user" size={22} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-[var(--muted)]">
                Clients
              </span>
              <span className="text-[22px] font-bold text-[var(--ink)] leading-none mt-1">
                0
              </span>
            </div>
          </div>

          <div
            onClick={() => go("32")}
            className="p-4 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[110px]"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="text-[var(--accent)] mb-2">
              <Icon name="layers" size={22} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-[var(--muted)]">
                Containers
              </span>
              <span className="text-[22px] font-bold text-[var(--ink)] leading-none mt-1">
                0
              </span>
            </div>
          </div>

          <div
            onClick={() => go("39")}
            className="p-4 rounded-[18px] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all min-h-[110px]"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div className="text-[var(--accent)] mb-2">
              <Icon name="credit-card" size={22} color="var(--accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-[var(--muted)]">
                Owed
              </span>
              <span className="text-[18px] font-bold text-[var(--ink)] leading-none mt-1">
                0 FCFA
              </span>
            </div>
          </div>
        </div>

        {/* Get Started Section */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[17px] font-bold text-[var(--ink)] tracking-tight">
            Get started
          </span>

          <div className="flex flex-col gap-2">
            {GET_STARTED_ROWS.map((item) => (
              <div
                key={item.id}
                onClick={() => go(item.id)}
                className="h-[64px] px-4 rounded-[16px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
                style={{
                  backgroundColor: "var(--surface)",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "var(--accent-tint)",
                      color: "var(--accent)",
                    }}
                  >
                    <Icon name={item.icon} size={18} color="var(--accent)" />
                  </div>
                  <span className="text-[15px] font-semibold text-[var(--ink)]">
                    {item.label}
                  </span>
                </div>

                <Icon name="chevron-right" size={18} color="var(--muted)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};
