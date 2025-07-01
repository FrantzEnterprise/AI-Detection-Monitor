import { DetectionResult } from '../store/detectionStore'

// Simulated AI detection algorithm
export const analyzeText = (text: string): DetectionResult => {
  // Simulate various detection indicators
  const indicators = {
    repetitivePatterns: calculateRepetitivePatterns(text),
    vocabularyComplexity: calculateVocabularyComplexity(text),
    sentenceStructure: calculateSentenceStructure(text),
    contextualCoherence: calculateContextualCoherence(text),
    humanLikeErrors: calculateHumanLikeErrors(text),
  }

  // Calculate overall AI probability based on indicators
  const aiProbability = calculateAIProbability(indicators)
  
  // Determine confidence based on indicator consistency
  const confidence = calculateConfidence(indicators)
  
  // Determine verdict
  let verdict: 'human' | 'ai' | 'uncertain'
  if (confidence > 0.8) {
    verdict = aiProbability > 0.6 ? 'ai' : 'human'
  } else {
    verdict = 'uncertain'
  }

  return {
    id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text,
    aiProbability,
    confidence,
    timestamp: new Date(),
    source: 'manual',
    indicators,
    verdict,
  }
}

const calculateRepetitivePatterns = (text: string): number => {
  const words = text.toLowerCase().split(/\s+/)
  const wordFreq: { [key: string]: number } = {}
  
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })
  
  const repetitions = Object.values(wordFreq).filter(freq => freq > 2).length
  return Math.min(repetitions / words.length * 5, 1)
}

const calculateVocabularyComplexity = (text: string): number => {
  const words = text.toLowerCase().split(/\s+/)
  const uniqueWords = new Set(words)
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length
  
  // AI tends to use more complex vocabulary consistently
  const complexityScore = (uniqueWords.size / words.length) * (avgWordLength / 10)
  return Math.min(complexityScore, 1)
}

const calculateSentenceStructure = (text: string): number => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const avgSentenceLength = sentences.reduce((sum, sentence) => 
    sum + sentence.trim().split(/\s+/).length, 0) / sentences.length
  
  // AI tends to have more uniform sentence structures
  const lengthVariance = calculateVariance(sentences.map(s => s.trim().split(/\s+/).length))
  const structureScore = avgSentenceLength > 15 && lengthVariance < 20 ? 0.8 : 0.3
  
  return Math.min(structureScore, 1)
}

const calculateContextualCoherence = (text: string): number => {
  // Simplified coherence check based on transition words and topic consistency
  const transitionWords = ['however', 'therefore', 'furthermore', 'moreover', 'consequently', 'additionally']
  const transitionCount = transitionWords.reduce((count, word) => 
    count + (text.toLowerCase().includes(word) ? 1 : 0), 0)
  
  // AI often uses more formal transitions
  return Math.min(transitionCount / 100 * text.length, 1)
}

const calculateHumanLikeErrors = (text: string): number => {
  // Look for common human errors: typos, informal language, contractions
  const contractions = ["don't", "won't", "can't", "isn't", "aren't", "wasn't", "weren't"]
  const informalWords = ["yeah", "ok", "gonna", "wanna", "kinda", "sorta"]
  
  const contractionCount = contractions.reduce((count, contraction) => 
    count + (text.toLowerCase().includes(contraction) ? 1 : 0), 0)
  const informalCount = informalWords.reduce((count, word) => 
    count + (text.toLowerCase().includes(word) ? 1 : 0), 0)
  
  // More human-like errors indicate human writing
  return Math.min((contractionCount + informalCount) / text.split(/\s+/).length * 10, 1)
}

const calculateAIProbability = (indicators: any): number => {
  const {
    repetitivePatterns,
    vocabularyComplexity,
    sentenceStructure,
    contextualCoherence,
    humanLikeErrors
  } = indicators

  // Weighted calculation - higher values for AI indicators
  const aiScore = (
    repetitivePatterns * 0.25 +
    vocabularyComplexity * 0.2 +
    sentenceStructure * 0.25 +
    contextualCoherence * 0.15 +
    (1 - humanLikeErrors) * 0.15  // Inverse because fewer errors suggest AI
  )

  return Math.min(Math.max(aiScore, 0), 1)
}

const calculateConfidence = (indicators: any): number => {
  const values = Object.values(indicators) as number[]
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const variance = calculateVariance(values)
  
  // Higher confidence when indicators are consistent (low variance)
  const confidenceScore = 1 - (variance / mean)
  return Math.min(Math.max(confidenceScore, 0.3), 1)
}

const calculateVariance = (numbers: number[]): number => {
  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length
  const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2))
  return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length
}
