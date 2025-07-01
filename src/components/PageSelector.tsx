import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, Youtube, MessageCircle, Twitter, Instagram, Facebook, Search, Monitor, X } from 'lucide-react'
import { WidgetStateManager, CrossPageCommunication } from '../utils/crossPageCommunication'
import { WidgetInjector } from '../utils/widgetInjector'

interface PageSelectorProps {
  onPageSelected: (url: string, platform: string) => void
  onClose: () => void
  isMonitoringActive: boolean
}

const PageSelector: React.FC<PageSelectorProps> = ({ onPageSelected, onClose, isMonitoringActive }) => {
  const [customUrl, setCustomUrl] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [isInjecting, setIsInjecting] = useState(false)

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'red', url: 'https://youtube.com' },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'blue', url: 'https://twitter.com' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'pink', url: 'https://instagram.com' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'blue', url: 'https://facebook.com' },
    { id: 'discord', name: 'Discord', icon: MessageCircle, color: 'indigo', url: 'https://discord.com' },
  ]

  const handlePlatformSelect = async (platform: any) => {
    setSelectedPlatform(platform.id)
    setIsInjecting(true)
    
    try {
      // Save monitoring state as active
      WidgetStateManager.saveState({
        isMonitoring: true,
        isMinimized: true,
        position: { x: 20, y: 20 },
        currentAnalysis: null,
        monitoringDisabled: false
      })

      // Inject widget into the target page
      await WidgetInjector.injectIntoPage(platform.url)
      
      // Notify about page selection
      onPageSelected(platform.url, platform.name)
      
      // Open the platform in a new tab
      window.open(platform.url, '_blank')
      
      // Close the selector
      onClose()
      
    } catch (error) {
      console.error('Failed to inject widget:', error)
    } finally {
      setIsInjecting(false)
      setSelectedPlatform(null)
    }
  }

  const handleCustomUrl = async () => {
    if (!customUrl.trim()) return
    
    let url = customUrl.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    setIsInjecting(true)
    
    try {
      // Save monitoring state as active
      WidgetStateManager.saveState({
        isMonitoring: true,
        isMinimized: true,
        position: { x: 20, y: 20 },
        currentAnalysis: null,
        monitoringDisabled: false
      })

      // Inject widget into the target page
      await WidgetInjector.injectIntoPage(url)
      
      // Notify about page selection
      onPageSelected(url, 'Custom Page')
      
      // Open the URL in a new tab
      window.open(url, '_blank')
      
      // Close the selector
      onClose()
      
    } catch (error) {
      console.error('Failed to inject widget:', error)
    } finally {
      setIsInjecting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-effect rounded-xl p-6 max-w-md w-full mx-4 border border-white border-opacity-20"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Monitor className="w-6 h-6 text-blue-400 mr-2" />
            <h2 className="text-white text-xl font-bold">Select Page to Monitor</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white text-opacity-70" />
          </button>
        </div>

        <p className="text-white text-opacity-70 text-sm mb-6">
          Choose a platform or enter a custom URL. The floating widget will appear on the selected page.
        </p>

        {/* Platform Selection */}
        <div className="space-y-3 mb-6">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handlePlatformSelect(platform)}
              disabled={isInjecting}
              className={`w-full flex items-center p-3 rounded-lg transition-all ${
                selectedPlatform === platform.id
                  ? 'bg-blue-500 bg-opacity-30 border border-blue-500 border-opacity-50'
                  : 'bg-white bg-opacity-5 hover:bg-white hover:bg-opacity-10 border border-transparent'
              } ${isInjecting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <platform.icon className={`w-5 h-5 text-${platform.color}-400 mr-3`} />
              <span className="text-white font-medium">{platform.name}</span>
              {selectedPlatform === platform.id && isInjecting && (
                <div className="ml-auto">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Custom URL */}
        <div className="space-y-3">
          <div className="flex items-center">
            <Globe className="w-4 h-4 text-white text-opacity-70 mr-2" />
            <span className="text-white text-sm font-medium">Custom URL</span>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Enter website URL..."
              className="flex-1 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-blue-400"
              onKeyPress={(e) => e.key === 'Enter' && handleCustomUrl()}
              disabled={isInjecting}
            />
            <button
              onClick={handleCustomUrl}
              disabled={!customUrl.trim() || isInjecting}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {isInjecting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {isInjecting && (
          <div className="mt-4 p-3 bg-blue-500 bg-opacity-20 rounded-lg border border-blue-500 border-opacity-30">
            <p className="text-blue-300 text-sm text-center">
              Injecting floating widget into target page...
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default PageSelector
