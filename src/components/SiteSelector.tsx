import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  Globe, 
  Image, 
  Video, 
  Music, 
  FileText, 
  ShoppingBag,
  Newspaper,
  BookOpen,
  Gamepad2,
  MessageSquare,
  Search,
  ExternalLink,
  AlertTriangle
} from 'lucide-react'

interface Site {
  name: string
  url: string
  category: string
  icon: React.ComponentType<any>
  description: string
  aiUseCase: string
  embedSupport: 'full' | 'limited' | 'blocked'
  alternativeUrl?: string
}

interface SiteSelectorProps {
  currentUrl: string
  setCurrentUrl: (url: string) => void
  onSiteSelect: (site: Site) => void
}

const sites: Site[] = [
  // News & Media (AI-generated articles, images)
  {
    name: 'BBC News',
    url: 'https://www.bbc.com/news',
    category: 'News & Media',
    icon: Newspaper,
    description: 'Global news coverage',
    aiUseCase: 'AI-generated articles, automated summaries, synthetic images',
    embedSupport: 'limited',
    alternativeUrl: 'https://lite.cnn.com'
  },
  {
    name: 'Reuters',
    url: 'https://www.reuters.com',
    category: 'News & Media',
    icon: Newspaper,
    description: 'International news agency',
    aiUseCase: 'AI-written news, automated reporting, generated images',
    embedSupport: 'limited'
  },
  
  // Content Platforms (High AI content risk)
  {
    name: 'Medium',
    url: 'https://medium.com',
    category: 'Content Platforms',
    icon: FileText,
    description: 'Publishing platform',
    aiUseCase: 'AI-generated articles, automated content, synthetic writing',
    embedSupport: 'full'
  },
  {
    name: 'Dev.to',
    url: 'https://dev.to',
    category: 'Content Platforms',
    icon: FileText,
    description: 'Developer community',
    aiUseCase: 'AI-generated code tutorials, automated documentation',
    embedSupport: 'full'
  },
  
  // Image & Art Platforms
  {
    name: 'Unsplash',
    url: 'https://unsplash.com',
    category: 'Images & Art',
    icon: Image,
    description: 'Stock photography',
    aiUseCase: 'AI-generated images, synthetic photography, deepfakes',
    embedSupport: 'full'
  },
  {
    name: 'Pexels',
    url: 'https://www.pexels.com',
    category: 'Images & Art',
    icon: Image,
    description: 'Free stock photos',
    aiUseCase: 'AI-generated stock images, synthetic content',
    embedSupport: 'full'
  },
  {
    name: 'DeviantArt',
    url: 'https://www.deviantart.com',
    category: 'Images & Art',
    icon: Image,
    description: 'Art community',
    aiUseCase: 'AI-generated artwork, synthetic art, digital creations',
    embedSupport: 'limited'
  },
  
  // E-commerce (AI product descriptions, reviews)
  {
    name: 'Product Hunt',
    url: 'https://www.producthunt.com',
    category: 'E-commerce',
    icon: ShoppingBag,
    description: 'Product discovery',
    aiUseCase: 'AI-generated product descriptions, automated reviews',
    embedSupport: 'full'
  },
  
  // Educational Content
  {
    name: 'Khan Academy',
    url: 'https://www.khanacademy.org',
    category: 'Education',
    icon: BookOpen,
    description: 'Online learning',
    aiUseCase: 'AI-generated educational content, automated explanations',
    embedSupport: 'full'
  },
  {
    name: 'Coursera',
    url: 'https://www.coursera.org',
    category: 'Education',
    icon: BookOpen,
    description: 'Online courses',
    aiUseCase: 'AI-generated course content, automated assessments',
    embedSupport: 'limited'
  },
  
  // Forums & Communities
  {
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    category: 'Forums',
    icon: MessageSquare,
    description: 'Developer Q&A',
    aiUseCase: 'AI-generated answers, automated code solutions',
    embedSupport: 'full'
  },
  {
    name: 'Quora',
    url: 'https://www.quora.com',
    category: 'Forums',
    icon: MessageSquare,
    description: 'Q&A platform',
    aiUseCase: 'AI-generated answers, synthetic responses',
    embedSupport: 'limited'
  },
  
  // Alternative Video Platforms (since YouTube blocks)
  {
    name: 'Vimeo',
    url: 'https://vimeo.com',
    category: 'Video Platforms',
    icon: Video,
    description: 'Video hosting platform',
    aiUseCase: 'AI-generated videos, synthetic content, deepfakes',
    embedSupport: 'full'
  },
  {
    name: 'Dailymotion',
    url: 'https://www.dailymotion.com',
    category: 'Video Platforms',
    icon: Video,
    description: 'Video sharing',
    aiUseCase: 'AI-generated video content, automated editing',
    embedSupport: 'limited'
  },
  
  // Music & Audio
  {
    name: 'SoundCloud',
    url: 'https://soundcloud.com',
    category: 'Music & Audio',
    icon: Music,
    description: 'Audio platform',
    aiUseCase: 'AI-generated music, synthetic audio, voice cloning',
    embedSupport: 'limited'
  },
  
  // Search Engines (AI-powered results)
  {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com',
    category: 'Search Engines',
    icon: Search,
    description: 'Privacy-focused search',
    aiUseCase: 'AI-powered search results, automated summaries',
    embedSupport: 'full'
  },
  {
    name: 'Bing',
    url: 'https://www.bing.com',
    category: 'Search Engines',
    icon: Search,
    description: 'Microsoft search engine',
    aiUseCase: 'AI-powered search, ChatGPT integration, generated results',
    embedSupport: 'full'
  },
  
  // Blocked Sites (with alternatives)
  {
    name: 'YouTube (Blocked)',
    url: 'https://www.youtube.com',
    category: 'Video Platforms',
    icon: Video,
    description: 'Video sharing platform',
    aiUseCase: 'AI-generated videos, synthetic thumbnails, deepfakes',
    embedSupport: 'blocked',
    alternativeUrl: 'https://invidious.io'
  },
  {
    name: 'Twitter/X (Blocked)',
    url: 'https://twitter.com',
    category: 'Social Media',
    icon: MessageSquare,
    description: 'Social media platform',
    aiUseCase: 'AI-generated posts, bot accounts, synthetic content',
    embedSupport: 'blocked',
    alternativeUrl: 'https://nitter.net'
  }
]

export default function SiteSelector({ currentUrl, setCurrentUrl, onSiteSelect }: SiteSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['All', ...Array.from(new Set(sites.map(site => site.category)))]
  
  const filteredSites = sites.filter(site => {
    const matchesCategory = selectedCategory === 'All' || site.category === selectedCategory
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.aiUseCase.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSiteSelect = (site: Site) => {
    if (site.embedSupport === 'blocked' && site.alternativeUrl) {
      setCurrentUrl(site.alternativeUrl)
    } else {
      setCurrentUrl(site.url)
    }
    onSiteSelect(site)
    setIsOpen(false)
  }

  const getEmbedStatusColor = (status: string) => {
    switch (status) {
      case 'full': return 'text-green-400'
      case 'limited': return 'text-yellow-400'
      case 'blocked': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const getEmbedStatusText = (status: string) => {
    switch (status) {
      case 'full': return 'Full Support'
      case 'limited': return 'Limited Support'
      case 'blocked': return 'Blocked (Alternative Available)'
      default: return 'Unknown'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-slate-800/60 border border-slate-600/50 rounded-xl text-white hover:bg-slate-700/60 transition-all"
      >
        <Globe className="w-5 h-5 text-cyan-400" />
        <span className="font-medium">Select Site</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden"
          >
            {/* Search and Filter */}
            <div className="p-4 border-b border-slate-700/50">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search sites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/60 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sites List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredSites.map((site, index) => {
                const Icon = site.icon
                return (
                  <motion.button
                    key={site.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSiteSelect(site)}
                    className="w-full p-4 text-left hover:bg-slate-800/60 transition-all border-b border-slate-700/30 last:border-b-0"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-slate-800/60 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-medium text-sm truncate">{site.name}</h4>
                          <div className="flex items-center space-x-1">
                            {site.embedSupport === 'blocked' && (
                              <AlertTriangle className="w-3 h-3 text-red-400" />
                            )}
                            {site.alternativeUrl && (
                              <ExternalLink className="w-3 h-3 text-blue-400" />
                            )}
                          </div>
                        </div>
                        <p className="text-slate-400 text-xs mb-2">{site.description}</p>
                        <p className="text-slate-500 text-xs mb-2 line-clamp-2">{site.aiUseCase}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">{site.category}</span>
                          <span className={`text-xs font-medium ${getEmbedStatusColor(site.embedSupport)}`}>
                            {getEmbedStatusText(site.embedSupport)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {filteredSites.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-slate-400">No sites found matching your criteria</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
