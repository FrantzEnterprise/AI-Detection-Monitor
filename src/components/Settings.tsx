import React, { useState } from 'react'
import { Settings as SettingsIcon, Save, RefreshCw, Shield, Bell, Database, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface SettingsState {
  apiKey: string
  confidenceThreshold: number
  enableAdvancedAnalysis: boolean
  maxFileSize: number
  autoSave: boolean
  exportFormat: string
  enableNotifications: boolean
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    apiKey: '',
    confidenceThreshold: 0.7,
    enableAdvancedAnalysis: true,
    maxFileSize: 10,
    autoSave: true,
    exportFormat: 'json',
    enableNotifications: true,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save delay
    setTimeout(() => {
      setIsSaving(false)
      alert('Settings saved successfully!')
    }, 1000)
  }

  const handleReset = () => {
    setSettings({
      apiKey: '',
      confidenceThreshold: 0.7,
      enableAdvancedAnalysis: true,
      maxFileSize: 10,
      autoSave: true,
      exportFormat: 'json',
      enableNotifications: true,
    })
  }

  const SettingSection = ({ title, icon: Icon, children }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-6"
    >
      <div className="flex items-center mb-4">
        <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg mr-3">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-white text-lg font-semibold">{title}</h2>
      </div>
      {children}
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
          <h1 className="text-white text-3xl font-bold mb-2">Settings</h1>
          <p className="text-white text-opacity-70 text-lg">
            Configure your AI detection preferences and system settings
          </p>
        </div>

        {/* API Configuration */}
        <SettingSection title="API Configuration" icon={Shield}>
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                API Key (Optional)
              </label>
              <input
                type="password"
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your API key for enhanced detection"
                value={settings.apiKey}
                onChange={(value: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({ ...prev, apiKey: value.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Confidence Threshold: {Math.round(settings.confidenceThreshold * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                className="w-full"
                value={settings.confidenceThreshold}
                onChange={(value: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({
                  ...prev,
                  confidenceThreshold: parseFloat(value.target.value)
                }))}
              />
            </div>
          </div>
        </SettingSection>

        {/* Analysis Settings */}
        <SettingSection title="Analysis Settings" icon={Zap}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Advanced Analysis</p>
                <p className="text-white text-opacity-70 text-sm">Enable deep learning models for better accuracy</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.enableAdvancedAnalysis}
                  onChange={(value: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({ ...prev, enableAdvancedAnalysis: value.target.checked }))}
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Max File Size (MB): {settings.maxFileSize}
              </label>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                className="w-full"
                value={settings.maxFileSize}
                onChange={(value: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({
                  ...prev,
                  maxFileSize: parseInt(value.target.value)
                }))}
              />
            </div>
          </div>
        </SettingSection>

        {/* Data Management */}
        <SettingSection title="Data Management" icon={Database}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-save Results</p>
                <p className="text-white text-opacity-70 text-sm">Automatically save analysis results to history</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.autoSave}
                  onChange={(value: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({ ...prev, autoSave: value.target.checked }))}
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Export Format
              </label>
              <select
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.exportFormat}
                onChange={(value: React.ChangeEvent<HTMLSelectElement>) => setSettings(prev => ({
                  ...prev,
                  exportFormat: value.target.value
                }))}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="xml">XML</option>
              </select>
            </div>
          </div>
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="Notifications" icon={Bell}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Enable Notifications</p>
                <p className="text-white text-opacity-70 text-sm">Get notified when AI content is detected</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.enableNotifications}
                  onChange={(value: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({ ...prev, enableNotifications: value.target.checked }))}
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </SettingSection>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex space-x-4"
        >
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center px-6 py-3 bg-green-500 rounded-lg text-white font-medium transition-all ${
              isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
            }`}
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center px-6 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-20 transition-all"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </button>
        </motion.div>

        {/* System Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6 border border-blue-500 border-opacity-50"
        >
          <div className="flex items-center mb-4">
            <SettingsIcon className="w-5 h-5 text-blue-400 mr-2" />
            <h2 className="text-white text-lg font-semibold">System Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white text-opacity-70">Version</p>
              <p className="text-white font-medium">v2.1.0</p>
            </div>
            <div>
              <p className="text-white text-opacity-70">Detection Engine</p>
              <p className="text-white font-medium">Enhanced AI Model</p>
            </div>
            <div>
              <p className="text-white text-opacity-70">Last Updated</p>
              <p className="text-white font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-white text-opacity-70">Status</p>
              <p className="text-green-400 font-medium">All Systems Operational</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Settings
