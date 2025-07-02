import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Scan, Sparkles, ArrowRight, Shield, Zap, Target } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = await login(email, password)
      if (!success) {
        setError('Invalid credentials')
      }
    } catch (err) {
      setError('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-purple-950/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-600/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-600/10 to-transparent" />
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-3/5 flex-col justify-center px-16 xl:px-24 2xl:px-32">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {/* Logo Section */}
            <div className="flex items-center mb-12">
              <div className="relative">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Scan className="w-10 h-10 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
              </div>
              <div className="ml-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                  AI Detector Pro
                </h1>
                <p className="text-blue-300/80 text-lg font-medium">Advanced Content Analysis</p>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-8 mb-16">
              <motion.h2 
                className="text-6xl xl:text-7xl font-bold text-white leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                Detect AI-Generated
                <motion.span 
                  className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  Content Instantly
                </motion.span>
              </motion.h2>
              
              <motion.p 
                className="text-slate-300 text-xl leading-relaxed max-w-lg font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                Analyze text, images, audio, and video with our cutting-edge AI detection algorithms. 
                Get instant, accurate results with detailed confidence scores and comprehensive analysis.
              </motion.p>
            </div>

            {/* Feature Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group">
                <div className="flex items-center mb-3">
                  <Shield className="w-6 h-6 text-blue-400 mr-2" />
                  <div className="text-3xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">99.2%</div>
                </div>
                <div className="text-slate-400 text-sm font-medium">Accuracy Rate</div>
              </div>
              
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 group">
                <div className="flex items-center mb-3">
                  <Zap className="w-6 h-6 text-cyan-400 mr-2" />
                  <div className="text-3xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">2s</div>
                </div>
                <div className="text-slate-400 text-sm font-medium">Analysis Time</div>
              </div>
              
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 group">
                <div className="flex items-center mb-3">
                  <Target className="w-6 h-6 text-purple-400 mr-2" />
                  <div className="text-3xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors">5M+</div>
                </div>
                <div className="text-slate-400 text-sm font-medium">Files Analyzed</div>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex items-center space-x-8 text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">Enterprise Ready</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">99.9% Uptime</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-2/5 flex items-center justify-center px-8 py-12 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-12">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-3xl mb-6 shadow-2xl"
                whileHover={{ scale: 1.05 }}
              >
                <Scan className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">AI Detector Pro</h1>
              <p className="text-slate-400 text-lg">Advanced Content Analysis</p>
            </div>

            {/* Login Card */}
            <motion.div 
              className="bg-slate-900/50 backdrop-blur-2xl rounded-3xl p-10 border border-slate-700/50 shadow-2xl relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <motion.h2 
                    className="text-3xl font-bold text-white mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Welcome Back
                  </motion.h2>
                  <motion.p 
                    className="text-slate-400 text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    Sign in to access your AI detection dashboard
                  </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-800/60 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-300 text-lg backdrop-blur-sm hover:bg-slate-800/80"
                      placeholder="Enter your email"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-800/60 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-300 text-lg backdrop-blur-sm hover:bg-slate-800/80 pr-14"
                        placeholder="Enter your password"
                        required
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </motion.button>
                    </div>
                  </motion.div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-2xl p-4 backdrop-blur-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group shadow-xl relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    {/* Button Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    
                    <div className="relative z-10 flex items-center">
                      {isLoading ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                          Signing In...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </form>

                <motion.div 
                  className="mt-10 pt-8 border-t border-slate-700/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
                    <p className="text-blue-300 text-sm font-semibold mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Demo Access Available
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Use any email and password combination to explore the full platform capabilities
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
