import React, { useState } from "react";
import { Icon, IconName } from "./Icon";

interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  rightIcon?: IconName;
  onRightIconClick?: () => void;
  isPassword?: boolean;
  isSelect?: boolean;
  error?: string;
}

export const Field: React.FC<FieldProps> = ({
  label,
  rightIcon,
  onRightIconClick,
  isPassword = false,
  isSelect = false,
  error,
  type = "text",
  className = "",
  readOnly,
  disabled,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[14px] font-medium leading-none" style={{ color: "var(--ink)" }}>
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        <input
          type={inputType}
          readOnly={readOnly || isSelect}
          disabled={disabled}
          className={`w-full h-[52px] px-4 rounded-[14px] text-[16px] outline-none transition-colors duration-150 ${
            readOnly || disabled ? "opacity-75" : ""
          } ${className}`}
          style={{
            backgroundColor: "var(--field)",
            color: "var(--ink)",
            border: "none",
          }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 p-1 text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
            tabIndex={-1}
            aria-label="Toggle password visibility"
          >
            <Icon name={showPassword ? "eye-off" : "eye"} size={20} />
          </button>
        )}
        {!isPassword && isSelect && (
          <div className="absolute right-3.5 pointer-events-none text-[var(--muted)]">
            <Icon name="chevron-down" size={18} />
          </div>
        )}
        {!isPassword && !isSelect && rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3.5 p-1 text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
            tabIndex={-1}
          >
            <Icon name={rightIcon} size={18} />
          </button>
        )}
      </div>
      {error && (
        <span className="text-[13px] font-normal leading-tight" style={{ color: "var(--alert)" }}>
          {error}
        </span>
      )}
    </div>
  );
};
