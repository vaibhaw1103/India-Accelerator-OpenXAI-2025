"use client"

import { useState } from "react"
import { LandingPage } from "./landing-page"
import { SymptomInput } from "./symptom-input"
import { AnalysisResults } from "./analysis-results"
import { HistoryPage } from "./history-page"
import { SymptomAnalysis, HistoryItem } from "@/types"
import { generateId } from "@/lib/utils"

type AppState = 'landing' | 'input' | 'analyzing' | 'results' | 'history'

export function MainApp() {
  const [currentState, setCurrentState] = useState<AppState>('landing')
  const [currentAnalysis, setCurrentAnalysis] = useState<SymptomAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleStartCheck = () => {
    setCurrentState('input')
    setErrorMessage('') // Clear any previous errors
  }

  const handleViewHistory = () => {
    setCurrentState('history')
  }

  const handleBackToLanding = () => {
    setCurrentState('landing')
    setCurrentAnalysis(null)
  }

  const handleSymptomSubmit = async (symptoms: string) => {
    setIsAnalyzing(true)
    setCurrentState('analyzing')

    try {
      const response = await fetch('/api/analyze-symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        // Handle validation errors
        if (response.status === 400) {
          setErrorMessage(responseData.error || 'Please provide valid symptom description')
          setCurrentState('input')
          setIsAnalyzing(false)
          return
        }
        throw new Error(responseData.error || 'Failed to analyze symptoms')
      }

      // Create full analysis object
      const analysis: SymptomAnalysis = {
        id: generateId(),
        timestamp: Date.now(),
        symptoms,
        ...responseData
      }

      // Save to history
      const historyItem: HistoryItem = {
        id: analysis.id,
        timestamp: analysis.timestamp,
        symptoms: analysis.symptoms,
        summary: analysis.conditions[0]?.name || 'Analysis completed',
        specialist: analysis.recommendedSpecialist
      }

      // Update localStorage
      const existingHistory = localStorage.getItem('dhanvantri-ai-history')
      const history = existingHistory ? JSON.parse(existingHistory) : []
      history.unshift(historyItem)
      
      // Keep only last 50 entries
      if (history.length > 50) {
        history.splice(50)
      }
      
      localStorage.setItem('dhanvantri-ai-history', JSON.stringify(history))

      setCurrentAnalysis(analysis)
      setCurrentState('results')
    } catch (error) {
      console.error('Error analyzing symptoms:', error)
      setErrorMessage('Failed to analyze symptoms. Please try again.')
      setCurrentState('input')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleViewAnalysisFromHistory = (historyItem: HistoryItem) => {
    // For now, we'll create a basic analysis from history item
    // In a real app, you might want to store full analysis data
    const analysis: SymptomAnalysis = {
      id: historyItem.id,
      timestamp: historyItem.timestamp,
      symptoms: historyItem.symptoms,
      conditions: [
        {
          name: historyItem.summary,
          description: "Historical analysis - consult with healthcare provider for current assessment",
          likelihood: 50,
          severity: "medium" as const
        }
      ],
      recommendedSpecialist: historyItem.specialist,
      insights: [
        {
          category: "general" as const,
          title: "Historical Record",
          content: "This is a previous analysis. For current symptoms, please conduct a new assessment."
        }
      ],
      confidenceScores: [
        {
          condition: historyItem.summary,
          confidence: 50,
          reasoning: "Historical data - accuracy may vary over time"
        }
      ]
    }

    setCurrentAnalysis(analysis)
    setCurrentState('results')
  }

  const renderCurrentState = () => {
    switch (currentState) {
      case 'landing':
        return (
          <LandingPage
            onStartCheck={handleStartCheck}
            onViewHistory={handleViewHistory}
          />
        )
      
      case 'input':
      case 'analyzing':
        return (
          <SymptomInput
            onBack={handleBackToLanding}
            onSubmit={handleSymptomSubmit}
            isLoading={isAnalyzing}
            errorMessage={errorMessage}
          />
        )
      
      case 'results':
        return currentAnalysis ? (
          <AnalysisResults
            analysis={currentAnalysis}
            symptoms={currentAnalysis.symptoms}
            onBack={() => setCurrentState('input')}
            onNewCheck={handleBackToLanding}
            onViewHistory={handleViewHistory}
          />
        ) : null
      
      case 'history':
        return (
          <HistoryPage
            onBack={handleBackToLanding}
            onViewAnalysis={handleViewAnalysisFromHistory}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      {renderCurrentState()}
    </div>
  )
}
