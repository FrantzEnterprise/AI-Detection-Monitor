import React from 'react'
import { Shield, Zap, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

const Header: React.FC = () => {
  return (
    <div className="h-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect flex items-center justify-between px-6 py-4 h-full"
      >
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">AI Content Detector</h1>
            <p className="text-white text-opacity-70 text-sm">Professional Detection Suite</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="bg-green-500 bg-opacity-20 p-2 rounded-lg mr-2">
              <Activity className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">System Status</p>
              <p className="text-green-400 text-xs">All Systems Operational</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg mr-2">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Detection Engine</p>
              <p className="text-blue-400 text-xs">v2.1.0 - Enhanced</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Header
