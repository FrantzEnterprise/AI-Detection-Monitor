import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDetectionStore } from '../store/detectionStore'

const Dashboard: React.FC = () => {
  const { stats, results } = useDetectionStore()

  const chartData = [
    { name: 'Human', value: stats.humanDetected, color: '#22c55e' },
    { name: 'AI', value: stats.aiDetected, color: '#ef4444' },
    { name: 'Uncertain', value: stats.uncertainDetected, color: '#f59e0b' },
  ]

  const weeklyData = [
    { day: 'Mon', analyses: 45, aiDetected: 12 },
    { day: 'Tue', analyses: 52, aiDetected: 18 },
    { day: 'Wed', analyses: 38, aiDetected: 8 },
    { day: 'Thu', analyses: 61, aiDetected: 22 },
    { day: 'Fri', analyses: 55, aiDetected: 15 },
    { day: 'Sat', analyses: 28, aiDetected: 6 },
    { day: 'Sun', analyses: 33, aiDetected: 9 },
  ]

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-6 card-hover"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-500 bg-opacity-20`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        {trend && (
          <div className="flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <p className="text-white text-2xl font-bold mb-1">{value}</p>
      <p className="text-white text-opacity-70 text-sm">{title}</p>
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
          <h1 className="text-white text-3xl font-bold mb-2">Detection Dashboard</h1>
          <p className="text-white text-opacity-70 text-lg">
            Real-time insights into AI content detection
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Analyzed"
            value={stats.totalAnalyzed.toLocaleString()}
            icon={Activity}
            color="blue"
            trend="+12%"
          />
          <StatCard
            title="AI Detected"
            value={stats.aiDetected.toLocaleString()}
            icon={AlertTriangle}
            color="red"
            trend="+8%"
          />
          <StatCard
            title="Human Content"
            value={stats.humanDetected.toLocaleString()}
            icon={CheckCircle}
            color="green"
            trend="+15%"
          />
          <StatCard
            title="Accuracy Rate"
            value="94.2%"
            icon={Shield}
            color="purple"
            trend="+2%"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detection Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-white text-xl font-semibold mb-4">Detection Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-white text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Analysis Trend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-white text-xl font-semibold mb-4">Weekly Analysis Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="analyses" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="aiDetected" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Detections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <h2 className="text-white text-xl font-semibold mb-4">Recent Detections</h2>
          <div className="space-y-3">
            {results.slice(0, 5).map((result) => (
              <div key={result.id} className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg">
                <div className="flex-1">
                  <p className="text-white font-medium truncate max-w-md">
                    {result.text.substring(0, 80)}...
                  </p>
                  <p className="text-white text-opacity-50 text-sm mt-1">
                    {result.timestamp.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    result.verdict === 'ai' ? 'bg-red-500 bg-opacity-20 text-red-300' :
                    result.verdict === 'human' ? 'bg-green-500 bg-opacity-20 text-green-300' :
                    'bg-yellow-500 bg-opacity-20 text-yellow-300'
                  }`}>
                    {result.verdict.toUpperCase()}
                  </div>
                  <p className="text-white text-sm font-medium">
                    {Math.round(result.aiProbability * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard
