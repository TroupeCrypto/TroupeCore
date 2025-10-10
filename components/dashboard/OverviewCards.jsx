'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MousePointer
} from 'lucide-react'

const metrics = [
  {
    id: 'users',
    title: 'Total Users',
    value: '24,567',
    change: '+12.5%',
    changeType: 'positive',
    icon: Users,
    color: 'blue',
    description: 'Active users this month'
  },
  {
    id: 'revenue',
    title: 'Revenue',
    value: '$127,459',
    change: '+8.2%',
    changeType: 'positive',
    icon: DollarSign,
    color: 'green',
    description: 'Total revenue this month'
  },
  {
    id: 'growth',
    title: 'Growth Rate',
    value: '23.4%',
    change: '+2.1%',
    changeType: 'positive',
    icon: TrendingUp,
    color: 'purple',
    description: 'Month over month growth'
  },
  {
    id: 'engagement',
    title: 'Engagement',
    value: '89.2%',
    change: '-1.3%',
    changeType: 'negative',
    icon: Activity,
    color: 'orange',
    description: 'User engagement rate'
  },
  {
    id: 'pageviews',
    title: 'Page Views',
    value: '1.2M',
    change: '+15.7%',
    changeType: 'positive',
    icon: Eye,
    color: 'indigo',
    description: 'Total page views'
  },
  {
    id: 'conversion',
    title: 'Conversion',
    value: '4.8%',
    change: '+0.9%',
    changeType: 'positive',
    icon: MousePointer,
    color: 'pink',
    description: 'Conversion rate'
  }
]

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
  indigo: 'from-indigo-500 to-indigo-600',
  pink: 'from-pink-500 to-pink-600'
}

export default function OverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        
        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="widget-container interactive-element cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[metric.color]}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                metric.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.changeType === 'positive' ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {metric.change}
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
              <p className="text-sm font-medium text-gray-300">{metric.title}</p>
              <p className="text-xs text-gray-400">{metric.description}</p>
            </div>

            {/* Mini Sparkline Placeholder */}
            <div className="mt-4 h-8 bg-gray-700/50 rounded flex items-end justify-between px-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-gradient-to-t ${colorClasses[metric.color]} rounded-full opacity-60`}
                  style={{ height: `${Math.random() * 100}%` }}
                />
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}