import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon } from "../components/Icon";
import { useDemo } from "../context/Demo";

export const S30Unmatched: React.FC = () => {
  const { back, go, unmatchedItems, setSelectedUnmatchedId } = useDemo();

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Unmatched"
      hasNav={true}
    >
      <div className="flex flex-col gap-3.5 pt-1 pb-4">
        {/* Alert Banner Card */}
        <div
          className="h-[56px] px-4 rounded-[16px] flex items-center gap-3 select-none"
          style={{
            backgroundColor: "var(--alert-tint)",
            color: "var(--alert)",
          }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0"
            style={{
              backgroundColor: "var(--alert)",
              color: "#FFFFFF",
            }}
          >
            !
          </div>
          <span className="text-[15px] font-semibold">
            {unmatchedItems.length} items
          </span>
        </div>

        {/* Unmatched Rows */}
        <div className="flex flex-col gap-2.5">
          {unmatchedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedUnmatchedId(item.id);
                go("31");
              }}
              className="h-[68px] px-4 rounded-[16px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all select-none"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div className="flex flex-col">
                <span className="text-[16px] font-bold text-[var(--ink)]">
                  {item.id}
                </span>
                <span className="text-[13px] text-[var(--muted)] mt-0.5">
                  {item.boxes} boxes · {item.cbm ?? 1} CBM · {item.date}
                </span>
              </div>

              <Icon name="chevron-right" size={18} color="var(--muted)" />
            </div>
          ))}
        </div>
      </div>
    </ScreenLayout>
  );
};
