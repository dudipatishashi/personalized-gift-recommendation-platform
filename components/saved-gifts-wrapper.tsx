"use client"

import dynamic from "next/dynamic"

// Dynamically import the SavedGifts component with no SSR
const SavedGifts = dynamic(() => import("./saved-gifts"), { ssr: false })

export default function SavedGiftsWrapper() {
  return <SavedGifts />
}
