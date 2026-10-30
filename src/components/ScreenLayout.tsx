import React from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "./OfflineBanner";
import { IconName } from "./Icon";

interface ScreenLayoutProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: IconName;
  onRightAction?: () => void;
  avatarInitial?: string;
  onAvatarClick?: () => void;
  headerChildren?: React.ReactNode;
  hasHeader?: boolean;
  hasNav?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  title,
  showBack = false,
  onBack,
  rightIcon,
  onRightAction,
  avatarInitial,
  onAvatarClick,
  headerChildren,
  hasHeader = true,
  hasNav = true,
  footer,
  children,
  className = "",
  contentClassName = "",
}) => {
  return (
    <div
      className={`flex flex-col h-full w-full overflow-hidden relative select-none screen-enter ${className}`}
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Safe area top clearance for physical phone camera, dynamic island, and notch */}
      <div
        className="w-full shrink-0 select-none pointer-events-none"
        style={{
          height: "max(44px, env(safe-area-inset-top, 44px))",
          backgroundColor: "var(--bg)",
        }}
      />

      {hasHeader && (
        <Header
          title={title}
          showBack={showBack}
          onBack={onBack}
          rightIcon={rightIcon}
          onRightAction={onRightAction}
          avatarInitial={avatarInitial}
          onAvatarClick={onAvatarClick}
        >
          {headerChildren}
        </Header>
      )}

      <OfflineBanner />

      <main
        className={`flex-1 overflow-y-auto px-5 py-4 overscroll-contain flex flex-col gap-4 ${contentClassName}`}
      >
        {children}
      </main>

      {footer && (
        <div
          className="p-5 pt-2 shrink-0 z-10"
          style={{
            backgroundColor: "var(--bg)",
            paddingBottom: hasNav ? "12px" : "calc(20px + env(safe-area-inset-bottom, 0px))",
          }}
        >
          {footer}
        </div>
      )}

      {hasNav && <BottomNav />}
    </div>
  );
};
