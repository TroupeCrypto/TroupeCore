import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import axios from 'axios'

const agentsAPI = {
  // Agent management
  getAgents: () => axios.get('/api/agents'),
  getAgent: (id) => axios.get(`/api/agents/${id}`),
  createAgent: (config) => axios.post('/api/agents', config),
  updateAgent: (id, config) => axios.put(`/api/agents/${id}`, config),
  deleteAgent: (id) => axios.delete(`/api/agents/${id}`),
  
  // Agent operations
  startAgent: (id) => axios.post(`/api/agents/${id}/start`),
  stopAgent: (id) => axios.post(`/api/agents/${id}/stop`),
  pauseAgent: (id) => axios.post(`/api/agents/${id}/pause`),
  restartAgent: (id) => axios.post(`/api/agents/${id}/restart`),
  
  // Agent monitoring
  getAgentMetrics: (id) => axios.get(`/api/agents/${id}/metrics`),
  getAgentLogs: (id, options = {}) => axios.get(`/api/agents/${id}/logs`, { params: options }),
  getAgentTasks: (id) => axios.get(`/api/agents/${id}/tasks`),
  
  // Agent configuration
  getAgentConfig: (id) => axios.get(`/api/agents/${id}/config`),
  updateAgentConfig: (id, config) => axios.put(`/api/agents/${id}/config`, config),
  
  // Training and deployment
  trainAgent: (id, data) => axios.post(`/api/agents/${id}/train`, data),
  deployAgent: (id, environment) => axios.post(`/api/agents/${id}/deploy`, { environment }),
  
  // Agent templates
  getTemplates: () => axios.get('/api/agents/templates'),
  createFromTemplate: (templateId, config) => 
    axios.post(`/api/agents/templates/${templateId}/create`, config),
}

// All agents hook
export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: () => agentsAPI.getAgents(),
    select: (data) => data.data,
    refetchInterval: 10000 // Refresh every 10 seconds
  })
}

// Single agent hook
export function useAgent(id, enabled = true) {
  return useQuery({
    queryKey: ['agents', id],
    queryFn: () => agentsAPI.getAgent(id),
    enabled: enabled && !!id,
    select: (data) => data.data,
    refetchInterval: 5000
  })
}

// Agent metrics hook with real-time updates
export function useAgentMetrics(id, realTime = false) {
  const queryClient = useQueryClient()
  
  const query = useQuery({
    queryKey: ['agents', id, 'metrics'],
    queryFn: () => agentsAPI.getAgentMetrics(id),
    enabled: !!id,
    refetchInterval: realTime ? 2000 : 10000,
    select: (data) => data.data
  })

  // Real-time metrics via WebSocket
  useEffect(() => {
    if (!realTime || !id) return

    const ws = new WebSocket(`ws://localhost:3001/agents/${id}/metrics`)
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      queryClient.setQueryData(['agents', id, 'metrics'], (oldData) => ({
        ...oldData,
        data: { ...oldData?.data, ...data }
      }))
    }

    return () => ws.close()
  }, [realTime, id, queryClient])

  return query
}

// Agent logs hook
export function useAgentLogs(id, options = {}) {
  const { level = 'all', limit = 100, realTime = false } = options
  const queryClient = useQueryClient()
  
  const query = useQuery({
    queryKey: ['agents', id, 'logs', level, limit],
    queryFn: () => agentsAPI.getAgentLogs(id, { level, limit }),
    enabled: !!id,
    select: (data) => data.data
  })

  // Real-time log streaming
  useEffect(() => {
    if (!realTime || !id) return

    const eventSource = new EventSource(`/api/agents/${id}/logs/stream?level=${level}`)
    
    eventSource.onmessage = (event) => {
      const newLog = JSON.parse(event.data)
      queryClient.setQueryData(['agents', id, 'logs', level, limit], (oldData) => {
        if (!oldData?.data) return oldData
        
        const updatedLogs = [newLog, ...oldData.data.logs].slice(0, limit)
        return {
          ...oldData,
          data: {
            ...oldData.data,
            logs: updatedLogs
          }
        }
      })
    }

    return () => eventSource.close()
  }, [realTime, id, level, limit, queryClient])

  return query
}

// Agent tasks hook
export function useAgentTasks(id, enabled = true) {
  return useQuery({
    queryKey: ['agents', id, 'tasks'],
    queryFn: () => agentsAPI.getAgentTasks(id),
    enabled: enabled && !!id,
    select: (data) => data.data,
    refetchInterval: 5000
  })
}

// Create agent hook
export function useCreateAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (config) => agentsAPI.createAgent(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    }
  })
}

// Update agent hook
export function useUpdateAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, config }) => agentsAPI.updateAgent(id, config),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['agents', variables.id] })
    }
  })
}

// Delete agent hook
export function useDeleteAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => agentsAPI.deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    }
  })
}

// Agent control hooks
export function useStartAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => agentsAPI.startAgent(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['agents', id] })
    }
  })
}

export function useStopAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => agentsAPI.stopAgent(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['agents', id] })
    }
  })
}

export function usePauseAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => agentsAPI.pauseAgent(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['agents', id] })
    }
  })
}

export function useRestartAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => agentsAPI.restartAgent(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['agents', id] })
    }
  })
}

// Agent training hook
export function useTrainAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => agentsAPI.trainAgent(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agents', variables.id] })
    }
  })
}

// Agent deployment hook
export function useDeployAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, environment }) => agentsAPI.deployAgent(id, environment),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agents', variables.id] })
    }
  })
}

// Agent templates hook
export function useAgentTemplates() {
  return useQuery({
    queryKey: ['agents', 'templates'],
    queryFn: () => agentsAPI.getTemplates(),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

// Create agent from template hook
export function useCreateFromTemplate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ templateId, config }) => agentsAPI.createFromTemplate(templateId, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    }
  })
}

// Agent roster management hook
export function useAgentRoster() {
  const [selectedAgents, setSelectedAgents] = useState([])
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    performance: 'all'
  })
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const { data: agents, isLoading, error } = useAgents()

  // Filter and sort agents
  const filteredAgents = agents?.filter(agent => {
    if (filters.status !== 'all' && agent.status !== filters.status) return false
    if (filters.type !== 'all' && agent.type !== filters.type) return false
    if (filters.performance !== 'all') {
      const performance = agent.performance || 0
      switch (filters.performance) {
        case 'excellent':
          if (performance < 90) return false
          break
        case 'good':
          if (performance < 70 || performance >= 90) return false
          break
        case 'poor':
          if (performance >= 70) return false
          break
      }
    }
    return true
  }).sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const selectAgent = (id) => {
    setSelectedAgents(prev => 
      prev.includes(id) 
        ? prev.filter(agentId => agentId !== id)
        : [...prev, id]
    )
  }

  const selectAllAgents = () => {
    if (selectedAgents.length === filteredAgents?.length) {
      setSelectedAgents([])
    } else {
      setSelectedAgents(filteredAgents?.map(agent => agent.id) || [])
    }
  }

  const bulkAction = async (action) => {
    // Implement bulk actions for selected agents
    const promises = selectedAgents.map(id => {
      switch (action) {
        case 'start':
          return agentsAPI.startAgent(id)
        case 'stop':
          return agentsAPI.stopAgent(id)
        case 'pause':
          return agentsAPI.pauseAgent(id)
        case 'restart':
          return agentsAPI.restartAgent(id)
        default:
          return Promise.resolve()
      }
    })
    
    await Promise.all(promises)
    setSelectedAgents([])
  }

  return {
    agents: filteredAgents,
    isLoading,
    error,
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
  }
}