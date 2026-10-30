import React, { useState, useEffect, useRef } from "react";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useDemo } from "../context/Demo";

export const S36ScanCamera: React.FC = () => {
  const { back, go, shipments, setSelectedShipmentId } = useDemo();
  const [torchOn, setTorchOn] = useState(false);
  const [scannedIds, setScannedIds] = useState<string[]>([]);
  const [manualCode, setManualCode] = useState("");
  const [lastScannedMsg, setLastScannedMsg] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const totalExpected = shipments.reduce((sum, s) => sum + (s.boxes || 1), 0);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => {
          stream = s;
          setCameraActive(true);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          setCameraActive(false);
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleScanShipment = (shpId: string) => {
    const clean = shpId.split("|")[0].trim().toUpperCase();
    const found = shipments.find((s) => s.id.toUpperCase() === clean);
    if (found) {
      setSelectedShipmentId(found.id);
      setScannedIds((prev) => (prev.includes(found.id) ? prev : [...prev, found.id]));
      setLastScannedMsg(`Scanned ${found.id} · ${found.clientName}`);
    } else if (clean) {
      setLastScannedMsg(`Code "${clean}" scanned`);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleScanShipment(manualCode);
    setManualCode("");
  };

  return (
    <div
      className="flex flex-col justify-between h-full w-full overflow-hidden relative select-none screen-enter"
      style={{ backgroundColor: "#0B0D17", color: "#FFFFFF" }}
    >
      {/* Live Camera Feed Background when available */}
      {cameraActive && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
        />
      )}

      {/* Top Safe Area + Controls */}
      <div
        className="w-full px-5 flex items-center justify-between z-20"
        style={{ paddingTop: "max(44px, env(safe-area-inset-top, 44px))" }}
      >
        <button
          type="button"
          onClick={() => setTorchOn(!torchOn)}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-all"
          style={{
            backgroundColor: torchOn
              ? "var(--accent)"
              : "rgba(255, 255, 255, 0.14)",
          }}
          aria-label="Toggle torch"
        >
          <Icon name="torch" size={18} color="#FFFFFF" />
        </button>

        <div
          className="px-4 py-1.5 rounded-full text-[14px] font-bold tracking-wide"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.14)" }}
        >
          {scannedIds.length} / {shipments.length || totalExpected} scanned
        </div>

        <button
          type="button"
          onClick={back}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer active:scale-95"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.14)" }}
          aria-label="Close scanner"
        >
          <Icon name="close" size={18} color="#FFFFFF" />
        </button>
      </div>

      {/* Center Square Scan Frame */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 z-20 gap-4">
        <div className="w-[220px] h-[220px] relative flex items-center justify-center">
          <div className="absolute top-0 left-0 w-9 h-9 border-t-4 border-l-4 border-white rounded-tl-[12px]" />
          <div className="absolute top-0 right-0 w-9 h-9 border-t-4 border-r-4 border-white rounded-tr-[12px]" />
          <div className="absolute bottom-0 left-0 w-9 h-9 border-b-4 border-l-4 border-white rounded-bl-[12px]" />
          <div className="absolute bottom-0 right-0 w-9 h-9 border-b-4 border-r-4 border-white rounded-br-[12px]" />

          <Icon name="qr" size={48} color="rgba(255, 255, 255, 0.35)" />
        </div>

        {lastScannedMsg && (
          <div
            onClick={() => go("26")}
            className="px-4 py-2 rounded-full text-[13px] font-semibold flex items-center gap-2 cursor-pointer"
            style={{ backgroundColor: "var(--accent)", color: "#FFFFFF" }}
          >
            <Icon name="check" size={14} color="#FFFFFF" />
            <span>{lastScannedMsg} (Tap to open)</span>
          </div>
        )}
      </div>

      {/* Interactive QR Test Tray + Manual Code Input + Done Button */}
      <div className="w-full px-5 pb-7 flex flex-col gap-3 z-20">
        {shipments.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">
              Tap a shipment QR label to test scan
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {shipments.map((s) => {
                const isScanned = scannedIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleScanShipment(s.id)}
                    className="px-3 py-1.5 rounded-full text-[12px] font-semibold shrink-0 cursor-pointer transition-all"
                    style={{
                      backgroundColor: isScanned
                        ? "var(--accent)"
                        : "rgba(255, 255, 255, 0.14)",
                      color: "#FFFFFF",
                    }}
                  >
                    {isScanned ? `✓ ${s.id}` : s.id}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Or enter QR / shipment code (e.g. SHP-1001)"
            className="flex-1 h-11 px-3.5 rounded-[12px] text-[13px] font-medium text-white placeholder:text-white/45 outline-none"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}
          />
          <button
            type="submit"
            className="h-11 px-4 rounded-[12px] text-[13px] font-semibold text-white cursor-pointer"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.22)" }}
          >
            Scan
          </button>
        </form>

        <Button variant="primary" className="w-full" onClick={back}>
          Done
        </Button>
      </div>
    </div>
  );
};
