import React from "react";
import { Logo } from "./Logo";

interface AgencyLogoMarkProps {
  agencyName: string;
  logoUrl?: string;
  size?: number;
  className?: string;
}

export const AgencyLogoMark: React.FC<AgencyLogoMarkProps> = ({
  agencyName,
  logoUrl,
  size = 34,
  className = "",
}) => {
  const cleanName = (agencyName || "Agency").trim();
  const initials = cleanName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (logoUrl && logoUrl.startsWith("preset:")) {
    const presetColor = logoUrl.replace("preset:", "") || "#0B5FFF";
    return (
      <div
        className={`rounded-[11px] flex items-center justify-center font-extrabold text-white shrink-0 select-none ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: presetColor,
          fontSize: Math.max(12, Math.round(size * 0.42)),
        }}
      >
        {initials || "AG"}
      </div>
    );
  }

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={cleanName}
        className={`rounded-[11px] object-cover shrink-0 border border-[var(--field)] bg-white ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-[11px] flex items-center justify-center font-extrabold text-white shrink-0 select-none ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: "var(--ink)",
        fontSize: Math.max(12, Math.round(size * 0.42)),
      }}
    >
      {initials || "AG"}
    </div>
  );
};

interface TrackingAndReceiptBrandHeaderProps {
  agencyName: string;
  agencyLogoUrl?: string;
  isWhiteLabeled: boolean;
  subtitle?: string;
  compact?: boolean;
}

/**
 * Renders the top brand header for Public Tracking and Official Receipts:
 * - On Basic Plan (or when white-label is disabled):
 *   Shows the Logislo Logo prominently AND clearly shows the Company in Charge.
 * - On Pro Plan with White-Label enabled:
 *   Shows the Agency's own Logo & Brand instead of Logislo's logo.
 */
export const TrackingAndReceiptBrandHeader: React.FC<
  TrackingAndReceiptBrandHeaderProps
> = ({
  agencyName,
  agencyLogoUrl,
  isWhiteLabeled,
  subtitle = "Company in charge of shipment",
  compact = false,
}) => {
  const displayAgency = (agencyName || "Freight Agency").trim();

  if (isWhiteLabeled) {
    return (
      <div
        className={`w-full rounded-[18px] ${
          compact ? "p-3.5" : "p-4"
        } flex items-center justify-between gap-3 select-none`}
        style={{
          backgroundColor: "var(--surface)",
          boxShadow: "var(--shadow-subtle)",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <AgencyLogoMark
            agencyName={displayAgency}
            logoUrl={agencyLogoUrl}
            size={compact ? 38 : 44}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
              {subtitle}
            </span>
            <span className="text-[17px] font-extrabold text-[var(--ink)] tracking-tight truncate">
              {displayAgency}
            </span>
          </div>
        </div>

        <span
          className="px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0"
          style={{
            backgroundColor: "var(--accent-tint)",
            color: "var(--accent)",
          }}
        >
          Verified Carrier
        </span>
      </div>
    );
  }

  // Standard (Basic plan or White-label off):
  // Show OUR Logislo logo prominently + Company in charge of shipment
  return (
    <div
      className={`w-full rounded-[18px] ${
        compact ? "p-3.5" : "p-4"
      } flex flex-col gap-3 select-none`}
      style={{
        backgroundColor: "var(--surface)",
        boxShadow: "var(--shadow-subtle)",
      }}
    >
      {/* Top row: Our Logislo Logo prominently visible */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--field)]">
        <Logo size={24} showWordmark={true} />
        <span
          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
          style={{
            backgroundColor: "var(--accent-tint)",
            color: "var(--accent)",
          }}
        >
          Official Tracking & Receipt
        </span>
      </div>

      {/* Bottom row: Company in charge of shipment */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <AgencyLogoMark
            agencyName={displayAgency}
            logoUrl={agencyLogoUrl}
            size={34}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-medium text-[var(--muted)] leading-none">
              {subtitle}
            </span>
            <span className="text-[15px] font-bold text-[var(--ink)] truncate mt-1">
              {displayAgency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
