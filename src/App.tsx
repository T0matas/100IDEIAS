import { useState, useEffect } from "react"
import { Sidebar } from "./components/Sidebar"
import { GeneratorHeader } from "./components/GeneratorHeader"
import { SkeletonGrid } from "./components/SkeletonGrid"
import { IdeaSwiper } from "./components/IdeaSwiper"
import { FavoritesDrawer } from "./components/FavoritesDrawer"
import { LoginModal } from "./components/LoginModal"
import { AnimatePresence, motion } from "framer-motion"
import { API_URL } from "./config"
import { MobileView } from "./components/MobileView"
import { LikedIdeasGrid } from "./components/LikedIdeasGrid"
import { CommunityView } from "./components/CommunityView"




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
  const [usageCount, setUsageCount] = useState(() => {
    const saved = localStorage.getItem('usageCount');
    return saved ? parseInt(saved, 10) : 0;
  })
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [currentView, setCurrentView] = useState<'generator' | 'community'>('generator')
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token || !isLoggedIn) {
        setIsDataLoaded(true);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/user/data`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLikedIdeas(data.likedIdeas || []);
          setFavoriteIdeas(data.favoriteIdeas || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsDataLoaded(true);
      }
    };
    fetchUserData();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isDataLoaded || !isLoggedIn) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const syncTimer = setTimeout(() => {
      fetch(`${API_URL}/api/user/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ likedIdeas, favoriteIdeas })
      }).catch(console.error);
    }, 1000);

    return () => clearTimeout(syncTimer);
  }, [likedIdeas, favoriteIdeas, isDataLoaded, isLoggedIn]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setIsLoggedIn(true)
        setUserEmail(user.email)
      } catch (e) {
        console.error("Erro ao ler usuário do localStorage")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('usageCount', usageCount.toString());
  }, [usageCount])

  const isPremium = userEmail === 'danieltomatas0@gmail.com';

  const handleIncrementUsage = () => {
    if (isPremium) return true;
    if (usageCount >= 5) {
      setIsUpgradeModalOpen(true)
      return false
    }
    setUsageCount(prev => prev + 1)
    return true
  }

  const [aiIdeas, setAiIdeas] = useState<any[] | null>(null)

  const handleGenerate = (ideas?: any[]) => {
    if (!isPremium) setUsageCount(prev => prev + 1)
    setAiIdeas(ideas || null)
    if (hasGenerated) {
      setHasGenerated(false)
      setTimeout(() => setHasGenerated(true), 10)
    } else {
      setHasGenerated(true)
    }
  }

  const handleToggleFavorite = (idea: any) => {
    setFavoriteIdeas((prev: any) => {
      const isAlreadyFav = prev.some((p: any) => p.id === idea.id);
      if (isAlreadyFav) {
        return prev.filter((p: any) => p.id !== idea.id);
      } else {
        if (prev.length >= 100) return prev;
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
          setCurrentView('generator');
        }}
        usageCount={usageCount}
        isPremium={isPremium}
        onIncrementUsage={handleIncrementUsage}
        onGenerate={handleGenerate}
        isUpgradeModalOpen={isUpgradeModalOpen}
        setIsUpgradeModalOpen={setIsUpgradeModalOpen}
        currentView={currentView}
        onOpenCommunity={() => setCurrentView('community')}
        aiIdeas={aiIdeas}
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
        <main className="flex-1 ml-48 relative min-h-screen flex flex-col transition-all duration-300">


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
                  externalValue={searchValue}
                  onValueChange={setSearchValue}
                  usageCount={usageCount}
                  isPremium={isPremium}
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
                          aiIdeas={aiIdeas}
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
