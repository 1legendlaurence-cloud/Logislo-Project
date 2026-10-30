import React, { useState, useEffect } from "react";
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
    <div className="w-full h-full flex flex-col justify-between select-none overflow-y-auto no-scrollbar py-6 px-2 sm:px-4">
      {/* SECTION 1: Top section with big headline and subtext, placed slightly beneath center */}
      <div className="flex-1 flex flex-col justify-end items-center text-center pb-4 sm:pb-6">
        <h1 className="text-[34px] sm:text-[42px] font-extrabold tracking-tight text-[var(--ink)] leading-tight text-center">
          Track your shipment
        </h1>
        <p className="text-[15px] sm:text-[17px] text-[var(--muted)] leading-relaxed text-center mt-2 max-w-[480px]">
          Enter your tracking number below to check real-time cargo status.
        </p>
      </div>

      {/* SECTION 2: Center section carrying the search bar, vertically and horizontally centered */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-[560px] mx-auto py-2">
        <form onSubmit={handleSubmit} className="w-full">
          <div
            className="w-full h-[58px] sm:h-[62px] pl-5 pr-2 rounded-[22px] flex items-center justify-between border border-[var(--field)] focus-within:border-[var(--accent)] transition-colors shadow-none"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Enter shipment ID (e.g. SHP-1001)"
              autoCapitalize="characters"
              autoComplete="off"
              className="bg-transparent border-none outline-none w-full text-[16px] sm:text-[17px] font-semibold text-[var(--ink)] placeholder:text-[var(--placeholder)] placeholder:font-normal"
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
                <Icon name="close" size={16} />
              </button>
            )}

            <button
              type="submit"
              disabled={searching || !queryInput.trim()}
              className="h-[44px] sm:h-[48px] px-6 rounded-[16px] font-bold text-[15px] text-white cursor-pointer active:scale-95 transition-transform shrink-0 disabled:opacity-40"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {searching ? "..." : "Search"}
            </button>
          </div>
        </form>

        {/* Results / Error Area within Center Section */}
        {matchedShipment ? (
          <div className="w-full flex flex-col gap-3.5 mt-5 text-left">
            {/* Company In Charge Banner */}
            {companyName && (
              <div
                className="p-4 rounded-[18px] flex items-center justify-between gap-3 border border-[var(--field)] shadow-none"
                style={{ backgroundColor: "var(--surface)" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <AgencyLogoMark
                    agencyName={companyName}
                    logoUrl={companyLogoUrl}
                    size={42}
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

            {/* Shipment Summary Card */}
            <div
              className="p-5 rounded-[20px] flex flex-col gap-3 border border-[var(--field)] shadow-none"
              style={{ backgroundColor: "var(--surface)" }}
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
                    {matchedShipment.cbm ? ` · ${matchedShipment.cbm} CBM` : ""}
                    {matchedShipment.weightKg ? ` · ${matchedShipment.weightKg} kg` : ""}
                  </span>
                </div>

                {matchedShipment.description && (
                  <div className="flex items-center justify-between">
                    <span>Cargo / Description</span>
                    <span className="font-semibold text-[var(--ink)] truncate max-w-[240px]">
                      {matchedShipment.description}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div
              className="p-5 rounded-[20px] flex flex-col border border-[var(--field)] shadow-none"
              style={{ backgroundColor: "var(--surface)" }}
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
            className="w-full p-6 rounded-[20px] flex flex-col items-center text-center gap-1.5 mt-5 border border-[var(--field)] shadow-none"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <h2 className="text-[17px] font-bold text-[var(--ink)]">
              Shipment &ldquo;{searchedId}&rdquo; not found
            </h2>
            <p className="text-[13px] text-[var(--muted)] max-w-[280px] leading-relaxed">
              Please verify your tracking code or ask your freight agency for a valid tracking link.
            </p>
          </div>
        ) : null}
      </div>

      {/* SECTION 3: Bottom section with Powered by Logislo footer */}
      <div className="flex-1 flex flex-col justify-end items-center pb-2 pt-4">
        {matchedShipment && isWhiteLabeled && companyName && (
          <span className="text-[12px] font-semibold text-[var(--ink)] mb-1">
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
  );
};
