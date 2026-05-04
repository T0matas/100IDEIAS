import { 
  Search, 
  Compass, 
  Bookmark, 
  Settings, 
  Moon,
  Sun,
  PlusCircle,
  X,
  Lightbulb,
  ChevronDown,
  HelpCircle,
  ThumbsUp,
  Users
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../lib/utils"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  onOpenGostadas: () => void
  onOpenFavorites: () => void
  onReset: () => void
  isResultsView: boolean
  isLoggedIn: boolean
  userEmail?: string
  onOpenLogin: () => void
  onOpenCommunity: () => void
  currentView: 'generator' | 'community'
}

const MENU_ITEMS = [
  { id: 'gerador', label: 'Gerador', icon: Compass, category: 'Criar' },
  { id: 'gostadas', label: 'Gostos', icon: ThumbsUp, category: 'Salvo' },
  { id: 'favoritas', label: 'Favoritas', icon: Bookmark, category: 'Salvo' },
  { id: 'comunidade', label: 'Comunidade', icon: Users, category: 'Social' },
]

export function MobileSidebar({ 
  isOpen, 
  onClose, 
  onOpenGostadas,
  onOpenFavorites, 
  onReset, 
  isResultsView,
  isLoggedIn,
  userEmail,
  onOpenLogin,
  onOpenCommunity,
  currentView
}: MobileSidebarProps) {
  const [searchValue, setSearchValue] = useState("")
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }, [theme])

  const filteredItems = MENU_ITEMS.filter(item => 
    item.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#0A0A0A] border-r border-white/5 z-[210] flex flex-col"
          >
            {/* Header / Logo */}
            <div className="p-5 pb-2">
              <div className="flex items-center justify-between mb-6">
                <div 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-black shadow-lg group-active:scale-95 transition-transform shrink-0">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-bold text-white tracking-tight leading-none">
                        100<span className="text-gray-500">ideias</span>
                      </span>
                      <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform", isUserMenuOpen && "rotate-180")} />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all active:scale-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#121212] border border-white/10 rounded-xl mb-4 shadow-2xl">
                      <div className="p-3 border-b border-white/10 flex flex-col">
                        <span className="text-sm font-medium text-white truncate">
                          {isLoggedIn ? (userEmail ? userEmail.split('@')[0] : "Conta de Login") : "Não conectado"}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5 truncate">
                          {isLoggedIn ? (userEmail || "usuario@email.com") : "Faça login para salvar"}
                        </span>
                      </div>
                      <div className="p-1.5">
                        <button className="w-full text-left px-2.5 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center space-x-2">
                          <HelpCircle className="w-4 h-4" />
                          <span>Ajuda</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search */}
            <div className="px-4 mb-8">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Filtrar menu..."
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all"
                />
              </div>
            </div>

            {/* Nav Content */}
            <div className="flex-1 overflow-y-auto px-3 space-y-6">
              {['Criar', 'Salvo', 'Social'].map(category => {
                const categoryItems = filteredItems.filter(item => item.category === category)
                
                return (
                  <div key={category} className="mb-6">
                    <p className="text-[10px] font-bold text-gray-600 mb-2 px-3 tracking-widest uppercase">{category}</p>
                    <nav className="space-y-1">
                      {categoryItems.map(item => (
                        <button 
                          key={item.id}
                          onClick={() => {
                            if (item.id === 'gerador') onReset();
                            else if (item.id === 'gostadas') onOpenGostadas();
                            else if (item.id === 'favoritas') onOpenFavorites();
                            else onOpenCommunity();
                            onClose();
                          }}
                          className={cn(
                            "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium outline-none",
                            (item.id === 'gerador' && currentView === 'generator' && !isResultsView) || (item.id === 'comunidade' && currentView === 'community')
                              ? "bg-white/[0.05] text-white shadow-inner" 
                              : "text-gray-500 hover:text-white hover:bg-white/[0.03]"
                          )}
                        >
                          <item.icon className={cn(
                            "w-4.5 h-4.5 transition-colors",
                            (item.id === 'gerador' && currentView === 'generator' && !isResultsView) || (item.id === 'comunidade' && currentView === 'community') ? "text-white" : "text-gray-500"
                          )} />
                          <span>{item.label}</span>
                        </button>
                      ))}
                      {categoryItems.length === 0 && (
                        <div className="h-2" /> 
                      )}
                    </nav>
                  </div>
                )
              })}
              {filteredItems.length === 0 && (
                <p className="px-3 py-4 text-xs text-gray-600">Nada encontrado</p>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <motion.button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-white bg-white/5 border border-transparent hover:border-white/5 relative overflow-hidden group"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={theme}
                      initial={{ y: 20, opacity: 0, rotate: -90 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      exit={{ y: -20, opacity: 0, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="relative z-10"
                    >
                      {theme === 'dark' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>

                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group">
                  <Settings className="w-4.5 h-4.5 group-hover:rotate-45 transition-transform duration-300" />
                </button>
              </div>
              <button 
                onClick={isLoggedIn ? undefined : () => { onOpenLogin(); onClose(); }}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
              >
                {isLoggedIn ? (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish</span>
                  </>
                ) : (
                  <span>Log in</span>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
