"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface SurveyData {
  relationship: string
  age: string
  gender: string
  occasion: string
  interests: string[]
  personality: string[]
  budget: number[]
  additionalInfo: string
}

interface SurveyContextType {
  surveyData: SurveyData
  updateSurveyData: (data: Partial<SurveyData>) => void
  resetSurveyData: () => void
}

const defaultSurveyData: SurveyData = {
  relationship: "",
  age: "",
  gender: "",
  occasion: "",
  interests: [],
  personality: [],
  budget: [50],
  additionalInfo: "",
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined)

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [surveyData, setSurveyData] = useState<SurveyData>(defaultSurveyData)

  const updateSurveyData = (data: Partial<SurveyData>) => {
    setSurveyData((prev) => ({ ...prev, ...data }))
  }

  const resetSurveyData = () => {
    setSurveyData(defaultSurveyData)
  }

  return (
    <SurveyContext.Provider value={{ surveyData, updateSurveyData, resetSurveyData }}>
      {children}
    </SurveyContext.Provider>
  )
}

export function useSurvey() {
  const context = useContext(SurveyContext)
  if (context === undefined) {
    throw new Error("useSurvey must be used within a SurveyProvider")
  }
  return context
}
