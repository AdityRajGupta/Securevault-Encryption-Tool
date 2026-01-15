import { Shield, Lock, Unlock, Server, Activity, Settings, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { motion } from 'framer-motion'

const navigation = [
  { name: 'Encrypt', icon: Lock, href: '#encrypt' },
  { name: 'Decrypt', icon: Unlock, href: '#decrypt' },
  { name: 'Server Storage', icon: Server, href: '#server' },
  { name: 'Activity', icon: Activity, href: '#activity' },
]

const secondaryNavigation = [
  { name: 'Settings', icon: Settings, href: '#settings' },
  { name: 'Help', icon: HelpCircle, href: '#help' },
]

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState('encrypt')

  const handleNavClick = (e, href, name) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(name.toLowerCase())
    }
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Logo/Brand */}
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-6">
        <motion.div 
          className="flex h-8 w-8 items-center justify-center rounded-md bg-accent"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Shield className="h-5 w-5 text-accent-foreground" />
        </motion.div>
        <span className="text-lg font-semibold">SecureVault</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-1 flex-col gap-y-7 px-4 py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <motion.a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.name)}
                className={cn(
                  'group flex gap-x-3 rounded-md p-2.5 text-sm font-medium transition-all duration-200',
                  activeSection === item.name.toLowerCase()
                    ? 'bg-accent/10 text-accent shadow-sm'
                    : 'text-muted-foreground hover:bg-accent/5 hover:text-foreground'
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                {item.name}
              </motion.a>
            </li>
          ))}
        </ul>

        {/* Secondary Navigation */}
        <ul role="list" className="space-y-1 border-t border-border pt-4">
          {secondaryNavigation.map((item) => (
            <li key={item.name}>
              <motion.a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.name)}
                className="group flex gap-x-3 rounded-md p-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent/5 hover:text-foreground"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                {item.name}
              </motion.a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
