import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, Copy, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ServerDownload() {
  const [savedName, setSavedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    if (!savedName) {
      toast.error("Please enter the server file name");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Downloading from server...");

    try {
      const res = await fetch(`http://localhost:5000/download/${savedName}`);
      if (!res.ok) throw new Error("File not found");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = savedName + ".enc";
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success("File downloaded successfully!", { id: toastId });
      setSavedName("");
    } catch (err) {
      toast.error("Download failed: " + err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(savedName);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-6 w-6 text-primary" />
          Download from Server
        </CardTitle>
        <CardDescription>
          Retrieve your encrypted files using the server file name
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Server Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Server File Name</label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="e.g., a1b2c3d4e5f6"
              value={savedName}
              onChange={(e) => setSavedName(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              disabled={!savedName}
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-accent" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This is the unique identifier provided after uploading
          </p>
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          disabled={loading || !savedName}
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
              Downloading...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download File
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
