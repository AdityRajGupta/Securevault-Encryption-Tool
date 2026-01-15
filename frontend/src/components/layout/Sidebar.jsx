import React from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, Download, History, Settings } from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { icon: Lock, label: "Encrypt & Upload", id: "encrypt" },
  { icon: Unlock, label: "Decrypt File", id: "decrypt" },
  { icon: Download, label: "Download from Server", id: "download" },
  { icon: History, label: "Recent Files", id: "history" },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="hidden lg:flex w-64 flex-col gap-4 border-r bg-card/50 p-4"
    >
      <div className="space-y-2">
        <h2 className="mb-4 px-4 text-lg font-semibold">Actions</h2>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-auto">
        <motion.button
          whileHover={{ x: 4 }}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
        >
          <Settings className="h-5 w-5" />
          Settings
        </motion.button>
      </div>
    </motion.aside>
  );
}
