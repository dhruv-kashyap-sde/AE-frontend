/**
 * Admin Exam Management Page
 * 
 * Server component that fetches initial data and renders the client component.
 */

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllExams } from "@/lib/models/exam";
import { getAllCategories } from "@/lib/models/category";
import ExamManagementClient from "./ExamManagementClient";

export default async function ExamManagementPage() {
  // Check authentication server-side
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    redirect("/login?admin=true");
  }

  // Fetch initial data
  const [exams, categories] = await Promise.all([
    getAllExams(),
    getAllCategories(),
  ]);

  // Serialize data for client component
  const serializedExams = JSON.parse(JSON.stringify(exams));
  const serializedCategories = JSON.parse(JSON.stringify(categories));

  return (
    <ExamManagementClient
      initialExams={serializedExams}
      initialCategories={serializedCategories}
    />
  );
}
