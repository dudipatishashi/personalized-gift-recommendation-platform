"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Gift } from "@/types/gift"
import { Star, ArrowLeft, Bookmark, Sparkles } from "lucide-react"
import Link from "next/link"
import { saveGift, removeGift, isGiftSaved } from "@/lib/gift-utils"
import GiftExplanation from "@/components/gift-explanation"
import NavBar from "@/components/nav-bar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function GiftDetailPage() {
  const params = useParams()
  const [gift, setGift] = useState<Gift | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Fetch gift details from API
    const fetchGift = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/gift/${params.id}`)

        if (response.ok) {
          const data = await response.json()
          setGift(data.gift)

          // Check if this gift is saved
          if (data.gift.id) {
            setSaved(isGiftSaved(data.gift.id))
          }
        } else {
          // If gift not found in database, try to use mock data
          // This is a fallback for demonstration purposes
          const mockGift: Gift = {
            id: params.id as string,
            name: "Bestselling Mystery Novel Collection",
            description:
              "A collection of the top 3 bestselling mystery novels of the year, perfect for someone who loves reading and mysteries. Each book has been carefully selected to provide hours of entertainment and intrigue.",
            price: 45.99,
            image: "",
            category: "Books",
            tags: ["Reading", "Mystery", "Creative"],
            rating: 4.8,
            reviews: 124,
            url: "#",
            reason:
              "Based on their love for reading and mystery novels, this collection would be perfect for them to enjoy. The selection includes a variety of mystery sub-genres to keep them engaged and entertained.",
          }

          setGift(mockGift)

          // Check if this gift is saved
          if (mockGift.id) {
            setSaved(isGiftSaved(mockGift.id))
          }
        }
      } catch (error) {
        console.error("Error fetching gift details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGift()

    // Listen for changes to saved gifts
    const handleStorageChange = () => {
      if (params.id) {
        setSaved(isGiftSaved(params.id as string))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [params.id])

  const handleSaveToggle = () => {
    if (!gift) return

    if (saved) {
      removeGift(gift.id)
    } else {
      saveGift(gift)
    }
    setSaved(!saved)
  }

  // Generate a consistent background color based on the gift category
  const getCategoryColor = (category: string) => {
    const colors = [
      "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
      "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
      "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
      "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
      "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    ]

    // Use the sum of character codes to determine the color
    const sum = category?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[sum % colors.length]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-24 bg-muted rounded w-full"></div>
                <div className="h-8 bg-muted rounded w-1/4"></div>
                <div className="h-12 bg-muted rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!gift) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Gift Not Found</h1>
          <p className="mb-6">Sorry, we couldn't find the gift you're looking for.</p>
          <Link href="/recommendations">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Recommendations
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/recommendations"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recommendations
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-border/50">
            <CardHeader>
              <Badge variant="outline" className={`mb-2 ${getCategoryColor(gift.category)}`}>
                {gift.category}
              </Badge>
              <CardTitle className="text-3xl">{gift.name}</CardTitle>
              <div className="flex items-center mt-2">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(gift.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {gift.rating.toFixed(1)} ({gift.reviews} reviews)
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-4">₹{Math.round(gift.price).toLocaleString("en-IN")}</div>
              <p className="text-muted-foreground mb-6">{gift.description}</p>

              <div className="mb-6">
                <GiftExplanation gift={gift} />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {gift.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Button className="flex-1" onClick={handleSaveToggle}>
                  {saved ? "Saved to Wishlist" : "Save to Wishlist"}
                  <Bookmark className={`ml-2 h-4 w-4 ${saved ? "fill-primary-foreground" : ""}`} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div>
            <Card className="border-border/50 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 text-secondary mr-2" />
                  Why We Recommend This
                </CardTitle>
                <CardDescription>
                  Our AI analyzed your preferences and found this to be an excellent match
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{gift.reason}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">
                  Details
                </TabsTrigger>
                <TabsTrigger value="shipping" className="flex-1">
                  Shipping
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">
                  Reviews
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      <li>
                        <strong>Category:</strong> {gift.category}
                      </li>
                      <li>
                        <strong>Tags:</strong> {gift.tags.join(", ")}
                      </li>
                      <li>
                        <strong>In Stock:</strong> Yes
                      </li>
                      <li>
                        <strong>Shipping:</strong> Free shipping available
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="shipping" className="pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="mb-2">Standard shipping (3-5 business days): Free</p>
                    <p className="mb-2">Express shipping (1-2 business days): ₹830</p>
                    <p>Gift wrapping available for an additional ₹415</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews" className="pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center mb-1">
                          <div className="flex mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 fill-amber-400 text-amber-400`} />
                            ))}
                          </div>
                          <span className="font-medium">Perfect gift!</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">by Jane D. on March 12, 2025</p>
                        <p>Bought this as a birthday gift and they absolutely loved it! The quality was excellent.</p>
                      </div>

                      <div>
                        <div className="flex items-center mb-1">
                          <div className="flex mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">Great value</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">by Michael T. on February 28, 2025</p>
                        <p>The collection was well curated and arrived in perfect condition. Would recommend!</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
