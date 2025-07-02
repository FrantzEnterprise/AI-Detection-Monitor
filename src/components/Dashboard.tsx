import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Image, 
  Music, 
  Video, 
  Mic, 
  FileText,
  Brain,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Zap,
  TrendingUp,
  Shield
} from 'lucide-react'
import FileUpload from './FileUpload'
import DetectionResults from './DetectionResults'

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [detectionResults, setDetectionResults] = useState<any>(null)

  const categories = [
    {
      id: 'image',
      title: 'Image Detection',
      description: 'Detect AI-generated images and deepfakes',
      icon: Image,
      color: 'from-purple-500 to-pink-500',
      stats: { scanned: 1247, aiDetected: 89 }
    },
    {
      id: 'audio',
      title: 'Audio Analysis',
      description: 'Identify AI-generated music and voiceovers',
      icon: Music,
      color: 'from-green-500 to-teal-500',
      stats: { scanned: 856, aiDetected: 67 }
    },
    {
      id: 'video',
      title: 'Video Detection',
      description: 'Analyze videos for AI-generated content',
      icon: Video,
      color: 'from-blue-500 to-cyan-500',
      stats: { scanned: 432, aiDetected: 23 }
    },
    {
      id: 'voice',
      title: 'Voice Analysis',
      description: 'Detect synthetic speech and voice cloning',
      icon: Mic,
      color: 'from-orange-500 to-red-500',
      stats: { scanned: 678, aiDetected: 45 }
    },
    {
      id: 'text',
      title: 'Text Analysis',
      description: 'Identify AI-generated text content',
      icon: FileText,
      color: 'from-indigo-500 to-purple-500',
      stats: { scanned: 2134, aiDetected: 156 }
    }
  ]

  const recentScans = [
    { id: 1, name: 'portrait_image.jpg', type: 'Image', result: 'AI Generated', confidence: 94, time: '2 min ago' },
    { id: 2, name: 'voice_sample.mp3', type: 'Audio', result: 'Human', confidence: 87, time: '5 min ago' },
    { id: 3, name: 'article_draft.txt', type: 'Text', result: 'AI Generated', confidence: 91, time: '8 min ago' },
    { id: 4, name: 'demo_video.mp4', type: 'Video', result: 'Mixed', confidence: 76, time: '12 min ago' },
  ]

  const handleFileAnalysis = (file: File, category: string) => {
    // Simulate analysis
    setTimeout(() => {
      const mockResult = {
        fileName: file.name,
        fileType: category,
        confidence: Math.floor(Math.random() * 30) + 70,
        isAI: Math.random() > 0.5,
        details: {
          fileSize: file.size,
          analysisTime: Math.floor(Math.random() * 5) + 1,
          techniques: ['Neural Network Analysis', 'Pattern Recognition', 'Metadata Inspection']
        }
      }
      setDetectionResults(mockResult)
    }, 2000)
  }

  if (selectedCategory) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-white/10">
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-cyan-400 hover:text-cyan-300 mb-4 flex items-center space-x-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-white">
            {categories.find(c => c.id === selectedCategory)?.title}
          </h1>
        </div>
        
        <div className="flex-1 p-6">
          {!detectionResults ? (
            <FileUpload 
              category={selectedCategory}
              onFileUpload={handleFileAnalysis}
            />
          ) : (
            <DetectionResults 
              results={detectionResults}
              onNewScan={() => setDetectionResults(null)}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Detection Dashboard</h1>
            <p className="text-gray-400">Advanced AI content analysis and detection</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-6 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Scans</p>
                <p className="text-2xl font-bold text-white">5,347</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">AI Detected</p>
                <p className="text-2xl font-bold text-white">380</p>
              </div>
              <Brain className="w-8 h-8 text-red-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Accuracy Rate</p>
                <p className="text-2xl font-bold text-white">94.2%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Processing Speed</p>
                <p className="text-2xl font-bold text-white">2.3s</p>
              </div>
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detection Categories */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-6">Detection Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Scanned</p>
                      <p className="text-lg font-bold text-white">{category.stats.scanned}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">AI Detected: {category.stats.aiDetected}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-cyan-400">Analyze</span>
                      <Upload className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Recent Scans */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Recent Scans</h2>
          <div className="space-y-4">
            {recentScans.map((scan, index) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium truncate">{scan.name}</h4>
                  <span className="text-xs text-gray-400">{scan.time}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{scan.type}</span>
                  <div className="flex items-center space-x-1">
                    {scan.result === 'AI Generated' && <XCircle className="w-4 h-4 text-red-400" />}
                    {scan.result === 'Human' && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {scan.result === 'Mixed' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                    <span className={`text-sm font-medium ${
                      scan.result === 'AI Generated' ? 'text-red-400' :
                      scan.result === 'Human' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {scan.result}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      scan.result === 'AI Generated' ? 'bg-red-400' :
                      scan.result === 'Human' ? 'bg-green-400' : 'bg-yellow-400'
                    }`}
                    style={{ width: `${scan.confidence}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Confidence: {scan.confidence}%</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
