import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { StatusChip } from "../components/Chip";
import { useDemo } from "../context/Demo";

export const S53StaffDetail: React.FC = () => {
  const { back, go, showConfirm, staffList, selectedStaffId, deactivateStaff } = useDemo();

  const staff =
    staffList.find((s) => s.id === selectedStaffId) ||
    staffList.find((s) => s.role !== "Owner") ||
    staffList[0];

  const handleDeactivate = () => {
    showConfirm({
      variant: "deactivate",
      title: `Deactivate ${staff.name}?`,
      cancelLabel: "Cancel",
      confirmLabel: "Deactivate",
      onConfirm: async () => {
        await deactivateStaff(staff.id);
        go("11");
      },
    });
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Staff"
      rightIcon="pencil"
      onRightAction={() => go("58")}
      hasNav={false}
      footer={
        <div className="flex flex-col gap-2.5 w-full">
          <Button
            variant="soft"
            className="w-full"
            onClick={() => go("13")}
          >
            Reset password
          </Button>
          <button
            type="button"
            onClick={handleDeactivate}
            className="w-full h-[52px] rounded-[14px] font-semibold text-[15px] cursor-pointer active:scale-[0.98] transition-all select-none"
            style={{
              backgroundColor: "var(--field)",
              color: "var(--ink)",
            }}
          >
            Deactivate
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-5 pt-2 pb-4 select-none">
        {/* Large Avatar & Name */}
        <div className="flex flex-col items-center text-center gap-2.5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-extrabold text-[28px]"
            style={{
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
            }}
          >
            {staff.name[0]}
          </div>

          <h2 className="text-[22px] font-extrabold text-[var(--ink)] leading-tight">
            {staff.name}
          </h2>

          <StatusChip status={staff.status} />
        </div>

        {/* Read-only Filled Rows */}
        <div className="flex flex-col gap-2.5">
          {[
            { label: "Role", value: staff.role },
            { label: "Office", value: staff.office },
            { label: "WhatsApp", value: staff.whatsapp },
            { label: "Email", value: staff.email },
          ].map((row) => (
            <div
              key={row.label}
              className="px-4 py-3.5 rounded-[14px] flex flex-col gap-1"
              style={{ backgroundColor: "var(--field)" }}
            >
              <span className="text-[12px] font-medium text-[var(--muted)]">
                {row.label}
              </span>
              <span className="text-[15px] font-medium text-[var(--ink)]">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ScreenLayout>
  );
};
