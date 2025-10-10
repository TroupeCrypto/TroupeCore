'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Trash2,
  MoreHorizontal,
  Activity,
  Brain,
  FileText,
  Shield,
  Cpu,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  BarChart3
} from 'lucide-react'
import { useAgentRoster } from '@/lib/hooks/useAIAgents'

const agentTypeIcons = {
  analytics: BarChart3,
  reporting: FileText,
  monitoring: Shield,
  processing: Cpu,
  assistant: Brain
}

const agentTypeColors = {
  analytics: 'blue',
  reporting: 'green',
  monitoring: 'purple',
  processing: 'orange',
  assistant: 'pink'
}

const statusIcons = {
  active: CheckCircle,
  idle: Clock,
  stopped: Square,
  error: AlertTriangle
}

const statusColors = {
  active: 'text-green-400',
  idle: 'text-yellow-400',
  stopped: 'text-gray-400',
  error: 'text-red-400'
}

export default function AgentRoster() {
  const {
    agents,
    isLoading,
    selectedAgents,
    filters,
    sortBy,
    sortOrder,
    selectAgent,
    selectAllAgents,
    bulkAction,
    setFilters,
    setSortBy,
    setSortOrder
  } = useAgentRoster()

  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'

  const filteredAgents = agents?.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleBulkAction = async (action) => {
    await bulkAction(action)
  }

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return 'text-green-400'
    if (performance >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getPerformanceBadge = (performance) => {
    if (performance >= 90) return 'Excellent'
    if (performance >= 70) return 'Good'
    return 'Needs Attention'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Bot className="h-8 w-8 mr-3 text-blue-400" />
            AI Agent Roster
          </h1>
          <p className="text-gray-400 mt-1">
            Manage and monitor your AI agent workforce
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Users className="h-4 w-4" />
            <span>{agents?.length || 0} Total Agents</span>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Agent
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="widget-container">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="idle">Idle</option>
              <option value="stopped">Stopped</option>
              <option value="error">Error</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="analytics">Analytics</option>
              <option value="reporting">Reporting</option>
              <option value="monitoring">Monitoring</option>
              <option value="processing">Processing</option>
              <option value="assistant">Assistant</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedAgents.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                {selectedAgents.length} selected
              </span>
              <button
                onClick={() => handleBulkAction('start')}
                className="btn-secondary text-sm"
              >
                <Play className="h-3 w-3 mr-1" />
                Start
              </button>
              <button
                onClick={() => handleBulkAction('pause')}
                className="btn-secondary text-sm"
              >
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </button>
              <button
                onClick={() => handleBulkAction('stop')}
                className="btn-secondary text-sm"
              >
                <Square className="h-3 w-3 mr-1" />
                Stop
              </button>
            </div>
          )}

          {/* View Toggle */}
          <div className="flex bg-gray-700 rounded-md p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Agent Grid/Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent, index) => {
            const TypeIcon = agentTypeIcons[agent.type] || Bot
            const StatusIcon = statusIcons[agent.status] || Square
            const isSelected = selectedAgents.includes(agent.id)
            
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`widget-container cursor-pointer transition-all hover:scale-105 ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => selectAgent(agent.id)}
              >
                {/* Agent Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-${agentTypeColors[agent.type]}-500/20`}>
                    <TypeIcon className={`h-5 w-5 text-${agentTypeColors[agent.type]}-400`} />
                  </div>
                  <div className="flex items-center space-x-1">
                    <StatusIcon className={`h-4 w-4 ${statusColors[agent.status]}`} />
                    <button className="p-1 text-gray-400 hover:text-white rounded">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Agent Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                    <p className="text-sm text-gray-400 capitalize">{agent.type} Agent</p>
                  </div>

                  {/* Performance */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Performance</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getPerformanceColor(agent.performance)}`}>
                        {agent.performance}%
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        agent.performance >= 90 ? 'bg-green-500/20 text-green-400' :
                        agent.performance >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {getPerformanceBadge(agent.performance)}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Tasks</p>
                      <p className="text-white font-medium">{agent.metrics?.tasksCompleted || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Uptime</p>
                      <p className="text-white font-medium">
                        {agent.status === 'active' ? '99.9%' : '0%'}
                      </p>
                    </div>
                  </div>

                  {/* Last Active */}
                  <div className="text-xs text-gray-400">
                    Last active: {agent.lastActive ? new Date(agent.lastActive).toLocaleString() : 'Never'}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle start/pause
                      }}
                      className="p-1 text-gray-400 hover:text-green-400 rounded"
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
                        // Handle stop
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 rounded"
                      title="Stop"
                    >
                      <Square className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle settings
                      }}
                      className="p-1 text-gray-400 hover:text-white rounded"
                      title="Settings"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">v{agent.version}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        // Table View
        <div className="widget-container overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedAgents.length === filteredAgents.length}
                    onChange={selectAllAgents}
                    className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Agent</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Performance</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Tasks</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Last Active</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((agent) => {
                const TypeIcon = agentTypeIcons[agent.type] || Bot
                const StatusIcon = statusIcons[agent.status] || Square
                const isSelected = selectedAgents.includes(agent.id)
                
                return (
                  <tr
                    key={agent.id}
                    className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                      isSelected ? 'bg-blue-500/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => selectAgent(agent.id)}
                        className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-${agentTypeColors[agent.type]}-500/20`}>
                          <TypeIcon className={`h-4 w-4 text-${agentTypeColors[agent.type]}-400`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{agent.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{agent.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`h-4 w-4 ${statusColors[agent.status]}`} />
                        <span className={`text-sm capitalize ${statusColors[agent.status]}`}>
                          {agent.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getPerformanceColor(agent.performance)}`}>
                          {agent.performance}%
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          agent.performance >= 90 ? 'bg-green-500/20 text-green-400' :
                          agent.performance >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {getPerformanceBadge(agent.performance)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-white">{agent.metrics?.tasksCompleted || 0}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-400">
                        {agent.lastActive ? new Date(agent.lastActive).toLocaleString() : 'Never'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <button className="p-1 text-gray-400 hover:text-green-400 rounded">
                          {agent.status === 'active' ? 
                            <Pause className="h-4 w-4" /> : 
                            <Play className="h-4 w-4" />
                          }
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-400 rounded">
                          <Square className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-white rounded">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="widget-container text-center">
          <div className="text-2xl font-bold text-green-400">
            {agents?.filter(a => a.status === 'active').length || 0}
          </div>
          <div className="text-sm text-gray-400">Active Agents</div>
        </div>
        <div className="widget-container text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {agents?.filter(a => a.status === 'idle').length || 0}
          </div>
          <div className="text-sm text-gray-400">Idle Agents</div>
        </div>
        <div className="widget-container text-center">
          <div className="text-2xl font-bold text-blue-400">
            {agents?.reduce((sum, a) => sum + (a.metrics?.tasksCompleted || 0), 0) || 0}
          </div>
          <div className="text-sm text-gray-400">Total Tasks</div>
        </div>
        <div className="widget-container text-center">
          <div className="text-2xl font-bold text-purple-400">
            {agents?.length ? (agents.reduce((sum, a) => sum + a.performance, 0) / agents.length).toFixed(1) : 0}%
          </div>
          <div className="text-sm text-gray-400">Avg Performance</div>
        </div>
      </div>
    </div>
  )
}