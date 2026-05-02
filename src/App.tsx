import { useState } from "react"
import { Sidebar } from "./components/Sidebar"
import { GeneratorHeader } from "./components/GeneratorHeader"
import { SkeletonGrid } from "./components/SkeletonGrid"
import { IdeaSwiper } from "./components/IdeaSwiper"
import { FavoritesDrawer } from "./components/FavoritesDrawer"
import { AnimatePresence, motion } from "framer-motion"
import { Settings } from "lucide-react"

function App() {
  const [hasGenerated, setHasGenerated] = useState(false)
  const [likedIdeas, setLikedIdeas] = useState<any[]>([])
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans flex">
      <Sidebar onOpenFavorites={() => setIsFavoritesOpen(true)} />
      <main className="flex-1 ml-64 relative min-h-screen flex flex-col">
        <button 
          className="absolute top-8 right-8 z-50 p-2.5 bg-[#1A1A1A] border border-white/5 hover:border-white/20 hover:bg-[#222222] rounded-xl text-gray-400 hover:text-white transition-all shadow-lg cursor-pointer flex items-center justify-center group" 
          title="Configurações"
        >
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
        </button>
        
        <GeneratorHeader 
          onGenerate={() => setHasGenerated(true)} 
          isGenerating={hasGenerated}
        />
        
        <div className="border-t border-white/5 w-full"></div>
        
        <div className="flex-1 bg-[#0A0A0A]">
          <AnimatePresence mode="wait">
            {hasGenerated ? (
              <motion.div 
                key="swiper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="pt-16 pb-24 flex flex-col items-center w-full min-h-[600px]"
              >
                <IdeaSwiper 
                  likedIdeas={likedIdeas} 
                  setLikedIdeas={setLikedIdeas} 
                  onReset={() => {
                    setHasGenerated(false);
                    setLikedIdeas([]);
                  }}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="skeleton"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full pb-24"
              >
                <SkeletonGrid />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <FavoritesDrawer 
        isOpen={isFavoritesOpen} 
        onClose={() => setIsFavoritesOpen(false)} 
        likedIdeas={likedIdeas} 
        onRemoveFavorite={(id: number) => setLikedIdeas(prev => prev.filter(idea => idea.id !== id))}
      />
    </div>
  )
}

export default App
