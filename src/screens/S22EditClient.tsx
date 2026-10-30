import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useDemo } from "../context/Demo";

export const S22EditClient: React.FC = () => {
  const { back, clients, selectedClientId, updateClient } = useDemo();

  const client =
    clients.find((c) => c.id === selectedClientId) || clients[0];

  const [name, setName] = useState(client.name);
  const [whatsapp, setWhatsapp] = useState(client.whatsapp);
  const [email, setEmail] = useState(client.email || "jean.dupont@example.com");

  const initials = (name || client.name)
    .split(" ")
    .map((n) => n[0])
    .join("");

  const handleSave = async () => {
    await updateClient(client.id, {
      name: name.trim() || client.name,
      whatsapp: whatsapp.trim() || client.whatsapp,
      email: email.trim() || undefined,
    });
    back();
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Edit client"
      hasNav={false}
      footer={
        <Button variant="primary" className="w-full" onClick={handleSave}>
          Save
        </Button>
      }
    >
      <div className="flex flex-col gap-5 pt-1 pb-4">
        {/* Header Avatar and Name */}
        <div className="flex flex-col items-center text-center gap-2 select-none pt-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-[22px]"
            style={{
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
            }}
          >
            {initials}
          </div>
          <div className="flex flex-col">
            <h2 className="text-[19px] font-bold text-[var(--ink)] leading-tight">
              {name || client.name}
            </h2>
            <span className="text-[13px] text-[var(--muted)] leading-tight mt-0.5">
              {client.code}
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3.5">
          {/* Name Field */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
              Name
            </label>
            <div className="relative flex items-center w-full">
              <div className="absolute left-4 text-[var(--muted)] pointer-events-none">
                <Icon name="user" size={18} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[52px] pl-11 pr-4 rounded-[14px] text-[15px] font-normal outline-none"
                style={{
                  backgroundColor: "var(--field)",
                  color: "var(--ink)",
                  border: "none",
                }}
              />
            </div>
          </div>

          {/* WhatsApp Field */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
              WhatsApp
            </label>
            <div className="relative flex items-center w-full">
              <div className="absolute left-4 text-[var(--muted)] pointer-events-none">
                <Icon name="whatsapp" size={18} />
              </div>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full h-[52px] pl-11 pr-4 rounded-[14px] text-[15px] font-normal outline-none"
                style={{
                  backgroundColor: "var(--field)",
                  color: "var(--ink)",
                  border: "none",
                }}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
              Email
            </label>
            <div className="relative flex items-center w-full">
              <div className="absolute left-4 text-[var(--muted)] pointer-events-none">
                <Icon name="file-text" size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[52px] pl-11 pr-4 rounded-[14px] text-[15px] font-normal outline-none"
                style={{
                  backgroundColor: "var(--field)",
                  color: "var(--ink)",
                  border: "none",
                }}
              />
            </div>
          </div>

          {/* Client Code (Locked) */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[13px] font-medium text-[var(--muted)] leading-none">
              Client code
            </label>
            <div className="relative flex items-center w-full">
              <div className="absolute left-4 text-[var(--muted)] pointer-events-none">
                <Icon name="credit-card" size={18} />
              </div>
              <input
                type="text"
                value={client.code}
                readOnly
                disabled
                className="w-full h-[52px] pl-11 pr-11 rounded-[14px] text-[15px] font-medium opacity-65 outline-none cursor-not-allowed"
                style={{
                  backgroundColor: "var(--field)",
                  color: "var(--ink)",
                  border: "none",
                }}
              />
              <div className="absolute right-4 text-[var(--muted)] pointer-events-none">
                <Icon name="lock" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};
