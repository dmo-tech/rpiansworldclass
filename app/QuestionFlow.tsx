"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";

import { type Question, validateAnswer } from "./businessQuestions";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

type QuestionFlowProps<Id extends string> = {
  questions: Question<Id>[];
  values: Record<Id, string>;
  onChange: (id: Id, value: string) => void;
  // Called after the last question, with the answers including that one.
  onComplete: (values: Record<Id, string>) => void;
  // ↑ on the first question; without it the first question has no way back.
  onBackFromFirst?: () => void;
  // The last question's button ("OK" on the others).
  finishLabel: string;
  isSubmitting?: boolean;
  submittingText?: string;
  errorMessage?: string;
  // Shown above the questions, e.g. "Payment received".
  notice?: ReactNode;
  // The question to start on, kept by the page so coming back from its next
  // step returns to the same question.
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
};

// Typeform-style form: one question at a time ("1 Full Name *", "Type your
// answer here...", OK or Enter for the next), a progress bar under the
// header, ↑ / ↓ buttons, and the site header and footer. Used by /register
// (business details) and /application (after payment).
export default function QuestionFlow<Id extends string>({
  questions,
  values,
  onChange,
  onComplete,
  onBackFromFirst,
  finishLabel,
  isSubmitting = false,
  submittingText,
  errorMessage,
  notice,
  initialIndex = 0,
  onIndexChange,
}: QuestionFlowProps<Id>) {
  const [fieldIndex, setFieldIndex] = useState(initialIndex);
  const [fieldError, setFieldError] = useState("");

  // The previous question stays on screen while it animates out, and its input
  // and buttons still act for that question. This ref lets them be ignored, so
  // fast typing or a double Enter can't overwrite or skip a question.
  const activeFieldIndexRef = useRef(initialIndex);

  const goToField = (index: number) => {
    activeFieldIndexRef.current = index;
    setFieldIndex(index);
    onIndexChange?.(index);
  };

  const currentField = questions[fieldIndex];
  const isLastField = fieldIndex === questions.length - 1;
  const isActiveField = () => activeFieldIndexRef.current === fieldIndex;

  const updateField = (id: Id, value: string) => {
    if (!isActiveField()) return;

    onChange(id, value);
    setFieldError("");
  };

  const advanceField = (valueOverride?: string) => {
    if (!isActiveField() || isSubmitting) return;

    const value = valueOverride ?? values[currentField.id];
    const error = validateAnswer(currentField, value);

    if (error) {
      setFieldError(error);
      return;
    }

    setFieldError("");

    const updatedValues =
      valueOverride !== undefined
        ? { ...values, [currentField.id]: valueOverride }
        : values;

    if (valueOverride !== undefined) {
      onChange(currentField.id, valueOverride);
    }

    if (isLastField) {
      onComplete(updatedValues);
    } else {
      goToField(fieldIndex + 1);
    }
  };

  const goBackField = () => {
    setFieldError("");

    if (fieldIndex === 0) {
      onBackFromFirst?.();
    } else {
      goToField(fieldIndex - 1);
    }
  };

  const handleFieldSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    advanceField();
  };

  // Long answers: Enter goes on, as in the other questions; Shift + Enter
  // starts a new line.
  const handleTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      advanceField();
    }
  };

  const okButton = (
    <button
      type="submit"
      disabled={isSubmitting}
      className="mt-6 rounded-md bg-[#3b82f6] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLastField ? finishLabel : "OK"}
    </button>
  );

  return (
    <main className="relative flex min-h-screen flex-col bg-white px-6 text-[#0f172a] md:px-16">
      <SiteHeader />

      <div className="fixed left-0 top-20 z-20 h-1 w-full bg-black/10">
        <motion.div
          animate={{
            width: `${((fieldIndex + 1) / questions.length) * 100}%`,
          }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="h-full bg-gradient-to-r from-[#ef4444] via-[#22c55e] to-[#3b82f6]"
        />
      </div>

      {/* The question starts at a fixed spot (as on the call-slot step) with a
          fixed space above the footer (80px mobile, 112px desktop). */}
      <div className="flex items-start justify-center pb-20 pt-24 md:pb-28 md:pt-[9.75rem]">
        <div className="w-full max-w-2xl">
          {notice}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentField.id}
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -24,
              }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <label
                htmlFor={currentField.id}
                className="flex items-start gap-3 text-2xl font-bold leading-snug md:text-3xl"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#3b82f6] text-sm font-bold text-white">
                  {fieldIndex + 1}
                </span>

                <span>{currentField.label} *</span>
              </label>

              {currentField.kind === "input" ? (
                <form onSubmit={handleFieldSubmit} className="mt-8 pl-10">
                  <input
                    key={currentField.id}
                    id={currentField.id}
                    type={currentField.type}
                    min={currentField.type === "number" ? "0" : undefined}
                    maxLength={currentField.maxLength}
                    value={values[currentField.id]}
                    onChange={(event) =>
                      updateField(currentField.id, event.target.value)
                    }
                    placeholder="Type your answer here..."
                    autoComplete={currentField.autoComplete}
                    autoFocus
                    className="w-full border-0 border-b-2 border-black/15 bg-transparent px-0 py-3 text-2xl outline-none transition placeholder:text-gray-300 focus:border-[#3b82f6]"
                  />

                  {okButton}
                </form>
              ) : currentField.kind === "textarea" ? (
                <form onSubmit={handleFieldSubmit} className="mt-8 pl-10">
                  <textarea
                    key={currentField.id}
                    id={currentField.id}
                    rows={3}
                    maxLength={currentField.maxLength}
                    value={values[currentField.id]}
                    onChange={(event) =>
                      updateField(currentField.id, event.target.value)
                    }
                    onKeyDown={handleTextareaKeyDown}
                    placeholder="Type your answer here..."
                    autoFocus
                    className="w-full resize-none border-0 border-b-2 border-black/15 bg-transparent px-0 py-3 text-xl leading-relaxed outline-none transition placeholder:text-gray-300 focus:border-[#3b82f6] md:text-2xl"
                  />

                  <p className="mt-2 text-xs font-medium text-gray-400">
                    Shift + Enter for a new line
                  </p>

                  {okButton}
                </form>
              ) : (
                <div className="mt-8 grid gap-3 pl-10 sm:grid-cols-2">
                  {currentField.options.map((option) => {
                    const isSelected = values[currentField.id] === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => advanceField(option)}
                        className={`rounded-lg border-2 px-4 py-4 text-left font-semibold transition ${
                          isSelected
                            ? "border-[#3b82f6] bg-[#3b82f6]/5"
                            : "border-black/10 bg-white hover:border-[#3b82f6]/40"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}

              <AnimatePresence>
                {fieldError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-5 ml-10 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700"
                  >
                    {fieldError}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-5 ml-10 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700"
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {isSubmitting && submittingText && (
                <p className="mt-5 ml-10 text-sm text-gray-500">
                  {submittingText}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Left of the floating WhatsApp button (64px wide at right-6), which
          would otherwise cover them. */}
      <div className="fixed bottom-6 right-[6.5rem] z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={goBackField}
          disabled={fieldIndex === 0 && !onBackFromFirst}
          aria-label="Previous question"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white text-lg text-gray-500 shadow-md transition hover:text-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-gray-500"
        >
          ↑
        </button>

        <button
          type="button"
          onClick={() => advanceField()}
          aria-label="Next question"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white text-lg text-gray-500 shadow-md transition hover:text-[#1d4ed8]"
        >
          ↓
        </button>
      </div>

      {/* Cancel main's side padding so the dark footer spans the full width;
          on tall screens the footer stretches to the bottom of the window. */}
      <div className="-mx-6 flex flex-1 flex-col md:-mx-16">
        <SiteFooter />
      </div>
    </main>
  );
}
