import { Card, CardContent } from "@/components/ui/card"
import type { Gift } from "@/types/gift"
import { Sparkles } from "lucide-react"

interface GiftExplanationProps {
  gift: Gift
  className?: string
}

export default function GiftExplanation({ gift, className = "" }: GiftExplanationProps) {
  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardContent className="p-4 bg-primary/5">
        <div className="flex items-start gap-2">
          <Sparkles className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium mb-2 text-primary">Why We Recommend This</h3>
            <p className="text-sm">{gift.reason}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
