import React, { useState, useEffect } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon } from "../components/Icon";
import { StatusChip } from "../components/Chip";
import { Logo } from "../components/Logo";
import { TrackingAndReceiptBrandHeader } from "../components/AgencyBrand";
import { QrPlaceholder } from "../components/QrPlaceholder";
import { useDemo } from "../context/Demo";
import { Shipment } from "../data/mock";

const DEFAULT_STEPS = [
  { status: "Expected", date: "Pending", completed: true, current: true },
  { status: "Received", date: "Pending", completed: false, current: false },
  { status: "In transit", date: "Pending", completed: false, current: false },
  { status: "Arrived", date: "Pending", completed: false, current: false },
  { status: "Ready", date: "Pending", completed: false, current: false },
  { status: "Collected", date: "Pending", completed: false, current: false },
];

export const S49PublicTracking: React.FC = () => {
  const {
    shipments,
    selectedShipmentId,
    setSelectedShipmentId,
    userProfile,
    plan,
    routes,
    back,
    go,
    lookupPublicShipment,
  } = useDemo();

  const currentShipment =
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0] || null;

  const [queryInput, setQueryInput] = useState(
    selectedShipmentId || currentShipment?.id || ""
  );
  const [searchedId, setSearchedId] = useState(
    selectedShipmentId || currentShipment?.id || ""
  );
  const [remoteMatched, setRemoteMatched] = useState<Shipment | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (selectedShipmentId) {
      setQueryInput(selectedShipmentId);
      setSearchedId(selectedShipmentId);
    } else if (shipments[0]?.id && !searchedId) {
      setQueryInput(shipments[0].id);
      setSearchedId(shipments[0].id);
    }
  }, [selectedShipmentId, shipments, searchedId]);

  const localMatched = shipments.find(
    (s) => s.id.toLowerCase() === searchedId.trim().toLowerCase()
  );
  const matchedShipment = localMatched || remoteMatched;

  // Determine Company in charge & White-labeling state
  const companyInCharge =
    matchedShipment?.agencyName || userProfile.agencyName || "Douala Express";
  const companyLogoUrl =
    matchedShipment?.agencyLogoUrl || userProfile.agencyLogoUrl;
  const isWhiteLabeled = Boolean(
    matchedShipment?.whiteLabelEnabled ??
      (plan === "Pro" && userProfile.whiteLabelEnabled)
  );

  const matchedRoute = routes.find((r) => r.id === matchedShipment?.routeId);
  const routeParts = matchedShipment?.route
    ? matchedShipment.route.split(/→| to /i)
    : [];
  const fromCity =
    matchedRoute?.fromCity || routeParts[0]?.trim() || "Guangzhou";
  const toCity = matchedRoute?.toCity || routeParts[1]?.trim() || "Douala";

  const steps = matchedShipment?.timeline?.length
    ? matchedShipment.timeline
    : DEFAULT_STEPS;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = queryInput.trim().toUpperCase();
    if (!cleaned) return;
    setSearchedId(cleaned);
    setSearching(true);
    try {
      const found = await lookupPublicShipment(cleaned);
      setRemoteMatched(found);
      if (found) {
        setSelectedShipmentId(found.id);
      }
    } finally {
      setSearching(false);
    }
  };

  return (
    <ScreenLayout hasHeader={false} hasNav={false}>
      <div className="flex flex-col gap-4 pt-3 pb-6 select-none">
        {/* Top bar with back option */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            style={{ backgroundColor: "var(--field)" }}
            title="Back"
          >
            <Icon name="back" size={18} color="var(--ink)" />
          </button>

          <span className="text-[13px] font-bold tracking-wider uppercase text-[var(--muted)]">
            Shipment Tracking
          </span>

          <div className="w-9" />
        </div>

        {/* Brand Header:
            - On Basic Plan: Shows Our Logislo Logo prominently + Company in charge of shipment
            - On Pro Plan (White-labeled): Shows Agency's own Logo instead of Logislo's logo */}
        <TrackingAndReceiptBrandHeader
          agencyName={companyInCharge}
          agencyLogoUrl={companyLogoUrl}
          isWhiteLabeled={isWhiteLabeled}
          subtitle="Company in charge of shipment"
        />

        {/* Tracking Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div
            className="flex-1 h-11 px-3.5 rounded-[14px] flex items-center gap-2.5"
            style={{ backgroundColor: "var(--field)" }}
          >
            <Icon name="search" size={16} color="var(--muted)" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Enter tracking ID (e.g. SHP-1001)"
              className="bg-transparent border-none outline-none w-full text-[14px] font-semibold text-[var(--ink)] placeholder:text-[var(--placeholder)]"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="h-11 px-4 rounded-[14px] font-semibold text-[13px] text-white cursor-pointer active:scale-95 transition-transform"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {searching ? "..." : "Track"}
          </button>
        </form>

        {/* Quick shipment pills when shipments exist in workspace */}
        {shipments.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {shipments.slice(0, 6).map((s) => {
              const active = matchedShipment?.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setQueryInput(s.id);
                    setSearchedId(s.id);
                    setSelectedShipmentId(s.id);
                  }}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: active
                      ? "var(--accent-tint)"
                      : "var(--field)",
                    color: active ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  {s.id}
                </button>
              );
            })}
          </div>
        )}

        {matchedShipment ? (
          <>
            {/* Shipment Summary Card */}
            <div
              className="p-5 rounded-[20px] flex items-center justify-between gap-3"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-[24px] font-extrabold tracking-tight text-[var(--ink)] leading-none">
                    {matchedShipment.id}
                  </h1>
                  <StatusChip status={matchedShipment.status} />
                </div>

                <span className="text-[13px] font-semibold text-[var(--ink)] truncate">
                  Client: {matchedShipment.clientName} ({matchedShipment.clientCode})
                </span>

                <div className="flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
                  <span>{fromCity}</span>
                  <Icon name="arrow-right" size={13} color="var(--muted)" />
                  <span>{toCity}</span>
                  <span>
                    · {matchedShipment.boxes} boxes ({matchedShipment.cbm ?? 1} CBM)
                  </span>
                </div>
              </div>

              <div className="p-1.5 rounded-[12px] bg-white border border-[var(--field)] shrink-0">
                <QrPlaceholder
                  size={64}
                  value={
                    matchedShipment.trackingLink ||
                    `https://track.logislo.com/${matchedShipment.id}`
                  }
                />
              </div>
            </div>

            {/* Vertical Stepper Card */}
            <div
              className="p-6 rounded-[20px] flex flex-col"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              {steps.map((step, i) => {
                const isLast = i === steps.length - 1;
                return (
                  <div key={step.status} className="flex gap-4 relative">
                    {/* Vertical connector line */}
                    {!isLast && (
                      <div
                        className="absolute left-[13px] top-[28px] bottom-[-8px] w-[2px]"
                        style={{
                          backgroundColor: step.completed
                            ? "var(--accent)"
                            : "var(--field)",
                        }}
                      />
                    )}

                    {/* Circle indicator */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        step.current ? "ring-4 ring-[var(--accent-tint)]" : ""
                      }`}
                      style={{
                        backgroundColor:
                          step.completed || step.current
                            ? "var(--accent)"
                            : "var(--field)",
                      }}
                    >
                      {step.completed ? (
                        <Icon name="check" size={14} color="#FFFFFF" />
                      ) : (
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: step.current
                              ? "#FFFFFF"
                              : "var(--placeholder)",
                          }}
                        />
                      )}
                    </div>

                    {/* Text Content */}
                    <div
                      className={`flex items-center justify-between flex-1 ${
                        !isLast ? "pb-6" : "pb-1"
                      }`}
                    >
                      <span
                        className={`text-[15px] ${
                          step.current
                            ? "font-bold text-[var(--accent)]"
                            : step.completed
                            ? "font-semibold text-[var(--ink)]"
                            : "font-normal text-[var(--muted)]"
                        }`}
                      >
                        {step.status}
                      </span>

                      <span className="text-[13px] text-[var(--muted)]">
                        {step.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div
            className="p-6 rounded-[20px] flex flex-col items-center text-center gap-3 mt-1"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              <Icon name="search" size={24} color="var(--accent)" />
            </div>
            <h2 className="text-[18px] font-bold text-[var(--ink)]">
              {searchedId
                ? `Shipment "${searchedId}" not found`
                : "Enter a shipment ID to track"}
            </h2>
            <p className="text-[13px] text-[var(--muted)] leading-relaxed max-w-[250px]">
              {shipments.length === 0
                ? "No shipments have been created yet. Create a new pre-alert in the app to generate your first tracking ID (SHP-1001)."
                : "Check the tracking code on your receipt or ask your freight agency for a valid tracking link."}
            </p>
            {shipments.length === 0 && (
              <button
                type="button"
                onClick={() => go("24")}
                className="mt-1 px-4 py-2 rounded-full text-[12px] font-semibold text-white cursor-pointer"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Create first pre-alert →
              </button>
            )}
          </div>
        )}

        {/* Footer Attribution */}
        <div className="flex items-center justify-center pt-1">
          {isWhiteLabeled ? (
            <span className="text-[12px] font-semibold text-[var(--muted)]">
              Official Tracking Portal · {companyInCharge}
            </span>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-medium text-[var(--muted)]">
                Powered by
              </span>
              <Logo size={16} showWordmark={true} />
            </div>
          )}
        </div>
      </div>
    </ScreenLayout>
  );
};
