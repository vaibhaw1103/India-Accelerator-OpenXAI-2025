"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Trash2, Eye, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HistoryItem } from "@/types"
import { formatTimestamp } from "@/lib/utils"

interface HistoryPageProps {
  onBack: () => void
  onViewAnalysis: (historyItem: HistoryItem) => void
}

export function HistoryPage({ onBack, onViewAnalysis }: HistoryPageProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('dhanvantri-ai-history')
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        setHistory(parsedHistory.sort((a: HistoryItem, b: HistoryItem) => b.timestamp - a.timestamp))
      } catch (error) {
        console.error('Error loading history:', error)
      }
    }
  }, [])

  const deleteHistoryItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem('dhanvantri-ai-history', JSON.stringify(updatedHistory))
  }

  const clearAllHistory = () => {
    if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      setHistory([])
      localStorage.removeItem('dhanvantri-ai-history')
    }
  }

  const filteredHistory = history.filter(item => 
    item.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.specialist.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>
              <p className="text-gray-600">Your previous symptom analyses</p>
            </div>
          </div>
          
          {history.length > 0 && (
            <Button onClick={clearAllHistory} variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </motion.div>

        {/* Search */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search your medical history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
            />
          </motion.div>
        )}

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <CardTitle className="text-xl text-gray-600 mb-2">
                    {history.length === 0 ? 'No History Yet' : 'No Results Found'}
                  </CardTitle>
                  <CardDescription>
                    {history.length === 0 
                      ? 'Your symptom analyses will appear here for easy reference'
                      : 'Try adjusting your search terms'
                    }
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {formatTimestamp(item.timestamp)}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          Recommended: <span className="font-medium text-medical-600">{item.specialist}</span>
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => onViewAnalysis(item)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          onClick={() => deleteHistoryItem(item.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">Symptoms:</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.symptoms}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">Summary:</h4>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Privacy Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-mint-50 border border-mint-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-mint-600 mt-0.5 flex-shrink-0">🔒</div>
            <div>
              <h3 className="font-semibold text-mint-800 mb-1">Privacy Protected</h3>
              <p className="text-sm text-mint-700">
                Your medical history is stored locally on your device and never shared with external servers. 
                You have complete control over your data.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
