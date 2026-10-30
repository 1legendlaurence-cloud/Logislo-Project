import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { useDemo } from "../context/Demo";

export const S20AddClient: React.FC = () => {
  const { back, go, variant, clients, addClient, setSelectedClientId } = useDemo();

  const isErrorVariant = variant === "error";

  const [name, setName] = useState(isErrorVariant ? "Jean Dupont" : "");
  const [whatsapp, setWhatsapp] = useState(
    isErrorVariant ? "+237 6 12 34 56 78" : ""
  );
  const [email, setEmail] = useState("");

  const existingDuplicate = clients.find(
    (c) =>
      whatsapp.trim().length > 0 &&
      c.whatsapp.replace(/\s+/g, "") === whatsapp.replace(/\s+/g, "")
  );
  const showDuplicateAlert = isErrorVariant || Boolean(existingDuplicate);

  const handleSave = async () => {
    await addClient({
      name: name.trim() || "New Client",
      whatsapp: whatsapp.trim() || "+237 6 12 34 56 78",
      email: email.trim() || undefined,
    });
    go("21");
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Add client"
      hasNav={false}
      footer={
        <Button variant="primary" className="w-full" onClick={handleSave}>
          Save
        </Button>
      }
    >
      <div className="flex flex-col gap-4 pt-2">
        <Field
          label="Name"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* WhatsApp Field with inline conflict alert */}
        <div className="flex flex-col gap-1.5 w-full">
          <Field
            label="WhatsApp"
            placeholder="+237 6 12 34 56 78"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />

          {showDuplicateAlert && (
            <div className="flex items-center justify-between px-1 pt-0.5">
              <span className="text-[13px] font-medium text-[var(--alert)]">
                Number already used
              </span>
              <button
                type="button"
                onClick={() => {
                  if (existingDuplicate) {
                    setSelectedClientId(existingDuplicate.id);
                  }
                  go("21");
                }}
                className="text-[13px] font-medium text-[var(--accent)] hover:underline cursor-pointer"
              >
                View client
              </button>
            </div>
          )}
        </div>

        <Field
          label="Email (optional)"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
    </ScreenLayout>
  );
};
