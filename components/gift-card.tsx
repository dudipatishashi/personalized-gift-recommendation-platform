"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Gift } from "@/types/gift"
import { Heart, Bookmark, Star } from "lucide-react"
import GiftExplanation from "@/components/gift-explanation"
import Link from "next/link"
import { saveGift, removeGift, isGiftSaved } from "@/lib/gift-utils"

interface GiftCardProps {
  gift: Gift
}

export default function GiftCard({ gift }: GiftCardProps) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(isGiftSaved(gift.id))

    // Listen for changes to saved gifts
    const handleStorageChange = () => {
      setSaved(isGiftSaved(gift.id))
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [gift.id])

  const [liked, setLiked] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

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
    const sum = category.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[sum % colors.length]
  }

  return (
    <Card className="gift-card overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className={`mb-2 ${getCategoryColor(gift.category)}`}>
              {gift.category}
            </Badge>
            <CardTitle className="text-lg">{gift.name}</CardTitle>
          </div>
          <span className="font-bold text-lg">₹{Math.round(gift.price).toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center mt-1">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="ml-1 text-sm font-medium">{gift.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground ml-1">({gift.reviews} reviews)</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardDescription className="line-clamp-3 mb-3">{gift.description}</CardDescription>
        <div className="flex flex-wrap gap-1 mt-2">
          {gift.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="flex-1" size="sm" asChild>
          <Link href={`/gift/${gift.id}`}>View Details</Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (saved) {
              removeGift(gift.id)
            } else {
              saveGift(gift)
            }
            setSaved(!saved)
          }}
          className={saved ? "text-primary border-primary" : ""}
        >
          <Bookmark className={`h-4 w-4 ${saved ? "fill-primary" : ""}`} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setLiked(!liked)}
          className={liked ? "text-red-500 border-red-500" : ""}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowExplanation(!showExplanation)}>
          {showExplanation ? "Hide Why" : "Why?"}
        </Button>
      </CardFooter>
      {showExplanation && (
        <div className="px-4 pb-4">
          <GiftExplanation gift={gift} />
        </div>
      )}
    </Card>
  )
}
