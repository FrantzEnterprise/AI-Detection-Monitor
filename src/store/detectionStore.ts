import { create } from 'zustand'

export interface DetectionResult {
  id: string
  text: string
  aiProbability: number
  confidence: number
  timestamp: Date
  source: 'manual' | 'batch' | 'api'
  platform?: string
  indicators: {
    repetitivePatterns: number
    vocabularyComplexity: number
    sentenceStructure: number
    contextualCoherence: number
    humanLikeErrors: number
  }
  verdict: 'human' | 'ai' | 'uncertain'
}

interface DetectionStore {
  results: DetectionResult[]
  isAnalyzing: boolean
  stats: {
    totalAnalyzed: number
    aiDetected: number
    humanDetected: number
    uncertainDetected: number
  }
  addResult: (result: DetectionResult) => void
  setAnalyzing: (analyzing: boolean) => void
  clearResults: () => void
  getResultById: (id: string) => DetectionResult | undefined
}

export const useDetectionStore = create<DetectionStore>((set, get) => ({
  results: [],
  isAnalyzing: false,
  stats: {
    totalAnalyzed: 0,
    aiDetected: 0,
    humanDetected: 0,
    uncertainDetected: 0,
  },
  
  addResult: (result) => set((state) => {
    const newResults = [result, ...state.results]
    const newStats = {
      totalAnalyzed: newResults.length,
      aiDetected: newResults.filter(r => r.verdict === 'ai').length,
      humanDetected: newResults.filter(r => r.verdict === 'human').length,
      uncertainDetected: newResults.filter(r => r.verdict === 'uncertain').length,
    }
    
    return {
      results: newResults,
      stats: newStats,
    }
  }),
  
  setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  
  clearResults: () => set({
    results: [],
    stats: {
      totalAnalyzed: 0,
      aiDetected: 0,
      humanDetected: 0,
      uncertainDetected: 0,
    },
  }),
  
  getResultById: (id) => get().results.find(result => result.id === id),
}))
