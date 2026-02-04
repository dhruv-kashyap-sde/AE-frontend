/**
 * Home Page (Server Component)
 * 
 * Fetches categories and exams from the database
 * and passes them to the client component.
 */

import { getAllCategories } from "@/lib/models/category"
import { getAllExams } from "@/lib/models/exam"
import { getFeaturedBatches } from "@/lib/models/batch"
import HomePageClient from "./HomePageClient"

export default async function HomePage() {
  // Fetch all categories, exams, and featured batches
  const [categoriesRaw, examsRaw, featuredBatchesRaw] = await Promise.all([
    getAllCategories(),
    getAllExams(),
    getFeaturedBatches(),
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
  console.log(exams, categories);
  

  // Serialize featured batches for client component
  const featuredBatches = featuredBatchesRaw.map((batch) => ({
    _id: batch._id.toString(),
    id: batch._id.toString(),
    title: batch.title,
    slug: batch.slug,
    price: batch.price,
    originalPrice: batch.originalPrice,
    expiry: batch.expiry ?? null,
    contentType: batch.contentType,
    totalCount: batch.totalCount,
    description: batch.description,
    exam: {
      _id: batch.exam._id.toString(),
      id: batch.exam._id.toString(),
      title: batch.exam.title,
      slug: batch.exam.slug,
      imageURL: batch.exam.imageURL,
    },
  }))

  return <HomePageClient categories={categories} exams={exams} featuredBatches={featuredBatches} />
}
