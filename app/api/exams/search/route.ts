import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import { Exam } from "@/lib/models/exam"
import { ensureModelsRegistered } from "@/lib/models/registry"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      )
    }

    await dbConnect()
    await ensureModelsRegistered()
    const ExamModel = Exam()

    // Case-insensitive search using regex
    const exams = await ExamModel.find({
      title: { $regex: query.trim(), $options: "i" }
    })
      .populate("category", "title")
      .select("title slug imageURL totalBatches category")
      .limit(20)
      .lean()

    // Transform the results
    const results = exams.map((exam: any) => ({
      _id: exam._id.toString(),
      title: exam.title,
      slug: exam.slug,
      imageURL: exam.imageURL,
      totalBatches: exam.totalBatches,
      category: {
        _id: exam.category._id.toString(),
        title: exam.category.title
      }
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Failed to search exams" },
      { status: 500 }
    )
  }
}
