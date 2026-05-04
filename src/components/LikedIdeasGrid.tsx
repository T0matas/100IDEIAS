import { motion, AnimatePresence } from "framer-motion"
import { X, ThumbsUp, Bookmark, Trash2, Lightbulb } from "lucide-react"
import { cn } from "../lib/utils"



interface LikedIdeasGridProps {
  isOpen: boolean
  onClose: () => void
  likedIdeas: any[]
  onRemoveLiked: (id: number) => void
  onToggleFavorite: (idea: any) => void
  favoriteIdeas: any[]
}

export function LikedIdeasGrid({ 
  isOpen, 
  onClose, 
  likedIdeas, 
  onRemoveLiked, 
  onToggleFavorite,
  favoriteIdeas 
}: LikedIdeasGridProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl h-[85vh] bg-[#0F0F0F] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: -12,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-colors group/icon"
                >
                  <ThumbsUp className="w-6 h-6 text-gray-500 group-hover/icon:text-white transition-colors" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">Seus Gostos</h2>
                  <p className="text-xs text-gray-500 font-medium">{likedIdeas.length} {likedIdeas.length === 1 ? 'ideia' : 'ideias'} guardadas</p>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white flex items-center justify-center transition-all active:scale-90"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Scrollable Grid Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-[#0A0A0A]/50">
              {likedIdeas.length === 0 ? (
                <div className="flex flex-col space-y-12">
                  <div className="flex flex-col items-start text-left space-y-2 pt-4">
                    <div className="w-12 h-1 bg-white/20 rounded-full mb-4" />
                    <h3 className="text-3xl font-bold text-white tracking-tight">Nenhuma ideia marcada como gosto</h3>
                    <p className="text-gray-500 text-sm">As ideias que você marcar como gosto aparecerão nesta lista</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-20 pointer-events-none select-none">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="group relative bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 flex flex-col h-[280px]"
                      >
                        <div className="flex items-start justify-between mb-8">
                          <div className="w-10 h-10 rounded-xl bg-white/10" />
                          <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white/5" />
                            <div className="w-8 h-8 rounded-lg bg-white/5" />
                          </div>
                        </div>

                        <div className="space-y-4 flex-1">
                          <div className="w-3/4 h-6 bg-white/10 rounded-lg" />
                          <div className="space-y-2">
                            <div className="w-full h-3 bg-white/5 rounded-md" />
                            <div className="w-full h-3 bg-white/5 rounded-md" />
                            <div className="w-2/3 h-3 bg-white/5 rounded-md" />
                          </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-white/10" />
                          <div className="w-20 h-2 bg-white/5 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedIdeas.map((idea, index) => {
                    const isFavorite = favoriteIdeas.some(fav => fav.id === idea.id);
                    return (
                      <motion.div
                        key={idea.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="group relative bg-[#141414] border border-white/5 rounded-3xl p-6 hover:border-white/10 hover:bg-white/[0.02] transition-all flex flex-col h-full"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                            <Lightbulb className="w-4.5 h-4.5" />
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => onToggleFavorite(idea)}
                              className={cn(
                                "w-8 h-8 rounded-lg border flex items-center justify-center transition-all active:scale-90",
                                isFavorite 
                                  ? "bg-white/20 border-white/30 text-white" 
                                  : "bg-white/[0.03] border-white/5 text-gray-500 hover:text-white"
                              )}
                            >
                              <Bookmark className={cn("w-3.5 h-3.5", isFavorite && "fill-current")} />
                            </button>
                            <button 
                              onClick={() => onRemoveLiked(idea.id)}
                              className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center active:scale-90"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-white mb-2 leading-tight">
                          {idea.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed flex-1">
                          {idea.description}
                        </p>

                        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Salva</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
