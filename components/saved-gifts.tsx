"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Gift } from "@/types/gift"
import { Bookmark, X, Sparkles } from "lucide-react"
import Link from "next/link"

export default function SavedGifts() {
  const [savedGifts, setSavedGifts] = useState<Gift[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
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
    }

    loadSavedGifts()

    // Set up event listener for storage changes
    window.addEventListener("storage", loadSavedGifts)

    // Custom event for when gifts are saved
    window.addEventListener("giftSaved", loadSavedGifts)

    return () => {
      window.removeEventListener("storage", loadSavedGifts)
      window.removeEventListener("giftSaved", loadSavedGifts)
    }
  }, [])

  const removeGift = (giftId: string) => {
    const updatedGifts = savedGifts.filter((gift) => gift.id !== giftId)
    setSavedGifts(updatedGifts)
    localStorage.setItem("savedGifts", JSON.stringify(updatedGifts))

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("storage"))
  }

  if (savedGifts.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="default"
        size="sm"
        className="rounded-full h-12 w-12 shadow-lg bg-gradient-to-r from-primary to-secondary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bookmark className="h-5 w-5 text-primary-foreground" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {savedGifts.length}
        </span>
      </Button>

      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 shadow-xl border-border/50">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base flex items-center">
                <Sparkles className="h-4 w-4 text-secondary mr-2" />
                Saved Gifts
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {savedGifts.map((gift) => (
                <div key={gift.id} className="flex items-center gap-3 border-b pb-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">{gift.category.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/gift/${gift.id}`} className="font-medium text-sm hover:underline line-clamp-1">
                      {gift.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">₹{Math.round(gift.price).toLocaleString("en-IN")}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => removeGift(gift.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
