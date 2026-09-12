"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const questions = [
  {
    question: "Can your business run smoothly without your daily involvement?",
  },
  {
    question: "Are employee KRAs and KPIs clearly defined and reviewed?",
  },
  {
    question: "Do you regularly track inventory ageing and dead stock?",
  },
  {
    question: "Do you know product-wise or category-wise gross profit?",
  },
  {
    question: "Do you have a clear cash-flow and working-capital dashboard?",
  },
  {
    question: "Are your important business processes documented through SOPs?",
  },
  {
    question: "Is your team performance reviewed every week?",
  },
  {
    question: "Are major business decisions based on accurate data?",
  },
];

const answerOptions = [
  {
    label: "No",
    score: 0,
  },
  {
    label: "Sometimes",
    score: 1,
  },
  {
    label: "Mostly",
    score: 2,
  },
  {
    label: "Yes",
    score: 3,
  },
];

function getResult(score: number) {
  if (score <= 30) {
    return {
      title: "Owner-Dependent Business",
      description:
        "Your business depends heavily on you. The first priority should be building visibility, accountability and repeatable systems.",
      level: "Critical",
    };
  }

  if (score <= 55) {
    return {
      title: "Business Needs Strong Systems",
      description:
        "Some processes may exist, but execution and tracking are inconsistent. You need structured implementation and regular reviews.",
      level: "Needs Improvement",
    };
  }

  if (score <= 75) {
    return {
      title: "Growing but Unstructured",
      description:
        "Your business has growth potential, but stronger dashboards, SOPs and team accountability are needed for sustainable scaling.",
      level: "Growth Stage",
    };
  }

  return {
    title: "System-Driven Business",
    description:
      "Your business has a strong foundation. The next opportunity is deeper automation, leadership development and profit multiplication.",
    level: "Strong",
  };
}

export default function BusinessHealthQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalQuestions = questions.length;
  const progress = isCompleted
    ? 100
    : (currentQuestion / totalQuestions) * 100;

  const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
  const maximumScore = totalQuestions * 3;
  const percentageScore = Math.round((totalScore / maximumScore) * 100);
  const result = getResult(percentageScore);

  const handleAnswer = (score: number) => {
    const updatedAnswers = [...answers, score];
    setAnswers(updatedAnswers);

    if (currentQuestion === totalQuestions - 1) {
      setIsCompleted(true);
      return;
    }

    setCurrentQuestion((current) => current + 1);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsCompleted(false);
  };

  const whatsappMessage = encodeURIComponent(
    `Namaste RPIANS Team,

I completed the Business Health Quiz.

Business Health Score: ${percentageScore}%
Result: ${result.title}
Level: ${result.level}

I would like to discuss my business diagnostic.`,
  );

  return (
    <section
      id="business-health-quiz"
      className="relative overflow-hidden border-y border-white/10 bg-white/[0.02] px-6 py-28"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3b82f6]/5 blur-[150px]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.7,
            }}
            transition={{
              duration: 0.7,
            }}
            className="text-xs uppercase tracking-[0.35em] text-[#3b82f6]"
          >
            60-Second Business Health Quiz
          </motion.p>

          <motion.h2
            initial={{
              opacity: 0,
              y: 45,
              filter: "blur(8px)",
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            viewport={{
              once: false,
              amount: 0.5,
            }}
            transition={{
              duration: 0.9,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 font-serif text-4xl md:text-6xl"
          >
            How System-Driven Is
            <span className="mt-2 block text-[#60a5fa]">
              Your Business Today?
            </span>
          </motion.h2>

          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.7,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400"
          >
            Answer eight practical questions and discover your current business
            health score.
          </motion.p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {isCompleted
                  ? "Quiz completed"
                  : `Question ${currentQuestion + 1} of ${totalQuestions}`}
              </span>

              <span className="font-semibold text-[#3b82f6]">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full rounded-full bg-gradient-to-r from-[#ec4899] via-[#facc15] to-[#3b82f6]"
              />
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {!isCompleted ? (
                <motion.div
                  key={currentQuestion}
                  initial={{
                    opacity: 0,
                    x: 80,
                    scale: 0.96,
                    filter: "blur(6px)",
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    x: -80,
                    scale: 0.96,
                    filter: "blur(6px)",
                  }}
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-3xl border border-[#3b82f6]/25 bg-gradient-to-b from-[#3b82f6]/10 to-black p-7 md:p-10"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                        Business Health Question
                      </p>

                      <h3 className="mt-5 font-serif text-2xl leading-tight sm:text-3xl md:text-4xl">
                        {questions[currentQuestion].question}
                      </h3>
                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/10 font-bold text-[#facc15]">
                      {String(currentQuestion + 1).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4">
                    {answerOptions.map((option, index) => (
                      <motion.button
                        key={option.label}
                        type="button"
                        onClick={() => handleAnswer(option.score)}
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.08,
                          duration: 0.4,
                        }}
                        whileHover={{
                          y: -4,
                          scale: 1.015,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:border-[#3b82f6]/60 hover:bg-[#3b82f6]/10 sm:px-6 sm:py-5"
                      >
                        <span className="text-base font-semibold sm:text-lg">
                          {option.label}
                        </span>

                        <span className="mt-1 block text-xs text-gray-500 sm:text-sm">
                          {option.score === 0 && "Not implemented"}
                          {option.score === 1 && "Partially implemented"}
                          {option.score === 2 && "Mostly implemented"}
                          {option.score === 3 && "Fully implemented"}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{
                    opacity: 0,
                    y: 50,
                    scale: 0.9,
                    filter: "blur(8px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-3xl border border-[#3b82f6]/30 bg-gradient-to-b from-[#3b82f6]/12 to-black p-7 text-center md:p-10"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                    Your Business Health Result
                  </p>

                  <motion.div
                    initial={{
                      scale: 0.5,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{
                      delay: 0.2,
                      duration: 0.6,
                    }}
                    className="mx-auto mt-7 flex h-40 w-40 items-center justify-center rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/10 shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                  >
                    <div>
                      <p className="font-serif text-5xl font-bold text-[#facc15]">
                        {percentageScore}%
                      </p>

                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">
                        Health Score
                      </p>
                    </div>
                  </motion.div>

                  <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-[#3b82f6]">
                    {result.level}
                  </p>

                  <h3 className="mt-3 font-serif text-3xl md:text-4xl">
                    {result.title}
                  </h3>

                  <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-400">
                    {result.description}
                  </p>

                  <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                    <a
                      href={`https://wa.me/917389638105?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-gradient-to-r from-[#ef4444] via-[#facc15] to-[#ec4899] px-8 py-4 font-bold text-black transition hover:scale-105"
                    >
                      Get Your Free Diagnostic
                    </a>

                    <button
                      type="button"
                      onClick={restartQuiz}
                      className="rounded-lg border border-[#3b82f6]/50 px-8 py-4 font-semibold text-[#93c5fd] transition hover:bg-[#3b82f6]/10"
                    >
                      Retake Quiz
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}