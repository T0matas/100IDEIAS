import { useState } from "react"
import { Sidebar } from "./components/Sidebar"
import { GeneratorHeader } from "./components/GeneratorHeader"
import { SkeletonGrid } from "./components/SkeletonGrid"
import { IdeaSwiper } from "./components/IdeaSwiper"
import { FavoritesDrawer } from "./components/FavoritesDrawer"
import { LoginModal } from "./components/LoginModal"
import { AnimatePresence, motion } from "framer-motion"
import { MobileView } from "./components/MobileView"
import { LikedIdeasGrid } from "./components/LikedIdeasGrid"
import { CommunityView } from "./components/CommunityView"
import { Globe } from "lucide-react"
import { cn } from "./lib/utils"

const LanguageSwitcher = () => {
  const [lang, setLang] = useState("EN")
  return (
    <div className="absolute top-4 right-6 z-[100]">
      <div className="flex items-center gap-4">
        <Globe className="w-3.5 h-3.5 text-white/30" />
        <div className="flex items-center gap-3.5">
          {["EN", "PT", "ES"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={cn(
                "text-[10px] font-black transition-all relative uppercase",
                l === lang ? "text-white" : "text-white/20"
              )}
            >
              {l}
              {l === lang && (
                <div className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

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
  const [currentView, setCurrentView] = useState<'generator' | 'community'>('generator')

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
        currentView={currentView}
        onOpenCommunity={() => setCurrentView('community')}
      />

      {/* Desktop View */}
      <div className="hidden md:flex min-h-screen bg-[#0A0A0A] font-sans">
        <Sidebar 
          onOpenGostadas={() => setIsGostadasOpen(true)}
          onOpenFavorites={() => setIsFavoritesOpen(true)} 
          onReset={() => {
            setHasGenerated(false);
            setSearchValue("");
            setCurrentView('generator');
          }}
          isResultsView={hasGenerated}
          isLoggedIn={isLoggedIn}
          userEmail={userEmail}
          onLogin={() => setIsLoginOpen(true)}
          onOpenCommunity={() => setCurrentView('community')}
          currentView={currentView}
        />
        <main className="flex-1 ml-60 relative min-h-screen flex flex-col">
          <LanguageSwitcher />

          {/* Generator / Community Section */}
          <AnimatePresence mode="wait">
            {currentView === 'generator' ? (
              <motion.div
                key="generator-view"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex-1 flex flex-col"
              >
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
              </motion.div>
            ) : (
              <motion.div
                key="community-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex-1 overflow-y-auto custom-scrollbar"
              >
                <CommunityView 
                  isLoggedIn={isLoggedIn} 
                  onLogin={() => setIsLoginOpen(true)} 
                  userEmail={userEmail}
                />
              </motion.div>
            )}
          </AnimatePresence>
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
