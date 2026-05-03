import { Lightbulb, Compass, Bookmark, Search, Settings, PlusCircle, Sun, Moon } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../lib/utils"

interface SidebarProps {
  onOpenFavorites: () => void
  onReset: () => void
  isResultsView: boolean
  isLoggedIn: boolean
  onLogin: () => void
}

const MENU_ITEMS = [
  { id: 'gerador', label: 'Gerador', icon: Compass, category: 'Plataforma' },
  { id: 'favoritas', label: 'Favoritas', icon: Bookmark, category: 'Plataforma' },
]

export function Sidebar({ onOpenFavorites, onReset, isResultsView, isLoggedIn, onLogin }: SidebarProps) {
  const [searchValue, setSearchValue] = useState("")
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }, [theme])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const filteredItems = MENU_ITEMS.filter(item => 
    item.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <aside className="w-60 h-screen border-r border-white/5 bg-[#0A0A0A] flex flex-col fixed left-0 top-0 z-[150]">
      {/* Logo */}
      <div className="p-5 flex items-center space-x-2.5 mb-1">
        <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-black">
          <Lightbulb className="w-4 h-4" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">
          100<span className="text-gray-500">ideias</span>
        </span>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Filtrar menu..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2 pl-10 pr-10 text-sm text-white placeholder-gray-600 outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 px-1.5 py-0.5 rounded-md border border-white/10 bg-white/[0.02] text-[9px] text-gray-600 font-bold tracking-tight pointer-events-none uppercase">
            <span>Ctrl</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-3 flex-1 overflow-y-auto custom-scrollbar">
        <div className="mb-6">
          <p className="text-[10px] font-bold text-gray-600 mb-2 px-3 tracking-widest uppercase">Plataforma</p>
          <nav className="space-y-1">
            {filteredItems.map(item => (
              <button 
                key={item.id}
                onClick={item.id === 'gerador' ? onReset : onOpenFavorites}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all cursor-pointer text-sm font-medium",
                  item.id === 'gerador' && !isResultsView 
                    ? "bg-white/5 text-white border border-white/5 shadow-sm" 
                    : "text-gray-500 hover:text-white hover:bg-white/[0.03]"
                )}
              >
                <item.icon className={cn("w-4 h-4", item.id === 'gerador' && !isResultsView ? "text-white" : "text-gray-500")} />
                <span>{item.label}</span>
              </button>
            ))}
            {filteredItems.length === 0 && (
              <p className="px-3 py-4 text-xs text-gray-600">Nada encontrado</p>
            )}
          </nav>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <motion.button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-500 hover:text-white rounded-lg cursor-pointer relative w-9 h-9 flex items-center justify-center overflow-hidden border border-transparent hover:border-white/5 shadow-inner group"
            title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: 20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -20, opacity: 0, rotate: 90 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                className="relative z-10"
              >
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Background Glow Effect */}
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity blur-md -z-0 bg-white/10"
            />
          </motion.button>
          <button className="p-2 text-gray-500 hover:text-white hover:bg-white/[0.03] rounded-lg transition-all cursor-pointer group" title="Configurações">
            <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
          </button>
        </div>
        <button 
          onClick={isLoggedIn ? undefined : onLogin}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.03] transition-all text-xs font-semibold cursor-pointer"
        >
          {isLoggedIn ? (
            <>
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Publish</span>
            </>
          ) : (
            <span>Log in</span>
          )}
        </button>
      </div>
    </aside>
  )
}
