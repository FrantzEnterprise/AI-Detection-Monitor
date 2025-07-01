import React, { useState } from 'react'
import { Upload, FileText, CheckCircle, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { analyzeText } from '../utils/aiDetection'
import { useDetectionStore } from '../store/detectionStore'

const BatchAnalyzer: React.FC = () => {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [progress, setProgress] = useState(0)
  const { addResult } = useDetectionStore()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    setFiles(selectedFiles)
    setResults([])
    setProgress(0)
  }

  const processFiles = async () => {
    if (files.length === 0) return

    setIsProcessing(true)
    const newResults: any[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        const text = await file.text()
        const result = analyzeText(text)
        result.source = 'batch'
        result.platform = file.name
        
        newResults.push(result)
        addResult(result)
        
        setProgress(((i + 1) / files.length) * 100)
        setResults([...newResults])
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
      }
    }

    setIsProcessing(false)
  }

  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `ai-detection-results-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const clearFiles = () => {
    setFiles([])
    setResults([])
    setProgress(0)
  }

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">Batch Analyzer</h1>
          <p className="text-white text-opacity-70 text-lg">
            Process multiple text files simultaneously for AI content detection
          </p>
        </div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center mb-4">
            <Upload className="w-5 h-5 text-white mr-2" />
            <h2 className="text-white text-lg font-semibold">File Upload</h2>
          </div>

          <div className="border-2 border-dashed border-white border-opacity-30 rounded-lg p-8 text-center mb-4">
            <input
              type="file"
              multiple
              accept=".txt,.md,.json"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <div className="bg-white bg-opacity-10 p-4 rounded-full mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-lg font-medium mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-white text-opacity-70 text-sm">
                  Supports .txt, .md, .json files
                </p>
              </div>
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <p className="text-white font-medium">{files.length} files selected:</p>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg">
                    <div>
                      <p className="text-white text-sm font-medium">{file.name}</p>
                      <p className="text-white text-opacity-70 text-xs">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <FileText className="w-4 h-4 text-white text-opacity-70" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3 mt-4">
            <button
              onClick={processFiles}
              disabled={files.length === 0 || isProcessing}
              className={`flex items-center flex-1 justify-center px-5 py-3 bg-green-500 rounded-lg text-white font-medium transition-all ${
                files.length > 0 && !isProcessing ? 'hover:bg-green-600' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {isProcessing ? 'Processing...' : 'Process Files'}
            </button>

            {files.length > 0 && (
              <button
                onClick={clearFiles}
                className="px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-20 transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>

        {/* Progress Section */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-effect rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-lg font-semibold">Processing Files</h2>
                <p className="text-white text-opacity-70">{Math.round(progress)}%</p>
              </div>
              
              <div className="w-full bg-white bg-opacity-10 rounded-full h-3 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                />
              </div>
              
              <p className="text-white text-opacity-70 text-sm">
                Processing {results.length + 1} of {files.length} files...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-xl font-semibold">Batch Results</h2>
                  <button
                    onClick={exportResults}
                    className="flex items-center px-4 py-2 bg-blue-500 rounded-lg text-white font-medium hover:bg-blue-600 transition-all"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-white bg-opacity-5 rounded-lg">
                    <p className="text-white text-2xl font-bold">{results.length}</p>
                    <p className="text-white text-opacity-70 text-sm">Total Processed</p>
                  </div>
                  <div className="text-center p-4 bg-white bg-opacity-5 rounded-lg">
                    <p className="text-red-400 text-2xl font-bold">
                      {results.filter(r => r.verdict === 'ai').length}
                    </p>
                    <p className="text-white text-opacity-70 text-sm">AI Detected</p>
                  </div>
                  <div className="text-center p-4 bg-white bg-opacity-5 rounded-lg">
                    <p className="text-green-400 text-2xl font-bold">
                      {results.filter(r => r.verdict === 'human').length}
                    </p>
                    <p className="text-white text-opacity-70 text-sm">Human Content</p>
                  </div>
                  <div className="text-center p-4 bg-white bg-opacity-5 rounded-lg">
                    <p className="text-yellow-400 text-2xl font-bold">
                      {results.filter(r => r.verdict === 'uncertain').length}
                    </p>
                    <p className="text-white text-opacity-70 text-sm">Uncertain</p>
                  </div>
                </div>

                {/* Individual Results */}
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium">{result.platform}</p>
                        <p className="text-white text-opacity-70 text-sm">
                          {result.text.substring(0, 100)}...
                        </p>
                        <p className="text-white text-opacity-50 text-xs mt-1">
                          {result.timestamp.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-white text-sm font-medium">
                            {Math.round(result.aiProbability * 100)}%
                          </p>
                          <p className="text-white text-opacity-70 text-xs">AI Prob.</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-white text-sm font-medium">
                            {Math.round(result.confidence * 100)}%
                          </p>
                          <p className="text-white text-opacity-70 text-xs">Confidence</p>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          result.verdict === 'ai' ? 'bg-red-500 bg-opacity-20 text-red-300' :
                          result.verdict === 'human' ? 'bg-green-500 bg-opacity-20 text-green-300' :
                          'bg-yellow-500 bg-opacity-20 text-yellow-300'
                        }`}>
                          {result.verdict.toUpperCase()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {files.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-xl p-6 border border-blue-500 border-opacity-50"
          >
            <h3 className="text-white text-lg font-semibold mb-3">How to Use Batch Analyzer</h3>
            <div className="space-y-2 text-white text-opacity-70 text-sm">
              <p>1. Select multiple text files (.txt, .md, .json) using the file picker</p>
              <p>2. Click "Process Files" to analyze all files simultaneously</p>
              <p>3. Monitor progress and view real-time results as files are processed</p>
              <p>4. Export results as JSON for further analysis or reporting</p>
              <p>5. All results are automatically saved to your analysis history</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default BatchAnalyzer
