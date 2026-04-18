import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getBatchById } from "@/lib/models/batch";
import { getExamById } from "@/lib/models/exam";
import { getAttemptQuestionsByTest } from "@/lib/models/question";
import { getTestById } from "@/lib/models/test";
import { hasActiveBatchAccess } from "@/server/batches/access.service";
import { TestProvider } from "@/context/TestContext";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import TestAttemptClient from "./TestAttemptClient";

const TestAttempt = async ({
  params,
}: {
  params: Promise<{ testId: string }>;
}) => {
  const { testId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role === "admin") {
    redirect("/admin");
  }

  const test = await getTestById(testId);
  if (!test) {
    notFound();
  }

  const batchId = test.batch.toString();
  const batch = await getBatchById(batchId);

  if (!batch || batch.contentType !== "test") {
    notFound();
  }

  const hasAccess = await hasActiveBatchAccess(session.user.id, batchId);
  if (!hasAccess) {
    const exam = await getExamById(batch.exam.toString());
    if (!exam) {
      notFound();
    }
    redirect(`/exam/${exam.slug}/${batch.slug}`);
  }

  const questions = await getAttemptQuestionsByTest(testId);
  const serializedQuestions = questions.map((question) => ({
    id: question._id.toString(),
    testId: question.test.toString(),
    question: question.question,
    options: [
      question.optionA,
      question.optionB,
      question.optionC,
      question.optionD,
    ],
    imageURL: question.imageURL,
    order: question.order,
  }));

  console.log("[ATTEMPT QUESTIONS]", {
    userId: session.user.id,
    testId,
    batchId,
    totalQuestions: serializedQuestions.length,
    questions: serializedQuestions,
  });

  return (
    <TestProvider
      questions={serializedQuestions}
      durationMinutes={test.duration}
      marksPerQuestion={test.marksPerQuestion}
      negativeMarking={test.negativeMarking}
      negativeMarkValue={test.negativeMarkValue}
    >
      <TestAttemptClient testTitle={test.title} />
    </TestProvider>
  );
};

export default TestAttempt;
