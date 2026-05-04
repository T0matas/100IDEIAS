import { motion } from "framer-motion"
import { Menu, Lightbulb, ThumbsUp } from "lucide-react"

interface MobileHeaderProps {
  onMenuClick: () => void
  onFavoritesClick: () => void
}

export function MobileHeader({ onMenuClick, onFavoritesClick }: MobileHeaderProps) {
  return (
    <header className="h-14 bg-[#0A0A0A] border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-black">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">
            100<span className="text-gray-500">ideias</span>
          </span>
        </div>
      </div>

      <motion.button 
        onClick={onFavoritesClick}
        whileHover={{ 
          scale: 1.2, 
          rotate: -12,
          transition: { type: "spring", stiffness: 400, damping: 10 }
        }}
        className="p-2 text-gray-500 hover:text-white transition-colors"
      >
        <ThumbsUp className="w-5 h-5" />
      </motion.button>
    </header>
  )
}
