"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import NavBar from "@/components/nav-bar"
import { Heart, Sparkles, Lightbulb, Clock, User } from "lucide-react"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [savedGifts, setSavedGifts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
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
  }, [status, router])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <NavBar />
      <main className="container mx-auto px-6 py-12">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-800 flex justify-center items-center gap-3">
            <Sparkles className="h-7 w-7 text-purple-600" />
            Hello, {session?.user?.name}!
          </h1>
          <p className="mt-4 text-lg text-gray-600">Your personalized gift dashboard</p>
        </section>

        <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {[
            {
              icon: <Lightbulb className="h-6 w-6 text-purple-500" />, title: "Find Gifts", description: "Start a new survey", link: "/survey", label: "Start"
            },
            {
              icon: <Heart className="h-6 w-6 text-pink-500" />, title: "Saved Gifts", description: `${savedGifts.length} item${savedGifts.length !== 1 ? "s" : ""} saved`, link: "/saved-gifts", label: "View"
            },
            {
              icon: <Clock className="h-6 w-6 text-yellow-500" />, title: "History", description: "View past suggestions", link: "/history", label: "History"
            },
            {
              icon: <User className="h-6 w-6 text-green-500" />, title: "Profile", description: "Edit your info", link: "/profile", label: "Edit"
            },
          ].map((item, index) => (
            <Card key={index} className="bg-white shadow-xl rounded-2xl p-5 hover:scale-[1.02] transition-transform">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">{item.icon}{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">{item.description}</p>
                <Button asChild className="w-full" variant="default">
                  <Link href={item.link}>{item.label}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          <Card className="bg-white shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Recommendations</CardTitle>
              <CardDescription className="text-sm text-gray-500">Your latest gift ideas</CardDescription>
            </CardHeader>
            <CardContent>
              {savedGifts.length > 0 ? (
                <ul className="space-y-3">
                  {savedGifts.slice(0, 5).map((gift: any) => (
                    <li key={gift.id} className="border-b pb-2">
                      <Link href={`/gift/${gift.id}`} className="text-blue-600 hover:underline">
                        {gift.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        ₹{Math.round(gift.price).toLocaleString("en-IN")} - {gift.category}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">No recommendations yet</p>
                  <Button asChild>
                    <Link href="/survey">Get Started</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Tips</CardTitle>
              <CardDescription className="text-sm text-gray-500">Improve your gift picks</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  ["Be specific", "Better answers give better gifts."],
                  ["Save favorites", "Bookmark gifts you love."],
                  ["Use filters", "Sort by price or type."],
                  ["Why it fits?", "Read why the gift matches."],
                ].map(([title, desc], i) => (
                  <li key={i}>
                    <p className="font-medium text-gray-700">{title}</p>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}