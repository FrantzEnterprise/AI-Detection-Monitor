import React, { useState } from 'react'
import { Search, Filter, Download, Trash2, Eye, Calendar, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDetectionStore } from '../store/detectionStore'

const HistoryView: React.FC = () => {
  const { results, clearResults } = useDetectionStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterVerdict, setFilterVerdict] = useState<'all' | 'ai' | 'human' | 'uncertain'>('all')
  const [selectedResult, setSelectedResult] = useState<any>(null)

  const filteredResults = results.filter(result => {
    const matchesSearch = result.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.platform?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterVerdict === 'all' || result.verdict === filterVerdict
    
    return matchesSearch && matchesFilter
  })

  const exportHistory = () => {
    const dataStr = JSON.stringify(filteredResults, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `ai-detection-history-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const ResultModal = ({ result, onClose }: any) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-effect rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">Analysis Details</h2>
          <button
            onClick={onClose}
            className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all"
          >
            <span className="text-white text-xl">×</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-white text-opacity-70 text-sm mb-1">Analysis ID</p>
            <p className="text-white font-mono text-sm">{result.id}</p>
          </div>

          <div>
            <p className="text-white text-opacity-70 text-sm mb-1">Content</p>
            <div className="bg-white bg-opacity-5 rounded-lg p-3 max-h-40 overflow-y-auto">
              <p className="text-white text-sm">{result.text}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white text-opacity-70 text-sm mb-1">Verdict</p>
              <p className={`font-bold ${
                result.verdict === 'ai' ? 'text-red-400' :
                result.verdict === 'human' ? 'text-green-400' :
                'text-yellow-400'
              }`}>
                {result.verdict.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-white text-opacity-70 text-sm mb-1">AI Probability</p>
              <p className="text-white font-bold">{Math.round(result.aiProbability * 100)}%</p>
            </div>
          </div>

          <div>
            <p className="text-white text-opacity-70 text-sm mb-2">Detection Indicators</p>
            <div className="space-y-2">
              {Object.entries(result.indicators).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <p className="text-white text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-white bg-opacity-10 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${(value as number) * 100}%` }}
                      />
                    </div>
                    <span className="text-white text-xs w-8">
                      {Math.round((value as number) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">Analysis History</h1>
          <p className="text-white text-opacity-70 text-lg">
            View and manage your AI detection analysis history
          </p>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white text-opacity-50" />
              <input
                type="text"
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search analyses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-white text-opacity-70" />
                <select
                  value={filterVerdict}
                  onChange={(e) => setFilterVerdict(e.target.value as any)}
                  className="bg-white bg-opacity-10 text-white rounded px-3 py-2 text-sm border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Results</option>
                  <option value="ai">AI Detected</option>
                  <option value="human">Human Content</option>
                  <option value="uncertain">Uncertain</option>
                </select>
              </div>

              <button
                onClick={exportHistory}
                className="flex items-center px-4 py-2 bg-blue-500 rounded-lg text-white font-medium hover:bg-blue-600 transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>

              <button
                onClick={clearResults}
                className="flex items-center px-4 py-2 bg-red-500 rounded-lg text-white font-medium hover:bg-red-600 transition-all"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="glass-effect rounded-xl p-4 text-center">
            <p className="text-white text-2xl font-bold">{filteredResults.length}</p>
            <p className="text-white text-opacity-70 text-sm">Total Results</p>
          </div>
          <div className="glass-effect rounded-xl p-4 text-center">
            <p className="text-red-400 text-2xl font-bold">
              {filteredResults.filter(r => r.verdict === 'ai').length}
            </p>
            <p className="text-white text-opacity-70 text-sm">AI Detected</p>
          </div>
          <div className="glass-effect rounded-xl p-4 text-center">
            <p className="text-green-400 text-2xl font-bold">
              {filteredResults.filter(r => r.verdict === 'human').length}
            </p>
            <p className="text-white text-opacity-70 text-sm">Human Content</p>
          </div>
          <div className="glass-effect rounded-xl p-4 text-center">
            <p className="text-yellow-400 text-2xl font-bold">
              {filteredResults.filter(r => r.verdict === 'uncertain').length}
            </p>
            <p className="text-white text-opacity-70 text-sm">Uncertain</p>
          </div>
        </motion.div>

        {/* Results List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <h2 className="text-white text-xl font-semibold mb-4">Analysis Results</h2>
          
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-white text-opacity-30 mx-auto mb-4" />
              <p className="text-white text-opacity-70">
                {results.length === 0 ? 'No analyses yet' : 'No results match your filters'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all cursor-pointer"
                  onClick={() => setSelectedResult(result)}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        result.verdict === 'ai' ? 'bg-red-500' :
                        result.verdict === 'human' ? 'bg-green-500' :
                        'bg-yellow-500'
                      }`} />
                      <p className="text-white font-medium">
                        {result.platform || 'Manual Analysis'}
                      </p>
                      <div className="flex items-center text-white text-opacity-50 text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {result.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="text-white text-opacity-70 text-sm mb-2 line-clamp-2">
                      {result.text.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="text-white text-opacity-50">
                        AI Probability: {Math.round(result.aiProbability * 100)}%
                      </span>
                      <span className="text-white text-opacity-50">
                        Confidence: {Math.round(result.confidence * 100)}%
                      </span>
                      <span className="text-white text-opacity-50">
                        Source: {result.source}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      result.verdict === 'ai' ? 'bg-red-500 bg-opacity-20 text-red-300' :
                      result.verdict === 'human' ? 'bg-green-500 bg-opacity-20 text-green-300' :
                      'bg-yellow-500 bg-opacity-20 text-yellow-300'
                    }`}>
                      {result.verdict.toUpperCase()}
                    </div>
                    
                    <button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        setSelectedResult(result)
                      }}
                      className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Result Detail Modal */}
        <AnimatePresence>
          {selectedResult && (
            <ResultModal
              result={selectedResult}
              onClose={() => setSelectedResult(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default HistoryView
