import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, ExternalLink, Shield, RefreshCw } from 'lucide-react'
import { useAIDetection } from '../contexts/AIDetectionContext'

interface BrowserInterfaceProps {
  currentUrl: string
  setCurrentUrl: (url: string) => void
}

export default function BrowserInterface({ currentUrl, setCurrentUrl }: BrowserInterfaceProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [embedError, setEmbedError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const { scanContent } = useAIDetection()

  useEffect(() => {
    setIsLoading(true)
    setEmbedError(false)
    setRetryCount(0)
    
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Simulate content scanning
      scanContent({
        type: 'webpage',
        url: currentUrl,
        content: `Analyzing content from ${new URL(currentUrl).hostname}`
      })
    }, 1500)

    return () => clearTimeout(timer)
  }, [currentUrl, scanContent])

  const handleIframeError = () => {
    setEmbedError(true)
    setIsLoading(false)
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    setEmbedError(false)
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      if (retryCount >= 2) {
        setEmbedError(true)
      }
    }, 1000)
  }

  const openInNewTab = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative"
    >
      {/* Browser Frame */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center space-x-3">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex-1 bg-white rounded-lg px-3 py-1 text-sm text-slate-600 border flex items-center justify-between">
          <span className="truncate">{currentUrl}</span>
          {embedError && (
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-xs text-red-500">Embed Blocked</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="h-full bg-white relative overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">Loading {new URL(currentUrl).hostname}...</p>
              <p className="text-slate-400 text-sm mt-2">Checking embed permissions...</p>
            </div>
          </div>
        ) : embedError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Embedding Blocked</h3>
              <p className="text-slate-600 mb-6">
                {new URL(currentUrl).hostname} doesn't allow embedding due to security policies (X-Frame-Options).
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={openInNewTab}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Open in New Tab</span>
                </button>
                
                <button
                  onClick={handleRetry}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Retry Embedding ({retryCount}/3)</span>
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-left">
                    <h4 className="font-medium text-blue-800 mb-1">AI Detection Still Active</h4>
                    <p className="text-sm text-blue-600">
                      Open the site in a new tab to continue monitoring AI content with our browser extension.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={currentUrl}
            className="w-full h-full border-0"
            title="Browser Content"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-top-navigation"
            onError={handleIframeError}
            onLoad={() => {
              // Simulate content analysis when page loads
              setTimeout(() => {
                scanContent({
                  type: 'webpage',
                  url: currentUrl,
                  content: `Successfully loaded and analyzing ${new URL(currentUrl).hostname}`
                })
              }, 2000)
            }}
          />
        )}

        {/* AI Detection Overlay */}
        {!embedError && (
          <div className="absolute top-4 right-4 z-10">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900/90 backdrop-blur-lg text-white px-4 py-2 rounded-xl border border-slate-700/50 flex items-center space-x-2"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">AI Scanning Active</span>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
