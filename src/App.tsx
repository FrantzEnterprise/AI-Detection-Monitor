import React, { useState } from 'react'
import FloatingWidget from './components/FloatingWidget'
import Login from './components/Login'
import Settings from './components/Settings'
import { AIDetectionProvider } from './contexts/AIDetectionContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function AppContent() {
  const { isAuthenticated } = useAuth()
  const [currentView, setCurrentView] = useState<'widget' | 'settings'>('widget')

  if (!isAuthenticated) {
    return <Login />
  }

  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-purple-950/30">
        <Settings />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(59,130,246,0.05)_50%,transparent_51%)] bg-[length:20px_20px]"></div>
      </div>

      {/* Demo Content Area */}
      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              AI Detection Widget
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Real-time AI content monitoring while you browse
            </p>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">How it works:</h2>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🎥</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Video Detection</h3>
                  <p className="text-slate-300 text-sm">
                    Monitors video content for AI-generated visuals, deepfakes, and synthetic media
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Audio Detection</h3>
                  <p className="text-slate-300 text-sm">
                    Analyzes audio streams for AI-generated music, voice cloning, and synthetic speech
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Text Detection</h3>
                  <p className="text-slate-300 text-sm">
                    Scans text content for AI-generated articles, comments, and automated writing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Content Sections */}
          <div className="space-y-8">
            <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Sample Video Content</h3>
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-600/30">
                <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-white font-medium">Sample Video Player</p>
                    <p className="text-slate-400 text-sm">AI detection active on video content</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Sample Article Content</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed mb-4">
                  This is sample text content that would be analyzed for AI generation patterns. 
                  The widget continuously monitors text as you read, checking for linguistic patterns 
                  that indicate artificial intelligence authorship.
                </p>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Advanced natural language processing algorithms examine sentence structure, 
                  vocabulary choices, and writing patterns to determine the likelihood of AI generation. 
                  The system provides real-time feedback through the floating widget interface.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Whether you're reading news articles, blog posts, or social media content, 
                  the AI detector helps you identify potentially synthetic text content with 
                  high accuracy and minimal false positives.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Button */}
          <div className="mt-12 text-center">
            <button
              onClick={() => setCurrentView('settings')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-xl"
            >
              Open Settings Console
            </button>
          </div>
        </div>
      </div>

      {/* Floating AI Detection Widget */}
      <FloatingWidget onOpenSettings={() => setCurrentView('settings')} />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AIDetectionProvider>
        <AppContent />
      </AIDetectionProvider>
    </AuthProvider>
  )
}

export default App
