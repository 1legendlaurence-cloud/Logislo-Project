import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useDemo } from "../context/Demo";

export const S09Profile: React.FC = () => {
  const { back, go, userProfile, updateProfile } = useDemo();
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [whatsapp, setWhatsapp] = useState(userProfile.whatsapp);

  const handleSave = async () => {
    await updateProfile({
      name: name.trim() || userProfile.name,
      email: email.trim() || userProfile.email,
      whatsapp: whatsapp.trim() || userProfile.whatsapp,
    });
    back();
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title="Profile"
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
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Field
          label="Email"
          type="email"
          placeholder="john@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Field
          label="WhatsApp"
          placeholder="+237 6 12 34 56 78"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />

        {/* Change password row */}
        <button
          type="button"
          onClick={() => go("04")}
          className="w-full h-[56px] px-4 rounded-[14px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all select-none mt-2"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <span className="text-[15px] font-medium text-[var(--ink)]">
            Change password
          </span>
          <Icon name="chevron-right" size={18} color="var(--muted)" />
        </button>
      </div>
    </ScreenLayout>
  );
};
