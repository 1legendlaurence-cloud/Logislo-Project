import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Logo } from "../components/Logo";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { useDemo } from "../context/Demo";

export const S03ResetPassword: React.FC = () => {
  const { go } = useDemo();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    go("02");
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
            Reset password
          </h1>

          <div className="flex flex-col gap-3 mt-1">
            <Field
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              className="h-[50px]"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-3">
          <Button type="submit" variant="primary" className="w-full">
            Send link
          </Button>

          <button
            type="button"
            onClick={() => go("02")}
            className="text-[14px] font-medium text-[var(--accent)] text-center py-1 cursor-pointer hover:underline"
          >
            Back to login
          </button>
        </div>
      </form>
    </ScreenLayout>
  );
};
