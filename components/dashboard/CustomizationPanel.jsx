'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  Layout, 
  Palette, 
  Settings, 
  Eye, 
  EyeOff,
  Grid,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Users,
  DollarSign,
  Database,
  Bot,
  Save,
  RotateCcw
} from 'lucide-react'
import { useDashboardStore } from '@/lib/stores/dashboardStore'

const availableWidgets = [
  { id: 'overview', name: 'Overview Cards', icon: Grid, category: 'analytics' },
  { id: 'analytics', name: 'Analytics Chart', icon: LineChart, category: 'analytics' },
  { id: 'performance', name: 'Performance Metrics', icon: Activity, category: 'monitoring' },
  { id: 'users', name: 'User Activity', icon: Users, category: 'analytics' },
  { id: 'revenue', name: 'Revenue Chart', icon: DollarSign, category: 'financial' },
  { id: 'agents', name: 'AI Agents', icon: Bot, category: 'ai' },
  { id: 'datasources', name: 'Data Sources', icon: Database, category: 'integration' },
  { id: 'realtime', name: 'Real-time Feed', icon: Activity, category: 'monitoring' },
  { id: 'heatmap', name: 'User Heatmap', icon: BarChart3, category: 'analytics' },
  { id: 'funnel', name: 'Conversion Funnel', icon: PieChart, category: 'analytics' }
]

const themes = [
  { id: 'dark', name: 'Dark Theme', primary: '#3b82f6', secondary: '#1f2937' },
  { id: 'blue', name: 'Blue Ocean', primary: '#0ea5e9', secondary: '#0f172a' },
  { id: 'purple', name: 'Purple Haze', primary: '#8b5cf6', secondary: '#1e1b4b' },
  { id: 'green', name: 'Forest Green', primary: '#10b981', secondary: '#064e3b' },
  { id: 'orange', name: 'Sunset Orange', primary: '#f59e0b', secondary: '#451a03' }
]

const layoutPresets = [
  { id: 'default', name: 'Default Layout', description: 'Balanced overview with key metrics' },
  { id: 'analytics', name: 'Analytics Focus', description: 'Emphasis on charts and data visualization' },
  { id: 'monitoring', name: 'Monitoring Dashboard', description: 'System health and performance focus' },
  { id: 'executive', name: 'Executive Summary', description: 'High-level KPIs and trends' }
]

export default function CustomizationPanel({ onClose }) {
  const { 
    widgets, 
    updateWidget, 
    addWidget, 
    removeWidget,
    darkMode,
    setDarkMode,
    realTimeEnabled,
    setRealTimeEnabled,
    refreshInterval,
    setRefreshInterval
  } = useDashboardStore()
  
  const [activeTab, setActiveTab] = useState('widgets')
  const [selectedTheme, setSelectedTheme] = useState('dark')
  const [tempSettings, setTempSettings] = useState({
    autoRefresh: realTimeEnabled,
    refreshRate: refreshInterval / 1000,
    animations: true,
    notifications: true
  })

  const handleWidgetToggle = (widgetId) => {
    const widget = widgets.find(w => w.id === widgetId)
    if (widget) {
      updateWidget(widgetId, { visible: !widget.visible })
    } else {
      // Add new widget
      const widgetConfig = availableWidgets.find(w => w.id === widgetId)
      if (widgetConfig) {
        addWidget({
          id: widgetId,
          type: widgetConfig.id,
          position: { x: 0, y: 0, w: 6, h: 4 },
          visible: true
        })
      }
    }
  }

  const handleSaveSettings = () => {
    setRealTimeEnabled(tempSettings.autoRefresh)
    setRefreshInterval(tempSettings.refreshRate * 1000)
    // Save other settings...
    onClose()
  }

  const handleResetToDefault = () => {
    // Reset to default configuration
    setTempSettings({
      autoRefresh: true,
      refreshRate: 30,
      animations: true,
      notifications: true
    })
  }

  const tabs = [
    { id: 'widgets', name: 'Widgets', icon: Grid },
    { id: 'layout', name: 'Layout', icon: Layout },
    { id: 'theme', name: 'Theme', icon: Palette },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Dashboard Customization</h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-700 rounded-lg p-1">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'widgets' && (
          <div>
            <h4 className="text-sm font-medium text-white mb-4">Manage Dashboard Widgets</h4>
            <div className="grid grid-cols-2 gap-3">
              {availableWidgets.map(widget => {
                const Icon = widget.icon
                const isVisible = widgets.find(w => w.id === widget.id)?.visible ?? false
                const exists = widgets.some(w => w.id === widget.id)
                
                return (
                  <div
                    key={widget.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isVisible
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                    }`}
                    onClick={() => handleWidgetToggle(widget.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${isVisible ? 'text-blue-400' : 'text-gray-400'}`} />
                        <div>
                          <p className="text-sm font-medium text-white">{widget.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{widget.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isVisible ? (
                          <Eye className="h-4 w-4 text-blue-400" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div>
            <h4 className="text-sm font-medium text-white mb-4">Layout Presets</h4>
            <div className="space-y-3">
              {layoutPresets.map(preset => (
                <div
                  key={preset.id}
                  className="p-4 border border-gray-600 rounded-lg hover:border-gray-500 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-white">{preset.name}</h5>
                      <p className="text-xs text-gray-400 mt-1">{preset.description}</p>
                    </div>
                    <button className="btn-secondary text-xs">Apply</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h5 className="text-sm font-medium text-white mb-3">Grid Settings</h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Grid Columns</span>
                  <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm">
                    <option value="12">12 Columns</option>
                    <option value="16">16 Columns</option>
                    <option value="24">24 Columns</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Gap Size</span>
                  <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm">
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div>
            <h4 className="text-sm font-medium text-white mb-4">Color Themes</h4>
            <div className="grid grid-cols-1 gap-3 mb-6">
              {themes.map(theme => (
                <div
                  key={theme.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedTheme === theme.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: theme.primary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: theme.secondary }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-white">{theme.name}</span>
                    </div>
                    {selectedTheme === theme.id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-white mb-3">Custom Colors</h5>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Primary Color</label>
                  <input
                    type="color"
                    defaultValue="#3b82f6"
                    className="w-full h-8 rounded border border-gray-600 bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Accent Color</label>
                  <input
                    type="color"
                    defaultValue="#10b981"
                    className="w-full h-8 rounded border border-gray-600 bg-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h4 className="text-sm font-medium text-white mb-4">Dashboard Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Auto Refresh</p>
                  <p className="text-xs text-gray-400">Automatically update dashboard data</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.autoRefresh}
                    onChange={(e) => setTempSettings({ ...tempSettings, autoRefresh: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Refresh Rate</p>
                  <p className="text-xs text-gray-400">How often to update data (seconds)</p>
                </div>
                <select
                  value={tempSettings.refreshRate}
                  onChange={(e) => setTempSettings({ ...tempSettings, refreshRate: parseInt(e.target.value) })}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm"
                >
                  <option value="10">10 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Animations</p>
                  <p className="text-xs text-gray-400">Enable smooth transitions and animations</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.animations}
                    onChange={(e) => setTempSettings({ ...tempSettings, animations: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Notifications</p>
                  <p className="text-xs text-gray-400">Show system alerts and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.notifications}
                    onChange={(e) => setTempSettings({ ...tempSettings, notifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
        <button
          onClick={handleResetToDefault}
          className="flex items-center space-x-2 text-gray-400 hover:text-white text-sm"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset to Default</span>
        </button>
        
        <div className="flex space-x-3">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSaveSettings} className="btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  )
}