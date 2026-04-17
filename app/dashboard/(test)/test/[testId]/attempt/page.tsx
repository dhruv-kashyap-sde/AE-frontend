import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import { getBatchById } from "@/lib/models/batch";
import { getExamById } from "@/lib/models/exam";
import { getAttemptQuestionsByTest } from "@/lib/models/question";
import { getTestById } from "@/lib/models/test";
import { hasActiveBatchAccess } from "@/server/batches/access.service";
import { ArrowLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

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

  return <>
    <div className="absolute bg-gray-800 w-full bottom-0 h-16 px-20">
      <Button variant={"secondary"}><ArrowLeft /></Button>
    </div>
  </>;
};

export default TestAttempt;
