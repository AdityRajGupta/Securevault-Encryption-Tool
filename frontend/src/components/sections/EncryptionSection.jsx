import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Upload, FileCheck, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { encryptFile } from '@/utils/crypto'

export default function EncryptionSection({ onServerNameUpdate }) {
  const [file, setFile] = useState(null)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleEncryptAndUpload() {
    if (!file) {
      toast.error("Please select a file to encrypt")
      return
    }
    if (!password) {
      toast.error("Please enter a password")
      return
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    setIsSuccess(false)
    
    try {
      const { blob, filename } = await encryptFile(file, password)
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      const form = new FormData()
      form.append('file', blob, filename)
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: form
      })
      const data = await res.json()
      
      onServerNameUpdate(data.savedName)
      setIsSuccess(true)
      toast.success('🎉 File encrypted and uploaded successfully!')
      
      setTimeout(() => {
        setFile(null)
        setPassword('')
        setIsSuccess(false)
      }, 3000)
    } catch (err) {
      toast.error('❌ Encryption failed: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Encrypt Files</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload and encrypt your files with military-grade AES-256 encryption
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="group relative overflow-hidden p-6 transition-all duration-300 hover:shadow-glow-sm hover:border-accent/30">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 transition-all duration-300 group-hover:from-accent/3 group-hover:to-transparent pointer-events-none" />
          
          <div className="relative space-y-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 transition-colors group-hover:bg-accent/20"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Lock className="h-5 w-5 text-accent" />
              </motion.div>
              <div>
                <h4 className="font-semibold">File & Password</h4>
                <p className="text-sm text-muted-foreground">
                  Select your file and create a strong password
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <div className="relative">
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    disabled={isLoading}
                    className="cursor-pointer transition-all duration-200 file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:transition-colors hover:bg-secondary/50 focus:ring-2 focus:ring-accent/20"
                  />
                  <AnimatePresence>
                    {file && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
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
                      className="text-xs text-muted-foreground flex items-center gap-1"
                    >
                      <span className="font-medium">{file.name}</span>
                      <span>•</span>
                      <span>{(file.size / 1024).toFixed(1)} KB</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter a strong password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="transition-all duration-200 hover:bg-secondary/50 focus:bg-secondary/50 focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <Button
                onClick={handleEncryptAndUpload}
                disabled={isLoading || !file || !password || isSuccess}
                className="relative w-full overflow-hidden bg-accent text-accent-foreground transition-all duration-200 hover:bg-accent/90 hover:shadow-glow disabled:opacity-50"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center"
                    >
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Encrypting...
                    </motion.div>
                  ) : isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="flex items-center"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Success!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
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

        <Card className="relative overflow-hidden p-6 bg-accent/5 border-accent/20 transition-all duration-300 hover:border-accent/30">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Security Information</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your files are encrypted using industry-standard AES-256 encryption
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              {[
                'All encryption happens in your browser',
                'Your password never leaves your device',
                'Files are automatically downloaded after encryption',
                'Encrypted files are uploaded to secure storage'
              ].map((text, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <motion.div 
                    className="h-1.5 w-1.5 rounded-full bg-accent"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  />
                  <span className="text-muted-foreground">{text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
