import type { Gift } from "@/types/gift"

// Direct API implementation for Gemini 2.0-flash
export async function generateGiftRecommendations(surveyData: any): Promise<Gift[]> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY")
    }

    const apiKey = process.env.GEMINI_API_KEY
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    const prompt = `
You are a gift recommendation expert. Based on the following information about a gift recipient,
generate 8 personalized gift recommendations. Provide simple text recommendations without any introductory text.

Recipient details:
- Age: ${surveyData.age}
- Gender: ${surveyData.gender}
- Relationship: ${surveyData.relationship}
- Occasion: ${surveyData.occasion}
- Interests: ${surveyData.interests.join(", ")}
- Personality traits: ${surveyData.personality.join(", ")}
- Budget: $${surveyData.budget[0]}
- Additional Info: ${surveyData.additionalInfo || "None"}

For each gift, provide:
1. Gift name (short and concise)
2. Brief description (1-2 sentences)
3. Approximate price (within budget)
4. Category (one of: Books, Technology, Sports, Art, Music, Travel, Cooking, Fashion, Home Decor, Gaming, Experiences)
5. Why it's a good match for this person (1 sentence)

Format each gift as a simple list item without numbering or introductory text.
`

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      throw new Error(`Gemini API error: ${errorData.error?.message || "Unknown error"}`)
    }

    const data = await response.json()

    // Extract the text from the response
    let text = ""
    if (data.candidates && data.candidates[0]?.content?.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.text) {
          text += part.text
        }
      }
    }

    if (!text) {
      throw new Error("No text generated from Gemini API")
    }

    // Parse the text response into structured gift objects
    const gifts = parseTextToGifts(text, surveyData)
    return gifts
  } catch (error) {
    console.error("❌ Gemini API error:", error)
    throw error
  }
}

// Helper function to parse text response into gift objects
function parseTextToGifts(text: string, surveyData: any): Gift[] {
  const gifts: Gift[] = []

  // Remove any introductory text and split by double newlines or other patterns
  const cleanedText = text.replace(/^(here are|here's|these are).+?:/i, "").trim()

  // Split by gift items - look for patterns that might separate gifts
  const giftTexts = cleanedText.split(/\n\s*\n|\*\*|\d+\./).filter((item) => item.trim().length > 0)

  giftTexts.forEach((giftText, index) => {
    const lines = giftText.split("\n").filter((line) => line.trim().length > 0)

    if (lines.length > 0) {
      // Extract gift information from text
      const name = lines[0].replace(/^\s*[-*•]\s*/, "").trim()
      const description = lines.length > 1 ? lines[1].trim() : "A thoughtful gift option."

      // Try to extract price from the text
      let price = 0
      const priceMatch = giftText.match(/\$(\d+(\.\d+)?)/)
      if (priceMatch) {
        price = Number.parseFloat(priceMatch[1])
      } else {
        // Default price based on budget
        price = Math.floor(Math.random() * (surveyData.budget[0] * 0.8)) + surveyData.budget[0] * 0.2
      }

      // Extract or assign category
      let category = "Gift"
      const categoryPatterns = [
        /category:\s*([A-Za-z\s&]+)/i,
        /type:\s*([A-Za-z\s&]+)/i,
        /\b(Books|Technology|Sports|Art|Music|Travel|Cooking|Fashion|Home Decor|Gaming|Experiences)\b/i,
      ]

      for (const pattern of categoryPatterns) {
        const match = giftText.match(pattern)
        if (match) {
          category = match[1].trim()
          break
        }
      }

      if (category === "Gift" && surveyData.interests && surveyData.interests.length > 0) {
        category = surveyData.interests[Math.floor(Math.random() * surveyData.interests.length)]
      }

      // Extract reason from the text or create a default one
      let reason = "This gift matches the recipient's interests and preferences."
      if (
        giftText.toLowerCase().includes("because") ||
        giftText.toLowerCase().includes("perfect for") ||
        giftText.toLowerCase().includes("great for") ||
        giftText.toLowerCase().includes("ideal for") ||
        giftText.toLowerCase().includes("reason:")
      ) {
        const reasonPatterns = [
          /because\s+(.+?)(?=\n|$)/i,
          /perfect for\s+(.+?)(?=\n|$)/i,
          /great for\s+(.+?)(?=\n|$)/i,
          /ideal for\s+(.+?)(?=\n|$)/i,
          /reason:\s+(.+?)(?=\n|$)/i,
        ]

        for (const pattern of reasonPatterns) {
          const match = giftText.match(pattern)
          if (match) {
            reason = match[1].trim()
            break
          }
        }
      }

      // Generate image URL based on gift name and category
      const imageUrl = getGiftImageUrl(name, category)

      // Create a gift object
      const gift: Gift = {
        id: `gift-${index + 1}`,
        name,
        description,
        price,
        image: imageUrl,
        category,
        tags: extractTags(giftText, surveyData),
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 100) + 20,
        url: `/gift/gift-${index + 1}`,
        reason,
      }

      gifts.push(gift)
    }
  })

  // If parsing failed or returned no gifts, return an empty array
  return gifts.length > 0 ? gifts : []
}

// Function to extract tags from gift text and survey data
function extractTags(giftText: string, surveyData: any): string[] {
  const tags: string[] = []

  // Add interests as tags
  if (surveyData.interests && Array.isArray(surveyData.interests)) {
    tags.push(...surveyData.interests.slice(0, 3))
  }

  // Add personality traits as tags
  if (surveyData.personality && Array.isArray(surveyData.personality)) {
    tags.push(...surveyData.personality.slice(0, 2))
  }

  // Add occasion as a tag
  if (surveyData.occasion) {
    tags.push(surveyData.occasion)
  }

  // Add additional keywords from the gift text
  const keywords = [
    "Premium",
    "Luxury",
    "Handmade",
    "Personalized",
    "Custom",
    "Unique",
    "Bestselling",
    "Popular",
    "Trending",
    "Classic",
    "Modern",
    "Vintage",
    "Eco-friendly",
    "Sustainable",
    "Practical",
    "Fun",
    "Educational",
    "Traditional",
    "Elegant",
    "Stylish",
    "Innovative",
    "Authentic",
    "Artisanal",
    "Exclusive",
    "Limited Edition",
    "Handcrafted",
    "Organic",
    "Smart",
    "Portable",
    "Durable",
  ]

  for (const keyword of keywords) {
    if (giftText.toLowerCase().includes(keyword.toLowerCase())) {
      tags.push(keyword)
    }
  }

  // Remove duplicates and limit to 5 tags
  return [...new Set(tags)].slice(0, 5)
}

// Function to get gift image URL based on name and category
function getGiftImageUrl(name: string, category: string): string {
  // Map of categories to image URLs
  const categoryImages: Record<string, string[]> = {
    Books: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800",
      "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=800",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800",
      "https://images.unsplash.com/photo-1524578271613-d550eacf6090?q=80&w=800",
      "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=800",
      "https://images.unsplash.com/photo-1526243741027-444d633d7365?q=80&w=800",
    ],
    Technology: [
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800",
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=800",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800",
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=800",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800",
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=800",
      "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=800",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800",
      "https://images.unsplash.com/photo-1563884072595-24a1d9dd5647?q=80&w=800",
      "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=800",
    ],
    Sports: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800",
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800",
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800",
      "https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=800",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800",
      "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=800",
      "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?q=80&w=800",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800",
    ],
    Art: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800",
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800",
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?q=80&w=800",
      "https://images.unsplash.com/photo-1531913764164-f85c52d7e6a9?q=80&w=800",
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=800",
      "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=800",
      "https://images.unsplash.com/photo-1578926288207-32356a2b4c1c?q=80&w=800",
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=800",
      "https://images.unsplash.com/photo-1558882224-dda166733046?q=80&w=800",
      "https://images.unsplash.com/photo-1520420097861-e4959843b682?q=80&w=800",
      "https://images.unsplash.com/photo-1579541591970-e5a7e3a79a0b?q=80&w=800",
    ],
    Music: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800",
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800",
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=800",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800",
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800",
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=800",
      "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?q=80&w=800",
      "https://images.unsplash.com/photo-1524650359799-842906ca1c06?q=80&w=800",
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?q=80&w=800",
      "https://images.unsplash.com/photo-1458560871784-56d23406c091?q=80&w=800",
    ],
    Travel: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800",
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800",
      "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=800",
      "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800",
      "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=800",
      "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=800",
      "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=800",
      "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?q=80&w=800",
      "https://images.unsplash.com/photo-1528543606781-2f6e6857f318?q=80&w=800",
      "https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?q=80&w=800",
    ],
    Cooking: [
      "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?q=80&w=800",
      "https://images.unsplash.com/photo-1607877361964-d5c3c2e0ff8a?q=80&w=800",
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800",
      "https://images.unsplash.com/photo-1556909114-44e3e9699e2b?q=80&w=800",
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=800",
      "https://images.unsplash.com/photo-1514986888952-8cd320577b68?q=80&w=800",
      "https://images.unsplash.com/photo-1528712306091-ed0763094c98?q=80&w=800",
      "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800",
      "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800",
      "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800",
      "https://images.unsplash.com/photo-1631861355236-01a6d0a2b1fe?q=80&w=800",
    ],
    Fashion: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800",
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=800",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800",
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800",
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=800",
      "https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80&w=800",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800",
      "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?q=80&w=800",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800",
    ],
    "Home Decor": [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=800",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800",
      "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?q=80&w=800",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=800",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800",
    ],
    Gaming: [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800",
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=800",
      "https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?q=80&w=800",
      "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?q=80&w=800",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800",
      "https://images.unsplash.com/photo-1586182987320-4f17e36a0cf6?q=80&w=800",
      "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?q=80&w=800",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800",
      "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?q=80&w=800",
      "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?q=80&w=800",
      "https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?q=80&w=800",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
    ],
    Experiences: [
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=800",
      "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?q=80&w=800",
      "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=800",
      "https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6?q=80&w=800",
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=800",
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800",
      "https://images.unsplash.com/photo-1519671282429-b44660ead0a7?q=80&w=800",
      "https://images.unsplash.com/photo-1526976668912-1a811878dd37?q=80&w=800",
      "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=800",
    ],
    Jewelry: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=800",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800",
      "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?q=80&w=800",
      "https://images.unsplash.com/photo-1603974372039-adc49044b6bd?q=80&w=800",
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800",
      "https://images.unsplash.com/photo-1619119069152-a2b331eb392a?q=80&w=800",
    ],
    Fitness: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800",
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=800",
      "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?q=80&w=800",
      "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=800",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800",
      "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=800",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800",
      "https://images.unsplash.com/photo-1518310383802-640c2de311b6?q=80&w=800",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800",
    ],
    Gardening: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800",
      "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=800",
      "https://images.unsplash.com/photo-1599685315640-4a9ba2613517?q=80&w=800",
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800",
      "https://images.unsplash.com/photo-1590931511555-83151d16a146?q=80&w=800",
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800",
      "https://images.unsplash.com/photo-1598902108854-10e335adac99?q=80&w=800",
      "https://images.unsplash.com/photo-1466692476655-ab0c26c69cbf?q=80&w=800",
      "https://images.unsplash.com/photo-1557429287-b2e26467fc2b?q=80&w=800",
      "https://images.unsplash.com/photo-1599629954294-14df9f8291b7?q=80&w=800",
      "https://images.unsplash.com/photo-1598512199776-e0e1a1299dbd?q=80&w=800",
      "https://images.unsplash.com/photo-1595228702420-b3640517f1e5?q=80&w=800",
    ],
    Beauty: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800",
      "https://images.unsplash.com/photo-1596704017254-9a90fd9fe615?q=80&w=800",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800",
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800",
      "https://images.unsplash.com/photo-1598528738936-c50861cc0e71?q=80&w=800",
      "https://images.unsplash.com/photo-1583001809873-a128495da465?q=80&w=800",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800",
    ],
    Pets: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800",
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=800",
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=800",
      "https://images.unsplash.com/photo-1560743641-3914f2c45636?q=80&w=800",
      "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?q=80&w=800",
      "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=800",
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=800",
      "https://images.unsplash.com/photo-1567008252030-8b3c9957a3e9?q=80&w=800",
      "https://images.unsplash.com/photo-1587559070757-f72a388edbba?q=80&w=800",
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=800",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800",
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800",
    ],
    DIY: [
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=800",
      "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=800",
      "https://images.unsplash.com/photo-1558910153-0eed3dfc3a83?q=80&w=800",
      "https://images.unsplash.com/photo-1560421683-6856ea585c78?q=80&w=800",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800",
      "https://images.unsplash.com/photo-1572297350242-837830e39385?q=80&w=800",
      "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=800",
      "https://images.unsplash.com/photo-1586307078358-2772b7572f6d?q=80&w=800",
      "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=800",
      "https://images.unsplash.com/photo-1606676539940-12768ce0e762?q=80&w=800",
      "https://images.unsplash.com/photo-1617791160536-598cf32026fb?q=80&w=800",
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=800",
    ],
    Photography: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800",
      "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?q=80&w=800",
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=800",
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800",
      "https://images.unsplash.com/photo-1520549233664-03f65c1d1327?q=80&w=800",
      "https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=800",
      "https://images.unsplash.com/photo-1480365501497-199581be0e66?q=80&w=800",
      "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=800",
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=800",
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=800",
    ],
    Stationery: [
      "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=800",
      "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?q=80&w=800",
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=800",
      "https://images.unsplash.com/photo-1568205612837-017257d2310a?q=80&w=800",
      "https://images.unsplash.com/photo-1574359411659-15573a27148d?q=80&w=800",
      "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=800",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800",
      "https://images.unsplash.com/photo-1565116175827-64847f972a3f?q=80&w=800",
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=800",
      "https://images.unsplash.com/photo-1558051815-0f18e64e6280?q=80&w=800",
    ],
    Camping: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800",
      "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?q=80&w=800",
      "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=800",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=800",
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=800",
      "https://images.unsplash.com/photo-1517823382935-51bfcb0ec6bc?q=80&w=800",
      "https://images.unsplash.com/photo-1563299796-17596ed6b017?q=80&w=800",
      "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?q=80&w=800",
      "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?q=80&w=800",
      "https://images.unsplash.com/photo-1533873984035-25970ab07461?q=80&w=800",
    ],
    Coffee: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800",
      "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=800",
      "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?q=80&w=800",
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800",
      "https://images.unsplash.com/photo-1497935586047-9395ee065e52?q=80&w=800",
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=800",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=800",
    ],
    Wine: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800",
      "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?q=80&w=800",
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800",
      "https://images.unsplash.com/photo-1568213816046-0a1727c9da1a?q=80&w=800",
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?q=80&w=800",
      "https://images.unsplash.com/photo-1566452348683-79a7ba93a8c7?q=80&w=800",
      "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800",
      "https://images.unsplash.com/photo-1547595628-c61a29f496f0?q=80&w=800",
      "https://images.unsplash.com/photo-1506914694386-2b48b6b6e46d?q=80&w=800",
      "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?q=80&w=800",
    ],
    Handmade: [
      "https://images.unsplash.com/photo-1560421683-6856ea585c78?q=80&w=800",
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=800",
      "https://images.unsplash.com/photo-1462927114214-6956d2fddd4e?q=80&w=800",
      "https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=800",
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800",
      "https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=800",
      "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?q=80&w=800",
      "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?q=80&w=800",
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?q=80&w=800",
      "https://images.unsplash.com/photo-1556760544-74068565f05c?q=80&w=800",
    ],
    Traditional: [
      "https://images.unsplash.com/photo-1604577853919-dbb99d3a54d6?q=80&w=800",
      "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=800",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800",
      "https://images.unsplash.com/photo-1606293926249-ed2f08dc5966?q=80&w=800",
      "https://images.unsplash.com/photo-1600431521340-491eca880813?q=80&w=800",
      "https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?q=80&w=800",
      "https://images.unsplash.com/photo-1590047265932-784b3f23c0c1?q=80&w=800",
      "https://images.unsplash.com/photo-1602810316693-3667c854239a?q=80&w=800",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800",
      "https://images.unsplash.com/photo-1602810319428-019690571b5b?q=80&w=800",
    ],
  }

  // Additional categories with their own images
  const additionalCategories: Record<string, string[]> = {
    Spiritual: [
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=800",
      "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?q=80&w=800",
      "https://images.unsplash.com/photo-1603539444875-76e7684265f6?q=80&w=800",
      "https://images.unsplash.com/photo-1605468269348-334c9a0e08f7?q=80&w=800",
      "https://images.unsplash.com/photo-1599056941681-7beea9d42a62?q=80&w=800",
    ],
    Ayurvedic: [
      "https://images.unsplash.com/photo-1611072172377-0cabc3addb30?q=80&w=800",
      "https://images.unsplash.com/photo-1611072172377-0cabc3addb30?q=80&w=800",
      "https://images.unsplash.com/photo-1512675828443-4f454c42253a?q=80&w=800",
      "https://images.unsplash.com/photo-1611072172377-0cabc3addb30?q=80&w=800",
      "https://images.unsplash.com/photo-1611072172377-0cabc3addb30?q=80&w=800",
    ],
    Indian: [
      "https://images.unsplash.com/photo-1566454825481-9c31f1f8fcff?q=80&w=800",
      "https://images.unsplash.com/photo-1589778655375-3e622a9fc91c?q=80&w=800",
      "https://images.unsplash.com/photo-1602602440863-2e1ff8a56e7f?q=80&w=800",
      "https://images.unsplash.com/photo-1600431521340-491eca880813?q=80&w=800",
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=800",
    ],
    Ethnic: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800",
      "https://images.unsplash.com/photo-1606293926249-ed2f08dc5966?q=80&w=800",
      "https://images.unsplash.com/photo-1600431521340-491eca880813?q=80&w=800",
      "https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?q=80&w=800",
      "https://images.unsplash.com/photo-1590047265932-784b3f23c0c1?q=80&w=800",
    ],
    Festive: [
      "https://images.unsplash.com/photo-1604577853919-dbb99d3a54d6?q=80&w=800",
      "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=800",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800",
      "https://images.unsplash.com/photo-1606293926249-ed2f08dc5966?q=80&w=800",
      "https://images.unsplash.com/photo-1600431521340-491eca880813?q=80&w=800",
    ],
  }

  // Merge the additional categories with the main categories
  const allCategoryImages = { ...categoryImages, ...additionalCategories }

  // Default category if not found
  const defaultCategory = "Gift"
  const defaultImages = [
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800",
    "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=800",
    "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800",
    "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800",
    "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=800",
    "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=800",
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800",
    "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800",
    "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=800",
    "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=800",
  ]

  // Try to find a category that matches (case-insensitive)
  const normalizedCategory = category.toLowerCase()
  let matchedCategory = Object.keys(allCategoryImages).find((cat) => cat.toLowerCase() === normalizedCategory)

  // If no exact match, try to find a partial match
  if (!matchedCategory) {
    matchedCategory = Object.keys(allCategoryImages).find(
      (cat) => normalizedCategory.includes(cat.toLowerCase()) || cat.toLowerCase().includes(normalizedCategory),
    )
  }

  // Get images for the category or use default
  const images = matchedCategory ? allCategoryImages[matchedCategory] : defaultImages

  // Select a random image from the category
  return images[Math.floor(Math.random() * images.length)]
}
