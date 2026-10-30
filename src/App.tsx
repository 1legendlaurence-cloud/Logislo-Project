import React, { useEffect } from "react";
import { DemoProvider, useDemo } from "./context/Demo";
import { getScreen } from "./nav";
import { MoreSheet } from "./components/MoreSheet";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { LimitSheet } from "./components/LimitSheet";
import { TutoOverlay } from "./components/TutoOverlay";
import { S49PublicTracking } from "./screens/S49PublicTracking";

const isDedicatedTrackHost = (): boolean => {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  return hostname.startsWith("track.") || pathname.startsWith("/track");
};

const ScreenHost: React.FC = () => {
  const { screenId } = useDemo();

  if (isDedicatedTrackHost()) {
    return (
      <div className="w-full h-full screen-enter flex flex-col">
        <S49PublicTracking />
      </div>
    );
  }

  const ScreenComponent = getScreen(screenId);

  return (
    <div key={screenId} className="w-full h-full screen-enter flex flex-col">
      <ScreenComponent />
    </div>
  );
};

const AppShell: React.FC = () => {
  const onTrackSite = isDedicatedTrackHost();

  useEffect(() => {
    if (onTrackSite) {
      document.title = "Logislo Track - Shipment Tracking";
    }
  }, [onTrackSite]);

  return (
    <div className="w-full h-[100dvh] flex items-center justify-center bg-[var(--bg)] overflow-hidden">
      <div className="w-full max-w-[430px] h-[100dvh] bg-[var(--bg)] relative flex flex-col overflow-hidden">
        <ScreenHost />
        {!onTrackSite && (
          <>
            <TutoOverlay />
            <MoreSheet />
            <ConfirmDialog />
            <LimitSheet />
          </>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <DemoProvider>
      <AppShell />
    </DemoProvider>
  );
}
