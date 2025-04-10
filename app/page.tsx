import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import NavBar from "@/components/nav-bar"
import { Gift, Sparkles, Heart, Zap, Users, Clock } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow">
        <section className="py-20 pattern-bg">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Discover the <span className="gradient-text">Perfect Gift</span> with AI-Powered Recommendations
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10">
                Our intelligent system helps you find thoughtful, personalized gift ideas for any occasion without the
                endless browsing.
              </p>
              <Link href="/survey">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Find the Perfect Gift
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our text-based recommendation system uses advanced AI to match the perfect gift to your recipient's
            personality and preferences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tell Us About Them</h3>
                <p className="text-muted-foreground">
                  Answer a few questions about the recipient's personality, interests, and the occasion.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your responses to generate personalized gift suggestions tailored to your needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Recommendations</h3>
                <p className="text-muted-foreground">
                  Review detailed text-based recommendations with explanations of why each gift is a good match.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "For Tech Enthusiasts", icon: <Zap className="h-5 w-5" /> },
                { name: "Culinary Delights", icon: <Heart className="h-5 w-5" /> },
                { name: "Outdoor Adventures", icon: <Zap className="h-5 w-5" /> },
                { name: "Literary Treasures", icon: <Heart className="h-5 w-5" /> },
              ].map((category) => (
                <Card key={category.name} className="group cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-3">{category.icon}</div>
                    <h3 className="font-medium text-lg group-hover:text-primary transition-colors">{category.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to find the perfect gift?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take our quick survey and get personalized recommendations in minutes. No more endless browsing or
              guesswork.
            </p>
            <Link href="/survey">
              <Button size="lg" className="rounded-full px-8">
                <Clock className="mr-2 h-5 w-5" />
                Start in 60 Seconds
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "I was struggling to find a gift for my dad who has everything. GiftSage suggested the perfect item that I never would have thought of!",
                author: "Sarah K.",
              },
              {
                quote:
                  "The detailed explanations for why each gift was recommended helped me understand which one would be best for my friend.",
                author: "Michael T.",
              },
              {
                quote:
                  "I've used other gift finders before, but this one actually understood what I was looking for. Saved me hours of searching!",
                author: "Priya R.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex flex-col h-full">
                    <div className="text-4xl text-primary/20 mb-4">"</div>
                    <p className="flex-grow mb-4 italic">{testimonial.quote}</p>
                    <div className="text-sm font-medium">— {testimonial.author}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-muted/30 py-8 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Sparkles className="h-5 w-5 text-secondary mr-2" />
              <span className="font-bold gradient-text">GiftSage</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">© 2025 GiftSage. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-muted-foreground hover:text-primary text-sm">
                Terms
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm">
                Privacy
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary text-sm">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
