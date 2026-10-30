import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Logo } from "../components/Logo";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { useDemo } from "../context/Demo";

export const S04SetPassword: React.FC = () => {
  const { reset, getHomeForRole, role } = useDemo();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const home = getHomeForRole(role);
    reset(home);
  };

  return (
    <ScreenLayout
      hasHeader={false}
      hasNav={false}
      contentClassName="overflow-hidden h-full flex flex-col justify-between pt-2 pb-5"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between h-full w-full"
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-[26px] font-extrabold tracking-tight text-[var(--ink)] leading-none pt-2">
            Set password
          </h1>

          <div className="flex flex-col gap-3 mt-1">
            <Field
              label="New password"
              isPassword
              placeholder="••••••••"
              value={newPassword}
              className="h-[50px]"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Field
              label="Confirm password"
              isPassword
              placeholder="••••••••"
              value={confirmPassword}
              className="h-[50px]"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-3">
          <Button type="submit" variant="primary" className="w-full">
            Continue
          </Button>
        </div>
      </form>
    </ScreenLayout>
  );
};
