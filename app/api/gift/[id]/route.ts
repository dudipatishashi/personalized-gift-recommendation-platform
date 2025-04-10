import { type NextRequest, NextResponse } from "next/server"
import { findGiftById } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const giftId = params.id

    if (!giftId) {
      return NextResponse.json({ error: "Gift ID is required" }, { status: 400 })
    }

    const gift = await findGiftById(giftId)

    if (!gift) {
      return NextResponse.json({ error: "Gift not found" }, { status: 404 })
    }

    return NextResponse.json({ gift })
  } catch (error) {
    console.error("Error fetching gift:", error)
    return NextResponse.json({ error: "Failed to fetch gift" }, { status: 500 })
  }
}
