import React from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useDemo } from "../context/Demo";

export const S11Staff: React.FC = () => {
  const { back, go, plan, showLimit, staffList, setSelectedStaffId } = useDemo();

  const handleAddStaff = () => {
    if (plan === "Basic" && staffList.length >= 4) {
      showLimit("staff");
    } else {
      go("12");
    }
  };

  const handleRowClick = (staffId: string, role: string) => {
    if (role === "Owner") {
      return;
    }
    setSelectedStaffId(staffId);
    go("53");
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      hasNav={true}
      headerChildren={
        <div className="flex items-center justify-between w-full">
          <span className="text-[22px] font-extrabold tracking-tight text-[var(--ink)]">
            Staff
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddStaff}
          >
            Add staff
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-2 pt-1">
        {staffList.map((staff) => {
          const isOwner = staff.role === "Owner";
          const subtitle = `${staff.role.replace(" worker", "")} · ${staff.office}`;

          return (
            <div
              key={staff.id}
              onClick={() => handleRowClick(staff.id, staff.role)}
              className={`h-[68px] px-4 rounded-[16px] flex items-center justify-between transition-all select-none ${
                isOwner ? "cursor-default" : "cursor-pointer active:scale-[0.99]"
              }`}
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[16px] shrink-0"
                  style={{
                    backgroundColor: "var(--accent-tint)",
                    color: "var(--accent)",
                  }}
                >
                  {staff.name[0]}
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-[var(--ink)] leading-snug">
                    {staff.name}
                  </span>
                  <span className="text-[13px] font-normal text-[var(--muted)] leading-tight mt-0.5">
                    {subtitle}
                  </span>
                </div>
              </div>

              {!isOwner && (
                <Icon name="chevron-right" size={18} color="var(--muted)" />
              )}
            </div>
          );
        })}
      </div>
    </ScreenLayout>
  );
};
