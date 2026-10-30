import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { Logo } from "../components/Logo";
import { useDemo } from "../context/Demo";

export const S02Login: React.FC = () => {
  const { go, reset, getHomeForRole, role, signInWithGoogle, updateProfile } = useDemo();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      await updateProfile({ email: email.trim() });
    }
    const home = getHomeForRole(role);
    reset(home);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      const home = getHomeForRole(role);
      reset(home);
    } catch {
      const home = getHomeForRole(role);
      reset(home);
    }
  };

  return (
    <ScreenLayout
      hasHeader={false}
      hasNav={false}
      contentClassName="overflow-y-auto h-full flex flex-col justify-between pt-3 pb-5"
    >
      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-between h-full w-full"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pt-1">
            <Logo size={24} showWordmark={true} />
          </div>

          <h1 className="text-[26px] font-extrabold tracking-tight text-[var(--ink)] leading-none pt-1">
            Welcome back
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
            <Field
              label="Password"
              isPassword
              placeholder="••••••••"
              value={password}
              className="h-[50px]"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pt-3">
          <Button type="submit" variant="primary" className="w-full">
            Log in
          </Button>

          <Button
            type="button"
            variant="soft"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>

          <div className="flex flex-col items-center mt-1 gap-1.5">
            <button
              type="button"
              onClick={() => go("14")}
              className="text-[13px] font-semibold text-[var(--accent)] text-center py-0.5 cursor-pointer hover:underline"
            >
              Join agency with staff invite code
            </button>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => go("03")}
                className="text-[13px] font-medium text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
              >
                Forgot password
              </button>
              <span className="text-[var(--placeholder)]">·</span>
              <button
                type="button"
                onClick={() => go("01")}
                className="text-[13px] font-medium text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </form>
    </ScreenLayout>
  );
};
