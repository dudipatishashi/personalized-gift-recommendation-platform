"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { generateRecommendations } from "@/lib/recommendations"
import type { Gift } from "@/types/gift"
import { SlidersHorizontal, Sparkles } from "lucide-react"
import GiftCard from "@/components/gift-card"
import FilterSidebar from "@/components/filter-sidebar"
import { useSurvey } from "@/context/survey-context"
import LoadingRecommendations from "@/components/loading-recommendations"
import { useSession } from "next-auth/react"
import NavBar from "@/components/nav-bar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecommendationsPage() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    categories: [] as string[],
    sortBy: "relevance",
  })

  const { data: session } = useSession()
  const { surveyData } = useSurvey()

  useEffect(() => {
    // Use the actual survey data from context
    const fetchRecommendations = async () => {
      setLoading(true)
      try {
        // For testing, check if we have any survey data
        if (
          Object.values(surveyData).some((val) => val && (typeof val === "string" ? val.length > 0 : val.length > 0))
        ) {
          // Call the API with the survey data
          try {
            const response = await fetch("/api/recommendations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(surveyData),
            })

            if (!response.ok) {
              throw new Error("Failed to fetch recommendations")
            }

            const data = await response.json()
            setGifts(data.gifts)
          } catch (error) {
            console.error("API error, using fallback:", error)
            // Use fallback if API fails
            const fallbackData = await generateRecommendations(surveyData)
            setGifts(fallbackData)
          }
        } else {
          // Use mock data if no survey data is available
          console.log("No survey data available, using mock data")
          const mockData = await generateRecommendations({
            relationship: "Friend",
            age: "30",
            gender: "Female",
            occasion: "Birthday",
            interests: ["Reading", "Cooking", "Travel"],
            personality: ["Creative", "Thoughtful"],
            budget: [100],
            additionalInfo: "She loves mystery novels and trying new recipes.",
          })
          setGifts(mockData)
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error)

        // Fallback to local recommendations
        const fallbackData = await generateRecommendations(surveyData)
        setGifts(fallbackData)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [surveyData])

  const filteredGifts = gifts.filter((gift) => {
    const priceInRange = gift.price >= filters.priceRange[0] && gift.price <= filters.priceRange[1]
    const categoryMatch = filters.categories.length === 0 || filters.categories.includes(gift.category)

    return priceInRange && categoryMatch
  })

  const sortedGifts = [...filteredGifts].sort((a, b) => {
    if (filters.sortBy === "price-low") {
      return a.price - b.price
    } else if (filters.sortBy === "price-high") {
      return b.price - a.price
    } else if (filters.sortBy === "rating") {
      return b.rating - a.rating
    }
    // Default: relevance (no additional sorting)
    return 0
  })

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters({
      ...filters,
      [filterType]: value,
    })
  }

  const categories = Array.from(new Set(gifts.map((gift) => gift.category)))

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Sparkles className="h-6 w-6 text-secondary mr-2" />
            <span>Your Personalized Gift Recommendations</span>
          </h1>
          <p className="text-muted-foreground">
            Based on your responses, we've curated these gift ideas that we think would be perfect.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter sidebar - visible on larger screens */}
          <div className={`md:w-1/4 lg:w-1/5 hidden md:block`}>
            <FilterSidebar filters={filters} categories={categories} onFilterChange={handleFilterChange} />
          </div>

          {/* Mobile filter sidebar - toggleable */}
          {showFilters && (
            <div className="fixed inset-0 bg-background z-50 p-4 md:hidden overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button variant="ghost" onClick={toggleFilters}>
                  Close
                </Button>
              </div>
              <FilterSidebar filters={filters} categories={categories} onFilterChange={handleFilterChange} />
            </div>
          )}

          {/* Main content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  Showing {sortedGifts.length} gift{sortedGifts.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={toggleFilters} className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <select
                  className="px-3 py-1 border rounded-md text-sm"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  <option value="relevance">Sort by: Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {loading ? (
              <LoadingRecommendations />
            ) : sortedGifts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedGifts.map((gift) => (
                  <GiftCard key={gift.id} gift={gift} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardHeader>
                  <CardTitle>No gifts match your filters</CardTitle>
                  <CardDescription>Try adjusting your filters to see more options.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        priceRange: [0, 500],
                        categories: [],
                        sortBy: "relevance",
                      })
                    }
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
