/**
 * Public Exams API
 * 
 * GET - Fetch all exams (public access)
 */

import { NextResponse } from "next/server";
import { getAllExams } from "@/lib/models/exam";

export async function GET() {
  try {
    const exams = await getAllExams();
    
    return NextResponse.json({
      success: true,
      data: exams,
    });
  } catch (error) {
    console.error("Error fetching exams:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch exams" },
      { status: 500 }
    );
  }
}
