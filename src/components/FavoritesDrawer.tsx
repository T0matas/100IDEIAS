import { motion, AnimatePresence } from "framer-motion"
import { X, Bookmark, Trash2, Lightbulb } from "lucide-react"

export function FavoritesDrawer({ isOpen, onClose, likedIdeas, onRemoveFavorite }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-[#0A0A0A] border-l border-white/5 z-[210] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#121212]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                  <Bookmark className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">Suas Favoritas</h2>
                  <p className="text-xs text-gray-500 font-medium">{likedIdeas.length} {likedIdeas.length === 1 ? 'ideia' : 'ideias'} guardadas</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer p-2 rounded-xl bg-white/5 hover:bg-white/10">
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
                      <Bookmark className="w-8 h-8 text-white/20" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Nenhuma favorita ainda</h3>
                    <p className="text-gray-500 text-sm px-4">
                      Quando você curtir uma ideia genial, ela ficará guardada com segurança aqui.
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {likedIdeas.map((idea: any) => (
                        <motion.div 
                          key={idea.id} 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 50, scale: 0.9 }}
                          transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
                          className="relative p-5 bg-[#1A1A1A] rounded-2xl border border-white/5 hover:border-white/20 transition-all shadow-[0_4px_0_rgb(15,15,15)] group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Lightbulb className="w-4 h-4 text-white" />
                              <h4 className="text-white font-bold">{idea.title}</h4>
                            </div>
                            <button 
                              onClick={() => onRemoveFavorite(idea.id)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer -mt-1 -mr-1"
                              title="Remover dos favoritos"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed pr-2">{idea.description}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
