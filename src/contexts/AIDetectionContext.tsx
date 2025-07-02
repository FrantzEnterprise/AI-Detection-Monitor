import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface Detection {
  id: string
  type: 'video' | 'audio' | 'text'
  content: string
  confidence: number
  isAI: boolean
  timestamp: Date
  source?: string
}

interface AIDetectionContextType {
  detections: Detection[]
  stats: {
    totalScanned: number
    aiDetected: number
    accuracy: number
    videoScanned: number
    audioScanned: number
    textScanned: number
  }
  scanContent: (content: { type: 'video' | 'audio' | 'text'; content: string; source?: string }) => void
  isScanning: boolean
  setIsScanning: (scanning: boolean) => void
}

const AIDetectionContext = createContext<AIDetectionContextType | undefined>(undefined)

export function AIDetectionProvider({ children }: { children: React.ReactNode }) {
  const [detections, setDetections] = useState<Detection[]>([])
  const [isScanning, setIsScanning] = useState(true)
  const [stats, setStats] = useState({
    totalScanned: 1247,
    aiDetected: 89,
    accuracy: 94.2,
    videoScanned: 423,
    audioScanned: 356,
    textScanned: 468
  })

  // Simulate continuous scanning
  useEffect(() => {
    if (!isScanning) return

    const interval = setInterval(() => {
      // Simulate random content detection
      const contentTypes: ('video' | 'audio' | 'text')[] = ['video', 'audio', 'text']
      const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)]
      
      const mockContent = {
        video: 'Video frame analysis detected synthetic patterns',
        audio: 'Audio waveform shows AI generation signatures',
        text: 'Text analysis reveals automated writing patterns'
      }

      scanContent({
        type: randomType,
        content: mockContent[randomType],
        source: window.location.hostname || 'demo-site.com'
      })
    }, 5000) // Scan every 5 seconds

    return () => clearInterval(interval)
  }, [isScanning])

  const scanContent = useCallback((content: { type: 'video' | 'audio' | 'text'; content: string; source?: string }) => {
    const confidence = Math.floor(Math.random() * 100)
    const isAI = confidence > 50

    const newDetection: Detection = {
      id: Date.now().toString() + Math.random(),
      type: content.type,
      content: content.content,
      confidence,
      isAI,
      timestamp: new Date(),
      source: content.source
    }

    setDetections(prev => [newDetection, ...prev.slice(0, 49)]) // Keep last 50 detections

    setStats(prev => ({
      ...prev,
      totalScanned: prev.totalScanned + 1,
      aiDetected: prev.aiDetected + (isAI ? 1 : 0),
      [`${content.type}Scanned`]: prev[`${content.type}Scanned` as keyof typeof prev] + 1
    }))
  }, [])

  return (
    <AIDetectionContext.Provider value={{ 
      detections, 
      stats, 
      scanContent, 
      isScanning, 
      setIsScanning 
    }}>
      {children}
    </AIDetectionContext.Provider>
  )
}

export function useAIDetection() {
  const context = useContext(AIDetectionContext)
  if (context === undefined) {
    throw new Error('useAIDetection must be used within an AIDetectionProvider')
  }
  return context
}
