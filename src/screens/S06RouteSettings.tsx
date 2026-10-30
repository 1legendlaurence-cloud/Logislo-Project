import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { LockBadge } from "../components/Chip";
import { useDemo } from "../context/Demo";

export const S06RouteSettings: React.FC = () => {
  const { back, go, stack, plan, routes, selectedRouteId, draftRoute, saveRouteSettings } =
    useDemo();

  const currentRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const isFromCreate = stack.includes("05") || Boolean(draftRoute);

  const [pricePerKg, setPricePerKg] = useState(
    isFromCreate ? "0" : String(currentRoute?.pricePerKg ?? 1200)
  );
  const [pricePerCbm, setPricePerCbm] = useState(
    isFromCreate ? "0" : String(currentRoute?.pricePerCbm ?? 45000)
  );
  const [deposit, setDeposit] = useState(
    isFromCreate ? "0" : String(currentRoute?.depositPct ?? 20)
  );
  const [gzFreeDays, setGzFreeDays] = useState(
    isFromCreate ? "0" : String(currentRoute?.gzFreeDays ?? 14)
  );
  const [gzDailyFee, setGzDailyFee] = useState(
    isFromCreate ? "0" : String(currentRoute?.gzDailyFee ?? 0)
  );
  const [dlaFreeDays, setDlaFreeDays] = useState(
    isFromCreate ? "0" : String(currentRoute?.dlaFreeDays ?? 3)
  );
  const [dlaDailyFee, setDlaDailyFee] = useState(
    isFromCreate ? "0" : String(currentRoute?.dlaDailyFee ?? 5000)
  );

  const isBasic = plan === "Basic";

  const parseNum = (v: string, fallback: number) => {
    const cleaned = Number(String(v).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(cleaned) ? cleaned : fallback;
  };

  const handleSave = async () => {
    await saveRouteSettings({
      pricePerKg: parseNum(pricePerKg, 1200),
      pricePerCbm: parseNum(pricePerCbm, 45000),
      depositPct: parseNum(deposit, 20),
      gzFreeDays: parseNum(gzFreeDays, 14),
      gzDailyFee: parseNum(gzDailyFee, 0),
      dlaFreeDays: parseNum(dlaFreeDays, 3),
      dlaDailyFee: parseNum(dlaDailyFee, 5000),
    });

    if (stack.includes("05")) {
      go("57");
    } else {
      back();
    }
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Route settings"
      hasNav={false}
      footer={
        <Button variant="primary" className="w-full" onClick={handleSave}>
          Save
        </Button>
      }
    >
      <div className="flex flex-col gap-5 pt-1">
        {/* Price Section */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[17px] font-bold text-[var(--ink)] tracking-tight">
            Price
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div
              className="p-4 rounded-[16px] flex flex-col justify-between"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <span className="text-[13px] font-medium text-[var(--muted)]">
                Per kg
              </span>
              <div className="mt-2 flex flex-col">
                <input
                  type="text"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(e.target.value)}
                  className="text-[20px] font-bold text-[var(--ink)] leading-none bg-transparent outline-none w-full"
                  placeholder="0"
                />
                <span className="text-[12px] font-normal text-[var(--muted)] mt-1">
                  FCFA
                </span>
              </div>
            </div>

            <div
              className="p-4 rounded-[16px] flex flex-col justify-between"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <span className="text-[13px] font-medium text-[var(--muted)]">
                Per CBM
              </span>
              <div className="mt-2 flex flex-col">
                <input
                  type="text"
                  value={pricePerCbm}
                  onChange={(e) => setPricePerCbm(e.target.value)}
                  className="text-[20px] font-bold text-[var(--ink)] leading-none bg-transparent outline-none w-full"
                  placeholder="0"
                />
                <span className="text-[12px] font-normal text-[var(--muted)] mt-1">
                  FCFA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Section */}
        <div className="flex flex-col gap-2">
          <span className="text-[17px] font-bold text-[var(--ink)] tracking-tight">
            Deposit
          </span>
          <div className="relative flex items-center">
            <input
              type="text"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              className="w-full h-[52px] px-4 pr-10 rounded-[14px] text-[16px] font-medium outline-none"
              style={{
                backgroundColor: "var(--field)",
                color: "var(--ink)",
                border: "none",
              }}
              placeholder="0"
            />
            <span className="absolute right-4 text-[14px] font-medium text-[var(--muted)] pointer-events-none">
              %
            </span>
          </div>
        </div>

        {/* Guangzhou office Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[17px] font-bold text-[var(--ink)] tracking-tight">
              Guangzhou office
            </span>
            {isBasic && <LockBadge label="Pro" />}
          </div>
          <div className={`grid grid-cols-2 gap-3 ${isBasic ? "opacity-60" : ""}`}>
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-[var(--muted)]">
                Free days
              </span>
              <div className="relative flex items-center">
                <input
                  type="text"
                  disabled={isBasic}
                  value={gzFreeDays}
                  onChange={(e) => setGzFreeDays(e.target.value)}
                  className="w-full h-[52px] px-4 pr-14 rounded-[14px] text-[16px] font-medium outline-none"
                  style={{
                    backgroundColor: "var(--field)",
                    color: "var(--ink)",
                    border: "none",
                  }}
                  placeholder="0"
                />
                <span className="absolute right-3.5 text-[13px] text-[var(--muted)] pointer-events-none">
                  days
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-[var(--muted)]">
                Daily fee
              </span>
              <div className="relative flex items-center">
                <input
                  type="text"
                  disabled={isBasic}
                  value={gzDailyFee}
                  onChange={(e) => setGzDailyFee(e.target.value)}
                  className="w-full h-[52px] px-4 pr-14 rounded-[14px] text-[16px] font-medium outline-none"
                  style={{
                    backgroundColor: "var(--field)",
                    color: "var(--ink)",
                    border: "none",
                  }}
                  placeholder="0"
                />
                <span className="absolute right-3.5 text-[13px] text-[var(--muted)] pointer-events-none">
                  FCFA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Douala office Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[17px] font-bold text-[var(--ink)] tracking-tight">
              Douala office
            </span>
            {isBasic && <LockBadge label="Pro" />}
          </div>
          <div className={`grid grid-cols-2 gap-3 ${isBasic ? "opacity-60" : ""}`}>
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-[var(--muted)]">
                Free days
              </span>
              <div className="relative flex items-center">
                <input
                  type="text"
                  disabled={isBasic}
                  value={dlaFreeDays}
                  onChange={(e) => setDlaFreeDays(e.target.value)}
                  className="w-full h-[52px] px-4 pr-14 rounded-[14px] text-[16px] font-medium outline-none"
                  style={{
                    backgroundColor: "var(--field)",
                    color: "var(--ink)",
                    border: "none",
                  }}
                  placeholder="0"
                />
                <span className="absolute right-3.5 text-[13px] text-[var(--muted)] pointer-events-none">
                  days
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-[var(--muted)]">
                Daily fee
              </span>
              <div className="relative flex items-center">
                <input
                  type="text"
                  disabled={isBasic}
                  value={dlaDailyFee}
                  onChange={(e) => setDlaDailyFee(e.target.value)}
                  className="w-full h-[52px] px-4 pr-14 rounded-[14px] text-[16px] font-medium outline-none"
                  style={{
                    backgroundColor: "var(--field)",
                    color: "var(--ink)",
                    border: "none",
                  }}
                  placeholder="0"
                />
                <span className="absolute right-3.5 text-[13px] text-[var(--muted)] pointer-events-none">
                  FCFA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};
