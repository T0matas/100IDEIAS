import { motion, AnimatePresence } from "framer-motion"
import { X, ThumbsUp, Trash2, Lightbulb, Bookmark } from "lucide-react"
import { cn } from "../lib/utils"

export function FavoritesDrawer({ isOpen, onClose, likedIdeas, onRemoveFavorite, title, type }: any) {
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
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl h-[85vh] bg-[#0F0F0F] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#121212]/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  {type === 'liked' ? (
                    <ThumbsUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">{title || "Suas Favoritas"}</h2>
                  <p className="text-xs text-gray-500 font-medium">{likedIdeas.length} {likedIdeas.length === 1 ? 'ideia' : 'ideias'} guardadas</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white flex items-center justify-center transition-all active:scale-90">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {likedIdeas.length === 0 ? (
                  <motion.div 
                    key="empty-favorites"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center justify-center h-full text-center space-y-4"
                  >
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-2">
                      {type === 'liked' ? <ThumbsUp className="w-8 h-8 text-white/20" /> : <Bookmark className="w-8 h-8 text-white/20" />}
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {type === 'liked' ? "Nenhuma ideia curtida ainda" : "Nenhuma ideia favorita ainda"}
                    </h3>
                    <p className="text-gray-500 text-sm px-4">
                      {type === 'liked' 
                        ? "Quando você curtir uma ideia incrível, ela ficará guardada aqui." 
                        : "As ideias que você marcar como favoritas aparecerão nesta lista."}
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {likedIdeas.map((idea: any, index: number) => (
                        <motion.div 
                          key={idea.id} 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.03 }}
                          className="group relative bg-[#141414] border border-white/5 rounded-3xl p-6 hover:border-white/10 hover:bg-white/[0.02] transition-all flex flex-col h-full"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                              <Lightbulb className="w-4.5 h-4.5" />
                            </div>
                            <div className="flex gap-2">
                              <button 
                                className="w-8 h-8 rounded-lg border bg-white/20 border-white/30 text-white flex items-center justify-center transition-all active:scale-90"
                                title="Favorito"
                              >
                                <Bookmark className="w-3.5 h-3.5 fill-current" />
                              </button>
                              <button 
                                onClick={() => onRemoveFavorite(idea.id)}
                                className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center active:scale-90"
                                title="Remover"
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
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
