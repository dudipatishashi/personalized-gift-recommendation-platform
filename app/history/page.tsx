"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import NavBar from "@/components/nav-bar"
import Link from "next/link"
import { Calendar, Gift } from "lucide-react"

interface RecommendationHistory {
  _id: string
  createdAt: string
  surveyData: {
    relationship: string
    age: string
    gender: string
    occasion: string
    interests: string[]
    personality: string[]
    budget: number[]
    additionalInfo: string
  }
  giftsCount: number
}

export default function HistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [history, setHistory] = useState<RecommendationHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      // In a real app, this would fetch from an API
      // fetchRecommendationHistory();

      // For demo purposes, we'll use mock data
      const mockHistory: RecommendationHistory[] = [
        {
          _id: "1",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          surveyData: {
            relationship: "Friend",
            age: "30",
            gender: "Female",
            occasion: "Birthday",
            interests: ["Reading", "Cooking", "Travel"],
            personality: ["Creative", "Thoughtful"],
            budget: [100],
            additionalInfo: "She loves mystery novels and trying new recipes.",
          },
          giftsCount: 8,
        },
        {
          _id: "2",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          surveyData: {
            relationship: "Partner",
            age: "35",
            gender: "Male",
            occasion: "Anniversary",
            interests: ["Technology", "Gaming", "Sports"],
            personality: ["Practical", "Adventurous"],
            budget: [150],
            additionalInfo: "He's been wanting a new gadget for his home office.",
          },
          giftsCount: 6,
        },
        {
          _id: "3",
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
          surveyData: {
            relationship: "Family",
            age: "65",
            gender: "Female",
            occasion: "Holiday",
            interests: ["Gardening", "Reading", "Home Decor"],
            personality: ["Relaxed", "Thoughtful"],
            budget: [75],
            additionalInfo: "She enjoys spending time in her garden and reading.",
          },
          giftsCount: 7,
        },
      ]

      setHistory(mockHistory)
      setLoading(false)
    }
  }, [status, router])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Recommendation History</h1>
          <p className="text-muted-foreground">View and revisit your previous gift recommendation searches</p>
        </div>

        {history.length > 0 ? (
          <div className="space-y-6">
            {history.map((item) => (
              <Card key={item._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        {item.surveyData.occasion} Gift for {item.surveyData.relationship}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(item.createdAt)}
                      </CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/recommendations?id=${item._id}`}>
                        <Gift className="h-4 w-4 mr-2" />
                        View Gifts
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Recipient Details</h3>
                      <ul className="space-y-1 text-sm">
                        <li>
                          <span className="text-muted-foreground">Relationship:</span> {item.surveyData.relationship}
                        </li>
                        <li>
                          <span className="text-muted-foreground">Age:</span> {item.surveyData.age}
                        </li>
                        <li>
                          <span className="text-muted-foreground">Gender:</span> {item.surveyData.gender}
                        </li>
                        <li>
                          <span className="text-muted-foreground">Budget:</span> ${item.surveyData.budget[0]}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Interests & Personality</h3>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.surveyData.interests.map((interest) => (
                          <span key={interest} className="bg-muted text-xs px-2 py-1 rounded">
                            {interest}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.surveyData.personality.map((trait) => (
                          <span key={trait} className="bg-primary/10 text-xs px-2 py-1 rounded">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {item.surveyData.additionalInfo && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="font-medium mb-2">Additional Information</h3>
                      <p className="text-sm">{item.surveyData.additionalInfo}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto p-6">
              <h3 className="text-xl font-medium mb-2">No History Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't generated any gift recommendations yet. Start a survey to get personalized gift ideas.
              </p>
              <Button asChild>
                <Link href="/survey">Start Gift Survey</Link>
              </Button>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
