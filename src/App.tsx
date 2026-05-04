import { useState } from "react"
import { ThumbsUp } from "lucide-react"
import { Sidebar } from "./components/Sidebar"
import { GeneratorHeader } from "./components/GeneratorHeader"
import { SkeletonGrid } from "./components/SkeletonGrid"
import { IdeaSwiper } from "./components/IdeaSwiper"
import { FavoritesDrawer } from "./components/FavoritesDrawer"
import { LoginModal } from "./components/LoginModal"
import { AnimatePresence, motion } from "framer-motion"
import { MobileView } from "./components/MobileView"
import { LikedIdeasGrid } from "./components/LikedIdeasGrid"


function App() {
  const [hasGenerated, setHasGenerated] = useState(false)
  const [likedIdeas, setLikedIdeas] = useState<any[]>([]) // Gostadas (Swiped Right)
  const [favoriteIdeas, setFavoriteIdeas] = useState<any[]>([]) // Favoritas (Bookmarked)
  const [isGostadasOpen, setIsGostadasOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)

  const handleIncrementUsage = () => {
    if (usageCount >= 5) {
      setIsUpgradeModalOpen(true)
      return false
    }
    setUsageCount(prev => prev + 1)
    return true
  }

  const handleGenerate = () => {
    setUsageCount(prev => prev + 1)
    setHasGenerated(true)
  }

  const handleToggleFavorite = (idea: any) => {
    setFavoriteIdeas((prev: any) => {
      const isAlreadyFav = prev.some((p: any) => p.id === idea.id);
      if (isAlreadyFav) {
        return prev.filter((p: any) => p.id !== idea.id);
      } else {
        return [...prev, idea];
      }
    });
  };

  return (
    <>
      {/* Mobile View */}
      <MobileView 
        hasGenerated={hasGenerated}
        setHasGenerated={setHasGenerated}
        likedIdeas={likedIdeas}
        setLikedIdeas={setLikedIdeas}
        favoriteIdeas={favoriteIdeas}
        setFavoriteIdeas={setFavoriteIdeas}
        isGostadasOpen={isGostadasOpen}
        setIsGostadasOpen={setIsGostadasOpen}
        isFavoritesOpen={isFavoritesOpen}
        setIsFavoritesOpen={setIsFavoritesOpen}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onOpenLogin={() => setIsLoginOpen(true)}
        onReset={() => {
          setHasGenerated(false);
          setSearchValue("");
        }}
        usageCount={usageCount}
        onIncrementUsage={handleIncrementUsage}
        onGenerate={handleGenerate}
        isUpgradeModalOpen={isUpgradeModalOpen}
        setIsUpgradeModalOpen={setIsUpgradeModalOpen}
      />

      {/* Desktop View */}
      <div className="hidden md:flex min-h-screen bg-[#0A0A0A] font-sans">
        <Sidebar 
          onOpenGostadas={() => setIsGostadasOpen(true)}
          onOpenFavorites={() => setIsFavoritesOpen(true)} 
          onReset={() => {
            setHasGenerated(false);
            setSearchValue("");
          }}
          isResultsView={hasGenerated}
          isLoggedIn={isLoggedIn}
          userEmail={userEmail}
          onLogin={() => setIsLoginOpen(true)}
        />
        <main className="flex-1 ml-60 relative min-h-screen flex flex-col">
          {/* Top Right Gostadas Button */}
          <div className="absolute top-8 right-12 z-30">
            <motion.button 
              onClick={() => setIsGostadasOpen(true)}
              whileHover={{ 
                scale: 1.2, 
                rotate: -12,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              className="p-2 text-gray-500 hover:text-white hover:bg-white/[0.03] rounded-xl transition-all cursor-pointer group"
              title="Gostos"
            >
              <ThumbsUp className="w-5 h-5 transition-colors" />
            </motion.button>
          </div>

          <GeneratorHeader 
            onGenerate={handleGenerate}
            isGenerating={hasGenerated}
            externalValue={searchValue}
            onValueChange={setSearchValue}
            usageCount={usageCount}
            isUpgradeModalOpen={isUpgradeModalOpen}
            setIsUpgradeModalOpen={setIsUpgradeModalOpen}
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
                  className="pt-16 pb-24 flex flex-col items-start w-full min-h-[600px]"
                >
                  <IdeaSwiper 
                    likedIdeas={likedIdeas} 
                    setLikedIdeas={setLikedIdeas} 
                    favoriteIdeas={favoriteIdeas}
                    setFavoriteIdeas={setFavoriteIdeas}
                    onReset={() => {
                      setHasGenerated(false);
                      setSearchValue("");
                    }}
                    onIncrementUsage={handleIncrementUsage}
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

      <LikedIdeasGrid 
        isOpen={isGostadasOpen} 
        onClose={() => setIsGostadasOpen(false)} 
        likedIdeas={likedIdeas} 
        onRemoveLiked={(id: number) => setLikedIdeas(prev => prev.filter(idea => idea.id !== id))}
        onToggleFavorite={handleToggleFavorite}
        favoriteIdeas={favoriteIdeas}
      />

      <FavoritesDrawer 
        isOpen={isFavoritesOpen} 
        onClose={() => setIsFavoritesOpen(false)} 
        likedIdeas={favoriteIdeas} 
        onRemoveFavorite={(id: number) => setFavoriteIdeas(prev => prev.filter(idea => idea.id !== id))}
        title="Suas Favoritas"
        type="favorite"
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={(email) => {
          setIsLoggedIn(true)
          setUserEmail(email)
        }}
      />
    </>
  )
}

export default App
