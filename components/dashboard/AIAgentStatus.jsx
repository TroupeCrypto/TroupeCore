'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Activity, 
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  BarChart3,
  FileText,
  Shield
} from 'lucide-react'
import { useDashboardStore } from '@/lib/stores/dashboardStore'

const agentTypes = {
  analytics: { icon: BarChart3, color: 'blue' },
  reporting: { icon: FileText, color: 'green' },
  monitoring: { icon: Shield, color: 'purple' },
  processing: { icon: Cpu, color: 'orange' }
}

const statusColors = {
  active: 'text-green-400',
  idle: 'text-yellow-400',
  error: 'text-red-400',
  stopped: 'text-gray-400'
}

const statusBgColors = {
  active: 'bg-green-500/20 border-green-500/30',
  idle: 'bg-yellow-500/20 border-yellow-500/30',
  error: 'bg-red-500/20 border-red-500/30',
  stopped: 'bg-gray-500/20 border-gray-500/30'
}

export default function AIAgentStatus() {
  const { agents, updateAgent, addAgent, removeAgent } = useDashboardStore()
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [showAddAgent, setShowAddAgent] = useState(false)

  const handleAgentAction = (agentId, action) => {
    const agent = agents.find(a => a.id === agentId)
    if (!agent) return

    switch (action) {
      case 'start':
        updateAgent(agentId, { status: 'active', lastActive: new Date().toISOString() })
        break
      case 'pause':
        updateAgent(agentId, { status: 'idle' })
        break
      case 'stop':
        updateAgent(agentId, { status: 'stopped' })
        break
      default:
        break
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'idle':
        return <Clock className="h-4 w-4 text-yellow-400" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      default:
        return <Square className="h-4 w-4 text-gray-400" />
    }
  }

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return 'text-green-400'
    if (performance >= 70) return 'text-yellow-400'
    return 'text-red-400'
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
            <Bot className="h-5 w-5 mr-2 text-blue-400" />
            AI Agent Roster
          </h3>
          <p className="text-sm text-gray-400">Manage and monitor AI agents</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>{agents.filter(a => a.status === 'active').length} Active</span>
          </div>
          <button
            onClick={() => setShowAddAgent(true)}
            className="btn-primary text-sm"
          >
            Add Agent
          </button>
        </div>
      </div>

      {/* Agent List */}
      <div className="space-y-3">
        {agents.map((agent, index) => {
          const agentType = agentTypes[agent.type] || agentTypes.analytics
          const AgentIcon = agentType.icon

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${statusBgColors[agent.status]} hover:bg-opacity-80 transition-all cursor-pointer`}
              onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${agentType.color}-500/20`}>
                    <AgentIcon className={`h-5 w-5 text-${agentType.color}-400`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{agent.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(agent.status)}
                      <span className={`text-xs capitalize ${statusColors[agent.status]}`}>
                        {agent.status}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{agent.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Activity className="h-3 w-3 text-gray-400" />
                      <span className={`text-sm font-medium ${getPerformanceColor(agent.performance)}`}>
                        {agent.performance}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{agent.lastActive}</p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAgentAction(agent.id, agent.status === 'active' ? 'pause' : 'start')
                      }}
                      className="p-1 text-gray-400 hover:text-white rounded"
                      title={agent.status === 'active' ? 'Pause' : 'Start'}
                    >
                      {agent.status === 'active' ? 
                        <Pause className="h-4 w-4" /> : 
                        <Play className="h-4 w-4" />
                      }
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAgentAction(agent.id, 'stop')
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 rounded"
                      title="Stop"
                    >
                      <Square className="h-4 w-4" />
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
              {selectedAgent === agent.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-600"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-xs font-medium text-gray-400 mb-2">Performance Metrics</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Success Rate:</span>
                          <span className="text-xs text-white">{agent.performance}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Tasks Completed:</span>
                          <span className="text-xs text-white">1,247</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Avg Response Time:</span>
                          <span className="text-xs text-white">0.8s</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-gray-400 mb-2">Configuration</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Version:</span>
                          <span className="text-xs text-white">v2.1.3</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Memory Usage:</span>
                          <span className="text-xs text-white">245 MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">CPU Usage:</span>
                          <span className="text-xs text-white">12%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Add Agent Modal */}
      {showAddAgent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAddAgent(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Add New AI Agent</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Agent Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter agent name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Agent Type</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="analytics">Analytics</option>
                  <option value="reporting">Reporting</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="processing">Processing</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddAgent(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Add agent logic here
                    setShowAddAgent(false)
                  }}
                  className="btn-primary"
                >
                  Add Agent
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Total Agents: {agents.length}</span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Active: {agents.filter(a => a.status === 'active').length}</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Idle: {agents.filter(a => a.status === 'idle').length}</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}