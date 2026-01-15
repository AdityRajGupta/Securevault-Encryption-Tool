import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { encryptFile } from "../../utils/crypto";
import { formatFileSize } from "../../lib/utils";

export default function EncryptUpload() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleEncryptAndUpload = async () => {
    if (!file) {
      toast.error("Please select a file to encrypt");
      return;
    }
    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Encrypting file...");

    try {
      const { blob, filename } = await encryptFile(file, password);

      // Download locally
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.loading("Uploading to server...", { id: toastId });

      // Upload to backend
      const form = new FormData();
      form.append("file", blob, filename);
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      toast.success(
        `File encrypted and uploaded! Server name: ${data.savedName}`,
        { id: toastId, duration: 5000 }
      );

      // Reset
      setFile(null);
      setPassword("");
    } catch (err) {
      toast.error("Encryption failed: " + err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-6 w-6 text-primary" />
          Encrypt & Upload File
        </CardTitle>
        <CardDescription>
          Secure your files with AES-256 encryption before uploading
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drag & Drop Zone */}
        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-all ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-2 text-sm font-medium">
            {file ? file.name : "Drag & drop your file here"}
          </p>
          <p className="text-xs text-muted-foreground">
            {file ? formatFileSize(file.size) : "or click to browse"}
          </p>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </motion.div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Encryption Password</label>
          <Input
            type="password"
            placeholder="Enter a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Remember this password - it cannot be recovered
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleEncryptAndUpload}
          disabled={loading || !file || !password}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
              />
              Processing...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Encrypt & Upload
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
