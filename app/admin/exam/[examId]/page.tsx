/**
 * Admin Exam Batches Page
 * 
 * Displays exam info and allows admin to manage batches.
 * URL: /admin/exam/[examSlug]
 */

import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getExamBySlug } from "@/lib/models/exam";
import { getBatchesByExam } from "@/lib/models/batch";
import BatchManagementClient from "./BatchManagementClient";
import { log } from "console";

export default async function ExamBatchesPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  // Check authentication server-side
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/login?admin=true");
  }

  const { examId: examSlug } = await params;

  // Fetch exam by slug
  const exam = await getExamBySlug(examSlug);
  console.log("exam data from /exam/examID: ", exam);
  

  if (!exam) {
    notFound();
  }

  // Fetch batches for this exam
  const batches = await getBatchesByExam(exam._id.toString());
  console.log("batches data from /exam/examID: ", batches);

  // Serialize data for client component
  const serializedExam = JSON.parse(JSON.stringify(exam));
  const serializedBatches = JSON.parse(JSON.stringify(batches));
  console.log("serialized exam data and serialized batches from /exam/examID: ", serializedExam, serializedBatches);

  return (
    <BatchManagementClient
      exam={serializedExam}
      initialBatches={serializedBatches}
    />
  );
}
