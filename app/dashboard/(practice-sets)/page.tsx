import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { findUserPurchasesWithDetails } from "@/server/payments/payment.repository"
import DashboardClient from "../DashboardClient"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  if (session.user.role === "admin") {
    redirect("/admin")
  }

  const purchases = await findUserPurchasesWithDetails(session.user.id)

  return (
    <DashboardClient
      userName={session.user.name?.split(" ")[0] || "User"}
      purchases={purchases}
    />
  )
}