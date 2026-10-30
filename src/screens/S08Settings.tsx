import React, { useState } from "react";
import { ScreenLayout } from "../components/ScreenLayout";
import { Icon, IconName } from "../components/Icon";
import { useDemo, Role } from "../context/Demo";
import { Language, LANGUAGE_LABELS, TUTO_LESSONS_BY_ROLE, tr } from "../i18n";

interface SettingsRowItem {
  id: string;
  labelKey: string;
  icon: IconName;
  badge?: string;
  ownerOnly?: boolean;
}

export const S08Settings: React.FC = () => {
  const {
    go,
    back,
    plan,
    role,
    setRole,
    language,
    setLanguage,
    tutoCompletedByRole,
    startTutoLesson,
    resetTutoForRole,
    clearAllWorkspaceData,
    userProfile,
  } = useDemo();

  const [tutoRoleTab, setTutoRoleTab] = useState<Role>(role);
  const [tutoExpanded, setTutoExpanded] = useState<boolean>(true);
  const [resetDone, setResetDone] = useState<boolean>(false);

  const allRows: SettingsRowItem[] = [
    { id: "09", labelKey: "Profile", icon: "user" },
    {
      id: "10",
      labelKey: "Agency",
      icon: "building",
      badge:
        plan === "Pro" && userProfile.whiteLabelEnabled ? "White-label" : undefined,
      ownerOnly: true,
    },
    { id: "07", labelKey: "Routes", icon: "map-pin", ownerOnly: true },
    { id: "11", labelKey: "Staff", icon: "user", ownerOnly: true },
    { id: "15", labelKey: "Plan", icon: "crown", badge: plan, ownerOnly: true },
  ];

  const rows = allRows.filter((r) => !r.ownerOnly || role === "Owner");

  const lessons = TUTO_LESSONS_BY_ROLE[tutoRoleTab] || TUTO_LESSONS_BY_ROLE.Owner;
  const completedIds = tutoCompletedByRole[tutoRoleTab] || [];
  const completedCount = lessons.filter((l) => completedIds.includes(l.id)).length;

  const languages: Language[] = ["en", "fr", "zh"];
  const rolesList: Role[] = ["Owner", "Manager", "Front desk", "Warehouse worker"];

  const handleLaunchLesson = (targetRole: Role, stepIdx?: number) => {
    if (targetRole !== role) {
      setRole(targetRole);
    }
    startTutoLesson(targetRole, stepIdx);
  };

  const handleFreshReset = async () => {
    await clearAllWorkspaceData();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <ScreenLayout
      showBack
      onBack={back}
      title={tr(language, "Settings")}
      hasNav={true}
    >
      <div className="flex flex-col gap-3 pt-1 pb-6">
        {/* Core Settings Rows */}
        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => go(row.id)}
              className="w-full h-[58px] px-4 rounded-[16px] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all select-none"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <div className="flex items-center gap-3.5">
                <div className="text-[var(--ink)] flex items-center justify-center">
                  <Icon name={row.icon} size={20} color="var(--ink)" />
                </div>
                <span className="text-[15px] font-medium text-[var(--ink)]">
                  {tr(language, row.labelKey)}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {row.badge && (
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[12px] font-medium"
                    style={{
                      backgroundColor: "var(--accent-tint)",
                      color: "var(--accent)",
                    }}
                  >
                    {row.badge}
                  </span>
                )}
                <Icon name="chevron-right" size={18} color="var(--muted)" />
              </div>
            </button>
          ))}
        </div>

        {/* Language Section (English, Français, 中文) */}
        <div
          className="p-4 rounded-[16px] flex flex-col gap-3 select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Icon name="settings" size={18} color="var(--ink)" />
              <span className="text-[15px] font-semibold text-[var(--ink)]">
                {tr(language, "Language")}
              </span>
            </div>
            <span className="text-[12px] font-medium text-[var(--muted)]">
              {LANGUAGE_LABELS[language].native}
            </span>
          </div>

          <div
            className="grid grid-cols-3 gap-1.5 p-1 rounded-[12px]"
            style={{ backgroundColor: "var(--field)" }}
          >
            {languages.map((langCode) => {
              const active = language === langCode;
              return (
                <button
                  key={langCode}
                  type="button"
                  onClick={() => setLanguage(langCode)}
                  className="h-9 rounded-[9px] text-[13px] font-semibold transition-all cursor-pointer active:scale-95"
                  style={{
                    backgroundColor: active ? "var(--surface)" : "transparent",
                    color: active ? "var(--accent)" : "var(--ink)",
                    boxShadow: active ? "var(--shadow-subtle)" : "none",
                  }}
                >
                  {LANGUAGE_LABELS[langCode].native}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tuto Section (Progressive Role-Based Guided Lessons) */}
        <div
          className="p-4 rounded-[16px] flex flex-col gap-3 select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setTutoExpanded((v) => !v)}
              className="flex items-center gap-3 text-left flex-1 min-w-0 cursor-pointer"
            >
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "var(--accent-tint)",
                  color: "var(--accent)",
                }}
              >
                <Icon name="file-text" size={18} color="var(--accent)" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[15px] font-semibold text-[var(--ink)] truncate">
                  {tr(language, "Tuto")}
                </span>
                <span className="text-[12px] text-[var(--muted)] truncate">
                  {tr(language, "Tuto subtitle")}
                </span>
              </div>
            </button>

            <span
              className="text-[12px] font-semibold px-2.5 py-1 rounded-[8px] shrink-0"
              style={{
                backgroundColor: "var(--field)",
                color: "var(--ink)",
              }}
            >
              {completedCount}/{lessons.length}
            </span>
          </div>

          {tutoExpanded && (
            <>
              {/* Profile Selector Tabs for Tuto */}
              <div
                className="grid grid-cols-2 gap-1.5 p-1 rounded-[12px]"
                style={{ backgroundColor: "var(--field)" }}
              >
                {rolesList.map((rItem) => {
                  const active = tutoRoleTab === rItem;
                  return (
                    <button
                      key={rItem}
                      type="button"
                      onClick={() => setTutoRoleTab(rItem)}
                      className="h-8 px-2 rounded-[8px] text-[12px] font-semibold truncate transition-all cursor-pointer"
                      style={{
                        backgroundColor: active ? "var(--surface)" : "transparent",
                        color: active ? "var(--accent)" : "var(--muted)",
                        boxShadow: active ? "var(--shadow-subtle)" : "none",
                      }}
                    >
                      {tr(language, rItem)}
                    </button>
                  );
                })}
              </div>

              {/* Start / Resume & Reset Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLaunchLesson(tutoRoleTab)}
                  className="flex-1 h-10 px-4 rounded-[12px] text-[13px] font-semibold text-white flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-transform"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  <span>
                    {completedCount > 0 && completedCount < lessons.length
                      ? tr(language, "Resume Tuto")
                      : tr(language, "Start Tuto")}
                  </span>
                  <Icon name="arrow-right" size={15} color="#FFFFFF" />
                </button>

                {completedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => resetTutoForRole(tutoRoleTab)}
                    className="h-10 px-3 rounded-[12px] text-[12px] font-semibold cursor-pointer active:scale-95"
                    style={{
                      backgroundColor: "var(--field)",
                      color: "var(--muted)",
                    }}
                  >
                    {tr(language, "Reset progress")}
                  </button>
                )}
              </div>

              {/* Progressive Lesson-by-Lesson List */}
              <div className="flex flex-col gap-2 pt-1">
                {lessons.map((lesson, idx) => {
                  const isDone = completedIds.includes(lesson.id);
                  const isUnlocked =
                    idx === 0 ||
                    isDone ||
                    completedIds.includes(lessons[idx - 1].id);

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => handleLaunchLesson(tutoRoleTab, idx)}
                      className="w-full p-3 rounded-[12px] flex items-start justify-between gap-3 text-left cursor-pointer active:scale-[0.99] transition-all"
                      style={{
                        backgroundColor: "var(--field)",
                        opacity: isUnlocked ? 1 : 0.75,
                      }}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                          style={{
                            backgroundColor: isDone
                              ? "var(--success)"
                              : isUnlocked
                              ? "var(--accent)"
                              : "var(--surface)",
                            color: isDone || isUnlocked ? "#FFFFFF" : "var(--muted)",
                          }}
                        >
                          {isDone ? (
                            <Icon name="check" size={12} color="#FFFFFF" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-semibold text-[var(--ink)] leading-snug">
                            {lesson.title[language]}
                          </span>
                          <span className="text-[12px] text-[var(--muted)] leading-snug mt-0.5">
                            {lesson.text[language]}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 mt-1">
                        <Icon
                          name="chevron-right"
                          size={16}
                          color="var(--muted)"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Workspace Fresh Reset Utility */}
        <div
          className="p-4 rounded-[16px] flex items-center justify-between gap-3 select-none"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-semibold text-[var(--ink)]">
              Fresh workspace reset
            </span>
            <span className="text-[12px] text-[var(--muted)]">
              Clear all test shipments, clients & payments
            </span>
          </div>

          <button
            type="button"
            onClick={handleFreshReset}
            className="px-3 py-1.5 rounded-[10px] text-[12px] font-semibold shrink-0 cursor-pointer active:scale-95 transition-transform"
            style={{
              backgroundColor: resetDone
                ? "var(--accent-tint)"
                : "var(--field)",
              color: resetDone ? "var(--accent)" : "var(--ink)",
            }}
          >
            {resetDone ? "Cleared ✓" : "Reset data"}
          </button>
        </div>
      </div>
    </ScreenLayout>
  );
};
