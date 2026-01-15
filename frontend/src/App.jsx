import { useState } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import StatsOverview from '@/components/sections/StatsOverview'
import EncryptionSection from '@/components/sections/EncryptionSection'
import DecryptionSection from '@/components/sections/DecryptionSection'
import ServerStorageSection from '@/components/sections/ServerStorageSection'
import ActivitySection from '@/components/sections/ActivitySection'

export default function App() {
  const [lastServerName, setLastServerName] = useState(null)

  return (
    <ThemeProvider>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Stats Overview */}
          <StatsOverview />

          {/* Encrypt Section */}
          <div id="encrypt">
            <EncryptionSection onServerNameUpdate={setLastServerName} />
          </div>

          {/* Decrypt Section */}
          <div id="decrypt" className="pt-8">
            <DecryptionSection />
          </div>

          {/* Server Storage Section */}
          <div id="server" className="pt-8">
            <ServerStorageSection lastServerName={lastServerName} />
          </div>

          {/* Activity Feed */}
          <div id="activity" className="pt-8">
            <ActivitySection />
          </div>
        </div>
      </DashboardLayout>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  )
}
