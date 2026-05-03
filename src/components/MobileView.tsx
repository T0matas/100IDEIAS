import { useState } from "react"
import { MobileHeader } from "./MobileHeader"
import { MobileSidebar } from "./MobileSidebar"
import { GeneratorHeader } from "./GeneratorHeader"
import { SkeletonGrid } from "./SkeletonGrid"
import { IdeaSwiper } from "./IdeaSwiper"
import { AnimatePresence, motion } from "framer-motion"


interface MobileViewProps {
  hasGenerated: boolean
  setHasGenerated: (val: boolean) => void
  likedIdeas: any[]
  setLikedIdeas: (val: any[]) => void
  isFavoritesOpen: boolean
  setIsFavoritesOpen: (val: boolean) => void
  searchValue: string
  setSearchValue: (val: string) => void
  onReset: () => void
  isLoggedIn: boolean
  userEmail?: string
  onOpenLogin: () => void
}

export function MobileView({
  hasGenerated,
  setHasGenerated,
  likedIdeas,
  setLikedIdeas,
  setIsFavoritesOpen,
  searchValue,
  setSearchValue,
  onReset,
  isLoggedIn,
  userEmail,
  onOpenLogin
}: MobileViewProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] md:hidden">
      <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="flex-1 flex flex-col pt-4 pb-10 overflow-y-auto overflow-x-hidden">
        {/* Generator Section */}
        <section className="px-5 mb-10">
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Gerador de Ideias</h2>
          </div>
          
          <div className="bg-[#121212] border border-white/5 rounded-[2rem] p-5 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <GeneratorHeader 
              onGenerate={() => setHasGenerated(true)} 
              isGenerating={hasGenerated}
              externalValue={searchValue}
              onValueChange={setSearchValue}
            />
          </div>
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
                    onReset={onReset}
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
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onReset={onReset}
        isResultsView={hasGenerated}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onOpenLogin={onOpenLogin}
      />
    </div>
  )
}
