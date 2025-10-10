'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  MoreHorizontal,
  User,
  Clock,
  MapPin,
  Smartphone,
  Monitor
} from 'lucide-react'

const sampleUsers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    avatar: 'SJ',
    status: 'online',
    lastActive: '2 min ago',
    location: 'New York, US',
    device: 'Desktop',
    sessions: 15,
    pageViews: 47,
    duration: '2h 34m'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.c@company.com',
    avatar: 'MC',
    status: 'away',
    lastActive: '15 min ago',
    location: 'San Francisco, US',
    device: 'Mobile',
    sessions: 8,
    pageViews: 23,
    duration: '1h 12m'
  },
  {
    id: 3,
    name: 'Emma Wilson',
    email: 'emma.w@company.com',
    avatar: 'EW',
    status: 'online',
    lastActive: 'Just now',
    location: 'London, UK',
    device: 'Desktop',
    sessions: 22,
    pageViews: 89,
    duration: '4h 21m'
  },
  {
    id: 4,
    name: 'David Rodriguez',
    email: 'david.r@company.com',
    avatar: 'DR',
    status: 'offline',
    lastActive: '1 hour ago',
    location: 'Madrid, ES',
    device: 'Tablet',
    sessions: 5,
    pageViews: 12,
    duration: '45m'
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    email: 'lisa.a@company.com',
    avatar: 'LA',
    status: 'online',
    lastActive: '5 min ago',
    location: 'Toronto, CA',
    device: 'Mobile',
    sessions: 18,
    pageViews: 56,
    duration: '3h 8m'
  }
]

const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  offline: 'bg-gray-500'
}

export default function UserActivityTable() {
  const [users, setUsers] = useState(sampleUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('lastActive')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'sessions':
          return b.sessions - a.sessions
        case 'pageViews':
          return b.pageViews - a.pageViews
        default:
          return 0
      }
    })

  const getDeviceIcon = (device) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Smartphone className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
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
          <h3 className="text-lg font-semibold text-white">User Activity</h3>
          <p className="text-sm text-gray-400">Real-time user engagement tracking</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700">
            <Download className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700">
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4 space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="online">Online</option>
          <option value="away">Away</option>
          <option value="offline">Offline</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="lastActive">Last Active</option>
          <option value="name">Name</option>
          <option value="sessions">Sessions</option>
          <option value="pageViews">Page Views</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">User</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Location</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Device</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Sessions</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Duration</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${statusColors[user.status]}`}></div>
                    <span className="text-sm text-gray-300 capitalize">{user.status}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{user.lastActive}</p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{user.location}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {getDeviceIcon(user.device)}
                    <span className="text-sm text-gray-300">{user.device}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm font-medium text-white">{user.sessions}</p>
                    <p className="text-xs text-gray-400">{user.pageViews} views</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-300">{user.duration}</span>
                </td>
                <td className="py-3 px-4">
                  <button className="p-1 text-gray-400 hover:text-white rounded">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <span>Showing {filteredUsers.length} of {users.length} users</span>
        <div className="flex items-center space-x-2">
          <span>Auto-refresh:</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>30s</span>
        </div>
      </div>
    </motion.div>
  )
}