import React, { useState } from "react";
import { motion } from "framer-motion";
import { Unlock, FileCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { decryptFile } from "../../utils/crypto";
import { formatFileSize } from "../../lib/utils";

export default function DecryptFile() {
  const [encFile, setEncFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDecrypt = async () => {
    if (!encFile) {
      toast.error("Please select an encrypted file");
      return;
    }
    if (!password) {
      toast.error("Please enter the password");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Decrypting file...");

    try {
      const buf = await encFile.arrayBuffer();
      const plainBlob = await decryptFile(buf, password);
      const originalName = encFile.name.replace(/\.enc$/, "") || "decrypted.bin";

      const url = URL.createObjectURL(plainBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = originalName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success("File decrypted successfully!", { id: toastId });
      setEncFile(null);
      setPassword("");
    } catch {
      toast.error("Decryption failed. Wrong password or corrupted file.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Unlock className="h-6 w-6 text-accent" />
          Decrypt File
        </CardTitle>
        <CardDescription>
          Decrypt your AES-256 encrypted files locally
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Encrypted File (.enc)</label>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8 hover:border-accent/50 transition-all"
          >
            <div className="text-center">
              <FileCheck className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">
                {encFile ? encFile.name : "Select encrypted file"}
              </p>
              {encFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(encFile.size)}
                </p>
              )}
            </div>
            <input
              type="file"
              accept=".enc"
              onChange={(e) => setEncFile(e.target.files[0])}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </motion.div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Decryption Password</label>
          <Input
            type="password"
            placeholder="Enter password used during encryption"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Decrypt Button */}
        <Button
          onClick={handleDecrypt}
          disabled={loading || !encFile || !password}
          className="w-full"
          size="lg"
          variant="secondary"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
              />
              Decrypting...
            </>
          ) : (
            <>
              <Unlock className="mr-2 h-4 w-4" />
              Decrypt File
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
