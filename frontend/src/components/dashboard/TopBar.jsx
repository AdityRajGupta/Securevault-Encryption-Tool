import { Moon, Sun, Bell } from 'lucide-react'
import { useThemeContext } from '@/components/theme/ThemeProvider'
import { Button } from '@/components/ui/button'

export default function TopBar() {
  const { toggleTheme, isDark } = useThemeContext()

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-base font-semibold">File Encryption</h2>
          <p className="text-sm text-muted-foreground">
            Secure your files with AES-256 encryption
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  )
}
