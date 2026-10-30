import React from "react";
import { Icon } from "./Icon";

export interface TimelineStep {
  status: string;
  date: string;
  completed: boolean;
  current?: boolean;
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ steps, className = "" }) => {
  return (
    <div
      className={`p-4 rounded-[16px] flex flex-col gap-0 ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        boxShadow: "var(--shadow-subtle)",
      }}
    >
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;

        return (
          <div key={step.status} className="flex items-start gap-3.5 relative">
            {/* Step dot and connecting line */}
            <div className="flex flex-col items-center shrink-0 w-5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors"
                style={{
                  backgroundColor: step.completed
                    ? "var(--accent)"
                    : "var(--field)",
                }}
              >
                {step.completed ? (
                  <Icon name="check" size={12} color="#FFFFFF" />
                ) : (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: step.current
                        ? "var(--accent)"
                        : "var(--placeholder)",
                    }}
                  />
                )}
              </div>
              {!isLast && (
                <div
                  className="w-0.5 min-h-[34px] flex-1 my-1"
                  style={{
                    backgroundColor: step.completed
                      ? "var(--accent-tint)"
                      : "var(--field)",
                  }}
                />
              )}
            </div>

            {/* Step content */}
            <div className={`flex items-baseline justify-between flex-1 ${!isLast ? "pb-4" : "pb-0"}`}>
              <span
                className={`text-[14px] leading-tight ${
                  step.current
                    ? "font-semibold text-[var(--accent)]"
                    : step.completed
                    ? "font-medium text-[var(--ink)]"
                    : "font-normal text-[var(--placeholder)]"
                }`}
              >
                {step.status}
              </span>
              <span
                className="text-[12px] font-normal leading-tight ml-2"
                style={{ color: "var(--muted)" }}
              >
                {step.date}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
