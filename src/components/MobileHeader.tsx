import { motion } from "framer-motion"
import { Menu, Lightbulb, ThumbsUp } from "lucide-react"

interface MobileHeaderProps {
  onMenuClick: () => void
  onFavoritesClick: () => void
}

export function MobileHeader({ onMenuClick, onFavoritesClick }: MobileHeaderProps) {
  return (
    <header className="h-16 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-5 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-400 hover:text-white transition-all active:scale-90"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-black shadow-lg shadow-white/5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            100<span className="text-gray-500">ideias</span>
          </span>
        </div>
      </div>

      <motion.button 
        onClick={onFavoritesClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white border border-white/5 transition-all"
      >
        <ThumbsUp className="w-5 h-5" />
      </motion.button>
    </header>
  )
}
