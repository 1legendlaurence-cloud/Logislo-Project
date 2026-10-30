import React from "react";
import { Icon, IconName } from "./Icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "soft" | "gray" | "alert" | "alert-soft";
  size?: "default" | "sm";
  icon?: IconName;
  iconPosition?: "left" | "right";
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "default",
  icon,
  iconPosition = "left",
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-150 select-none outline-none focus:outline-none";

  const sizeClasses =
    size === "default"
      ? "h-[52px] px-5 rounded-[14px] text-[15px] min-h-[48px]"
      : "h-[36px] px-3.5 rounded-[10px] text-[13px] min-h-[36px]";

  let variantClasses = "";
  let iconColor = "currentColor";

  switch (variant) {
    case "primary":
      variantClasses =
        "text-white shadow-[var(--shadow-subtle)] active:scale-[0.98]";
      break;
    case "soft":
      variantClasses =
        "active:scale-[0.98]";
      break;
    case "gray":
      variantClasses =
        "active:scale-[0.98]";
      break;
    case "alert":
      variantClasses =
        "text-white active:scale-[0.98]";
      break;
    case "alert-soft":
      variantClasses =
        "active:scale-[0.98]";
      break;
  }

  const variantStyle: React.CSSProperties = {
    backgroundColor:
      variant === "primary"
        ? "var(--accent)"
        : variant === "soft"
        ? "var(--accent-tint)"
        : variant === "gray"
        ? "var(--field)"
        : variant === "alert"
        ? "var(--alert)"
        : "var(--alert-tint)",
    color:
      variant === "primary" || variant === "alert"
        ? "#FFFFFF"
        : variant === "soft"
        ? "var(--accent)"
        : variant === "alert-soft"
        ? "var(--alert)"
        : "var(--ink)",
  };

  const disabledClasses = disabled
    ? "opacity-40 cursor-not-allowed pointer-events-none"
    : "cursor-pointer";

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}
      style={variantStyle}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <Icon
          name={icon}
          size={size === "default" ? 18 : 15}
          color={iconColor}
          className={children ? "mr-2" : ""}
        />
      )}
      {children}
      {icon && iconPosition === "right" && (
        <Icon
          name={icon}
          size={size === "default" ? 18 : 15}
          color={iconColor}
          className={children ? "ml-2" : ""}
        />
      )}
    </button>
  );
};
