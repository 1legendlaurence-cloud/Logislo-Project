import React from "react";
import { Icon, IconName } from "./Icon";
import { useDemo } from "../context/Demo";
import { tr } from "../i18n";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: IconName;
  onRightAction?: () => void;
  avatarInitial?: string;
  onAvatarClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightIcon,
  onRightAction,
  avatarInitial,
  onAvatarClick,
  className = "",
  children,
}) => {
  const { back, language } = useDemo();

  const handleBack = () => {
    if (onBack) onBack();
    else back();
  };

  return (
    <header
      className={`h-[56px] px-5 flex items-center justify-between shrink-0 select-none z-10 ${className}`}
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center cursor-pointer active:scale-95 text-[var(--ink)]"
            aria-label="Back"
          >
            <Icon name="back" size={20} />
          </button>
        )}
        {title && (
          <h1
            className={`font-extrabold tracking-tight truncate ${
              showBack ? "text-[22px]" : "text-[26px]"
            }`}
            style={{ color: "var(--ink)" }}
          >
            {tr(language, title)}
          </h1>
        )}
        {children}
      </div>

      <div className="flex items-center gap-2">
        {rightIcon && (
          <button
            type="button"
            onClick={onRightAction}
            className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center cursor-pointer active:scale-95 text-[var(--ink)]"
            aria-label="Action"
          >
            <Icon name={rightIcon} size={20} />
          </button>
        )}
        {avatarInitial && (
          <button
            type="button"
            onClick={onAvatarClick}
            className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-[14px] cursor-pointer active:scale-95"
            style={{
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
            }}
            aria-label="Account menu"
          >
            {avatarInitial}
          </button>
        )}
      </div>
    </header>
  );
};
