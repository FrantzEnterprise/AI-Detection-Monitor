import React from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Home, 
  Settings, 
  LogOut, 
  User,
  Shield,
  Zap
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface SidebarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const { user, logout } = useAuth()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-64 bg-black/20 backdrop-blur-lg border-r border-white/10 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center animate-glow">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Detector</h1>
            <p className="text-xs text-gray-400">Professional</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-10 h-10 rounded-full border-2 border-cyan-500/50"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <li key={item.id}>
                <motion.button
                  onClick={() => setCurrentPage(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Stats */}
      <div className="p-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Status</span>
            </div>
            <span className="text-xs text-green-400 font-medium">Active</span>
          </div>
        </div>

        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </motion.button>
      </div>
    </motion.div>
  )
}
