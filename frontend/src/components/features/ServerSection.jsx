import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Server, Download, Copy, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

// ... rest of the file stays the same


export default function ServerSection({ lastServerName }) {
  const [savedName, setSavedName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleDownloadFromServer() {
    if (!savedName) {
      toast.error("Enter a server ID")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/download/${savedName}`)
      if (!res.ok) throw new Error('File not found')
      
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${savedName}.enc`
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      toast.success('File downloaded from server')
    } catch (err) {
      toast.error('Download failed: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(lastServerName)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="relative overflow-hidden p-6 transition-shadow duration-300 hover:shadow-glow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
      
      <div className="relative space-y-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Server className="h-5 w-5 text-accent" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-lg">Server Storage</h3>
            <p className="text-sm text-muted-foreground">
              Download files from the server
            </p>
          </div>
        </div>

        <AnimatePresence>
          {lastServerName && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="rounded-md border border-accent/20 bg-accent/5 p-4 shadow-glow-sm"
            >
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Latest Upload
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-background/50 px-2 py-1.5 text-sm font-mono backdrop-blur-sm">
                  {lastServerName}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="h-8 w-8 transition-transform hover:scale-110 active:scale-95"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="h-4 w-4 text-accent" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Copy className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="savedName" className="text-sm font-medium">
              Server ID
            </Label>
            <Input
              id="savedName"
              type="text"
              placeholder="Enter file ID"
              value={savedName}
              onChange={(e) => setSavedName(e.target.value)}
              className="transition-colors hover:bg-secondary/50 focus:bg-secondary/50"
            />
          </div>

          <Button
            onClick={handleDownloadFromServer}
            disabled={isLoading || !savedName}
            variant="secondary"
            className="w-full transition-all hover:bg-secondary/80 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download from Server
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}
