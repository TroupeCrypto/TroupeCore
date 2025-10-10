import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import axios from 'axios'

// API endpoints
const API_BASE = '/api'

const analyticsAPI = {
  getOverview: (dateRange = '7d') => 
    axios.get(`${API_BASE}/analytics/overview?range=${dateRange}`),
  
  getMetrics: (metrics, dateRange = '7d') => 
    axios.get(`${API_BASE}/analytics/metrics`, { 
      params: { metrics: metrics.join(','), range: dateRange } 
    }),
  
  getUserActivity: (filters = {}) => 
    axios.get(`${API_BASE}/analytics/users`, { params: filters }),
  
  getRevenue: (dateRange = '7d') => 
    axios.get(`${API_BASE}/analytics/revenue?range=${dateRange}`),
  
  getPerformance: () => 
    axios.get(`${API_BASE}/analytics/performance`),
  
  exportData: (type, filters = {}) => 
    axios.post(`${API_BASE}/analytics/export`, { type, filters }),
  
  getCustomReport: (config) => 
    axios.post(`${API_BASE}/analytics/reports/custom`, config),
}

// Main analytics hook
export function useAnalytics(dateRange = '7d', options = {}) {
  const { 
    enabled = true, 
    refetchInterval = 30000,
    staleTime = 60000 
  } = options

  return useQuery({
    queryKey: ['analytics', 'overview', dateRange],
    queryFn: () => analyticsAPI.getOverview(dateRange),
    enabled,
    refetchInterval,
    staleTime,
    select: (data) => data.data
  })
}

// Metrics hook with real-time updates
export function useMetrics(selectedMetrics = [], dateRange = '7d', realTime = false) {
  const queryClient = useQueryClient()
  
  const query = useQuery({
    queryKey: ['analytics', 'metrics', selectedMetrics, dateRange],
    queryFn: () => analyticsAPI.getMetrics(selectedMetrics, dateRange),
    enabled: selectedMetrics.length > 0,
    refetchInterval: realTime ? 10000 : 60000,
    staleTime: realTime ? 5000 : 30000,
    select: (data) => data.data
  })

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!realTime) return

    const ws = new WebSocket(`ws://localhost:3001/analytics/realtime`)
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'metrics_update') {
        queryClient.setQueryData(
          ['analytics', 'metrics', selectedMetrics, dateRange],
          (oldData) => ({
            ...oldData,
            data: { ...oldData?.data, ...data.metrics }
          })
        )
      }
    }

    return () => ws.close()
  }, [realTime, selectedMetrics, dateRange, queryClient])

  return query
}

// User activity hook
export function useUserActivity(filters = {}, options = {}) {
  const { 
    enabled = true,
    refetchInterval = 30000 
  } = options

  return useQuery({
    queryKey: ['analytics', 'users', filters],
    queryFn: () => analyticsAPI.getUserActivity(filters),
    enabled,
    refetchInterval,
    select: (data) => data.data
  })
}

// Revenue analytics hook
export function useRevenue(dateRange = '7d', options = {}) {
  const { enabled = true } = options

  return useQuery({
    queryKey: ['analytics', 'revenue', dateRange],
    queryFn: () => analyticsAPI.getRevenue(dateRange),
    enabled,
    refetchInterval: 60000,
    select: (data) => data.data
  })
}

// Performance metrics hook
export function usePerformance(realTime = false) {
  const queryClient = useQueryClient()
  
  const query = useQuery({
    queryKey: ['analytics', 'performance'],
    queryFn: () => analyticsAPI.getPerformance(),
    refetchInterval: realTime ? 5000 : 30000,
    select: (data) => data.data
  })

  // Real-time performance updates via Server-Sent Events
  useEffect(() => {
    if (!realTime) return

    const eventSource = new EventSource('/api/analytics/performance/stream')
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      queryClient.setQueryData(['analytics', 'performance'], (oldData) => ({
        ...oldData,
        data: { ...oldData?.data, ...data }
      }))
    }

    return () => eventSource.close()
  }, [realTime, queryClient])

  return query
}

// Custom report hook
export function useCustomReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (config) => analyticsAPI.getCustomReport(config),
    onSuccess: (data) => {
      // Cache the custom report
      queryClient.setQueryData(
        ['analytics', 'custom-report', data.data.id],
        data.data
      )
    }
  })
}

// Export data hook
export function useExportData() {
  return useMutation({
    mutationFn: ({ type, filters }) => analyticsAPI.exportData(type, filters),
    onSuccess: (data) => {
      // Trigger download
      const blob = new Blob([data.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-export-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }
  })
}

// Real-time dashboard hook
export function useRealTimeDashboard(enabled = true) {
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [lastUpdate, setLastUpdate] = useState(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled) return

    const ws = new WebSocket(`ws://localhost:3001/dashboard/realtime`)
    
    ws.onopen = () => {
      setConnectionStatus('connected')
    }

    ws.onclose = () => {
      setConnectionStatus('disconnected')
    }

    ws.onerror = () => {
      setConnectionStatus('error')
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setLastUpdate(new Date())

      // Update relevant queries based on data type
      switch (data.type) {
        case 'metrics_update':
          queryClient.invalidateQueries({ queryKey: ['analytics', 'metrics'] })
          break
        case 'user_activity':
          queryClient.invalidateQueries({ queryKey: ['analytics', 'users'] })
          break
        case 'performance_update':
          queryClient.invalidateQueries({ queryKey: ['analytics', 'performance'] })
          break
        case 'revenue_update':
          queryClient.invalidateQueries({ queryKey: ['analytics', 'revenue'] })
          break
        default:
          break
      }
    }

    return () => ws.close()
  }, [enabled, queryClient])

  return {
    connectionStatus,
    lastUpdate,
    isConnected: connectionStatus === 'connected'
  }
}

// Analytics filters hook
export function useAnalyticsFilters() {
  const [filters, setFilters] = useState({
    dateRange: '7d',
    metrics: ['users', 'revenue', 'performance'],
    userSegments: [],
    regions: [],
    devices: []
  })

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      dateRange: '7d',
      metrics: ['users', 'revenue', 'performance'],
      userSegments: [],
      regions: [],
      devices: []
    })
  }

  return {
    filters,
    updateFilter,
    resetFilters,
    setFilters
  }
}