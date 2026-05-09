import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, Palette, Camera, Mail, ExternalLink, ChevronRight } from "lucide-react"
import { cn } from "../lib/utils"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail?: string
}

export function SettingsModal({ isOpen, onClose, userEmail }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | null>('profile')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // On mobile, start with null tab to show menu
  useEffect(() => {
    if (isOpen && isMobile) {
      setActiveTab(null)
    } else if (isOpen && !isMobile && !activeTab) {
      setActiveTab('profile')
    }
  }, [isOpen, isMobile])

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load data when modal opens or userEmail changes
  useEffect(() => {
    if (isOpen) {
      const savedAvatar = localStorage.getItem(`avatar_${userEmail || 'guest'}`)
      const savedName = localStorage.getItem(`name_${userEmail || 'guest'}`)
      const defaultName = userEmail ? userEmail.split('@')[0] : "Usuário"
      
      setAvatarUrl(savedAvatar)
      setDisplayName(savedName || defaultName)
    }
  }, [isOpen, userEmail])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setAvatarUrl(base64)
        localStorage.setItem(`avatar_${userEmail || 'guest'}`, base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNameChange = (newName: string) => {
    setDisplayName(newName)
    // Only persist if it's not empty/just spaces
    if (newName.trim().length > 0) {
      localStorage.setItem(`name_${userEmail || 'guest'}`, newName)
    }
  }

  if (!isOpen) return null

  const userHandle = displayName.trim() 
    ? `@${displayName.trim().toLowerCase().replace(/\s+/g, '')}` 
    : ""

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[850px] md:h-[600px] h-full max-h-[90vh] bg-[#0F0F0F] border border-white/10 rounded-[1.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden"
          >
            {/* Sidebar */}
            <div className={cn(
              "w-full md:w-[240px] border-r border-white/5 bg-[#0A0A0A] p-6 flex flex-col",
              activeTab && "hidden md:flex"
            )}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white tracking-tight">Settings</h2>
                <button 
                  onClick={onClose}
                  className="md:hidden p-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 px-3">Account</p>
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'profile' ? "bg-white/10 text-white" : "text-gray-500 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </div>
                      <ChevronRight className="w-4 h-4 md:hidden" />
                    </button>
                    <button
                      onClick={() => setActiveTab('appearance')}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'appearance' ? "bg-white/10 text-white" : "text-gray-500 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Palette className="w-4 h-4" />
                        <span>Appearance</span>
                      </div>
                      <ChevronRight className="w-4 h-4 md:hidden" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className={cn(
              "flex-1 flex flex-col min-w-0 bg-[#0F0F0F]",
              !activeTab && "hidden md:flex"
            )}>
              <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveTab(null)}
                    className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <h3 className="text-sm md:text-base font-bold text-white">
                    {activeTab === 'profile' ? 'Account' : 'Appearance'}
                  </h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                {activeTab === 'profile' && (
                  <div className="space-y-10">
                    {/* Profile Header Card */}
                    <div className="p-4 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-xl overflow-hidden shrink-0">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            displayName.substring(0, 1).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-lg font-bold text-white truncate">{displayName}</h4>
                          <p className="text-sm text-gray-500 truncate">{userHandle}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3 md:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all"
                      >
                        <Camera className="w-4 h-4 md:w-3.5 md:h-3.5" />
                        Change Avatar
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                      />
                    </div>

                    {/* Display Name Section */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Display Name</label>
                      <input 
                        type="text" 
                        value={displayName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/30 transition-all"
                      />
                    </div>

                    <div className="h-px bg-white/5 w-full" />

                    {/* Public Profile Section */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-white">Public Profile</h4>
                      <div className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer">
                        <p className="text-sm text-gray-400 pr-4">
                          Public profile settings have moved to <span className="text-white font-medium">Studio</span>
                        </p>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-all shrink-0" />
                      </div>
                    </div>

                    {/* Connected Accounts */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">Connected accounts</h4>
                        <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-all group">
                          Manage <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 shrink-0">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{userEmail || "danieltomatas0@gmail.com"}</p>
                            <p className="text-xs text-gray-500">Email</p>
                          </div>
                        </div>
                        <span className="w-fit px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Primary</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-white">Theme</h4>
                      <p className="text-xs text-gray-500">Customize how 100Ideias looks on your device.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-white/20 bg-white/5 flex flex-col gap-3 cursor-pointer">
                          <div className="h-20 bg-[#0A0A0A] rounded-lg border border-white/10" />
                          <span className="text-xs font-bold text-white">Dark Mode</span>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 hover:border-white/10 bg-transparent flex flex-col gap-3 cursor-pointer">
                          <div className="h-20 bg-white rounded-lg border border-black/5" />
                          <span className="text-xs font-bold text-gray-500">Light Mode</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
