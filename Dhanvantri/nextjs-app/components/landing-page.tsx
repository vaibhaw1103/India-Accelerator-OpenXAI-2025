"use client"

import { motion } from "framer-motion"
import { Stethoscope, Shield, Clock, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LandingPageProps {
  onStartCheck: () => void
  onViewHistory: () => void
}

export function LandingPage({ onStartCheck, onViewHistory }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{
      background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #14b8a6 50%, #10b981 75%, #3b82f6 100%)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center space-y-8"
        style={{ position: 'relative', zIndex: 10 }}
      >
        {/* Hero Section */}
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="p-4 rounded-full medical-hero-icon" style={{
              background: 'linear-gradient(135deg, #dbeafe 0%, #bae6fd 100%)',
              border: '2px solid rgba(14, 165, 233, 0.2)',
              boxShadow: '0 8px 32px rgba(14, 165, 233, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <Stethoscope className="w-16 h-16 test-icon-blue" style={{
                color: '#0ea5e9',
                filter: 'drop-shadow(0 2px 4px rgba(14, 165, 233, 0.3))'
              }} />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold medical-title" style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Dhanvantri AI
          </h1>
          
          <p className="text-xl max-w-2xl mx-auto leading-relaxed medical-subtitle" style={{
            color: '#64748b'
          }}>
            Get instant medical insights with complete privacy. Your symptoms are analyzed locally using advanced AI - no data leaves your device.
          </p>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 my-12"
        >
          <div className="test-card" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(186, 230, 253, 0.5)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(14, 165, 233, 0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}>
            <div className="text-center">
              <Shield className="w-8 h-8 test-icon-green mx-auto mb-2" style={{
                color: '#14b8a6',
                filter: 'drop-shadow(0 2px 4px rgba(20, 184, 166, 0.3))'
              }} />
              <h3 className="text-lg font-semibold mb-2">Complete Privacy</h3>
              <p className="text-sm text-gray-600">
                All processing happens locally using Ollama. Your medical data never leaves your device.
              </p>
            </div>
          </div>

          <div className="test-card" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(186, 230, 253, 0.5)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(14, 165, 233, 0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}>
            <div className="text-center">
              <Brain className="w-8 h-8 test-icon-blue mx-auto mb-2" style={{
                color: '#0ea5e9',
                filter: 'drop-shadow(0 2px 4px rgba(14, 165, 233, 0.3))'
              }} />
              <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-gray-600">
                Advanced language models analyze your symptoms and provide detailed medical insights.
              </p>
            </div>
          </div>

          <div className="test-card" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(186, 230, 253, 0.5)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(14, 165, 233, 0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}>
            <div className="text-center">
              <Clock className="w-8 h-8 test-icon-pink mx-auto mb-2" style={{
                color: '#ec4899',
                filter: 'drop-shadow(0 2px 4px rgba(236, 72, 153, 0.3))'
              }} />
              <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">
                Get immediate analysis with specialist recommendations and confidence scores.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={onStartCheck}
            className="test-button"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              border: 'none',
              fontWeight: '600',
              fontSize: '1.125rem',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(245, 158, 11, 0.6)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)'
            }}
          >
            Start Symptom Check
          </button>
          
          <button
            onClick={onViewHistory}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-4 px-8 rounded-lg text-lg transition-colors"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
          >
            View History
          </button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 p-4 rounded-lg max-w-2xl mx-auto medical-disclaimer"
          style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '1px solid #f59e0b',
            color: '#92400e',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)'
          }}
        >
          <p className="text-sm">
            <strong>Medical Disclaimer:</strong> This tool is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for medical concerns.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
