import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useDashboardStore = create(
  persist(
    (set, get) => ({
      // UI State
      sidebarCollapsed: false,
      darkMode: true,
      
      // Dashboard Configuration
      widgets: [
        { id: 'overview', type: 'overview', position: { x: 0, y: 0, w: 12, h: 4 }, visible: true },
        { id: 'analytics', type: 'analytics', position: { x: 0, y: 4, w: 8, h: 6 }, visible: true },
        { id: 'performance', type: 'performance', position: { x: 8, y: 4, w: 4, h: 6 }, visible: true },
        { id: 'users', type: 'users', position: { x: 0, y: 10, w: 6, h: 4 }, visible: true },
        { id: 'revenue', type: 'revenue', position: { x: 6, y: 10, w: 6, h: 4 }, visible: true },
      ],
      
      // Data Filters
      dateRange: '7d',
      selectedMetrics: ['users', 'revenue', 'performance', 'engagement'],
      
      // Real-time Data
      realTimeEnabled: true,
      refreshInterval: 30000, // 30 seconds
      
      // AI Agents
      agents: [
        { 
          id: 'agent-1', 
          name: 'Data Analyzer', 
          status: 'active', 
          type: 'analytics',
          performance: 95,
          lastActive: new Date().toISOString()
        },
        { 
          id: 'agent-2', 
          name: 'Report Generator', 
          status: 'active', 
          type: 'reporting',
          performance: 88,
          lastActive: new Date().toISOString()
        },
        { 
          id: 'agent-3', 
          name: 'Anomaly Detector', 
          status: 'idle', 
          type: 'monitoring',
          performance: 92,
          lastActive: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
        },
      ],
      
      // Database Connections
      dataSources: [
        { 
          id: 'postgres-main', 
          name: 'Main Database', 
          type: 'postgresql', 
          status: 'connected',
          lastSync: new Date().toISOString()
        },
        { 
          id: 'redis-cache', 
          name: 'Redis Cache', 
          type: 'redis', 
          status: 'connected',
          lastSync: new Date().toISOString()
        },
        { 
          id: 'mongodb-logs', 
          name: 'Log Database', 
          type: 'mongodb', 
          status: 'connected',
          lastSync: new Date().toISOString()
        },
      ],
      
      // Actions
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setDarkMode: (darkMode) => set({ darkMode }),
      
      updateWidget: (widgetId, updates) => set((state) => ({
        widgets: state.widgets.map(widget => 
          widget.id === widgetId ? { ...widget, ...updates } : widget
        )
      })),
      
      addWidget: (widget) => set((state) => ({
        widgets: [...state.widgets, widget]
      })),
      
      removeWidget: (widgetId) => set((state) => ({
        widgets: state.widgets.filter(widget => widget.id !== widgetId)
      })),
      
      setDateRange: (range) => set({ dateRange: range }),
      setSelectedMetrics: (metrics) => set({ selectedMetrics: metrics }),
      setRealTimeEnabled: (enabled) => set({ realTimeEnabled: enabled }),
      setRefreshInterval: (interval) => set({ refreshInterval: interval }),
      
      updateAgent: (agentId, updates) => set((state) => ({
        agents: state.agents.map(agent => 
          agent.id === agentId ? { ...agent, ...updates } : agent
        )
      })),
      
      addAgent: (agent) => set((state) => ({
        agents: [...state.agents, agent]
      })),
      
      removeAgent: (agentId) => set((state) => ({
        agents: state.agents.filter(agent => agent.id !== agentId)
      })),
      
      updateDataSource: (sourceId, updates) => set((state) => ({
        dataSources: state.dataSources.map(source => 
          source.id === sourceId ? { ...source, ...updates } : source
        )
      })),
      
      addDataSource: (source) => set((state) => ({
        dataSources: [...state.dataSources, source]
      })),
      
      removeDataSource: (sourceId) => set((state) => ({
        dataSources: state.dataSources.filter(source => source.id !== sourceId)
      })),
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        darkMode: state.darkMode,
        widgets: state.widgets,
        dateRange: state.dateRange,
        selectedMetrics: state.selectedMetrics,
        realTimeEnabled: state.realTimeEnabled,
        refreshInterval: state.refreshInterval,
      }),
    }
  )
)