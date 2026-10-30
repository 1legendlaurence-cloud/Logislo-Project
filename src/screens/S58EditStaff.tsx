import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Field } from "../components/Field";
import { SearchableSelect } from "../components/SearchableSelect";
import { Segmented } from "../components/Segmented";
import { Button } from "../components/Button";
import { useDemo, Role } from "../context/Demo";

const ROLE_OPTIONS = [
  "Warehouse worker",
  "Front desk",
  "Manager (Pro)",
];

export const S58EditStaff: React.FC = () => {
  const { back, go, staffList, selectedStaffId, updateStaff } = useDemo();

  const staff =
    staffList.find((s) => s.id === selectedStaffId) ||
    staffList.find((s) => s.role !== "Owner") ||
    staffList[0];

  const [name, setName] = useState(staff.name);
  const [email, setEmail] = useState(staff.email);
  const [whatsapp, setWhatsapp] = useState(staff.whatsapp);
  const [role, setRole] = useState<string>(
    staff.role === "Manager" ? "Manager (Pro)" : staff.role
  );
  const [customTitle, setCustomTitle] = useState(staff.customTitle || "Warehouse Lead");
  const [office, setOffice] = useState(staff.office);

  const handleSave = async () => {
    const normalizedRole: Role = role.startsWith("Manager")
      ? "Manager"
      : (role as Role);
    await updateStaff(staff.id, {
      name: name.trim() || staff.name,
      email: email.trim() || staff.email,
      whatsapp: whatsapp.trim() || staff.whatsapp,
      role: normalizedRole,
      customTitle: customTitle.trim() || undefined,
      office,
    });
    go("53");
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Edit staff"
      hasNav={false}
      footer={
        <Button variant="primary" className="w-full" onClick={handleSave}>
          Save
        </Button>
      }
    >
      <div className="flex flex-col gap-4 pt-1 pb-4">
        {/* Name */}
        <Field
          label="Name"
          placeholder="e.g. Paul"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <Field
          label="Email"
          type="email"
          placeholder="e.g. paul@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* WhatsApp */}
        <Field
          label="WhatsApp"
          type="tel"
          placeholder="e.g. +86 139 0000 1234"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />

        {/* Role Selector */}
        <SearchableSelect
          label="Role"
          placeholder="Select role"
          options={ROLE_OPTIONS}
          value={role}
          onChange={setRole}
        />

        {/* Custom Title */}
        <Field
          label="Custom title (optional)"
          placeholder="e.g. Warehouse Lead"
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
      </div>
    </ScreenLayout>
  );
};
