import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Server, Download, Copy, Check, Loader2, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

export default function ServerStorageSection({ lastServerName }) {
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
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Server Storage</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Download encrypted files from secure server storage
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10">
                <Server className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold">Download Files</h4>
                <p className="text-sm text-muted-foreground">
                  Enter file ID to retrieve from server
                </p>
              </div>
            </div>

            <AnimatePresence>
              {lastServerName && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="rounded-md border border-accent/20 bg-accent/5 p-4"
                >
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Latest Upload ID
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-background/50 px-2 py-1.5 text-sm font-mono">
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
                          <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Check className="h-4 w-4 text-accent" />
                          </motion.div>
                        ) : (
                          <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }}>
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
                <Label htmlFor="savedName">Server File ID</Label>
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

        <Card className="p-6 bg-accent/5 border-accent/20">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <h4 className="font-semibold">Storage Information</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  How your encrypted files are stored
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-muted-foreground">Files are stored in encrypted format only</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-muted-foreground">Server cannot decrypt your files</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-muted-foreground">Unique ID generated for each upload</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-muted-foreground">Download anytime with your file ID</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
