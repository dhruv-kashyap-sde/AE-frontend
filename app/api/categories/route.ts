/**
 * Public Categories API
 * 
 * GET - Fetch all categories (public access)
 */

import { NextResponse } from "next/server";
import { getAllCategories } from "@/lib/models/category";

export async function GET() {
  try {
    const categories = await getAllCategories();
    
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
