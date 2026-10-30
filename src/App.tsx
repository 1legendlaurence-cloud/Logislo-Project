import React from "react";
import { DemoProvider, useDemo } from "./context/Demo";
import { getScreen } from "./nav";
import { MoreSheet } from "./components/MoreSheet";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { LimitSheet } from "./components/LimitSheet";
import { TutoOverlay } from "./components/TutoOverlay";

const ScreenHost: React.FC = () => {
  const { screenId } = useDemo();
  const ScreenComponent = getScreen(screenId);

  return (
    <div key={screenId} className="w-full h-full screen-enter flex flex-col">
      <ScreenComponent />
    </div>
  );
};

const AppShell: React.FC = () => {
  return (
    <div className="w-full h-[100dvh] flex items-center justify-center bg-[var(--bg)] overflow-hidden">
      <div className="w-full max-w-[430px] h-[100dvh] bg-[var(--bg)] relative flex flex-col overflow-hidden">
        <ScreenHost />
        <TutoOverlay />
        <MoreSheet />
        <ConfirmDialog />
        <LimitSheet />
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
