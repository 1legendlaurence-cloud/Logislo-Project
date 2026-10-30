import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useDemo } from "../context/Demo";

export const S48Tools: React.FC = () => {
  const { back, userProfile, updateProfile } = useDemo();
  const joined = Boolean(userProfile.waitlistJoined);

  const handleJoin = async () => {
    await updateProfile({ waitlistJoined: !joined });
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Tools"
      hasNav={true}
    >
      <div className="flex flex-col gap-4 pt-1 pb-4 select-none">
        {/* Single Coming Soon Card */}
        <div
          className="p-5 rounded-[20px] flex flex-col gap-4"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-start justify-between">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              <Icon name="file-text" size={24} color="var(--accent)" />
            </div>

            <span
              className="px-3 py-1 rounded-full text-[12px] font-semibold"
              style={{
                backgroundColor: "var(--accent)",
                color: "#FFFFFF",
              }}
            >
              Soon
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 className="text-[19px] font-extrabold text-[var(--ink)] tracking-tight">
              Business update agent
            </h2>
            <p className="text-[14px] text-[var(--muted)] leading-relaxed">
              Get real-time updates and insights from your business agent.
            </p>
          </div>

          <Button
            variant={joined ? "soft" : "primary"}
            icon={joined ? "check" : "user"}
            className="w-full"
            onClick={handleJoin}
          >
            {joined ? "On waitlist" : "Join waitlist"}
          </Button>
        </div>
      </div>
    </ScreenLayout>
  );
};
