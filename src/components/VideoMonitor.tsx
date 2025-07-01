import React, { useState } from 'react'
import { Play, Square, Eye, Mic, Bot, AlertTriangle, CheckCircle, Clock, Minimize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { VideoMonitor as VideoMonitorClass, VideoAnalysisResult } from '../utils/videoAnalysis'

interface VideoMonitorProps {
  onBackgroundModeChange?: (isBackground: boolean) => void
}

const VideoMonitor: React.FC<VideoMonitorProps> = ({ onBackgroundModeChange }) => {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [videoMonitor] = useState(new VideoMonitorClass())
  const [currentAnalysis, setCurrentAnalysis] = useState<VideoAnalysisResult | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<VideoAnalysisResult[]>([])
  const [notifications, setNotifications] = useState<string[]>([])

  const startMonitoring = async () => {
    try {
      await videoMonitor.startMonitoring((result) => {
        setCurrentAnalysis(result)
        setAnalysisHistory(prev => [result, ...prev.slice(0, 9)]) // Keep last 10
        
        // Add notifications for detections
        const newNotifications: string[] = []
        if (result.detections.aiVideo.detected) {
          newNotifications.push(`AI Video detected with ${Math.round(result.detections.aiVideo.confidence * 100)}% confidence`)
        }
        if (result.detections.aiAudio.detected) {
          newNotifications.push(`AI Audio detected with ${Math.round(result.detections.aiAudio.confidence * 100)}% confidence`)
        }
        if (result.detections.botContent.detected) {
          newNotifications.push(`Bot Content detected with ${Math.round(result.detections.botContent.confidence * 100)}% confidence`)
        }
        
        if (newNotifications.length > 0) {
          setNotifications(prev => [...newNotifications, ...prev.slice(0, 4)])
        }
      })
      setIsMonitoring(true)
      onBackgroundModeChange?.(true)
    } catch (error) {
      console.error('Failed to start monitoring:', error)
      alert('Please allow screen capture permission to monitor YouTube videos')
    }
  }

  const stopMonitoring = () => {
    videoMonitor.stopMonitoring()
    setIsMonitoring(false)
    setCurrentAnalysis(null)
    onBackgroundModeChange?.(false)
  }

  const DetectionCard = ({ title, detection, icon: Icon, color }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-effect rounded-xl p-4 ${detection.detected ? 'border border-red-500 border-opacity-50' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg bg-${color}-500 bg-opacity-20 mr-3`}>
            <Icon className={`w-5 h-5 text-${color}-400`} />
          </div>
          <h3 className="text-white font-semibold">{title}</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          detection.detected 
            ? 'bg-red-500 bg-opacity-20 text-red-300' 
            : 'bg-green-500 bg-opacity-20 text-green-300'
        }`}>
          {detection.detected ? 'DETECTED' : 'CLEAN'}
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-white text-opacity-70 text-sm mb-1">Confidence</p>
        <div className="w-full bg-white bg-opacity-10 rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-${detection.detected ? 'red' : 'green'}-500`}
            style={{ width: `${detection.confidence * 100}%` }}
          />
        </div>
        <p className="text-white text-sm mt-1">{Math.round(detection.confidence * 100)}%</p>
      </div>

      {detection.indicators.length > 0 && (
        <div>
          <p className="text-white text-opacity-70 text-sm mb-2">Indicators:</p>
          <div className="space-y-1">
            {detection.indicators.map((indicator: string, index: number) => (
              <p key={index} className="text-white text-xs bg-white bg-opacity-5 rounded px-2 py-1">
                • {indicator}
              </p>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">YouTube Video Monitor</h1>
            <p className="text-white text-opacity-70 text-lg">
              Real-time AI detection for video and audio content
            </p>
          </div>
          
          {/* Background Mode Indicator */}
          {isMonitoring && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-effect rounded-lg p-3 border border-green-500 border-opacity-50"
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                <p className="text-green-400 text-sm font-medium">Background Mode Ready</p>
              </div>
              <p className="text-white text-opacity-70 text-xs mt-1">
                Minimize to continue monitoring in background
              </p>
            </motion.div>
          )}
        </div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-semibold">Monitor Control</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isMonitoring 
                ? 'bg-green-500 bg-opacity-20 text-green-300' 
                : 'bg-gray-500 bg-opacity-20 text-gray-300'
            }`}>
              {isMonitoring ? 'ACTIVE' : 'INACTIVE'}
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={`flex items-center px-5 py-3 rounded-lg font-medium transition-all ${
                isMonitoring 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isMonitoring ? (
                <Square className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </button>

            {isMonitoring && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center px-4 py-3 bg-blue-500 bg-opacity-20 rounded-lg border border-blue-500 border-opacity-30"
              >
                <Minimize2 className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-blue-300 text-sm font-medium">
                  Click minimize to run in background
                </span>
              </motion.div>
            )}
          </div>
          
          <p className="text-white text-opacity-70 text-sm mt-3">
            {isMonitoring 
              ? 'Monitoring active - analyzing video and audio content every 5 seconds. You can minimize this window to continue monitoring in the background.'
              : 'Click "Start Monitoring" and allow screen capture to begin YouTube analysis'
            }
          </p>
        </motion.div>

        {/* Live Notifications */}
        <AnimatePresence>
          {notifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-effect rounded-xl p-4 border border-yellow-500 border-opacity-50"
            >
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                <h3 className="text-white font-semibold">Live Detections</h3>
              </div>
              <div className="space-y-2">
                {notifications.slice(0, 3).map((notification, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-yellow-300 text-sm bg-yellow-500 bg-opacity-10 rounded px-3 py-2"
                  >
                    {notification}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Analysis */}
        {currentAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-semibold">Current Analysis</h2>
                <div className="flex items-center text-white text-opacity-70 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {currentAnalysis.timestamp.toLocaleTimeString()}
                </div>
              </div>
              
              {currentAnalysis.videoTitle && (
                <div className="mb-4">
                  <p className="text-white text-opacity-70 text-sm mb-1">Video Title</p>
                  <p className="text-white font-medium">{currentAnalysis.videoTitle}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DetectionCard
                title="AI Video"
                detection={currentAnalysis.detections.aiVideo}
                icon={Eye}
                color="red"
              />
              <DetectionCard
                title="AI Audio"
                detection={currentAnalysis.detections.aiAudio}
                icon={Mic}
                color="orange"
              />
              <DetectionCard
                title="Bot Content"
                detection={currentAnalysis.detections.botContent}
                icon={Bot}
                color="purple"
              />
            </div>
          </motion.div>
        )}

        {/* Analysis History */}
        {analysisHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-white text-xl font-semibold mb-4">Recent Analysis History</h2>
            <div className="space-y-3">
              {analysisHistory.slice(0, 5).map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">
                      {analysis.videoTitle || 'Unknown Video'}
                    </p>
                    <p className="text-white text-opacity-50 text-xs mt-1">
                      {analysis.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {analysis.detections.aiVideo.detected && (
                      <div className="w-2 h-2 bg-red-500 rounded-full" title="AI Video Detected" />
                    )}
                    {analysis.detections.aiAudio.detected && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full" title="AI Audio Detected" />
                    )}
                    {analysis.detections.botContent.detected && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full" title="Bot Content Detected" />
                    )}
                    {!analysis.detections.aiVideo.detected && 
                     !analysis.detections.aiAudio.detected && 
                     !analysis.detections.botContent.detected && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        {!isMonitoring && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-xl p-6 border border-blue-500 border-opacity-50"
          >
            <h3 className="text-white text-lg font-semibold mb-3">How to Use Background Monitoring</h3>
            <div className="space-y-2 text-white text-opacity-70 text-sm">
              <p>1. Navigate to a YouTube video in your browser</p>
              <p>2. Click "Start Monitoring" and allow screen capture permission</p>
              <p>3. Click the minimize button (top-right) to switch to floating widget mode</p>
              <p>4. The floating widget will continue monitoring in the background</p>
              <p>5. Click the floating widget to expand back to full controls</p>
              <p>6. Real-time notifications will appear for any AI/bot content detected</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default VideoMonitor
