import React, { useState, useRef, useEffect } from "react";
import { Icon } from "./Icon";

interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal query when value prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value); // revert query to current value if not selected
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes((query || "").toLowerCase())
  );

  const handleSelect = (opt: string) => {
    if (disabled) return;
    onChange(opt);
    setQuery(opt);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    onChange(val);
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5 w-full relative">
      <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
        {label}
      </label>

      <div className="relative flex items-center w-full">
        <input
          type="text"
          value={query}
          disabled={disabled}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={() => {
            if (!disabled) setOpen(true);
          }}
          className={`w-full h-[52px] px-4 pr-11 rounded-[14px] text-[15px] font-normal outline-none transition-colors ${
            disabled ? "opacity-45 cursor-not-allowed" : ""
          }`}
          style={{
            backgroundColor: "var(--field)",
            color: "var(--ink)",
            border: "none",
          }}
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) setOpen(!open);
          }}
          className={`absolute right-3.5 p-1 text-[var(--muted)] ${
            disabled ? "opacity-30 cursor-not-allowed" : "hover:text-[var(--ink)] cursor-pointer"
          }`}
          tabIndex={-1}
          aria-label="Toggle dropdown"
        >
          <Icon
            name="chevron-down"
            size={18}
            className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Branded Dropdown Menu */}
      {open && (
        <div
          className="absolute top-[72px] left-0 right-0 z-40 rounded-[14px] p-1.5 max-h-[190px] overflow-y-auto select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-dialog)",
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => {
              const isSelected = opt.toLowerCase() === value.toLowerCase();

              return (
                <div
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className="px-3.5 py-2.5 rounded-[10px] text-[14px] cursor-pointer transition-colors flex items-center justify-between active:scale-[0.99]"
                  style={{
                    backgroundColor: isSelected ? "var(--accent-tint)" : "transparent",
                    color: isSelected ? "var(--accent)" : "var(--ink)",
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  <span>{opt}</span>
                  {isSelected && <Icon name="check" size={16} color="var(--accent)" />}
                </div>
              );
            })
          ) : (
            <div className="px-3.5 py-3 text-[13px] text-[var(--muted)] text-center">
              No matching {label.toLowerCase()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
