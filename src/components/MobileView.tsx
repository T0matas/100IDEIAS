import { useState } from "react"
import { MobileHeader } from "./MobileHeader"
import { MobileSidebar } from "./MobileSidebar"
import { GeneratorHeader } from "./GeneratorHeader"
import { SkeletonGrid } from "./SkeletonGrid"
import { IdeaSwiper } from "./IdeaSwiper"
import { AnimatePresence, motion } from "framer-motion"
import { LikedIdeasGrid } from "./LikedIdeasGrid"


interface MobileViewProps {
  hasGenerated: boolean
  setHasGenerated: (val: boolean) => void
  likedIdeas: any[]
  setLikedIdeas: React.Dispatch<React.SetStateAction<any[]>>
  favoriteIdeas: any[]
  setFavoriteIdeas: React.Dispatch<React.SetStateAction<any[]>>
  isGostadasOpen: boolean
  setIsGostadasOpen: (val: boolean) => void
  isFavoritesOpen: boolean
  setIsFavoritesOpen: (val: boolean) => void
  searchValue: string
  setSearchValue: (val: string) => void
  onReset: () => void
  isLoggedIn: boolean
  userEmail?: string
  onOpenLogin: () => void
  usageCount: number
  onIncrementUsage: () => boolean
  onGenerate: () => void
  isUpgradeModalOpen: boolean
  setIsUpgradeModalOpen: (val: boolean) => void
}

export function MobileView({
  hasGenerated,
  setHasGenerated: _setHasGenerated,
  likedIdeas,
  setLikedIdeas,
  favoriteIdeas,
  setFavoriteIdeas,
  isGostadasOpen,
  setIsGostadasOpen,
  setIsFavoritesOpen,
  searchValue,
  setSearchValue,
  onReset,
  isLoggedIn,
  userEmail,
  onOpenLogin,
  usageCount,
  onIncrementUsage,
  onGenerate,
  isUpgradeModalOpen,
  setIsUpgradeModalOpen
}: MobileViewProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] md:hidden">
      <MobileHeader 
        onMenuClick={() => setIsSidebarOpen(true)} 
        onFavoritesClick={() => setIsGostadasOpen(true)}
      />
      
      <main className="flex-1 flex flex-col pt-0 pb-10 overflow-y-auto overflow-x-hidden">
        {/* Generator Section */}
        <section className="mb-4">
          <GeneratorHeader 
            onGenerate={onGenerate}
            isGenerating={hasGenerated}
            externalValue={searchValue}
            onValueChange={setSearchValue}
            usageCount={usageCount}
            isUpgradeModalOpen={isUpgradeModalOpen}
            setIsUpgradeModalOpen={setIsUpgradeModalOpen}
          />
        </section>

        {/* Results/Gallery Section */}
        <section className="px-5 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">
              {hasGenerated ? "Sugestões para você" : "Explorar Temas"}
            </h2>
            {hasGenerated && (
              <button onClick={onReset} className="text-[10px] font-bold text-gray-600 hover:text-white transition-colors uppercase tracking-widest">
                Limpar
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[400px]">
            <AnimatePresence mode="wait">
              {hasGenerated ? (
                <motion.div 
                  key="swiper"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col items-start w-full"
                >
                  <IdeaSwiper 
                    likedIdeas={likedIdeas} 
                    setLikedIdeas={setLikedIdeas} 
                    favoriteIdeas={favoriteIdeas}
                    setFavoriteIdeas={setFavoriteIdeas}
                    onReset={onReset}
                    onIncrementUsage={onIncrementUsage}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <SkeletonGrid />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <MobileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onOpenGostadas={() => setIsGostadasOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onReset={onReset}
        isResultsView={hasGenerated}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onOpenLogin={onOpenLogin}
      />

      <LikedIdeasGrid 
        isOpen={isGostadasOpen} 
        onClose={() => setIsGostadasOpen(false)} 
        likedIdeas={likedIdeas} 
        onRemoveLiked={(id: number) => setLikedIdeas(prev => prev.filter(idea => idea.id !== id))}
        onToggleFavorite={(idea: any) => {
          setFavoriteIdeas((prev: any[]) => {
            const isAlreadyFav = prev.some((p: any) => p.id === idea.id);
            if (isAlreadyFav) return prev.filter((p: any) => p.id !== idea.id);
            return [...prev, idea];
          });
        }}
        favoriteIdeas={favoriteIdeas}
      />
    </div>
  )
}
