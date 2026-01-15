import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Unlock, Download, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { decryptFile } from '@/utils/crypto'

// ... rest of the file stays the same


export default function DecryptSection() {
  const [encFile, setEncFile] = useState(null)
  const [encPassword, setEncPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleDecryptLocal() {
    if (!encFile) {
      toast.error("Select an encrypted file")
      return
    }
    if (!encPassword) {
      toast.error("Enter the password")
      return
    }

    setIsLoading(true)
    setIsSuccess(false)
    
    try {
      const buf = await encFile.arrayBuffer()
      const plainBlob = await decryptFile(buf, encPassword)
      const originalName = encFile.name.replace(/\.enc$/, '') || 'decrypted.bin'

      const url = URL.createObjectURL(plainBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = originalName
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      setIsSuccess(true)
      toast.success('File decrypted successfully')
      
      setTimeout(() => {
        setEncFile(null)
        setEncPassword('')
        setIsSuccess(false)
      }, 2000)
    } catch {
      toast.error('Decryption failed: Wrong password or corrupted file')
    } finally {
      setIsLoading(false)
    }
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
            <Unlock className="h-5 w-5 text-accent" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-lg">Decrypt File</h3>
            <p className="text-sm text-muted-foreground">
              Restore your encrypted files
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="encFile" className="text-sm font-medium">
              Encrypted File
            </Label>
            <Input
              id="encFile"
              type="file"
              onChange={(e) => setEncFile(e.target.files[0])}
              className="cursor-pointer transition-colors file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium hover:bg-secondary/50"
            />
            <AnimatePresence>
              {encFile && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-muted-foreground"
                >
                  {encFile.name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <Label htmlFor="encPassword" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="encPassword"
              type="password"
              placeholder="Enter your password"
              value={encPassword}
              onChange={(e) => setEncPassword(e.target.value)}
              className="transition-colors hover:bg-secondary/50 focus:bg-secondary/50"
            />
          </div>

          <Button
            onClick={handleDecryptLocal}
            disabled={isLoading || !encFile || !encPassword || isSuccess}
            className="relative w-full overflow-hidden bg-accent text-accent-foreground transition-all hover:bg-accent/90 hover:shadow-glow active:scale-[0.98] disabled:opacity-50"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </motion.div>
              ) : isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Success!
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Decrypt & Download
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </Card>
  )
}
