import { motion } from 'framer-motion'
import { Lock, Unlock, Server, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'

const stats = [
  { name: 'Files Encrypted', value: 0, icon: Lock, suffix: '' },
  { name: 'Files Decrypted', value: 0, icon: Unlock, suffix: '' },
  { name: 'Server Storage', value: 0, icon: Server, suffix: ' MB' },
  { name: 'Security Score', value: 100, icon: TrendingUp, suffix: '%' },
]

function CountUpNumber({ value, suffix }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1000
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
        >
          <Card className="group relative overflow-hidden p-6 transition-all duration-300 hover:shadow-glow-sm hover:border-accent/30">
            {/* Subtle gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 transition-all duration-300 group-hover:from-accent/5 group-hover:to-transparent" />
            
            <div className="relative">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 transition-all duration-300 group-hover:bg-accent/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <stat.icon className="h-5 w-5 text-accent" />
                </motion.div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums">
                  <CountUpNumber value={stat.value} suffix={stat.suffix} />
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
