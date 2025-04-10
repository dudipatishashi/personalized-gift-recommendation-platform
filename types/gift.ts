export interface Gift {
  id: string
  name: string
  description: string
  price: number
  image: string // This will be empty in our text-based approach
  category: string
  tags: string[]
  rating: number
  reviews: number
  url: string
  reason: string
}
