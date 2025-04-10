import type { Gift } from "@/types/gift"

export function saveGift(gift: Gift): void {
  // Get existing saved gifts
  const savedGiftsJson = localStorage.getItem("savedGifts")
  let savedGifts: Gift[] = []

  if (savedGiftsJson) {
    try {
      savedGifts = JSON.parse(savedGiftsJson)
    } catch (e) {
      console.error("Error parsing saved gifts:", e)
    }
  }

  // Check if gift is already saved
  const isAlreadySaved = savedGifts.some((savedGift) => savedGift.id === gift.id)

  if (!isAlreadySaved) {
    // Add the new gift
    savedGifts.push(gift)
    localStorage.setItem("savedGifts", JSON.stringify(savedGifts))

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("storage"))
    window.dispatchEvent(new Event("giftSaved"))
  }
}

export function removeGift(giftId: string): void {
  // Get existing saved gifts
  const savedGiftsJson = localStorage.getItem("savedGifts")
  let savedGifts: Gift[] = []

  if (savedGiftsJson) {
    try {
      savedGifts = JSON.parse(savedGiftsJson)
      // Remove the gift
      savedGifts = savedGifts.filter((gift) => gift.id !== giftId)
      localStorage.setItem("savedGifts", JSON.stringify(savedGifts))

      // Dispatch event to notify other components
      window.dispatchEvent(new Event("storage"))
      window.dispatchEvent(new Event("giftSaved"))
    } catch (e) {
      console.error("Error parsing saved gifts:", e)
    }
  }
}

export function isGiftSaved(giftId: string): boolean {
  // Get existing saved gifts
  const savedGiftsJson = localStorage.getItem("savedGifts")
  let savedGifts: Gift[] = []

  if (savedGiftsJson) {
    try {
      savedGifts = JSON.parse(savedGiftsJson)
      return savedGifts.some((gift) => gift.id === giftId)
    } catch (e) {
      console.error("Error parsing saved gifts:", e)
      return false
    }
  }

  return false
}
