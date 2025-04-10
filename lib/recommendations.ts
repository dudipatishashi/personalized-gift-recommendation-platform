import type { Gift } from "@/types/gift"

// Function to get recommendations from the API
export async function generateRecommendations(surveyData: any): Promise<Gift[]> {
  try {
    // Try to get AI-generated recommendations
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(surveyData),
    })

    if (!response.ok) {
      // If the API returns an error, throw to trigger the fallback
      const errorData = await response.json()
      console.error("API error:", errorData)
      throw new Error(`API error: ${errorData.error || response.status}`)
    }

    const data = await response.json()
    return data.gifts
  } catch (error) {
    console.error("Error fetching recommendations:", error)

    // Always fall back to mock data if the API fails for any reason
    console.log("Falling back to mock recommendations")
    return getFallbackRecommendations(surveyData)
  }
}

// Update the getFallbackRecommendations function to ensure it's properly converting currency
export function getFallbackRecommendations(surveyData: any): Gift[] {
  // Base set of gifts that can be filtered and customized
  const allGifts: Gift[] = [
    {
      id: "1",
      name: "Bestselling Mystery Novel Collection",
      description:
        "A collection of the top 3 bestselling mystery novels of the year, perfect for someone who loves reading and mysteries.",
      price: 3800,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800",
      category: "Books",
      tags: ["Reading", "Mystery", "Creative"],
      rating: 4.8,
      reviews: 124,
      url: "/gift/1",
      reason: "Based on their love for reading and mystery novels, this collection would be perfect for them to enjoy.",
    },
    {
      id: "2",
      name: "Gourmet Cooking Spice Set",
      description:
        "A set of premium spices from around the world, perfect for the home chef who loves to experiment with new flavors.",
      price: 3300,
      image: "https://images.unsplash.com/photo-1607877361964-d5c3c2e0ff8a?q=80&w=800",
      category: "Cooking",
      tags: ["Cooking", "Gourmet", "Creative"],
      rating: 4.6,
      reviews: 89,
      url: "/gift/2",
      reason: "Since they enjoy cooking, this spice set will help them create new and exciting recipes.",
    },
    {
      id: "3",
      name: "Travel Journal with World Map",
      description:
        "A beautiful leather-bound travel journal with a world map design, perfect for documenting adventures.",
      price: 2400,
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800",
      category: "Travel",
      tags: ["Travel", "Thoughtful", "Creative"],
      rating: 4.7,
      reviews: 56,
      url: "/gift/3",
      reason: "For someone who loves travel, this journal provides a way to document their experiences and memories.",
    },
    {
      id: "4",
      name: "Cooking Class Gift Card",
      description: "A gift card for a series of online cooking classes taught by world-renowned chefs.",
      price: 9900,
      image: "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?q=80&w=800",
      category: "Experiences",
      tags: ["Cooking", "Learning", "Creative"],
      rating: 4.9,
      reviews: 42,
      url: "/gift/4",
      reason: "This combines their love of cooking with a unique experience they can enjoy at their own pace.",
    },
    {
      id: "5",
      name: "Personalized Bookends",
      description: "Handcrafted wooden bookends that can be personalized with their initials or a short message.",
      price: 5400,
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800",
      category: "Home Decor",
      tags: ["Reading", "Thoughtful", "Personalized"],
      rating: 4.5,
      reviews: 38,
      url: "/gift/5",
      reason: "These bookends are both practical for their book collection and add a personal touch to their space.",
    },
    {
      id: "6",
      name: "Smart Fitness Tracker",
      description: "A premium fitness tracker that monitors activity, sleep, and health metrics with a sleek design.",
      price: 10800,
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd6b0?q=80&w=800",
      category: "Technology",
      tags: ["Fitness", "Technology", "Practical"],
      rating: 4.7,
      reviews: 215,
      url: "/gift/6",
      reason: "Perfect for someone who values fitness and enjoys tracking their progress with the latest technology.",
    },
    {
      id: "7",
      name: "Artisanal Coffee Subscription",
      description: "A 3-month subscription to receive freshly roasted coffee beans from around the world.",
      price: 6200,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800",
      category: "Food & Drink",
      tags: ["Coffee", "Subscription", "Gourmet"],
      rating: 4.8,
      reviews: 92,
      url: "/gift/7",
      reason: "For coffee enthusiasts, this subscription offers a chance to explore new flavors every month.",
    },
    {
      id: "8",
      name: "Wireless Noise-Cancelling Headphones",
      description: "Premium headphones with active noise cancellation and exceptional sound quality.",
      price: 16600,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800",
      category: "Technology",
      tags: ["Music", "Technology", "Premium"],
      rating: 4.9,
      reviews: 178,
      url: "/gift/8",
      reason: "These headphones provide an immersive listening experience for music lovers or frequent travelers.",
    },
    {
      id: "9",
      name: "Indoor Herb Garden Kit",
      description: "A complete kit for growing fresh herbs indoors, including seeds, pots, and soil.",
      price: 4100,
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800",
      category: "Gardening",
      tags: ["Cooking", "Gardening", "Sustainable"],
      rating: 4.5,
      reviews: 63,
      url: "/gift/9",
      reason:
        "This combines their interest in cooking with sustainable living, allowing them to grow fresh herbs at home.",
    },
    {
      id: "10",
      name: "Personalized Star Map",
      description: "A custom star map showing the night sky from a specific location and date, beautifully framed.",
      price: 7400,
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800",
      category: "Home Decor",
      tags: ["Personalized", "Thoughtful", "Romantic"],
      rating: 4.7,
      reviews: 105,
      url: "/gift/10",
      reason:
        "This thoughtful gift commemorates a special date and location with a beautiful piece of personalized art.",
    },
    {
      id: "11",
      name: "Virtual Reality Headset",
      description: "An immersive VR headset with access to hundreds of games and experiences.",
      price: 24900,
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800",
      category: "Technology",
      tags: ["Gaming", "Technology", "Immersive"],
      rating: 4.6,
      reviews: 142,
      url: "/gift/11",
      reason: "For tech enthusiasts and gamers, this provides countless hours of immersive entertainment.",
    },
    {
      id: "12",
      name: "Luxury Scented Candle Set",
      description: "A set of premium scented candles made with natural ingredients and unique fragrance combinations.",
      price: 5400,
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800",
      category: "Home Decor",
      tags: ["Relaxation", "Home Decor", "Luxury"],
      rating: 4.8,
      reviews: 87,
      url: "/gift/12",
      reason: "These candles create a relaxing atmosphere and add a touch of luxury to any space.",
    },
    {
      id: "13",
      name: "Traditional Indian Silk Scarf",
      description: "Handwoven silk scarf with traditional Indian patterns, perfect for adding elegance to any outfit.",
      price: 4500,
      image: "https://images.unsplash.com/photo-1566454825481-9c31f1f8fcff?q=80&w=800",
      category: "Fashion",
      tags: ["Traditional", "Elegant", "Indian"],
      rating: 4.7,
      reviews: 68,
      url: "/gift/13",
      reason:
        "This beautiful handcrafted piece celebrates Indian artistry and adds a touch of elegance to any wardrobe.",
    },
    {
      id: "14",
      name: "Ayurvedic Wellness Gift Box",
      description: "A curated collection of authentic Ayurvedic wellness products including oils, teas, and incense.",
      price: 6800,
      image: "https://images.unsplash.com/photo-1611072172377-0cabc3addb30?q=80&w=800",
      category: "Ayurvedic",
      tags: ["Wellness", "Traditional", "Self-care"],
      rating: 4.9,
      reviews: 42,
      url: "/gift/14",
      reason: "Perfect for someone interested in holistic wellness and traditional Indian healing practices.",
    },
    {
      id: "15",
      name: "Handcrafted Brass Decor Piece",
      description: "Intricately designed brass figurine made by skilled Indian artisans using traditional techniques.",
      price: 8200,
      image: "https://images.unsplash.com/photo-1600431521340-491eca880813?q=80&w=800",
      category: "Home Decor",
      tags: ["Traditional", "Handcrafted", "Ethnic"],
      rating: 4.8,
      reviews: 56,
      url: "/gift/15",
      reason: "This authentic piece brings the rich heritage of Indian craftsmanship into their home.",
    },
    {
      id: "16",
      name: "Premium Spice Gift Box",
      description: "Collection of premium Indian spices in an elegant wooden box with detailed recipe cards.",
      price: 3900,
      image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=800",
      category: "Cooking",
      tags: ["Indian", "Gourmet", "Cooking"],
      rating: 4.7,
      reviews: 93,
      url: "/gift/16",
      reason: "Perfect for food enthusiasts who want to explore authentic Indian flavors in their cooking.",
    },
  ]

  // Filter based on interests, personality, and budget
  let filteredGifts = allGifts.filter((gift) => {
    // Budget filter (allow slightly above budget)
    const budgetInINR = convertToINR(surveyData.budget?.[0] || 500)
    const withinBudget = gift.price <= budgetInINR * 1.2

    // Interest match
    const matchesInterest =
      !surveyData.interests?.length ||
      surveyData.interests.some(
        (interest: string) =>
          gift.tags.includes(interest) || gift.category.toLowerCase().includes(interest.toLowerCase()),
      )

    // Personality match
    const matchesPersonality =
      !surveyData.personality?.length || surveyData.personality.some((trait: string) => gift.tags.includes(trait))

    return withinBudget && (matchesInterest || matchesPersonality)
  })

  // If no matches, return a subset of all gifts within budget
  if (filteredGifts.length === 0) {
    const budgetInINR = convertToINR(surveyData.budget?.[0] || 500)
    filteredGifts = allGifts.filter((gift) => gift.price <= budgetInINR * 1.2).slice(0, 8)
  }

  // Limit to 8 gifts
  return filteredGifts.slice(0, 8)
}

// Helper function to convert USD to INR
function convertToINR(usdAmount: number): number {
  const conversionRate = 83 // Approximate USD to INR conversion rate
  return Math.round(usdAmount * conversionRate)
}
