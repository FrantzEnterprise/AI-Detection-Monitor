import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Home,
  Settings,
  Brain,
  AlertTriangle,
  ExternalLink
} from 'lucide-react'
import SiteSelector from './SiteSelector'

interface TopBarProps {
  currentUrl: string
  setCurrentUrl: (url: string) => void
  isMonitoring: boolean
  setIsMonitoring: (monitoring: boolean) => void
}

export default function TopBar({ currentUrl, setCurrentUrl, isMonitoring, setIsMonitoring }: TopBarProps) {
  const [urlInput, setUrlInput] = useState(currentUrl)
  const [currentSite, setCurrentSite] = useState<any>(null)

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentUrl(urlInput)
  }

  const handleSiteSelect = (site: any) => {
    setCurrentSite(site)
    setUrlInput(site.embedSupport === 'blocked' && site.alternativeUrl ? site.alternativeUrl : site.url)
  }

  const isBlocked = currentSite?.embedSupport === 'blocked'

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Section - Logo & Navigation */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AI Detector Browser</h1>
              <p className="text-xs text-slate-400">Real-time Content Analysis</p>
            </div>
          </div>

          {/* Browser Controls */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all">
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                setCurrentUrl('https://medium.com')
                setUrlInput('https://medium.com')
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Section - URL Bar & Site Selector */}
        <div className="flex-1 max-w-2xl mx-8">
          <form onSubmit={handleUrlSubmit} className="relative">
            <div className="flex items-center bg-slate-800/60 border border-slate-600/50 rounded-xl overflow-hidden">
              <Globe className="w-5 h-5 text-slate-400 ml-4" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-transparent text-white placeholder-slate-400 focus:outline-none"
                placeholder="Enter URL or select from sites below..."
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Go
              </button>
            </div>
          </form>

          {/* Site Selector & Status */}
          <div className="flex items-center justify-between mt-3">
            <SiteSelector 
              currentUrl={currentUrl}
              setCurrentUrl={setCurrentUrl}
              onSiteSelect={handleSiteSelect}
            />
            
            {/* Current Site Status */}
            {currentSite && (
              <div className="flex items-center space-x-2">
                {isBlocked && (
                  <div className="flex items-center space-x-1 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-400 font-medium">Using Alternative</span>
                  </div>
                )}
                {currentSite.alternativeUrl && isBlocked && (
                  <div className="flex items-center space-x-1 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-blue-400 font-medium">Proxy Access</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Section - AI Monitor Toggle */}
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
              isMonitoring 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMonitoring ? (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span className="font-medium">Monitoring ON</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5" />
                <span className="font-medium">Monitoring OFF</span>
              </>
            )}
          </motion.button>

          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
