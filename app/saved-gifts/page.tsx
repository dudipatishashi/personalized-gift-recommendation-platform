"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import NavBar from "@/components/nav-bar"
import GiftCard from "@/components/gift-card"
import type { Gift } from "@/types/gift"
import { Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function SavedGiftsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [savedGifts, setSavedGifts] = useState<Gift[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      // Load saved gifts from localStorage
      const loadSavedGifts = () => {
        const saved = localStorage.getItem("savedGifts")
        if (saved) {
          try {
            setSavedGifts(JSON.parse(saved))
          } catch (e) {
            console.error("Error loading saved gifts:", e)
          }
        }
        setLoading(false)
      }

      loadSavedGifts()

      // Set up event listener for storage changes
      window.addEventListener("storage", loadSavedGifts)
      window.addEventListener("giftSaved", loadSavedGifts)

      return () => {
        window.removeEventListener("storage", loadSavedGifts)
        window.removeEventListener("giftSaved", loadSavedGifts)
      }
    }
  }, [status, router])

  const clearAllSavedGifts = () => {
    if (confirm("Are you sure you want to remove all saved gifts?")) {
      localStorage.setItem("savedGifts", "[]")
      setSavedGifts([])
      window.dispatchEvent(new Event("storage"))
    }
  }

  const filteredGifts = savedGifts.filter((gift) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      gift.name.toLowerCase().includes(query) ||
      gift.description.toLowerCase().includes(query) ||
      gift.category.toLowerCase().includes(query) ||
      gift.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  })

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
          <h1 className="text-3xl font-bold mb-2">Your Saved Gifts</h1>
          <p className="text-muted-foreground">Manage and review the gift ideas you've saved for later</p>
        </div>

        {savedGifts.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search saved gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="sm" onClick={clearAllSavedGifts}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>

            {filteredGifts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGifts.map((gift) => (
                  <GiftCard key={gift.id} gift={gift} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No gifts match your search</h3>
                <p className="text-muted-foreground mb-4">Try a different search term</p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto p-6">
              <h3 className="text-xl font-medium mb-2">No Saved Gifts Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't saved any gift ideas yet. When you find gifts you like, click the bookmark icon to save them
                for later.
              </p>
              <Button asChild>
                <Link href="/survey">Find Gift Ideas</Link>
              </Button>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
