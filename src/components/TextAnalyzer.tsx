import React, { useState } from 'react'
import { Search, FileText, AlertTriangle, CheckCircle, Clock, Copy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { analyzeText } from '../utils/aiDetection'
import { useDetectionStore } from '../store/detectionStore'

const TextAnalyzer: React.FC = () => {
  const [inputText, setInputText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentResult, setCurrentResult] = useState<any>(null)
  const { addResult } = useDetectionStore()

  const handleAnalyze = async () => {
    if (!inputText.trim()) return

    setIsAnalyzing(true)
    
    // Simulate analysis delay
    setTimeout(() => {
      const result = analyzeText(inputText)
      setCurrentResult(result)
      addResult(result)
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleClear = () => {
    setInputText('')
    setCurrentResult(null)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const IndicatorBar = ({ label, value, color }: any) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-white text-opacity-70 text-sm">{Math.round(value * 100)}%</p>
      </div>
      <div className="w-full bg-white bg-opacity-10 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-2 rounded-full bg-${color}-500`}
        />
      </div>
    </div>
  )

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">Text Analyzer</h1>
          <p className="text-white text-opacity-70 text-lg">
            Analyze text content for AI-generated patterns and characteristics
          </p>
        </div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 text-white mr-2" />
            <h2 className="text-white text-lg font-semibold">Input Text</h2>
          </div>
          
          <textarea
            className="w-full h-48 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg p-4 text-white placeholder-white placeholder-opacity-50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste or type the text you want to analyze for AI-generated content..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-white text-opacity-70 text-sm">
              {inputText.length} characters • {inputText.split(/\s+/).filter(word => word.length > 0).length} words
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-20 transition-all"
              >
                Clear
              </button>
              
              <button
                onClick={handleAnalyze}
                disabled={!inputText.trim() || isAnalyzing}
                className={`flex items-center px-5 py-2 bg-blue-500 rounded-lg text-white font-medium transition-all ${
                  inputText.trim() && !isAnalyzing ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {isAnalyzing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {currentResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Overall Result */}
              <div className={`glass-effect rounded-xl p-6 border ${
                currentResult.verdict === 'ai' ? 'border-red-500 border-opacity-50' :
                currentResult.verdict === 'human' ? 'border-green-500 border-opacity-50' :
                'border-yellow-500 border-opacity-50'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {currentResult.verdict === 'ai' ? (
                      <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
                    ) : currentResult.verdict === 'human' ? (
                      <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                    ) : (
                      <Clock className="w-6 h-6 text-yellow-400 mr-3" />
                    )}
                    <h2 className="text-white text-xl font-semibold">Analysis Result</h2>
                  </div>
                  
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(currentResult, null, 2))}
                    className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all"
                  >
                    <Copy className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-white text-opacity-70 text-sm mb-1">Verdict</p>
                    <p className={`text-lg font-bold ${
                      currentResult.verdict === 'ai' ? 'text-red-400' :
                      currentResult.verdict === 'human' ? 'text-green-400' :
                      'text-yellow-400'
                    }`}>
                      {currentResult.verdict.toUpperCase()}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-white text-opacity-70 text-sm mb-1">AI Probability</p>
                    <p className="text-white text-lg font-bold">
                      {Math.round(currentResult.aiProbability * 100)}%
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-white text-opacity-70 text-sm mb-1">Confidence</p>
                    <p className="text-white text-lg font-bold">
                      {Math.round(currentResult.confidence * 100)}%
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-white text-opacity-70 text-sm mb-2">AI Probability Distribution</p>
                  <div className="w-full bg-white bg-opacity-10 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-gradient-to-r from-green-500 to-red-500"
                      style={{ width: `${currentResult.aiProbability * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Detailed Indicators */}
              <div className="glass-effect rounded-xl p-6">
                <h2 className="text-white text-xl font-semibold mb-4">Detection Indicators</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <IndicatorBar
                      label="Repetitive Patterns"
                      value={currentResult.indicators.repetitivePatterns}
                      color="red"
                    />
                    <IndicatorBar
                      label="Vocabulary Complexity"
                      value={currentResult.indicators.vocabularyComplexity}
                      color="orange"
                    />
                    <IndicatorBar
                      label="Sentence Structure"
                      value={currentResult.indicators.sentenceStructure}
                      color="yellow"
                    />
                  </div>
                  
                  <div>
                    <IndicatorBar
                      label="Contextual Coherence"
                      value={currentResult.indicators.contextualCoherence}
                      color="blue"
                    />
                    <IndicatorBar
                      label="Human-like Errors"
                      value={currentResult.indicators.humanLikeErrors}
                      color="green"
                    />
                  </div>
                </div>
              </div>

              {/* Analysis Details */}
              <div className="glass-effect rounded-xl p-6">
                <h2 className="text-white text-xl font-semibold mb-4">Analysis Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-white text-opacity-70 text-sm mb-1">Analysis ID</p>
                    <p className="text-white font-mono text-sm">{currentResult.id}</p>
                  </div>
                  
                  <div>
                    <p className="text-white text-opacity-70 text-sm mb-1">Timestamp</p>
                    <p className="text-white text-sm">{currentResult.timestamp.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-white text-opacity-70 text-sm mb-1">Source</p>
                    <p className="text-white text-sm capitalize">{currentResult.source}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips Section */}
        {!currentResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-xl p-6 border border-blue-500 border-opacity-50"
          >
            <h3 className="text-white text-lg font-semibold mb-3">Analysis Tips</h3>
            <div className="space-y-2 text-white text-opacity-70 text-sm">
              <p>• Longer texts (100+ words) provide more accurate results</p>
              <p>• The analyzer looks for patterns in vocabulary, structure, and style</p>
              <p>• Results include confidence scores and detailed breakdowns</p>
              <p>• All analyses are saved to your history for future reference</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default TextAnalyzer
