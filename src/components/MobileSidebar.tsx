import { 
  Search, 
  Compass, 
  Bookmark, 
  Settings, 
  Moon,
  Sun,
  ChevronRight,
  PlusCircle,
  X,
  Lightbulb
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../lib/utils"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  onOpenFavorites: () => void
  onReset: () => void
  isResultsView: boolean
  isLoggedIn: boolean
  onOpenLogin: () => void
}

const MENU_ITEMS = [
  { id: 'gerador', label: 'Gerador', icon: Compass },
  { id: 'favoritas', label: 'Favoritas', icon: Bookmark, hasChevron: true },
]

export function MobileSidebar({ 
  isOpen, 
  onClose, 
  onOpenFavorites, 
  onReset, 
  isResultsView,
  isLoggedIn,
  onOpenLogin
}: MobileSidebarProps) {
  const [searchValue, setSearchValue] = useState("")
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

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
            className="fixed left-0 top-0 bottom-0 w-[300px] bg-[#0A0A0A] border-r border-white/5 z-[210] flex flex-col"
          >
            {/* Header / Logo */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-black shadow-lg">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-white tracking-tight leading-none">
                    100ideias
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium mt-1">Plataforma</span>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 mb-8">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Filtrar menu..."
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-11 pr-10 text-sm text-white placeholder-gray-600 outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Nav Content */}
            <div className="flex-1 overflow-y-auto px-4 space-y-8">
              {/* Plataforma Section */}
              <div>
                <p className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4">Plataforma</p>
                <nav className="space-y-1.5">
                  {filteredItems.map(item => (
                    <MenuButton 
                      key={item.id}
                      icon={item.icon} 
                      label={item.label} 
                      active={item.id === 'gerador' ? !isResultsView : false} 
                      onClick={() => { 
                        if (item.id === 'gerador') onReset();
                        else onOpenFavorites();
                        onClose(); 
                      }}
                      hasChevron={item.hasChevron}
                    />
                  ))}
                  {filteredItems.length === 0 && (
                    <p className="px-3 py-4 text-xs text-gray-600">Nada encontrado</p>
                  )}
                </nav>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Theme Toggle with PC-like animations */}
                <motion.button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  whileHover={{ scale: 1.1 }}
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
                      {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </motion.div>
                  </AnimatePresence>
                  <motion.div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity blur-md -z-0 bg-white/10"
                  />
                </motion.button>

                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group">
                  <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                </button>
              </div>
              <button 
                onClick={isLoggedIn ? undefined : () => { onOpenLogin(); onClose(); }}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold shadow-sm"
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

function MenuButton({ 
  icon: Icon, 
  label, 
  active, 
  onClick,
  hasChevron 
}: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick?: () => void,
  hasChevron?: boolean 
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all text-sm font-medium",
        active 
          ? "bg-white/5 text-white border border-white/5 shadow-inner" 
          : "text-gray-500 hover:text-white hover:bg-white/[0.03]"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn("w-4.5 h-4.5 transition-colors", active ? "text-white" : "text-gray-500")} />
        <span>{label}</span>
      </div>
      {hasChevron && <ChevronRight className="w-4 h-4 text-gray-700" />}
    </button>
  )
}
