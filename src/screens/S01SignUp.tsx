import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { Logo } from "../components/Logo";
import { useDemo } from "../context/Demo";

export const S01SignUp: React.FC = () => {
  const { go, updateProfile, signInWithGoogle } = useDemo();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [agencyName, setAgencyName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: fullName.trim() || "Owner",
      email: email.trim() || "owner@company.com",
      whatsapp: whatsapp.trim() || "+237 6 00 00 00 00",
      agencyName: agencyName.trim() || "My Agency",
      role: "Owner",
    });
    go("05");
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      if (agencyName.trim() || fullName.trim()) {
        await updateProfile({
          ...(fullName.trim() ? { name: fullName.trim() } : {}),
          ...(agencyName.trim() ? { agencyName: agencyName.trim() } : {}),
        });
      }
      go("05");
    } catch {
      go("05");
    }
  };

  return (
    <ScreenLayout
      hasHeader={false}
      hasNav={false}
      contentClassName="overflow-y-auto h-full flex flex-col justify-between pt-2 pb-5"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between h-full w-full"
      >
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between pt-1">
            <Logo size={22} showWordmark={true} />
            <button
              type="button"
              onClick={() => go("14")}
              className="text-[12px] font-semibold text-[var(--accent)] cursor-pointer hover:underline"
            >
              Joining as staff?
            </button>
          </div>

          <h1 className="text-[25px] font-extrabold tracking-tight text-[var(--ink)] leading-none">
            Create account
          </h1>

          <div className="flex flex-col gap-2.5">
            <Field
              label="Full name"
              placeholder="Your full name"
              value={fullName}
              className="h-[46px]"
              onChange={(e) => setFullName(e.target.value)}
            />
            <Field
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              className="h-[46px]"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Field
              label="WhatsApp"
              placeholder="+237 6 12 34 56 78"
              value={whatsapp}
              className="h-[46px]"
              onChange={(e) => setWhatsapp(e.target.value)}
            />
            <Field
              label="Password"
              isPassword
              placeholder="••••••••"
              value={password}
              className="h-[46px]"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Field
              label="Agency name"
              placeholder="e.g. Douala Express"
              value={agencyName}
              className="h-[46px]"
              onChange={(e) => setAgencyName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-3">
          <Button type="submit" variant="primary" className="w-full">
            Sign up
          </Button>

          <Button
            type="button"
            variant="soft"
            className="w-full"
            onClick={handleGoogleSignUp}
          >
            Continue with Google
          </Button>

          <button
            type="button"
            onClick={() => go("02")}
            className="text-[13px] font-medium text-[var(--accent)] text-center py-1 cursor-pointer hover:underline"
          >
            Log in
          </button>
        </div>
      </form>
    </ScreenLayout>
  );
};
