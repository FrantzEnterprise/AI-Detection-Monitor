import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Zap,
  Globe,
  Lock,
  Eye,
  Download,
  Trash2
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Settings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [notifications, setNotifications] = useState({
    email: true,
    desktop: false,
    analysis: true,
    security: true
  })
  const [privacy, setPrivacy] = useState({
    dataCollection: false,
    analytics: true,
    sharing: false
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data', icon: Database },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-20 h-20 rounded-full border-4 border-cyan-500/50"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                <p className="text-gray-400">{user?.email}</p>
                <button className="mt-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-all">
                  Change Avatar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Organization</label>
                <input
                  type="text"
                  placeholder="Your organization"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white">
                  <option value="analyst">Content Analyst</option>
                  <option value="researcher">Researcher</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium capitalize">{key} Notifications</h4>
                      <p className="text-gray-400 text-sm">
                        {key === 'email' && 'Receive notifications via email'}
                        {key === 'desktop' && 'Show desktop notifications'}
                        {key === 'analysis' && 'Notify when analysis is complete'}
                        {key === 'security' && 'Security and account alerts'}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-cyan-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                {Object.entries(privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-gray-400" />
                      <div>
                        <h4 className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                        <p className="text-gray-400 text-sm">
                          {key === 'dataCollection' && 'Allow collection of usage data'}
                          {key === 'analytics' && 'Enable analytics and performance tracking'}
                          {key === 'sharing' && 'Share anonymized data for research'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPrivacy(prev => ({ ...prev, [key]: !value }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-cyan-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Theme Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-gray-900 to-blue-900 border-2 border-cyan-500 rounded-lg cursor-pointer">
                  <div className="w-full h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded mb-3"></div>
                  <p className="text-white font-medium">Cyber Blue (Current)</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-900 to-purple-900 border border-white/20 rounded-lg cursor-pointer hover:border-purple-500">
                  <div className="w-full h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded mb-3"></div>
                  <p className="text-white font-medium">Neon Purple</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-900 to-green-900 border border-white/20 rounded-lg cursor-pointer hover:border-green-500">
                  <div className="w-full h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded mb-3"></div>
                  <p className="text-white font-medium">Matrix Green</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Display Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Animations</h4>
                    <p className="text-gray-400 text-sm">Enable smooth transitions and effects</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-cyan-500">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Reduced Motion</h4>
                    <p className="text-gray-400 text-sm">Minimize animations for accessibility</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Download className="w-6 h-6 text-cyan-400" />
                    <h4 className="text-white font-medium">Export Data</h4>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">Download all your analysis history and settings</p>
                  <button className="w-full px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all">
                    Export All Data
                  </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Trash2 className="w-6 h-6 text-red-400" />
                    <h4 className="text-white font-medium">Delete Account</h4>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">Permanently delete your account and all data</p>
                  <button className="w-full px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Storage Usage</h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white">Analysis History</span>
                  <span className="text-gray-400">2.3 GB / 10 GB</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div className="w-1/4 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Images</p>
                    <p className="text-white font-medium">1.2 GB</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Videos</p>
                    <p className="text-white font-medium">0.8 GB</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Audio</p>
                    <p className="text-white font-medium">0.2 GB</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Text</p>
                    <p className="text-white font-medium">0.1 GB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-full flex">
      {/* Settings Sidebar */}
      <div className="w-64 border-r border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Settings</h2>
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex justify-end space-x-4"
          >
            <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all">
              Cancel
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all">
              Save Changes
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
