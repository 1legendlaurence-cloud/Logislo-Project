import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon } from "../components/Icon";

export const S50InvalidLink: React.FC = () => {
  return (
    <ScreenLayout hasHeader={false} hasNav={false}>
      <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4 select-none">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "var(--accent-tint)",
            color: "var(--accent)",
          }}
        >
          <Icon name="close" size={32} color="var(--accent)" />
        </div>

        <h1 className="text-[24px] font-extrabold tracking-tight text-[var(--ink)]">
          Link not valid
        </h1>

        <p className="text-[14px] text-[var(--muted)] max-w-[260px] leading-relaxed">
          The link you are trying to access is no longer valid or has expired.
        </p>
      </div>
    </ScreenLayout>
  );
};
