import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Field } from "../components/Field";
import { Segmented } from "../components/Segmented";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { LockBadge } from "../components/Chip";
import { useDemo, Role } from "../context/Demo";

export const S12AddStaff: React.FC = () => {
  const { back, go, plan, showLimit, addStaff } = useDemo();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [role, setRole] = useState<Role>("Warehouse worker");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [office, setOffice] = useState("Guangzhou");
  const [inviteMethod, setInviteMethod] = useState("Invite link");

  const isBasic = plan === "Basic";

  const handleRoleSelect = (r: Role) => {
    if (r === "Manager" && isBasic) {
      showLimit("staff");
      return;
    }
    setRole(r);
    setRoleDropdownOpen(false);
  };

  const handleCreate = async () => {
    await addStaff({
      name: name.trim() || "Paul",
      email: email.trim() || "paul@example.com",
      whatsapp: whatsapp.trim() || "+86 139 0000 1234",
      role,
      office,
      customTitle: customTitle.trim() || undefined,
    });
    go("13");
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Add staff"
      hasNav={false}
      footer={
        <Button variant="primary" className="w-full" onClick={handleCreate}>
          Create
        </Button>
      }
    >
      <div className="flex flex-col gap-4 pt-2 pb-6">
        <Field
          label="Name"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Field
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Field
          label="WhatsApp"
          placeholder="+237 6 12 34 56 78"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />

        {/* Role Field with Branded Dropdown */}
        <div className="flex flex-col gap-1.5 w-full relative">
          <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
            Role
          </label>
          <div
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="w-full h-[52px] px-4 rounded-[14px] flex items-center justify-between cursor-pointer select-none"
            style={{ backgroundColor: "var(--field)" }}
          >
            <span className="text-[15px] font-normal text-[var(--ink)]">
              {role}
            </span>
            <Icon
              name="chevron-down"
              size={18}
              color="var(--muted)"
              className={`transition-transform duration-150 ${
                roleDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Branded Role Dropdown Menu */}
          {roleDropdownOpen && (
            <div
              className="absolute top-[72px] left-0 right-0 z-40 rounded-[14px] p-1.5 select-none"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-dialog)",
              }}
            >
              {(
                [
                  { label: "Warehouse worker" as Role, pro: false },
                  { label: "Front desk" as Role, pro: false },
                  { label: "Manager" as Role, pro: true },
                ]
              ).map((item) => {
                const isSelected = role === item.label;

                return (
                  <div
                    key={item.label}
                    onClick={() => handleRoleSelect(item.label)}
                    className="px-3.5 py-2.5 rounded-[10px] text-[14px] cursor-pointer transition-colors flex items-center justify-between active:scale-[0.99]"
                    style={{
                      backgroundColor: isSelected ? "var(--accent-tint)" : "transparent",
                      color: isSelected ? "var(--accent)" : "var(--ink)",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.pro && isBasic && <LockBadge label="Pro" />}
                    </div>
                    {isSelected && <Icon name="check" size={16} color="var(--accent)" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Field
          label="Custom title (optional)"
          placeholder="e.g. Supervisor"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
        />

        {/* Office Segmented */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
            Office
          </label>
          <Segmented
            options={["Guangzhou", "Douala"]}
            value={office}
            onChange={setOffice}
          />
        </div>

        {/* Invite Method Segmented */}
        <div className="pt-1">
          <Segmented
            options={["Invite link", "Temporary password"]}
            value={inviteMethod}
            onChange={setInviteMethod}
          />
        </div>
      </div>
    </ScreenLayout>
  );
};
