import { NextResponse } from 'next/server'

// Mock AI agents data - in production, this would be stored in a database
let agents = [
  {
    id: 'agent-1',
    name: 'Data Analyzer Pro',
    type: 'analytics',
    status: 'active',
    performance: 95.2,
    version: '2.1.3',
    createdAt: '2024-01-15T10:30:00Z',
    lastActive: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
    config: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
      timeout: 30000
    },
    metrics: {
      tasksCompleted: 1247,
      successRate: 95.2,
      avgResponseTime: 0.8,
      memoryUsage: 245,
      cpuUsage: 12
    },
    capabilities: ['data-analysis', 'report-generation', 'anomaly-detection'],
    environment: 'production'
  },
  {
    id: 'agent-2',
    name: 'Report Generator',
    type: 'reporting',
    status: 'active',
    performance: 88.7,
    version: '1.9.2',
    createdAt: '2024-01-20T14:15:00Z',
    lastActive: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    config: {
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      maxTokens: 1024,
      timeout: 20000
    },
    metrics: {
      tasksCompleted: 892,
      successRate: 88.7,
      avgResponseTime: 1.2,
      memoryUsage: 189,
      cpuUsage: 8
    },
    capabilities: ['report-creation', 'data-visualization', 'scheduling'],
    environment: 'production'
  },
  {
    id: 'agent-3',
    name: 'Anomaly Detector',
    type: 'monitoring',
    status: 'idle',
    performance: 92.1,
    version: '3.0.1',
    createdAt: '2024-02-01T09:45:00Z',
    lastActive: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    config: {
      model: 'custom-ml-model',
      threshold: 0.85,
      windowSize: 100,
      timeout: 15000
    },
    metrics: {
      tasksCompleted: 2156,
      successRate: 92.1,
      avgResponseTime: 0.3,
      memoryUsage: 312,
      cpuUsage: 15
    },
    capabilities: ['anomaly-detection', 'pattern-recognition', 'alerting'],
    environment: 'production'
  }
]

// Generate mock logs for an agent
function generateAgentLogs(agentId, count = 50) {
  const logLevels = ['info', 'warn', 'error', 'debug']
  const logs = []
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - i * 60000) // 1 minute intervals
    const level = logLevels[Math.floor(Math.random() * logLevels.length)]
    
    let message = ''
    switch (level) {
      case 'info':
        message = `Task completed successfully - processed ${Math.floor(Math.random() * 100)} records`
        break
      case 'warn':
        message = `High memory usage detected: ${Math.floor(Math.random() * 500 + 200)}MB`
        break
      case 'error':
        message = `Failed to connect to data source: timeout after 30s`
        break
      case 'debug':
        message = `Processing batch ${Math.floor(Math.random() * 1000)} with ${Math.floor(Math.random() * 50)} items`
        break
    }
    
    logs.push({
      id: `log-${i}`,
      timestamp: timestamp.toISOString(),
      level,
      message,
      agentId
    })
  }
  
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

// GET /api/agents - Get all agents
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    
    let filteredAgents = [...agents]
    
    if (status && status !== 'all') {
      filteredAgents = filteredAgents.filter(agent => agent.status === status)
    }
    
    if (type && type !== 'all') {
      filteredAgents = filteredAgents.filter(agent => agent.type === type)
    }
    
    // Update last active times for active agents
    filteredAgents = filteredAgents.map(agent => {
      if (agent.status === 'active') {
        return {
          ...agent,
          lastActive: new Date(Date.now() - Math.random() * 600000).toISOString() // Random time within last 10 minutes
        }
      }
      return agent
    })
    
    return NextResponse.json({
      success: true,
      data: filteredAgents,
      total: filteredAgents.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Get agents error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}

// POST /api/agents - Create new agent
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, type, config } = body
    
    if (!name || !type) {
      return NextResponse.json(
        { success: false, error: 'Name and type are required' },
        { status: 400 }
      )
    }
    
    const newAgent = {
      id: `agent-${Date.now()}`,
      name,
      type,
      status: 'stopped',
      performance: 0,
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      lastActive: null,
      config: {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1024,
        timeout: 30000,
        ...config
      },
      metrics: {
        tasksCompleted: 0,
        successRate: 0,
        avgResponseTime: 0,
        memoryUsage: 0,
        cpuUsage: 0
      },
      capabilities: [],
      environment: 'development'
    }
    
    agents.push(newAgent)
    
    return NextResponse.json({
      success: true,
      data: newAgent,
      message: 'Agent created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Create agent error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}

// PUT /api/agents - Bulk update agents
export async function PUT(request) {
  try {
    const body = await request.json()
    const { agentIds, action, config } = body
    
    if (!agentIds || !Array.isArray(agentIds)) {
      return NextResponse.json(
        { success: false, error: 'Agent IDs array is required' },
        { status: 400 }
      )
    }
    
    const updatedAgents = []
    
    for (const agentId of agentIds) {
      const agentIndex = agents.findIndex(agent => agent.id === agentId)
      if (agentIndex !== -1) {
        switch (action) {
          case 'start':
            agents[agentIndex].status = 'active'
            agents[agentIndex].lastActive = new Date().toISOString()
            break
          case 'stop':
            agents[agentIndex].status = 'stopped'
            break
          case 'pause':
            agents[agentIndex].status = 'idle'
            break
          case 'update':
            agents[agentIndex] = { ...agents[agentIndex], ...config }
            break
        }
        updatedAgents.push(agents[agentIndex])
      }
    }
    
    return NextResponse.json({
      success: true,
      data: updatedAgents,
      message: `Bulk ${action} completed for ${updatedAgents.length} agents`
    })
  } catch (error) {
    console.error('Bulk update agents error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update agents' },
      { status: 500 }
    )
  }
}