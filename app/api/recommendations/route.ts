import { type NextRequest, NextResponse } from "next/server"
import { generateGiftRecommendations } from "@/lib/gemini"
import { saveRecommendation } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { getFallbackRecommendations } from "@/lib/recommendations"

// Handle POST request to /api/recommendations
export async function POST(request: NextRequest) {
  try {
    const surveyData = await request.json()
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || "anonymous"

    // 1. Try to generate recommendations via Gemini
    try {
      const gifts = await generateGiftRecommendations(surveyData)

      // If we got empty results from Gemini, use fallback
      if (!gifts || gifts.length === 0) {
        throw new Error("No recommendations generated")
      }

      // 2. Optionally save to DB
      if (session?.user) {
        await saveRecommendation(userId, surveyData, gifts)
      }

      // 3. Return recommendations
      return NextResponse.json({ gifts })
    } catch (apiError: any) {
      console.error("Gemini API error:", apiError)

      // 4. Fallback to mock recommendations
      const fallbackGifts = getFallbackRecommendations(surveyData)

      if (session?.user) {
        await saveRecommendation(userId, surveyData, fallbackGifts)
      }

      return NextResponse.json({
        gifts: fallbackGifts,
        message: "Fallback recommendations used due to Gemini error",
      })
    }
  } catch (error) {
    console.error("Route error:", error)
    // Even if there's an error in the route handler, return fallback recommendations
    const fallbackGifts = getFallbackRecommendations({
      relationship: "Friend",
      age: "30",
      gender: "Female",
      occasion: "Birthday",
      interests: ["Reading", "Cooking", "Travel"],
      personality: ["Creative", "Thoughtful"],
      budget: [100],
      additionalInfo: "She loves mystery novels and trying new recipes.",
    })

    return NextResponse.json({
      gifts: fallbackGifts,
      message: "Fallback recommendations used due to route error",
    })
  }
}
