import React from 'react'
import { BarChart3, FileText, FolderOpen, History, Settings, Video } from 'lucide-react'
import { motion } from 'framer-motion'

type TabType = 'dashboard' | 'analyzer' | 'batch' | 'history' | 'settings' | 'video-monitor'

interface SidebarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analyzer', label: 'Text Analyzer', icon: FileText },
    { id: 'video-monitor', label: 'Video Monitor', icon: Video },
    { id: 'batch', label: 'Batch Analyzer', icon: FolderOpen },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="w-64 h-full">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-effect h-full p-4"
      >
        <div className="mb-8">
          <h2 className="text-white text-xl font-bold">AI Detector</h2>
          <p className="text-white text-opacity-70 text-sm">Professional Suite</p>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as TabType)}
                className={`w-full p-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-500 bg-opacity-20 text-white' 
                    : 'text-white text-opacity-70 hover:bg-white hover:bg-opacity-5'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center w-full"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </button>
            )
          })}
        </nav>
      </motion.div>
    </div>
  )
}

export default Sidebar
