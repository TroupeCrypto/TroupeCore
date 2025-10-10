import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import axios from 'axios'

const databaseAPI = {
  // Connection management
  getConnections: () => axios.get('/api/database/connections'),
  testConnection: (config) => axios.post('/api/database/test', config),
  createConnection: (config) => axios.post('/api/database/connections', config),
  updateConnection: (id, config) => axios.put(`/api/database/connections/${id}`, config),
  deleteConnection: (id) => axios.delete(`/api/database/connections/${id}`),
  
  // Schema operations
  getSchema: (connectionId) => axios.get(`/api/database/connections/${connectionId}/schema`),
  getTables: (connectionId) => axios.get(`/api/database/connections/${connectionId}/tables`),
  getTableSchema: (connectionId, tableName) => 
    axios.get(`/api/database/connections/${connectionId}/tables/${tableName}/schema`),
  
  // Query operations
  executeQuery: (connectionId, query) => 
    axios.post(`/api/database/connections/${connectionId}/query`, { query }),
  getQueryHistory: (connectionId) => 
    axios.get(`/api/database/connections/${connectionId}/history`),
  saveQuery: (connectionId, query, name) => 
    axios.post(`/api/database/connections/${connectionId}/queries`, { query, name }),
  
  // Data operations
  getTableData: (connectionId, tableName, options = {}) => 
    axios.get(`/api/database/connections/${connectionId}/tables/${tableName}/data`, { params: options }),
  
  // Real-time monitoring
  getConnectionStats: (connectionId) => 
    axios.get(`/api/database/connections/${connectionId}/stats`),
}

// Database connections hook
export function useDatabaseConnections() {
  return useQuery({
    queryKey: ['database', 'connections'],
    queryFn: () => databaseAPI.getConnections(),
    select: (data) => data.data,
    refetchInterval: 30000
  })
}

// Connection test hook
export function useTestConnection() {
  return useMutation({
    mutationFn: (config) => databaseAPI.testConnection(config),
    onSuccess: (data) => {
      return data.data
    }
  })
}

// Create connection hook
export function useCreateConnection() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (config) => databaseAPI.createConnection(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['database', 'connections'] })
    }
  })
}

// Update connection hook
export function useUpdateConnection() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, config }) => databaseAPI.updateConnection(id, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['database', 'connections'] })
    }
  })
}

// Delete connection hook
export function useDeleteConnection() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => databaseAPI.deleteConnection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['database', 'connections'] })
    }
  })
}

// Schema hook
export function useSchema(connectionId, enabled = true) {
  return useQuery({
    queryKey: ['database', 'schema', connectionId],
    queryFn: () => databaseAPI.getSchema(connectionId),
    enabled: enabled && !!connectionId,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

// Tables hook
export function useTables(connectionId, enabled = true) {
  return useQuery({
    queryKey: ['database', 'tables', connectionId],
    queryFn: () => databaseAPI.getTables(connectionId),
    enabled: enabled && !!connectionId,
    select: (data) => data.data,
    staleTime: 2 * 60 * 1000 // 2 minutes
  })
}

// Table schema hook
export function useTableSchema(connectionId, tableName, enabled = true) {
  return useQuery({
    queryKey: ['database', 'table-schema', connectionId, tableName],
    queryFn: () => databaseAPI.getTableSchema(connectionId, tableName),
    enabled: enabled && !!connectionId && !!tableName,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000
  })
}

// Query execution hook
export function useExecuteQuery() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ connectionId, query }) => databaseAPI.executeQuery(connectionId, query),
    onSuccess: (data, variables) => {
      // Update query history
      queryClient.invalidateQueries({ 
        queryKey: ['database', 'query-history', variables.connectionId] 
      })
    }
  })
}

// Query history hook
export function useQueryHistory(connectionId, enabled = true) {
  return useQuery({
    queryKey: ['database', 'query-history', connectionId],
    queryFn: () => databaseAPI.getQueryHistory(connectionId),
    enabled: enabled && !!connectionId,
    select: (data) => data.data
  })
}

// Table data hook with pagination
export function useTableData(connectionId, tableName, options = {}, enabled = true) {
  const { page = 1, limit = 50, filters = {}, sort = {} } = options
  
  return useQuery({
    queryKey: ['database', 'table-data', connectionId, tableName, page, limit, filters, sort],
    queryFn: () => databaseAPI.getTableData(connectionId, tableName, { 
      page, limit, filters, sort 
    }),
    enabled: enabled && !!connectionId && !!tableName,
    select: (data) => data.data,
    keepPreviousData: true
  })
}

// Connection stats hook with real-time updates
export function useConnectionStats(connectionId, realTime = false) {
  const queryClient = useQueryClient()
  
  const query = useQuery({
    queryKey: ['database', 'connection-stats', connectionId],
    queryFn: () => databaseAPI.getConnectionStats(connectionId),
    enabled: !!connectionId,
    refetchInterval: realTime ? 5000 : 30000,
    select: (data) => data.data
  })

  // Real-time updates via Server-Sent Events
  useEffect(() => {
    if (!realTime || !connectionId) return

    const eventSource = new EventSource(`/api/database/connections/${connectionId}/stats/stream`)
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      queryClient.setQueryData(
        ['database', 'connection-stats', connectionId], 
        (oldData) => ({
          ...oldData,
          data: { ...oldData?.data, ...data }
        })
      )
    }

    return () => eventSource.close()
  }, [realTime, connectionId, queryClient])

  return query
}

// Database query builder hook
export function useQueryBuilder(connectionId) {
  const [query, setQuery] = useState({
    select: [],
    from: '',
    joins: [],
    where: [],
    groupBy: [],
    having: [],
    orderBy: [],
    limit: null
  })

  const [sqlQuery, setSqlQuery] = useState('')

  // Generate SQL from query object
  const generateSQL = () => {
    let sql = 'SELECT '
    
    if (query.select.length === 0) {
      sql += '*'
    } else {
      sql += query.select.join(', ')
    }
    
    if (query.from) {
      sql += ` FROM ${query.from}`
    }
    
    query.joins.forEach(join => {
      sql += ` ${join.type} JOIN ${join.table} ON ${join.condition}`
    })
    
    if (query.where.length > 0) {
      sql += ` WHERE ${query.where.join(' AND ')}`
    }
    
    if (query.groupBy.length > 0) {
      sql += ` GROUP BY ${query.groupBy.join(', ')}`
    }
    
    if (query.having.length > 0) {
      sql += ` HAVING ${query.having.join(' AND ')}`
    }
    
    if (query.orderBy.length > 0) {
      sql += ` ORDER BY ${query.orderBy.join(', ')}`
    }
    
    if (query.limit) {
      sql += ` LIMIT ${query.limit}`
    }
    
    setSqlQuery(sql)
    return sql
  }

  const addSelect = (field) => {
    setQuery(prev => ({
      ...prev,
      select: [...prev.select, field]
    }))
  }

  const removeSelect = (field) => {
    setQuery(prev => ({
      ...prev,
      select: prev.select.filter(f => f !== field)
    }))
  }

  const setFrom = (table) => {
    setQuery(prev => ({ ...prev, from: table }))
  }

  const addWhere = (condition) => {
    setQuery(prev => ({
      ...prev,
      where: [...prev.where, condition]
    }))
  }

  const addJoin = (type, table, condition) => {
    setQuery(prev => ({
      ...prev,
      joins: [...prev.joins, { type, table, condition }]
    }))
  }

  const reset = () => {
    setQuery({
      select: [],
      from: '',
      joins: [],
      where: [],
      groupBy: [],
      having: [],
      orderBy: [],
      limit: null
    })
    setSqlQuery('')
  }

  return {
    query,
    sqlQuery,
    generateSQL,
    addSelect,
    removeSelect,
    setFrom,
    addWhere,
    addJoin,
    reset,
    setQuery
  }
}

// Custom database hook for specific integrations
export function useCustomDatabase(type, config) {
  const [connection, setConnection] = useState(null)
  const [status, setStatus] = useState('disconnected')

  useEffect(() => {
    if (!config) return

    const connect = async () => {
      setStatus('connecting')
      try {
        const response = await databaseAPI.testConnection({ type, ...config })
        if (response.data.success) {
          setConnection(response.data.connection)
          setStatus('connected')
        } else {
          setStatus('error')
        }
      } catch (error) {
        setStatus('error')
        console.error('Database connection error:', error)
      }
    }

    connect()
  }, [type, config])

  const disconnect = () => {
    setConnection(null)
    setStatus('disconnected')
  }

  const reconnect = () => {
    disconnect()
    // Trigger reconnection
    setStatus('connecting')
  }

  return {
    connection,
    status,
    isConnected: status === 'connected',
    disconnect,
    reconnect
  }
}