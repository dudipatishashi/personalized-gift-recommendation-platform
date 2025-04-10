import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { getAllGifts } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Get all gifts
    const gifts = await getAllGifts()

    return NextResponse.json({ gifts })
  } catch (error) {
    console.error("Error fetching gifts:", error)
    return NextResponse.json({ error: "Failed to fetch gifts" }, { status: 500 })
  }
}
