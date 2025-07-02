import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Image,
  Video,
  Music,
  FileText,
  TrendingUp,
  Activity
} from 'lucide-react'
import { useAIDetection } from '../contexts/AIDetectionContext'

interface AIMonitorPanelProps {
  isMonitoring: boolean
}

export default function AIMonitorPanel({ isMonitoring }: AIMonitorPanelProps) {
  const { detections, stats } = useAIDetection()

  const realtimeDetections = [
    { id: 1, type: 'image', element: 'Thumbnail', confidence: 89, isAI: true, timestamp: '2s ago' },
    { id: 2, type: 'text', element: 'Video Title', confidence: 23, isAI: false, timestamp: '5s ago' },
    { id: 3, type: 'video', element: 'Content Frame', confidence: 94, isAI: true, timestamp: '8s ago' },
    { id: 4, type: 'audio', element: 'Background Music', confidence: 67, isAI: false, timestamp: '12s ago' },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return Image
      case 'video': return Video
      case 'audio': return Music
      case 'text': return FileText
      default: return Eye
    }
  }

  return (
    <div className="h-full bg-slate-900/50 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Brain className="w-6 h-6 mr-2 text-cyan-400" />
            AI Monitor
          </h2>
          <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Scanned</p>
                <p className="text-2xl font-bold text-white">{stats.totalScanned}</p>
              </div>
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">AI Detected</p>
                <p className="text-2xl font-bold text-red-400">{stats.aiDetected}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Detections */}
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
          Live Detections
        </h3>

        <div className="space-y-3">
          <AnimatePresence>
            {realtimeDetections.map((detection, index) => {
              const Icon = getIcon(detection.type)
              return (
                <motion.div
                  key={detection.id}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-slate-800/60 rounded-xl p-4 border transition-all hover:bg-slate-800/80 ${
                    detection.isAI 
                      ? 'border-red-500/30 hover:border-red-500/50' 
                      : 'border-green-500/30 hover:border-green-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        detection.isAI ? 'bg-red-500/20' : 'bg-green-500/20'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          detection.isAI ? 'text-red-400' : 'text-green-400'
                        }`} />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{detection.element}</p>
                        <p className="text-slate-400 text-xs capitalize">{detection.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {detection.isAI ? (
                        <XCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Confidence</span>
                      <span className={`text-xs font-medium ${
                        detection.isAI ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {detection.confidence}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          detection.isAI ? 'bg-red-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${detection.confidence}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 text-right">{detection.timestamp}</p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Analysis Summary */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-400" />
            Page Analysis Summary
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Overall AI Content:</span>
              <span className="text-yellow-400 font-medium">47%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Risk Level:</span>
              <span className="text-orange-400 font-medium">Medium</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Elements Scanned:</span>
              <span className="text-cyan-400 font-medium">23</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
