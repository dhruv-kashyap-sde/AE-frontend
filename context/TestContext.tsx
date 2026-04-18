"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface SerializedQuestion {
  id: string;
  testId: string;
  question: string;
  options: string[];
  imageURL: string | null;
  order: number;
}

type QuestionStatus =
  | "not_visited"
  | "unanswered"
  | "answered"
  | "review"
  | "review_with_answer";

interface QuestionAttemptState {
  selectedOption: number | null;
  markedForReview: boolean;
  visited: boolean;
}

interface TestContextValue {
  questions: SerializedQuestion[];
  totalQuestions: number;
  currentQuestionIndex: number;
  currentQuestion: SerializedQuestion | null;
  currentQuestionState: QuestionAttemptState;
  marksPerQuestion: number;
  negativeMarking: boolean;
  negativeMarkValue: number;
  remainingSeconds: number;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  goToQuestion: (index: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  selectOption: (optionIndex: number) => void;
  clearCurrentSelection: () => void;
  markCurrentForReview: () => void;
  getQuestionState: (questionId: string) => QuestionStatus;
}

const TestContext = createContext<TestContextValue | undefined>(undefined);

const defaultQuestionState: QuestionAttemptState = {
  selectedOption: null,
  markedForReview: false,
  visited: false,
};

function createInitialQuestionState(questions: SerializedQuestion[]) {
  return questions.reduce<Record<string, QuestionAttemptState>>((acc, question, index) => {
    acc[question.id] = {
      ...defaultQuestionState,
      // First question is visible immediately when attempt starts.
      visited: index === 0,
    };
    return acc;
  }, {});
}

export function TestProvider({
  children,
  questions,
  durationMinutes,
  marksPerQuestion,
  negativeMarking,
  negativeMarkValue,
}: {
  children: React.ReactNode;
  questions: SerializedQuestion[];
  durationMinutes: number;
  marksPerQuestion: number;
  negativeMarking: boolean;
  negativeMarkValue: number;
}) {
  const totalQuestions = questions.length;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionState, setQuestionState] = useState<Record<string, QuestionAttemptState>>(
    () => createInitialQuestionState(questions)
  );

  const totalDurationSeconds = Math.max(durationMinutes, 0) * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(totalDurationSeconds);

  useEffect(() => {
    setQuestionState(createInitialQuestionState(questions));
    setCurrentQuestionIndex(0);
  }, [questions]);

  useEffect(() => {
    if (totalDurationSeconds <= 0) {
      setRemainingSeconds(0);
      return;
    }

    const endTime = Date.now() + totalDurationSeconds * 1000;
    setRemainingSeconds(totalDurationSeconds);

    const intervalId = window.setInterval(() => {
      const secondsLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setRemainingSeconds(secondsLeft);

      if (secondsLeft <= 0) {
        window.clearInterval(intervalId);
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [questions, totalDurationSeconds]);

  const currentQuestion = questions[currentQuestionIndex] ?? null;

  const markVisited = useCallback(
    (questionId: string) => {
      setQuestionState((prev) => {
        const current = prev[questionId] ?? defaultQuestionState;
        if (current.visited) {
          return prev;
        }
        return {
          ...prev,
          [questionId]: {
            ...current,
            visited: true,
          },
        };
      });
    },
    [setQuestionState]
  );

  const goToQuestion = useCallback(
    (index: number) => {
      if (totalQuestions === 0) {
        return;
      }

      const safeIndex = Math.min(Math.max(index, 0), totalQuestions - 1);
      const nextQuestion = questions[safeIndex];

      setCurrentQuestionIndex(safeIndex);
      markVisited(nextQuestion.id);
    },
    [markVisited, questions, totalQuestions]
  );

  const goToNextQuestion = useCallback(() => {
    goToQuestion(currentQuestionIndex + 1);
  }, [currentQuestionIndex, goToQuestion]);

  const goToPreviousQuestion = useCallback(() => {
    goToQuestion(currentQuestionIndex - 1);
  }, [currentQuestionIndex, goToQuestion]);

  const selectOption = useCallback(
    (optionIndex: number) => {
      if (!currentQuestion) {
        return;
      }

      setQuestionState((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          ...(prev[currentQuestion.id] ?? defaultQuestionState),
          selectedOption: optionIndex,
          visited: true,
        },
      }));
    },
    [currentQuestion]
  );

  const clearCurrentSelection = useCallback(() => {
    if (!currentQuestion) {
      return;
    }

    setQuestionState((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] ?? defaultQuestionState),
        selectedOption: null,
        visited: true,
      },
    }));
  }, [currentQuestion]);

  const markCurrentForReview = useCallback(() => {
    if (!currentQuestion) {
      return;
    }

    setQuestionState((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] ?? defaultQuestionState),
        // Toggle review status for current question.
        markedForReview: !(prev[currentQuestion.id]?.markedForReview ?? false),
        visited: true,
      },
    }));
  }, [currentQuestion]);

  const getQuestionState = useCallback(
    (questionId: string): QuestionStatus => {
      const state = questionState[questionId] ?? defaultQuestionState;

      if (state.markedForReview && state.selectedOption !== null) {
        return "review_with_answer";
      }
      if (state.markedForReview) {
        return "review";
      }
      if (state.selectedOption !== null) {
        return "answered";
      }
      if (state.visited) {
        return "unanswered";
      }

      return "not_visited";
    },
    [questionState]
  );

  const currentQuestionState = currentQuestion
    ? (questionState[currentQuestion.id] ?? defaultQuestionState)
    : defaultQuestionState;

  const value = useMemo<TestContextValue>(
    () => ({
      questions,
      totalQuestions,
      currentQuestionIndex,
      currentQuestion,
      currentQuestionState,
      marksPerQuestion,
      negativeMarking,
      negativeMarkValue,
      remainingSeconds,
      isFirstQuestion: currentQuestionIndex <= 0,
      isLastQuestion: currentQuestionIndex >= totalQuestions - 1,
      goToQuestion,
      goToNextQuestion,
      goToPreviousQuestion,
      selectOption,
      clearCurrentSelection,
      markCurrentForReview,
      getQuestionState,
    }),
    [
      clearCurrentSelection,
      currentQuestion,
      currentQuestionIndex,
      currentQuestionState,
      getQuestionState,
      goToNextQuestion,
      goToPreviousQuestion,
      goToQuestion,
      marksPerQuestion,
      markCurrentForReview,
      negativeMarkValue,
      negativeMarking,
      questions,
      remainingSeconds,
      selectOption,
      totalQuestions,
    ]
  );

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
}

export const useTest = () => {
  const context = useContext(TestContext);

  if (!context) {
    throw new Error("useTest must be used within a TestProvider");
  }

  return context;
};
