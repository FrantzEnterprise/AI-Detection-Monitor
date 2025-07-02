import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Video, 
  Music, 
  FileText, 
  ChevronUp, 
  ChevronDown,
  Settings,
  Minimize2,
  Maximize2,
  X,
  AlertTriangle,
  CheckCircle,
  Activity,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAIDetection } from '../contexts/AIDetectionContext'

interface FloatingWidgetProps {
  onOpenSettings: () => void
}

export default function FloatingWidget({ onOpenSettings }: FloatingWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const { detections, stats, isScanning, setIsScanning } = useAIDetection()

  // Simulated real-time detection data
  const [videoAI, setVideoAI] = useState(23)
  const [audioAI, setAudioAI] = useState(67)
  const [textAI, setTextAI] = useState(45)

  // Simulate real-time updates
  useEffect(() => {
    if (!isScanning) return

    const interval = setInterval(() => {
      setVideoAI(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 10)))
      setAudioAI(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 8)))
      setTextAI(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 12)))
    }, 2000)

    return () => clearInterval(interval)
  }, [isScanning])

  const getConfidenceColor = (confidence: number) => {
    if (confidence < 30) return 'text-green-400'
    if (confidence < 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getConfidenceGradient = (confidence: number) => {
    if (confidence < 30) return 'from-green-500 to-green-400'
    if (confidence < 70) return 'from-yellow-500 to-yellow-400'
    return 'from-red-500 to-red-400'
  }

  const getRiskLevel = (confidence: number) => {
    if (confidence < 30) return 'Low Risk'
    if (confidence < 70) return 'Medium Risk'
    return 'High Risk'
  }

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-blue-500/25 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Brain className="w-7 h-7" />
          {isScanning && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          )}
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.div
        className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
        style={{ width: isExpanded ? '320px' : '280px' }}
        layout
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border-b border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">AI Monitor</h3>
                <p className="text-slate-400 text-xs">Real-time Detection</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsScanning(!isScanning)}
                className={`p-1.5 rounded-lg transition-all ${
                  isScanning 
                    ? 'text-green-400 hover:bg-green-500/10' 
                    : 'text-slate-400 hover:bg-slate-700/50'
                }`}
              >
                {isScanning ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Status Indicator */}
              <div className="p-4 border-b border-slate-700/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                    <span className="text-white text-sm font-medium">
                      {isScanning ? 'Scanning Active' : 'Scanning Paused'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {stats.totalScanned} scanned
                  </div>
                </div>
              </div>

              {/* Detection Meters */}
              <div className="p-4 space-y-4">
                {/* Video AI Detection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-red-400" />
                      <span className="text-white text-sm font-medium">Video AI</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${getConfidenceColor(videoAI)}`}>
                        {Math.round(videoAI)}%
                      </span>
                      <p className="text-xs text-slate-400">{getRiskLevel(videoAI)}</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <motion.div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getConfidenceGradient(videoAI)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${videoAI}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Audio AI Detection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Music className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm font-medium">Audio AI</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${getConfidenceColor(audioAI)}`}>
                        {Math.round(audioAI)}%
                      </span>
                      <p className="text-xs text-slate-400">{getRiskLevel(audioAI)}</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <motion.div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getConfidenceGradient(audioAI)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${audioAI}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Text AI Detection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-green-400" />
                      <span className="text-white text-sm font-medium">Text AI</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${getConfidenceColor(textAI)}`}>
                        {Math.round(textAI)}%
                      </span>
                      <p className="text-xs text-slate-400">{getRiskLevel(textAI)}</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <motion.div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getConfidenceGradient(textAI)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${textAI}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Overall Risk Assessment */}
              <div className="p-4 border-t border-slate-700/30">
                <div className="bg-slate-800/50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">Overall Risk</span>
                    <div className="flex items-center space-x-1">
                      {Math.max(videoAI, audioAI, textAI) > 70 ? (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                      <span className={`text-sm font-bold ${getConfidenceColor(Math.max(videoAI, audioAI, textAI))}`}>
                        {getRiskLevel(Math.max(videoAI, audioAI, textAI))}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    Last scan: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-slate-700/30 bg-slate-800/30">
                <div className="flex items-center justify-between">
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 text-xs transition-all">
                    <Activity className="w-3 h-3" />
                    <span>Details</span>
                  </button>
                  <button 
                    onClick={onOpenSettings}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 text-xs transition-all"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
