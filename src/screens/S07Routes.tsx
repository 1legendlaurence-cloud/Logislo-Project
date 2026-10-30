import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useDemo } from "../context/Demo";

export const S07Routes: React.FC = () => {
  const { go, back, plan, showLimit, routes, setSelectedRouteId, setDraftRoute } = useDemo();

  const isBasic = plan === "Basic";

  const handleAddRoute = () => {
    if (isBasic || routes.length >= 3) {
      showLimit("routes");
    } else {
      go("05");
    }
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Routes"
      hasNav={true}
      footer={
        <div className="flex flex-col gap-2.5 w-full">
          {isBasic && (
            <button
              type="button"
              onClick={() => showLimit("routes")}
              className="h-[48px] px-4 rounded-[14px] flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform select-none"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              <div className="flex items-center gap-2 font-medium text-[14px]">
                <Icon name="lock" size={16} color="var(--accent)" />
                <span>Pro</span>
              </div>
              <Icon name="chevron-right" size={16} color="var(--accent)" />
            </button>
          )}

          <Button
            variant="primary"
            className="w-full"
            onClick={handleAddRoute}
          >
            Add route
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pt-1">
        {routes.map((route) => (
          <div
            key={route.id}
            onClick={() => {
              setSelectedRouteId(route.id);
              setDraftRoute(null);
              go("06");
            }}
            className="p-5 rounded-[16px] cursor-pointer active:scale-[0.99] transition-all flex flex-col gap-4 select-none"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            {/* Top route header */}
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-semibold text-[var(--ink)]">
                {route.fromCity}
              </span>
              <Icon name="arrow-right" size={16} color="var(--ink)" />
              <span className="text-[17px] font-semibold text-[var(--ink)]">
                {route.toCity}
              </span>
            </div>

            {/* Pricing columns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-[var(--muted)]">
                  Per kg
                </span>
                <span className="text-[20px] font-bold text-[var(--ink)] leading-none mt-1.5">
                  {route.pricePerKg.toLocaleString()}
                </span>
                <span className="text-[12px] text-[var(--muted)] mt-1">
                  FCFA
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-[var(--muted)]">
                  Per CBM
                </span>
                <span className="text-[20px] font-bold text-[var(--ink)] leading-none mt-1.5">
                  {route.pricePerCbm.toLocaleString()}
                </span>
                <span className="text-[12px] text-[var(--muted)] mt-1">
                  FCFA
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScreenLayout>
  );
};
