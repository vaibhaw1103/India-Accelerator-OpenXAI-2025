"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SymptomInputProps {
  onBack: () => void
  onSubmit: (symptoms: string) => void
  isLoading?: boolean
  errorMessage?: string
}

export function SymptomInput({ onBack, onSubmit, isLoading = false, errorMessage }: SymptomInputProps) {
  const [symptoms, setSymptoms] = useState("")
  const [isListening, setIsListening] = useState(false)

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSymptoms(prev => prev + (prev ? ' ' : '') + transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      alert('Speech recognition is not supported in your browser.')
    }
  }

  const handleSubmit = () => {
    if (symptoms.trim()) {
      onSubmit(symptoms.trim())
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto w-full space-y-6"
      >
        {/* Header */}
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
            <h1 className="text-2xl font-bold text-gray-900">Describe Your Symptoms</h1>
            <p className="text-gray-600">Be as detailed as possible for better analysis</p>
          </div>
        </div>

        {/* Input Card */}
        <Card className="border-medical-200">
          <CardHeader>
            <CardTitle className="text-lg">What symptoms are you experiencing?</CardTitle>
            <CardDescription>
              Include details like duration, severity, location, and any triggers you've noticed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Message Display */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3"
              >
                <div className="text-red-500 mt-0.5">⚠️</div>
                <div>
                  <p className="text-red-800 font-medium">Invalid Input</p>
                  <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
                  <p className="text-red-600 text-xs mt-2">
                    Example: "persistent headache for 3 days with nausea" or "chest pain when breathing"
                  </p>
                </div>
              </motion.div>
            )}
            
            <div className="relative">
              <Textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="For example: I've been having a persistent headache for 3 days, mainly on the left side. It gets worse in bright light and I feel nauseous..."
                className="min-h-[150px] text-base leading-relaxed resize-none"
                disabled={isLoading}
              />
              
              {/* Voice Input Button */}
              <Button
                onClick={handleVoiceInput}
                variant="ghost"
                size="icon"
                className={`absolute bottom-2 right-2 rounded-full ${
                  isListening ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'
                }`}
                disabled={isLoading}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 animate-pulse" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>

            {isListening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-600 flex items-center space-x-2"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>Listening... Speak clearly into your microphone</span>
              </motion.div>
            )}

            {/* Character Count */}
            <div className="text-sm text-gray-500 text-right">
              {symptoms.length} characters
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleSubmit}
            disabled={!symptoms.trim() || isLoading}
            variant="medical"
            size="lg"
            className="px-8 py-6 text-lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Analyze Symptoms</span>
              </div>
            )}
          </Button>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-mint-50 border border-mint-200 rounded-lg p-4"
        >
          <h3 className="font-semibold text-mint-800 mb-2">💡 Tips for better analysis:</h3>
          <ul className="text-sm text-mint-700 space-y-1">
            <li>• Mention when symptoms started and how long they've lasted</li>
            <li>• Describe the intensity (mild, moderate, severe)</li>
            <li>• Include any activities that make symptoms better or worse</li>
            <li>• Note any accompanying symptoms</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}
