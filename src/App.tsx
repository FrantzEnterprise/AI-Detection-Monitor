import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import TextAnalyzer from './components/TextAnalyzer'
import BatchAnalyzer from './components/BatchAnalyzer'
import HistoryView from './components/HistoryView'
import Settings from './components/Settings'
import VideoMonitor from './components/VideoMonitor'
import { useDetectionStore } from './store/detectionStore'

type TabType = 'dashboard' | 'analyzer' | 'batch' | 'history' | 'settings' | 'video-monitor'

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('video-monitor')
  const { isAnalyzing } = useDetectionStore()

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'analyzer':
        return <TextAnalyzer />
      case 'video-monitor':
        return <VideoMonitor />
      case 'batch':
        return <BatchAnalyzer />
      case 'history':
        return <HistoryView />
      case 'settings':
        return <Settings />
      default:
        return <VideoMonitor />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
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
    </div>
  )
}

export default App
