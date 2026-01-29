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

  if (!exam) {
    notFound();
  }

  // Fetch batches for this exam
  const batches = await getBatchesByExam(exam._id.toString());

  // Serialize data for client component
  const serializedExam = JSON.parse(JSON.stringify(exam));
  const serializedBatches = JSON.parse(JSON.stringify(batches));

  return (
    <BatchManagementClient
      exam={serializedExam}
      initialBatches={serializedBatches}
    />
  );
}
