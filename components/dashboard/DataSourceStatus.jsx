'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Database, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Settings, 
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Server,
  Cloud,
  HardDrive
} from 'lucide-react'
import { useDashboardStore } from '@/lib/stores/dashboardStore'

const databaseIcons = {
  postgresql: Database,
  mysql: Database,
  mongodb: Server,
  redis: Activity,
  elasticsearch: Cloud,
  sqlite: HardDrive
}

const statusColors = {
  connected: 'text-green-400',
  connecting: 'text-yellow-400',
  disconnected: 'text-red-400',
  error: 'text-red-400'
}

const statusBgColors = {
  connected: 'bg-green-500/20 border-green-500/30',
  connecting: 'bg-yellow-500/20 border-yellow-500/30',
  disconnected: 'bg-red-500/20 border-red-500/30',
  error: 'bg-red-500/20 border-red-500/30'
}

export default function DataSourceStatus() {
  const { dataSources, updateDataSource, addDataSource, removeDataSource } = useDashboardStore()
  const [selectedSource, setSelectedSource] = useState(null)
  const [showAddSource, setShowAddSource] = useState(false)
  const [newSource, setNewSource] = useState({
    name: '',
    type: 'postgresql',
    host: '',
    port: '',
    database: ''
  })

  const handleConnect = (sourceId) => {
    updateDataSource(sourceId, { 
      status: 'connecting',
      lastSync: new Date().toISOString()
    })
    
    // Simulate connection process
    setTimeout(() => {
      updateDataSource(sourceId, { 
        status: 'connected',
        lastSync: new Date().toISOString()
      })
    }, 2000)
  }

  const handleDisconnect = (sourceId) => {
    updateDataSource(sourceId, { status: 'disconnected' })
  }

  const handleAddSource = () => {
    const source = {
      id: `source-${Date.now()}`,
      name: newSource.name,
      type: newSource.type,
      status: 'disconnected',
      lastSync: null,
      config: {
        host: newSource.host,
        port: newSource.port,
        database: newSource.database
      }
    }
    
    addDataSource(source)
    setNewSource({ name: '', type: 'postgresql', host: '', port: '', database: '' })
    setShowAddSource(false)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'connecting':
        return <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin" />
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-red-400" />
      default:
        return <AlertTriangle className="h-4 w-4 text-red-400" />
    }
  }

  const getConnectionStats = (source) => {
    // Mock connection stats
    return {
      latency: Math.floor(Math.random() * 50) + 10,
      queries: Math.floor(Math.random() * 1000) + 100,
      connections: Math.floor(Math.random() * 20) + 5
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="widget-container"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Database className="h-5 w-5 mr-2 text-purple-400" />
            Data Sources
          </h3>
          <p className="text-sm text-gray-400">Database connections and integrations</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>{dataSources.filter(s => s.status === 'connected').length} Connected</span>
          </div>
          <button
            onClick={() => setShowAddSource(true)}
            className="btn-primary text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Source
          </button>
        </div>
      </div>

      {/* Data Sources List */}
      <div className="space-y-3">
        {dataSources.map((source, index) => {
          const DbIcon = databaseIcons[source.type] || Database
          const stats = getConnectionStats(source)

          return (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${statusBgColors[source.status]} hover:bg-opacity-80 transition-all cursor-pointer`}
              onClick={() => setSelectedSource(selectedSource === source.id ? null : source.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <DbIcon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{source.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(source.status)}
                      <span className={`text-xs capitalize ${statusColors[source.status]}`}>
                        {source.status}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400 uppercase">{source.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Activity className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-white">{stats.latency}ms</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {source.lastSync ? `Synced ${source.lastSync}` : 'Never synced'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        source.status === 'connected' 
                          ? handleDisconnect(source.id)
                          : handleConnect(source.id)
                      }}
                      className={`p-1 rounded ${
                        source.status === 'connected' 
                          ? 'text-red-400 hover:text-red-300' 
                          : 'text-green-400 hover:text-green-300'
                      }`}
                      title={source.status === 'connected' ? 'Disconnect' : 'Connect'}
                    >
                      {source.status === 'connected' ? 
                        <WifiOff className="h-4 w-4" /> : 
                        <Wifi className="h-4 w-4" />
                      }
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleConnect(source.id)
                      }}
                      className="p-1 text-gray-400 hover:text-white rounded"
                      title="Refresh"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-gray-400 hover:text-white rounded"
                      title="Settings"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedSource === source.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-600"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-xs font-medium text-gray-400 mb-2">Connection Info</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Host:</span>
                          <span className="text-xs text-white">localhost:5432</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Database:</span>
                          <span className="text-xs text-white">analytics_db</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">SSL:</span>
                          <span className="text-xs text-green-400">Enabled</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-gray-400 mb-2">Performance</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Active Connections:</span>
                          <span className="text-xs text-white">{stats.connections}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Queries/min:</span>
                          <span className="text-xs text-white">{stats.queries}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Pool Size:</span>
                          <span className="text-xs text-white">20</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="btn-secondary text-xs">Test Connection</button>
                    <button className="btn-secondary text-xs">View Schema</button>
                    <button className="btn-secondary text-xs">Query Builder</button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Add Data Source Modal */}
      {showAddSource && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAddSource(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Add Data Source</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Source Name</label>
                <input
                  type="text"
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter source name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Database Type</label>
                <select 
                  value={newSource.type}
                  onChange={(e) => setNewSource({ ...newSource, type: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="mongodb">MongoDB</option>
                  <option value="redis">Redis</option>
                  <option value="elasticsearch">Elasticsearch</option>
                  <option value="sqlite">SQLite</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Host</label>
                  <input
                    type="text"
                    value={newSource.host}
                    onChange={(e) => setNewSource({ ...newSource, host: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="localhost"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Port</label>
                  <input
                    type="text"
                    value={newSource.port}
                    onChange={(e) => setNewSource({ ...newSource, port: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5432"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Database</label>
                <input
                  type="text"
                  value={newSource.database}
                  onChange={(e) => setNewSource({ ...newSource, database: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="database_name"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddSource(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSource}
                  className="btn-primary"
                  disabled={!newSource.name || !newSource.host}
                >
                  Add Source
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Total Sources: {dataSources.length}</span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connected: {dataSources.filter(s => s.status === 'connected').length}</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Offline: {dataSources.filter(s => s.status === 'disconnected').length}</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}