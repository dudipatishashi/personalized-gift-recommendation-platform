"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { useSurvey } from "@/context/survey-context"
import NavBar from "@/components/nav-bar"

export default function SurveyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const { surveyData, updateSurveyData } = useSurvey()

  const steps = [
    {
      title: "Who is this gift for?",
      fields: ["relationship", "age", "gender"],
    },
    {
      title: "What's the occasion?",
      fields: ["occasion"],
    },
    {
      title: "What are their interests?",
      fields: ["interests"],
    },
    {
      title: "What's their personality like?",
      fields: ["personality"],
    },
    {
      title: "What's your budget?",
      fields: ["budget"],
    },
    {
      title: "Any additional details?",
      fields: ["additionalInfo"],
    },
  ]

  const interests = [
    "Reading",
    "Cooking",
    "Sports",
    "Technology",
    "Art",
    "Music",
    "Travel",
    "Gaming",
    "Fitness",
    "Fashion",
    "Home Decor",
    "Gardening",
  ]

  const personalities = [
    "Creative",
    "Practical",
    "Adventurous",
    "Intellectual",
    "Social",
    "Relaxed",
    "Organized",
    "Energetic",
    "Thoughtful",
    "Humorous",
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      // Submit the form and navigate to recommendations
      router.push("/recommendations")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleChange = (field: string, value: any) => {
    updateSurveyData({ [field]: value } as any)
  }

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    if (checked) {
      updateSurveyData({
        [field]: [...(surveyData[field as keyof typeof surveyData] as string[]), value],
      } as any)
    } else {
      updateSurveyData({
        [field]: (surveyData[field as keyof typeof surveyData] as string[]).filter((item) => item !== value),
      } as any)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen pattern-bg">
      <NavBar />

      <div className="container max-w-2xl mx-auto py-12 px-4">
        <Card className="shadow-lg border-border/50">
          <CardHeader>
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-6 w-6 text-secondary mr-2" />
              <CardTitle className="text-2xl text-center gradient-text">{steps[currentStep].title}</CardTitle>
            </div>
            <div className="survey-progress-bar">
              <div className="survey-progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>What is your relationship with them?</Label>
                  <RadioGroup
                    value={surveyData.relationship}
                    onValueChange={(value) => handleChange("relationship", value)}
                    className="grid grid-cols-2 gap-2"
                  >
                    {["Family", "Friend", "Partner", "Colleague", "Acquaintance", "Other"].map((rel) => (
                      <div key={rel} className="flex items-center space-x-2">
                        <RadioGroupItem value={rel} id={`relationship-${rel}`} />
                        <Label htmlFor={`relationship-${rel}`}>{rel}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="age">How old are they?</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Age"
                    value={surveyData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>What is their gender?</Label>
                  <RadioGroup
                    value={surveyData.gender}
                    onValueChange={(value) => handleChange("gender", value)}
                    className="grid grid-cols-2 gap-2"
                  >
                    {["Male", "Female", "Non-binary", "Prefer not to say"].map((gender) => (
                      <div key={gender} className="flex items-center space-x-2">
                        <RadioGroupItem value={gender} id={`gender-${gender}`} />
                        <Label htmlFor={`gender-${gender}`}>{gender}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>What's the occasion?</Label>
                  <RadioGroup
                    value={surveyData.occasion}
                    onValueChange={(value) => handleChange("occasion", value)}
                    className="grid grid-cols-2 gap-2"
                  >
                    {[
                      "Birthday",
                      "Anniversary",
                      "Holiday",
                      "Graduation",
                      "Wedding",
                      "Housewarming",
                      "Just Because",
                      "Other",
                    ].map((occasion) => (
                      <div key={occasion} className="flex items-center space-x-2">
                        <RadioGroupItem value={occasion} id={`occasion-${occasion}`} />
                        <Label htmlFor={`occasion-${occasion}`}>{occasion}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>What are their interests? (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {interests.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={`interest-${interest}`}
                          checked={surveyData.interests.includes(interest)}
                          onCheckedChange={(checked) => handleCheckboxChange("interests", interest, checked as boolean)}
                        />
                        <Label htmlFor={`interest-${interest}`}>{interest}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>How would you describe their personality? (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {personalities.map((trait) => (
                      <div key={trait} className="flex items-center space-x-2">
                        <Checkbox
                          id={`personality-${trait}`}
                          checked={surveyData.personality.includes(trait)}
                          onCheckedChange={(checked) => handleCheckboxChange("personality", trait, checked as boolean)}
                        />
                        <Label htmlFor={`personality-${trait}`}>{trait}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>What's your budget?</Label>
                    <span className="font-medium">
                      ₹{Math.round(surveyData.budget[0] * 83).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <Slider
                    value={surveyData.budget}
                    min={10}
                    max={500}
                    step={5}
                    onValueChange={(value) => handleChange("budget", value)}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹830</span>
                    <span>₹41,500+</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="additionalInfo">Any additional details that might help?</Label>
                  <textarea
                    id="additionalInfo"
                    className="w-full min-h-[120px] p-3 border rounded-md"
                    placeholder="E.g., favorite brands, colors, things they've mentioned wanting, etc."
                    value={surveyData.additionalInfo}
                    onChange={(e) => handleChange("additionalInfo", e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={handleNext}
              className={currentStep === steps.length - 1 ? "bg-gradient-to-r from-primary to-secondary" : ""}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Get Recommendations
                </>
              ) : (
                <>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
