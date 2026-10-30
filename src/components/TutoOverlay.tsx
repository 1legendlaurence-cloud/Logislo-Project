import React from "react";
import { useDemo } from "../context/Demo";
import { TUTO_LESSONS_BY_ROLE, tr } from "../i18n";
import { Icon } from "./Icon";

export const TutoOverlay: React.FC = () => {
  const {
    role,
    language,
    screenId,
    go,
    tutoActive,
    setTutoActive,
    tutoStepByRole,
    setTutoStepForRole,
    tutoCompletedByRole,
    markTutoLessonDone,
  } = useDemo();

  if (!tutoActive) return null;

  // Hide on splash/auth screens
  if (["00", "01", "02", "03", "04"].includes(screenId)) return null;

  const lessons = TUTO_LESSONS_BY_ROLE[role] || TUTO_LESSONS_BY_ROLE.Owner;
  const currentStepIdx = Math.min(
    Math.max(0, tutoStepByRole[role] || 0),
    lessons.length - 1
  );
  const lesson = lessons[currentStepIdx];
  const completedIds = tutoCompletedByRole[role] || [];
  const isCurrentScreen = screenId === lesson.screenId;

  const handleNext = () => {
    markTutoLessonDone(role, lesson.id);
    if (currentStepIdx < lessons.length - 1) {
      const nextIdx = currentStepIdx + 1;
      const nextLesson = lessons[nextIdx];
      setTutoStepForRole(role, nextIdx);
      if (screenId !== nextLesson.screenId) {
        go(nextLesson.screenId);
      }
    } else {
      setTutoActive(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      const prevLesson = lessons[prevIdx];
      setTutoStepForRole(role, prevIdx);
      if (screenId !== prevLesson.screenId) {
        go(prevLesson.screenId);
      }
    }
  };

  const handleGoToSection = () => {
    if (screenId !== lesson.screenId) {
      go(lesson.screenId);
    }
  };

  const stepLabel =
    language === "zh"
      ? `第 ${currentStepIdx + 1} 课 / 共 ${lessons.length} 课`
      : `${tr(language, "Lesson")} ${currentStepIdx + 1} ${tr(language, "of")} ${lessons.length}`;

  return (
    <div
      className="absolute left-3.5 right-3.5 z-40 rounded-[18px] p-4 select-none transition-all"
      style={{
        bottom: "76px",
        backgroundColor: "var(--surface)",
        boxShadow: "0 12px 32px rgba(14, 17, 22, 0.18)",
        border: "1.5px solid var(--accent)",
      }}
      role="dialog"
      aria-label="Tutorial lesson"
    >
      {/* Top Bar: Role + Step Counter + Close */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[6px] shrink-0"
            style={{
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
            }}
          >
            Tuto · {tr(language, role)}
          </span>
          <span className="text-[12px] font-semibold text-[var(--muted)] truncate">
            {stepLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setTutoActive(false)}
          className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer active:scale-95 text-[var(--muted)]"
          style={{ backgroundColor: "var(--field)" }}
          aria-label="Close tutorial"
        >
          <Icon name="close" size={14} color="var(--ink)" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-1.5 mb-2.5">
        {lessons.map((l, idx) => {
          const isDone = completedIds.includes(l.id);
          const isActive = idx === currentStepIdx;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => {
                setTutoStepForRole(role, idx);
                if (screenId !== l.screenId) {
                  go(l.screenId);
                }
              }}
              className="h-1.5 rounded-full transition-all cursor-pointer"
              style={{
                flex: isActive ? 2 : 1,
                backgroundColor: isActive
                  ? "var(--accent)"
                  : isDone
                  ? "var(--success)"
                  : "var(--field)",
              }}
              aria-label={`Lesson ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* Section Kicker & Simple Lesson Content */}
      <div className="mb-3">
        <div className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-wider mb-0.5">
          {lesson.sectionTag[language]}
        </div>
        <h3 className="text-[15px] font-bold text-[var(--ink)] leading-snug">
          {lesson.title[language]}
        </h3>
        <p className="text-[13px] text-[var(--muted)] leading-relaxed mt-1">
          {lesson.text[language]}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          {currentStepIdx > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="h-9 px-3 rounded-[10px] text-[12px] font-semibold cursor-pointer active:scale-95 transition-transform"
              style={{
                backgroundColor: "var(--field)",
                color: "var(--ink)",
              }}
            >
              {tr(language, "Previous")}
            </button>
          )}

          {!isCurrentScreen && (
            <button
              type="button"
              onClick={handleGoToSection}
              className="h-9 px-3 rounded-[10px] text-[12px] font-semibold cursor-pointer active:scale-95 transition-transform"
              style={{
                backgroundColor: "var(--accent-tint)",
                color: "var(--accent)",
              }}
            >
              {lesson.actionLabel[language]}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="h-9 px-4 rounded-[10px] text-[12px] font-semibold text-white flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform ml-auto"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <span>
            {currentStepIdx < lessons.length - 1
              ? tr(language, "Next lesson")
              : tr(language, "Finish Tuto")}
          </span>
          <Icon name="arrow-right" size={14} color="#FFFFFF" />
        </button>
      </div>
    </div>
  );
};
