import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Upload, FileCheck, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { encryptFile } from '@/utils/crypto'

export default function EncryptSection({ onServerNameUpdate }) {
  const [file, setFile] = useState(null)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleEncryptAndUpload() {
    if (!file) {
      toast.error("Select a file to encrypt")
      return
    }
    if (!password) {
      toast.error("Enter a password")
      return
    }

    setIsLoading(true)
    setIsSuccess(false)
    
    try {
      const { blob, filename } = await encryptFile(file, password)
      
      // Download locally
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      // Upload to backend
      const form = new FormData()
      form.append('file', blob, filename)
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: form
      })
      const data = await res.json()
      
      onServerNameUpdate(data.savedName)
      setIsSuccess(true)
      toast.success('File encrypted and uploaded successfully')
      
      // Reset after delay
      setTimeout(() => {
        setFile(null)
        setPassword('')
        setIsSuccess(false)
      }, 2000)
    } catch (err) {
      toast.error('Encryption failed: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="relative overflow-hidden p-6 transition-shadow duration-300 hover:shadow-glow-sm">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
      
      <div className="relative space-y-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Lock className="h-5 w-5 text-accent" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-lg">Encrypt File</h3>
            <p className="text-sm text-muted-foreground">
              Secure your files with AES-256 encryption
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-medium">
              File
            </Label>
            <div className="relative">
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="cursor-pointer transition-colors file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium hover:bg-secondary/50"
              />
              <AnimatePresence>
                {file && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <FileCheck className="h-4 w-4 text-accent" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {file && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-muted-foreground"
                >
                  {file.name} • {(file.size / 1024).toFixed(1)} KB
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="transition-colors hover:bg-secondary/50 focus:bg-secondary/50"
            />
          </div>

          <Button
            onClick={handleEncryptAndUpload}
            disabled={isLoading || !file || !password || isSuccess}
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
                  <Upload className="mr-2 h-4 w-4" />
                  Encrypt & Upload
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </Card>
  )
}
