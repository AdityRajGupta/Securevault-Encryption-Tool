import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import EncryptUpload from "./components/features/EncryptUpload";
import DecryptFile from "./components/features/DecryptFile";
import ServerDownload from "./components/features/ServerDownload";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("encrypt");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const renderContent = () => {
    switch (activeTab) {
      case "encrypt":
        return <EncryptUpload />;
      case "decrypt":
        return <DecryptFile />;
      case "download":
        return <ServerDownload />;
      case "history":
        return (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">History feature coming soon...</p>
          </div>
        );
      default:
        return <EncryptUpload />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
