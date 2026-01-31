/**
 * Home Page (Server Component)
 * 
 * Fetches categories and exams from the database
 * and passes them to the client component.
 */

import { getAllCategories } from "@/lib/models/category"
import { getAllExams } from "@/lib/models/exam"
import HomePageClient from "./HomePageClient"

export default async function HomePage() {
  // Fetch all categories and exams
  const [categoriesRaw, examsRaw] = await Promise.all([
    getAllCategories(),
    getAllExams(),
  ])

  // Serialize categories for client component
  const categories = categoriesRaw.map((cat) => ({
    _id: cat._id.toString(),
    title: cat.title,
    imageURL: cat.imageURL,
  }))

  // Serialize exams for client component
  const exams = examsRaw.map((exam) => ({
    _id: exam._id.toString(),
    title: exam.title,
    slug: exam.slug,
    imageURL: exam.imageURL,
    totalBatches: exam.totalBatches,
    category: {
      _id: exam.category._id.toString(),
      title: exam.category.title,
    },
  }))

  return <HomePageClient categories={categories} exams={exams} />
}
