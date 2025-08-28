"use client"

import { motion } from "framer-motion"
import { ArrowLeft, AlertTriangle, User, Heart, Shield, Lightbulb, Home, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SymptomAnalysis } from "@/types"
import { generateMedicalPDF } from "@/lib/pdf-generator"
import { useState } from "react"

interface AnalysisResultsProps {
  analysis: SymptomAnalysis
  symptoms: string
  onBack: () => void
  onNewCheck: () => void
  onViewHistory: () => void
}

export function AnalysisResults({ analysis, symptoms, onBack, onNewCheck, onViewHistory }: AnalysisResultsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true)
      await generateMedicalPDF(analysis, symptoms)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500'
    if (confidence >= 60) return 'bg-yellow-500'
    if (confidence >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'red_flags': return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'lifestyle': return <Heart className="w-5 h-5 text-pink-600" />
      case 'prevention': return <Shield className="w-5 h-5 text-mint-600" />
      default: return <Lightbulb className="w-5 h-5 text-blue-600" />
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
              <p className="text-gray-600">AI-powered symptom analysis</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button onClick={onViewHistory} variant="outline">
              View History
            </Button>
            <Button onClick={onNewCheck} variant="medical">
              <Home className="w-4 h-4 mr-2" />
              New Check
            </Button>
          </div>
        </motion.div>

        {/* Recommended Specialist - Highlighted */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-medical-300 bg-medical-50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <User className="w-8 h-8 text-medical-600" />
              </div>
              <CardTitle className="text-xl text-medical-800">Recommended Specialist</CardTitle>
              <CardDescription className="text-lg font-semibold text-medical-700">
                {analysis.recommendedSpecialist}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Possible Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Possible Conditions</CardTitle>
              <CardDescription>
                Based on your symptoms, here are the most likely conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.conditions.map((condition, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`p-4 rounded-lg border ${getSeverityColor(condition.severity)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{condition.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {condition.likelihood}% likely
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(condition.severity)}`}>
                        {condition.severity}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{condition.description}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Confidence Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Confidence Analysis</CardTitle>
              <CardDescription>
                How confident the AI is in each assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.confidenceScores.map((score, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{score.condition}</span>
                    <span className="text-sm font-semibold">{score.confidence}%</span>
                  </div>
                  <Progress 
                    value={score.confidence} 
                    className="h-3"
                  />
                  <p className="text-sm text-gray-600">{score.reasoning}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Insights - Expandable */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Medical Insights</CardTitle>
              <CardDescription>
                Important information and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {analysis.insights.map((insight, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(insight.category)}
                        <span className="font-semibold">{insight.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 text-base leading-relaxed">
                        {insight.content}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {/* Medical Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Important Medical Disclaimer</h3>
              <p className="text-sm text-yellow-700">
                This analysis is for informational purposes only and should not replace professional medical advice. 
                Please consult with a qualified healthcare provider for proper diagnosis and treatment. 
                If you're experiencing severe symptoms, seek immediate medical attention.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
