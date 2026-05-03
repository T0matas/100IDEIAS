import { useState } from "react"
import { Sidebar } from "./components/Sidebar"
import { GeneratorHeader } from "./components/GeneratorHeader"
import { SkeletonGrid } from "./components/SkeletonGrid"
import { IdeaSwiper } from "./components/IdeaSwiper"
import { FavoritesDrawer } from "./components/FavoritesDrawer"
import { LoginModal } from "./components/LoginModal"
import { AnimatePresence, motion } from "framer-motion"
import { MobileView } from "./components/MobileView"

function App() {
  const [hasGenerated, setHasGenerated] = useState(false)
  const [likedIdeas, setLikedIdeas] = useState<any[]>([])
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <>
      {/* Mobile View */}
      <MobileView 
        hasGenerated={hasGenerated}
        setHasGenerated={setHasGenerated}
        likedIdeas={likedIdeas}
        setLikedIdeas={setLikedIdeas}
        isFavoritesOpen={isFavoritesOpen}
        setIsFavoritesOpen={setIsFavoritesOpen}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => setIsLoginOpen(true)}
        onReset={() => {
          setHasGenerated(false);
          setSearchValue("");
        }}
      />

      {/* Desktop View */}
      <div className="hidden md:flex min-h-screen bg-[#0A0A0A] font-sans">
        <Sidebar 
          onOpenFavorites={() => setIsFavoritesOpen(true)} 
          onReset={() => {
            setHasGenerated(false);
            setSearchValue("");
          }}
          isResultsView={hasGenerated}
          isLoggedIn={isLoggedIn}
          onLogin={() => setIsLoginOpen(true)}
        />
        <main className="flex-1 ml-60 relative min-h-screen flex flex-col">
          <GeneratorHeader 
            onGenerate={() => setHasGenerated(true)} 
            isGenerating={hasGenerated}
            externalValue={searchValue}
            onValueChange={setSearchValue}
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
                      setSearchValue("");
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
      </div>

      <FavoritesDrawer 
        isOpen={isFavoritesOpen} 
        onClose={() => setIsFavoritesOpen(false)} 
        likedIdeas={likedIdeas} 
        onRemoveFavorite={(id: number) => setLikedIdeas(prev => prev.filter(idea => idea.id !== id))}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={() => setIsLoggedIn(true)}
      />
    </>
  )
}

export default App
