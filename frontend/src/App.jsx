import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import EncryptSection from '@/components/features/EncryptSection'
import DecryptSection from '@/components/features/DecryptSection'
import ServerSection from '@/components/features/ServerSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lock } from 'lucide-react'

// ... rest of the file stays the same


export default function App() {
  const [lastServerName, setLastServerName] = useState(null)
  const [activeTab, setActiveTab] = useState('encrypt')

  return (
    <ThemeProvider>
      <DashboardLayout>
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold tracking-tight">
              File Encryption
            </h1>
            <p className="text-base text-muted-foreground">
              Secure your files with military-grade AES-256 encryption
            </p>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="encrypt" className="transition-all data-[state=active]:shadow-sm">
                Encrypt
              </TabsTrigger>
              <TabsTrigger value="decrypt" className="transition-all data-[state=active]:shadow-sm">
                Decrypt
              </TabsTrigger>
              <TabsTrigger value="server" className="transition-all data-[state=active]:shadow-sm">
                Server
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="encrypt" className="mt-6">
                <motion.div
                  key="encrypt"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <EncryptSection onServerNameUpdate={setLastServerName} />
                </motion.div>
              </TabsContent>

              <TabsContent value="decrypt" className="mt-6">
                <motion.div
                  key="decrypt"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <DecryptSection />
                </motion.div>
              </TabsContent>

              <TabsContent value="server" className="mt-6">
                <motion.div
                  key="server"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ServerSection lastServerName={lastServerName} />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-3 rounded-md border border-border/50 bg-muted/30 p-4 backdrop-blur-sm"
          >
            <Lock className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              All encryption happens in your browser. Your password and files never leave your device.
            </p>
          </motion.div>
        </div>
      </DashboardLayout>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  )
}
