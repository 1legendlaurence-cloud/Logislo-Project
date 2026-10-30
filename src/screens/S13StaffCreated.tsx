import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useDemo } from "../context/Demo";

export const S13StaffCreated: React.FC = () => {
  const { go, staffList, selectedStaffId } = useDemo();
  const [copied, setCopied] = useState(false);

  const staff =
    staffList.find((s) => s.id === selectedStaffId) ||
    staffList[staffList.length - 1] || {
      name: "Paul",
      role: "Warehouse worker",
      office: "Guangzhou",
      tempPassword: "7F3K-9D2M",
    };

  const tempPassword = staff.tempPassword || "7F3K-9D2M";
  const initials = staff.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Logislo Staff Access",
        text: `Your temporary password is: ${tempPassword}`,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <ScreenLayout
      showBack
      onBack={() => go("11")}
      title="Staff created"
      hasNav={false}
      footer={
        <Button
          variant="primary"
          icon="share"
          className="w-full"
          onClick={handleShare}
        >
          Share link
        </Button>
      }
    >
      <div className="flex flex-col gap-4 pt-2">
        {/* Staff Profile Card */}
        <div
          className="p-6 rounded-[20px] flex flex-col items-center text-center gap-3 select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-[24px]"
            style={{
              backgroundColor: "var(--accent)",
              color: "#FFFFFF",
            }}
          >
            {initials || "PW"}
          </div>

          <div className="flex flex-col">
            <h2 className="text-[20px] font-bold text-[var(--ink)] leading-snug">
              {staff.name}
            </h2>
            <span className="text-[13px] text-[var(--muted)] mt-0.5">
              {staff.role} · {staff.office}
            </span>
          </div>

          <div
            className="px-3 py-1 rounded-full text-[12px] font-medium flex items-center gap-1.5 mt-1"
            style={{
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
            }}
          >
            <Icon name="check" size={14} color="var(--accent)" />
            <span>Staff created successfully</span>
          </div>
        </div>

        {/* Temporary password card */}
        <div
          className="p-4 rounded-[16px] flex items-center justify-between select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-medium text-[var(--muted)]">
              Temporary password
            </span>
            <span className="text-[20px] font-mono font-bold tracking-wider text-[var(--ink)]">
              {tempPassword}
            </span>
          </div>

          <Button
            variant="soft"
            size="sm"
            icon={copied ? "check" : "copy"}
            onClick={handleCopy}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        {/* Info card */}
        <div
          className="p-4 rounded-[16px] flex items-start gap-3 select-none"
          style={{ backgroundColor: "var(--field)" }}
        >
          <div className="pt-0.5 text-[var(--muted)]">
            <Icon name="check" size={16} />
          </div>
          <span className="text-[13px] font-normal leading-relaxed text-[var(--muted)]">
            The staff can now log in using this temporary password. Please ask them to change it after first login.
          </span>
        </div>
      </div>
    </ScreenLayout>
  );
};
