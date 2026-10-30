import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useDemo } from "../context/Demo";

interface PlaceholderScreenProps {
  id: string;
  name: string;
  batch: number;
  hasNav?: boolean;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  id,
  name,
  batch,
  hasNav = true,
}) => {
  const { back } = useDemo();

  return (
    <ScreenLayout
      title={name}
      showBack={id !== "16" && id !== "17" && id !== "18" && id !== "02"}
      onBack={back}
      hasNav={hasNav}
    >
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-[20px]"
          style={{
            backgroundColor: "var(--accent-tint)",
            color: "var(--accent)",
          }}
        >
          {id}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-[20px] font-semibold text-[var(--ink)]">
            {name}
          </h2>
          <p className="text-[14px] text-[var(--muted)]">
            Batch {batch} placeholder
          </p>
        </div>
      </div>
    </ScreenLayout>
  );
};
