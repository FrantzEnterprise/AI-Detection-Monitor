import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Eye, AlertTriangle, CheckCircle, Activity, Maximize2, X } from 'lucide-react'
import { VideoMonitor as VideoMonitorClass, VideoAnalysisResult } from '../utils/videoAnalysis'
import { useDetectionStore } from '../store/detectionStore'

interface FloatingWidgetProps {
  onExpand: () => void
  isBackgroundMonitoring: boolean
}

const FloatingWidget: React.FC<FloatingWidgetProps> = ({ onExpand, isBackgroundMonitoring }) => {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [videoMonitor] = useState(new VideoMonitorClass())
  const [currentAnalysis, setCurrentAnalysis] = useState<VideoAnalysisResult | null>(null)
  const [recentDetections, setRecentDetections] = useState<string[]>([])
  const [showNotification, setShowNotification] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const { stats } = useDetectionStore()

  useEffect(() => {
    // Auto-start monitoring when widget loads if background monitoring was active
    if (isBackgroundMonitoring && !isMonitoring) {
      startMonitoring()
    }
  }, [isBackgroundMonitoring])

  const startMonitoring = async () => {
    try {
      await videoMonitor.startMonitoring((result) => {
        setCurrentAnalysis(result)
        
        // Check for new detections
        const newDetections: string[] = []
        if (result.detections.aiVideo.detected) {
          newDetections.push(`AI Video (${Math.round(result.detections.aiVideo.confidence * 100)}%)`)
        }
        if (result.detections.aiAudio.detected) {
          newDetections.push(`AI Audio (${Math.round(result.detections.aiAudio.confidence * 100)}%)`)
        }
        if (result.detections.botContent.detected) {
          newDetections.push(`Bot Content (${Math.round(result.detections.botContent.confidence * 100)}%)`)
        }
        
        if (newDetections.length > 0) {
          setRecentDetections(prev => [...newDetections, ...prev.slice(0, 4)])
          setShowNotification(true)
          setTimeout(() => setShowNotification(false), 3000)
        }
      })
      setIsMonitoring(true)
    } catch (error) {
      console.error('Failed to start monitoring:', error)
    }
  }

  const stopMonitoring = () => {
    videoMonitor.stopMonitoring()
    setIsMonitoring(false)
    setCurrentAnalysis(null)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button')) return // Don't drag when clicking buttons
    
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.max(0, Math.min(window.innerWidth - 320, e.clientX - offsetX))
      const newY = Math.max(0, Math.min(window.innerHeight - 200, e.clientY - offsetY))
      setPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const hasActiveDetections = currentAnalysis && (
    currentAnalysis.detections.aiVideo.detected ||
    currentAnalysis.detections.aiAudio.detected ||
    currentAnalysis.detections.botContent.detected
  )

  return (
    <>
      {/* Floating Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed z-50 w-80 glass-effect rounded-xl border-2 ${
          hasActiveDetections ? 'border-red-500 border-opacity-50' : 'border-white border-opacity-20'
        } cursor-move select-none`}
        style={{ 
          right: position.x, 
          bottom: position.y,
          backdropFilter: 'blur(20px)',
          background: 'rgba(0, 0, 0, 0.8)'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white border-opacity-10">
          <div 
            className="flex items-center flex-1 cursor-pointer"
            onClick={onExpand}
          >
            <div className={`p-2 rounded-lg mr-2 ${
              hasActiveDetections ? 'bg-red-500 bg-opacity-20' : 'bg-blue-500 bg-opacity-20'
            }`}>
              <Shield className={`w-4 h-4 ${
                hasActiveDetections ? 'text-red-400' : 'text-blue-400'
              }`} />
            </div>
            <div>
              <h3 className="text-white text-sm font-bold">AI Detector</h3>
              <p className={`text-xs ${
                isMonitoring ? 'text-green-400' : 'text-white text-opacity-50'
              }`}>
                {isMonitoring ? 'Monitoring Active' : 'Click to expand'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onExpand()
              }}
              className="p-1.5 bg-white bg-opacity-10 rounded hover:bg-opacity-20 transition-all"
              title="Expand to full window"
            >
              <Maximize2 className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white bg-opacity-5 rounded-lg p-2">
              <p className="text-white text-lg font-bold">{stats.totalAnalyzed}</p>
              <p className="text-white text-opacity-70 text-xs">Total</p>
            </div>
            <div className="bg-white bg-opacity-5 rounded-lg p-2">
              <p className="text-red-400 text-lg font-bold">{stats.aiDetected}</p>
              <p className="text-white text-opacity-70 text-xs">AI Found</p>
            </div>
            <div className="bg-white bg-opacity-5 rounded-lg p-2">
              <p className="text-green-400 text-lg font-bold">{stats.humanDetected}</p>
              <p className="text-white text-opacity-70 text-xs">Human</p>
            </div>
          </div>

          {/* Current Status */}
          {currentAnalysis ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-white text-xs font-medium">Latest Analysis</p>
                <p className="text-white text-opacity-50 text-xs">
                  {currentAnalysis.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              <div className="space-y-1">
                {currentAnalysis.detections.aiVideo.detected && (
                  <div className="flex items-center justify-between bg-red-500 bg-opacity-10 rounded px-2 py-1">
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 text-red-400 mr-1" />
                      <span className="text-red-300 text-xs">AI Video</span>
                    </div>
                    <span className="text-red-300 text-xs font-medium">
                      {Math.round(currentAnalysis.detections.aiVideo.confidence * 100)}%
                    </span>
                  </div>
                )}
                
                {currentAnalysis.detections.aiAudio.detected && (
                  <div className="flex items-center justify-between bg-orange-500 bg-opacity-10 rounded px-2 py-1">
                    <div className="flex items-center">
                      <Activity className="w-3 h-3 text-orange-400 mr-1" />
                      <span className="text-orange-300 text-xs">AI Audio</span>
                    </div>
                    <span className="text-orange-300 text-xs font-medium">
                      {Math.round(currentAnalysis.detections.aiAudio.confidence * 100)}%
                    </span>
                  </div>
                )}
                
                {currentAnalysis.detections.botContent.detected && (
                  <div className="flex items-center justify-between bg-purple-500 bg-opacity-10 rounded px-2 py-1">
                    <div className="flex items-center">
                      <AlertTriangle className="w-3 h-3 text-purple-400 mr-1" />
                      <span className="text-purple-300 text-xs">Bot Content</span>
                    </div>
                    <span className="text-purple-300 text-xs font-medium">
                      {Math.round(currentAnalysis.detections.botContent.confidence * 100)}%
                    </span>
                  </div>
                )}
                
                {!hasActiveDetections && (
                  <div className="flex items-center justify-center bg-green-500 bg-opacity-10 rounded px-2 py-1">
                    <CheckCircle className="w-3 h-3 text-green-400 mr-1" />
                    <span className="text-green-300 text-xs">Content Clean</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-white text-opacity-50 text-xs">
                {isMonitoring ? 'Waiting for analysis...' : 'Click to start monitoring'}
              </p>
            </div>
          )}

          {/* Control Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              isMonitoring ? stopMonitoring() : startMonitoring()
            }}
            className={`w-full py-2 rounded-lg text-xs font-medium transition-all ${
              isMonitoring 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>
      </motion.div>

      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && recentDetections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed top-4 right-4 z-50 glass-effect rounded-lg p-4 border border-red-500 border-opacity-50 max-w-sm"
            style={{ 
              backdropFilter: 'blur(20px)',
              background: 'rgba(0, 0, 0, 0.9)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
                <h4 className="text-white font-semibold text-sm">AI Content Detected!</h4>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="p-1 hover:bg-white hover:bg-opacity-10 rounded"
              >
                <X className="w-3 h-3 text-white text-opacity-70" />
              </button>
            </div>
            <div className="space-y-1">
              {recentDetections.slice(0, 2).map((detection, index) => (
                <p key={index} className="text-red-300 text-xs">• {detection}</p>
              ))}
            </div>
            <button
              onClick={() => {
                setShowNotification(false)
                onExpand()
              }}
              className="mt-2 text-blue-400 text-xs hover:text-blue-300 transition-colors"
            >
              View Details →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingWidget
