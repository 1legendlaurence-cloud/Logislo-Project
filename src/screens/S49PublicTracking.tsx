import React, { useState, useEffect } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon } from "../components/Icon";
import { StatusChip } from "../components/Chip";
import { Logo } from "../components/Logo";
import { AgencyLogoMark } from "../components/AgencyBrand";
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
    routes,
    lookupPublicShipment,
  } = useDemo();

  const [queryInput, setQueryInput] = useState(selectedShipmentId || "");
  const [searchedId, setSearchedId] = useState(selectedShipmentId || "");
  const [matchedShipment, setMatchedShipment] = useState<Shipment | null>(null);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-run lookup if a tracking ID was passed in URL or selection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawPath = window.location.pathname
      .replace(/^\/track\/?/i, "")
      .replace(/^\/+/, "")
      .replace(/\/+$/, "")
      .trim();
    const pathId =
      rawPath && rawPath.toLowerCase() !== "index.html" ? rawPath : "";
    const hashId = window.location.hash
      .replace(/^#\/track\/?/i, "")
      .replace(/^#\/?/, "")
      .trim();

    const urlId =
      params.get("id") || params.get("tracking") || pathId || hashId || "";

    const rawTarget = (selectedShipmentId || urlId).replace(/^\/+/, "").trim();
    if (
      rawTarget &&
      rawTarget.toLowerCase() !== "invalid" &&
      rawTarget.toLowerCase() !== "index.html"
    ) {
      setQueryInput(rawTarget.toUpperCase());
      setSearchedId(rawTarget.toUpperCase());
      handleExecuteSearch(rawTarget);
    }
  }, [selectedShipmentId]);

  const handleExecuteSearch = async (trackingCode: string) => {
    const cleaned = trackingCode.trim().toUpperCase();
    if (!cleaned) return;
    setSearchedId(cleaned);
    setSearching(true);
    setHasSearched(true);

    try {
      // 1. Try local state first
      const localMatch = shipments.find(
        (s) => s.id.toUpperCase() === cleaned
      );
      if (localMatch) {
        setMatchedShipment(localMatch);
        setSelectedShipmentId(localMatch.id);
        return;
      }

      // 2. Lookup in Firestore public collection
      const remote = await lookupPublicShipment(cleaned);
      setMatchedShipment(remote);
      if (remote) {
        setSelectedShipmentId(remote.id);
      }
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteSearch(queryInput);
  };

  // Company in charge details are ONLY resolved from the specific shipment found
  const companyName = matchedShipment?.agencyName?.trim() || "";
  const companyLogoUrl = matchedShipment?.agencyLogoUrl;
  const isWhiteLabeled = Boolean(matchedShipment?.whiteLabelEnabled);

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

  return (
    <ScreenLayout hasHeader={false} hasNav={false}>
      <div className="flex flex-col gap-5 pt-8 pb-6 min-h-full select-none justify-between">
        <div className="flex flex-col gap-4">
          {/* Big Display Title & Subtext - No Top Nav Bar */}
          <div className="flex flex-col gap-1.5 pt-2">
            <h1 className="text-[28px] font-extrabold tracking-tight text-[var(--ink)] leading-tight">
              Track your shipment
            </h1>
            <p className="text-[14px] text-[var(--muted)] leading-relaxed">
              Enter your tracking number below to check real-time cargo status.
            </p>
          </div>

          {/* Minimalist Search Bar with Search Button INSIDE */}
          <form onSubmit={handleSubmit} className="w-full">
            <div
              className="w-full h-[54px] pl-4 pr-1.5 rounded-[18px] flex items-center justify-between border border-[var(--field)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus-within:border-[var(--accent)] transition-colors"
              style={{ backgroundColor: "var(--surface)" }}
            >
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Enter shipment ID (e.g. SHP-1001)"
                autoCapitalize="characters"
                autoComplete="off"
                className="bg-transparent border-none outline-none w-full text-[15px] font-semibold text-[var(--ink)] placeholder:text-[var(--placeholder)]"
              />

              {queryInput && (
                <button
                  type="button"
                  onClick={() => {
                    setQueryInput("");
                    setMatchedShipment(null);
                    setHasSearched(false);
                  }}
                  className="p-1.5 mr-1 text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                  title="Clear"
                >
                  <Icon name="close" size={14} />
                </button>
              )}

              <button
                type="submit"
                disabled={searching || !queryInput.trim()}
                className="h-[42px] px-5 rounded-[14px] font-bold text-[14px] text-white cursor-pointer active:scale-95 transition-transform shrink-0 disabled:opacity-40"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {searching ? "..." : "Search"}
              </button>
            </div>
          </form>

          {/* Results Section */}
          {matchedShipment ? (
            <div className="flex flex-col gap-3.5 mt-2">
              {/* Company In Charge Banner - ONLY appears after shipment is found */}
              {companyName && (
                <div
                  className="p-4 rounded-[18px] flex items-center justify-between gap-3"
                  style={{
                    backgroundColor: "var(--surface)",
                    boxShadow: "var(--shadow-subtle)",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AgencyLogoMark
                      agencyName={companyName}
                      logoUrl={companyLogoUrl}
                      size={40}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                        Company in charge of shipment
                      </span>
                      <span className="text-[16px] font-extrabold text-[var(--ink)] tracking-tight truncate">
                        {companyName}
                      </span>
                    </div>
                  </div>

                  <span
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0"
                    style={{
                      backgroundColor: "var(--accent-tint)",
                      color: "var(--accent)",
                    }}
                  >
                    Carrier
                  </span>
                </div>
              )}

              {/* Shipment Details Card */}
              <div
                className="p-5 rounded-[20px] flex flex-col gap-3"
                style={{
                  backgroundColor: "var(--surface)",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[22px] font-extrabold tracking-tight text-[var(--ink)]">
                    {matchedShipment.id}
                  </span>
                  <StatusChip status={matchedShipment.status} />
                </div>

                <div className="flex flex-col gap-1.5 text-[13px] text-[var(--muted)] border-t border-[var(--field)] pt-3">
                  <div className="flex items-center justify-between">
                    <span>Route</span>
                    <span className="font-semibold text-[var(--ink)]">
                      {fromCity} → {toCity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Packages</span>
                    <span className="font-semibold text-[var(--ink)]">
                      {matchedShipment.boxes} box
                      {matchedShipment.boxes > 1 ? "es" : ""}
                      {matchedShipment.cbm
                        ? ` · ${matchedShipment.cbm} CBM`
                        : ""}
                      {matchedShipment.weightKg
                        ? ` · ${matchedShipment.weightKg} kg`
                        : ""}
                    </span>
                  </div>

                  {matchedShipment.description && (
                    <div className="flex items-center justify-between">
                      <span>Cargo / Description</span>
                      <span className="font-semibold text-[var(--ink)] truncate max-w-[200px]">
                        {matchedShipment.description}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div
                className="p-5 rounded-[20px] flex flex-col"
                style={{
                  backgroundColor: "var(--surface)",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                {steps.map((step, i) => {
                  const isLast = i === steps.length - 1;
                  return (
                    <div key={step.status} className="flex gap-3.5 relative">
                      {!isLast && (
                        <div
                          className="absolute left-[11px] top-[24px] bottom-[-6px] w-[2px]"
                          style={{
                            backgroundColor: step.completed
                              ? "var(--accent)"
                              : "var(--field)",
                          }}
                        />
                      )}

                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10"
                        style={{
                          backgroundColor:
                            step.completed || step.current
                              ? "var(--accent)"
                              : "var(--field)",
                        }}
                      >
                        {step.completed ? (
                          <Icon name="check" size={13} color="#FFFFFF" />
                        ) : (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: step.current
                                ? "#FFFFFF"
                                : "var(--placeholder)",
                            }}
                          />
                        )}
                      </div>

                      <div
                        className={`flex items-center justify-between flex-1 ${
                          !isLast ? "pb-5" : "pb-0.5"
                        }`}
                      >
                        <span
                          className={`text-[14px] ${
                            step.current
                              ? "font-bold text-[var(--accent)]"
                              : step.completed
                              ? "font-semibold text-[var(--ink)]"
                              : "font-normal text-[var(--muted)]"
                          }`}
                        >
                          {step.status}
                        </span>

                        <span className="text-[12px] text-[var(--muted)]">
                          {step.date}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : hasSearched && searchedId ? (
            <div
              className="p-8 rounded-[20px] flex flex-col items-center text-center gap-2 mt-4"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <h2 className="text-[17px] font-bold text-[var(--ink)]">
                Shipment &ldquo;{searchedId}&rdquo; not found
              </h2>
              <p className="text-[13px] text-[var(--muted)] max-w-[260px] leading-relaxed">
                Please verify your tracking code or ask your freight agency for a valid tracking link.
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer: Powered by Logislo */}
        <div className="flex flex-col items-center justify-center gap-1 pt-6 pb-2">
          {matchedShipment && isWhiteLabeled && companyName && (
            <span className="text-[12px] font-semibold text-[var(--ink)]">
              Official Tracking · {companyName}
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-medium text-[var(--muted)]">
              Powered by
            </span>
            <Logo size={16} showWordmark={true} />
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};
