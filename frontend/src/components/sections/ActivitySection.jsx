import { motion } from 'framer-motion'
import { Lock, Unlock, Server, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'

const activities = [
  { id: 1, type: 'encrypt', description: 'Ready to encrypt your first file', time: 'Just now', icon: Lock },
  { id: 2, type: 'info', description: 'All systems operational', time: '1m ago', icon: Clock },
]

export default function ActivitySection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Recent Activity</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your encryption and decryption history
        </p>
      </div>

      <Card className="divide-y divide-border">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10">
              <activity.icon className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{activity.description}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </Card>
    </div>
  )
}
