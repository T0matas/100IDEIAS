import { Lightbulb, Bookmark, Search, Settings, PlusCircle, Sun, Moon, ChevronDown, HelpCircle, ThumbsUp, Compass } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../lib/utils"

interface SidebarProps {
  onOpenGostadas: () => void
  onOpenFavorites: () => void
  onReset: () => void
  isResultsView: boolean
  isLoggedIn: boolean
  userEmail?: string
  onLogin: () => void
}

const MENU_ITEMS = [
  { id: 'gerador', label: 'Gerador', icon: Compass, category: 'Criar' },
  { id: 'gostadas', label: 'Gostos', icon: ThumbsUp, category: 'Salvo' },
  { id: 'favoritas', label: 'Favoritas', icon: Bookmark, category: 'Salvo' },
]

export function Sidebar({ onOpenGostadas, onOpenFavorites, onReset, isResultsView, isLoggedIn, userEmail, onLogin }: SidebarProps) {
  const [searchValue, setSearchValue] = useState("")
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
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
      {/* Logo Area */}
      <div 
        className="relative p-5 pb-1 w-full"
        onMouseEnter={() => setIsUserMenuOpen(true)}
        onMouseLeave={() => setIsUserMenuOpen(false)}
      >
        <button className="flex items-center space-x-2.5 w-full hover:bg-white/5 p-2 -ml-2 rounded-xl transition-colors group">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-black shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <span className="text-base font-bold text-white tracking-tight flex-1 text-left">
            100<span className="text-gray-500">ideias</span>
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </button>

        <AnimatePresence>
          {isUserMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-5 top-[64px] w-52 bg-[#121212] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-white/10 flex flex-col">
                <span className="text-sm font-medium text-white truncate">
                  {isLoggedIn ? (userEmail ? userEmail.split('@')[0] : "Conta de Login") : "Não conectado"}
                </span>
                <span className="text-xs text-gray-500 mt-0.5 truncate">
                  {isLoggedIn ? (userEmail || "usuario@email.com") : "Faça login para salvar"}
                </span>
              </div>
              <div className="p-1.5">
                <button className="w-full text-left px-2.5 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center space-x-2 cursor-pointer">
                  <HelpCircle className="w-4 h-4" />
                  <span>Ajuda</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
        {['Criar', 'Salvo', 'Social'].map(category => {
          const categoryItems = filteredItems.filter(item => item.category === category)

          return (
            <div key={category} className="mb-6">
              <p className="text-[10px] font-bold text-gray-600 mb-2 px-3 tracking-widest uppercase">{category}</p>
              <nav className="space-y-1">
                {categoryItems.map(item => (
                  <button 
                    key={item.id}
                    onClick={
                      item.id === 'gerador' ? onReset : 
                      item.id === 'gostadas' ? onOpenGostadas : 
                      onOpenFavorites
                    }
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium outline-none transition-all group",
                      item.id === 'gerador' && !isResultsView 
                        ? "bg-white/[0.05] text-white" 
                        : "text-gray-500 hover:text-white hover:bg-white/[0.03]"
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 transition-colors text-gray-500 group-hover:text-white"
                    )} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          )
        })}
        {filteredItems.length === 0 && (
          <p className="px-3 py-4 text-xs text-gray-600">Nada encontrado</p>
        )}
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
