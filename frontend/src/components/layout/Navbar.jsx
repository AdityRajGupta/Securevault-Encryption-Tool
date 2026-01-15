import React from "react";
import { motion } from "framer-motion";
import { Lock, Moon, Sun } from "lucide-react";
import Button from "../ui/Button";

export default function Navbar({ darkMode, toggleDarkMode }) {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">SecureVault</h1>
            <p className="text-xs text-muted-foreground">End-to-end encryption</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
