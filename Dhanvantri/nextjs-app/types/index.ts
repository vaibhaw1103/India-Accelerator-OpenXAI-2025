export interface SymptomAnalysis {
  id: string
  timestamp: number
  symptoms: string
  conditions: Condition[]
  recommendedSpecialist: string
  insights: Insight[]
  confidenceScores: ConfidenceScore[]
}

export interface Condition {
  name: string
  description: string
  likelihood: number
  severity: 'low' | 'medium' | 'high'
}

export interface Insight {
  category: 'red_flags' | 'lifestyle' | 'prevention' | 'general'
  title: string
  content: string
}

export interface ConfidenceScore {
  condition: string
  confidence: number
  reasoning: string
}

export interface HistoryItem {
  id: string
  timestamp: number
  symptoms: string
  summary: string
  specialist: string
}
