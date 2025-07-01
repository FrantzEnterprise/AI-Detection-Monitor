import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import TextAnalyzer from './components/TextAnalyzer'
import BatchAnalyzer from './components/BatchAnalyzer'
import HistoryView from './components/HistoryView'
import Settings from './components/Settings'
import VideoMonitor from './components/VideoMonitor'
import FloatingWidget from './components/FloatingWidget'
import { useDetectionStore } from './store/detectionStore'

type TabType = 'dashboard' | 'analyzer' | 'batch' | 'history' | 'settings' | 'video-monitor'

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('video-monitor')
  const [isMinimized, setIsMinimized] = useState(false) // Start expanded by default
  const [isBackgroundMonitoring, setIsBackgroundMonitoring] = useState(false)
  const [isAppReady, setIsAppReady] = useState(false)
  const { isAnalyzing } = useDetectionStore()

  // Ensure app is ready before rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Auto-minimize after 10 seconds of inactivity when background monitoring is active
  useEffect(() => {
    if (isBackgroundMonitoring && !isMinimized) {
      const timer = setTimeout(() => {
        setIsMinimized(true)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [isBackgroundMonitoring, isMinimized])

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'analyzer':
        return <TextAnalyzer />
      case 'video-monitor':
        return <VideoMonitor onBackgroundModeChange={setIsBackgroundMonitoring} />
      case 'batch':
        return <BatchAnalyzer />
      case 'history':
        return <HistoryView />
      case 'settings':
        return <Settings />
      default:
        return <VideoMonitor onBackgroundModeChange={setIsBackgroundMonitoring} />
    }
  }

  const handleExpand = () => {
    setIsMinimized(false)
  }

  const handleMinimize = () => {
    setIsMinimized(true)
  }

  // Show loading state until app is ready
  if (!isAppReady) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="glass-effect rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading AI Detector...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <FloatingWidget
            key="floating-widget"
            onExpand={handleExpand}
            isBackgroundMonitoring={isBackgroundMonitoring}
          />
        ) : (
          <motion.div
            key="full-app"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col h-full w-full"
          >
            {/* Minimize Button */}
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={handleMinimize}
                className="glass-effect p-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
                title="Minimize to floating window"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>

            <Header />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 p-6 overflow-auto"
              >
                {renderContent()}
              </motion.div>
            </div>
            
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <div className="glass-effect rounded-lg p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white text-lg font-medium">Analyzing content...</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
