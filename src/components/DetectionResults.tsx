import React from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Clock, 
  Zap,
  Brain,
  Shield,
  BarChart3
} from 'lucide-react'

interface DetectionResultsProps {
  results: {
    fileName: string
    fileType: string
    confidence: number
    isAI: boolean
    details: {
      fileSize: number
      analysisTime: number
      techniques: string[]
    }
  }
  onNewScan: () => void
}

export default function DetectionResults({ results, onNewScan }: DetectionResultsProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getResultColor = () => {
    if (results.isAI) return 'red'
    if (results.confidence > 85) return 'green'
    return 'yellow'
  }

  const getResultIcon = () => {
    if (results.isAI) return XCircle
    if (results.confidence > 85) return CheckCircle
    return AlertTriangle
  }

  const ResultIcon = getResultIcon()
  const colorClass = getResultColor()

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className={`inline-flex items-center justify-center w-20 h-20 bg-${colorClass}-500/20 rounded-2xl mb-4`}>
          <ResultIcon className={`w-10 h-10 text-${colorClass}-400`} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Analysis Complete</h2>
        <p className="text-gray-400">Detailed results for your file analysis</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Result */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Detection Result</h3>
                <p className="text-gray-400">{results.fileName}</p>
              </div>
              <div className={`px-4 py-2 bg-${colorClass}-500/20 border border-${colorClass}-500/30 rounded-lg`}>
                <span className={`text-${colorClass}-400 font-medium`}>
                  {results.isAI ? 'AI Generated' : 'Human Created'}
                </span>
              </div>
            </div>

            {/* Confidence Meter */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Confidence Level</span>
                <span className="text-white font-bold">{results.confidence}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${results.confidence}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-4 rounded-full bg-gradient-to-r ${
                    colorClass === 'red' ? 'from-red-500 to-red-400' :
                    colorClass === 'green' ? 'from-green-500 to-green-400' :
                    'from-yellow-500 to-yellow-400'
                  }`}
                />
              </div>
            </div>

            {/* Analysis Techniques */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Analysis Techniques Used</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.details.techniques.map((technique, index) => (
                  <motion.div
                    key={technique}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 text-center"
                  >
                    <Brain className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-white text-sm font-medium">{technique}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* File Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              File Information
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">File Name</p>
                <p className="text-white font-medium truncate">{results.fileName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">File Type</p>
                <p className="text-white font-medium">{results.fileType}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">File Size</p>
                <p className="text-white font-medium">{formatFileSize(results.details.fileSize)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Analysis Stats
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">Processing Time</span>
                </div>
                <span className="text-white font-medium">{results.details.analysisTime}s</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">Speed</span>
                </div>
                <span className="text-white font-medium">Fast</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">Accuracy</span>
                </div>
                <span className="text-white font-medium">High</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center space-x-4"
      >
        <button
          onClick={onNewScan}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all"
        >
          Analyze Another File
        </button>
        <button className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all">
          Download Report
        </button>
      </motion.div>
    </div>
  )
}
