import { Send, Shuffle, History, AlertCircle, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button3D } from "./ui/Button3D"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../lib/utils"

const SURPRISE_THEMES = [
  "Apps de inteligência artificial para pets",
  "Plataformas de economia circular para roupas",
  "Ferramentas de produtividade para TDAH",
  "Mercado de nicho para amantes de café",
  "Soluções de gamificação para exercícios físicos",
  "Turismo sustentável e ecológico",
  "Educação financeira para adolescentes"
]

function TypewriterText() {
  const words = ["explorar hoje?", "criar hoje?", "lançar hoje?", "descobrir hoje?"]
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = words[currentWordIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(word.substring(0, currentText.length + 1))
        
        if (currentText === word) {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 2500)
        }
      } else {
        setCurrentText(word.substring(0, currentText.length - 1))
        
        if (currentText === "") {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? 30 : 80)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex])

  return (
    <>
      {currentText}
      <span className="animate-pulse font-normal opacity-50 ml-1">|</span>
    </>
  )
}

export function GeneratorHeader({ 
  onGenerate, 
  isGenerating,
  externalValue,
  onValueChange
}: { 
  onGenerate: () => void, 
  isGenerating?: boolean,
  externalValue?: string,
  onValueChange?: (val: string) => void
}) {
  const [internalValue, setInternalValue] = useState("")
  const value = externalValue !== undefined ? externalValue : internalValue
  const setValue = (val: string) => {
    if (onValueChange) onValueChange(val)
    else setInternalValue(val)
  }
  
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [showWarning, setShowWarning] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isFlying, setIsFlying] = useState(false)

  const handleRemoveRecent = (term: string) => {
    setRecentSearches(prev => prev.filter(t => t !== term))
  }

  const handleClearAllRecents = () => {
    setRecentSearches([])
  }

  const handleSurprise = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 1000);
    const randomTheme = SURPRISE_THEMES[Math.floor(Math.random() * SURPRISE_THEMES.length)]
    setValue(randomTheme)
  }

  const handleGenerateClick = () => {
    if (!value.trim()) return;

    if (isGenerating) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    setIsFlying(true);
    setTimeout(() => setIsFlying(false), 600);

    if (!recentSearches.includes(value.trim())) {
      setRecentSearches((prev: string[]) => [value.trim(), ...prev].slice(0, 4))
    }
    onGenerate()
  }

  return (
    <div className="max-w-4xl pt-8 md:pt-16 pb-8 px-4 md:px-12 relative z-20">
      <div className="w-10 h-1 bg-white rounded-full mb-6 opacity-80" />
      <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-tight leading-tight min-h-[60px] md:min-h-[90px]">
        O que você quer <br/>
        <span className="text-gray-500"><TypewriterText /></span>
      </h1>
      <p className="text-gray-400 mb-8 mt-2 text-sm max-w-xl">
        Digite qualquer tema e nossa IA gerará 5 cards de ideias incríveis para você avaliar.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl mt-6">
        <div className="flex-1 relative flex items-center shadow-[0_4px_0_rgb(15,15,15)] rounded-2xl bg-[#1A1A1A] border border-white/5 transition-all focus-within:border-white/20 focus-within:shadow-[0_4px_0_rgb(25,25,25)] overflow-hidden">
          <input 
            type="text" 
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (showWarning) setShowWarning(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGenerateClick();
            }}
            placeholder="Ex: negócios sustentáveis..."
            className="w-full bg-transparent pl-4 md:pl-6 pr-[110px] py-3.5 text-sm md:text-base text-white placeholder-gray-600 outline-none"
          />
          <button 
            onClick={handleSurprise}
            className="absolute right-2 flex items-center space-x-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-3 py-2 rounded-xl transition-all text-[11px] font-bold cursor-pointer active:scale-95 group"
            title="Preencher com um tema aleatório"
          >
            <Shuffle className={cn(
              "w-3.5 h-3.5 transition-transform duration-1000 ease-in-out",
              isSpinning && "rotate-[360deg]"
            )} />
            <span>Surpresa</span>
          </button>
        </div>
        <Button3D 
          onClick={handleGenerateClick}
          color="white"
          className="px-8 py-3 rounded-2xl group overflow-hidden h-[52px] sm:h-[48px] flex-shrink-0"
        >
          <span className="font-bold text-sm">Gerar Ideias</span>
          <Send className={cn(
            "w-4 h-4 ml-2 transition-all duration-500 ease-out",
            isFlying && "translate-x-12 -translate-y-12 opacity-0"
          )} />
        </Button3D>
      </div>

      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }}
            className="fixed top-20 left-1/2 z-[250] w-[90%] max-w-sm"
          >
            <div className="bg-[#1A1A1A] border border-red-500/40 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">Ação Bloqueada</p>
                <p className="text-xs text-gray-400 mt-0.5">Conclua ou limpe a pesquisa atual primeiro!</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4 max-w-3xl">
          <div className="flex items-center space-x-2 text-gray-500 font-semibold text-xs uppercase tracking-wider">
            <History className="w-3.5 h-3.5" />
            <span>Pesquisas Recentes</span>
          </div>
          {recentSearches.length > 0 && (
            <button 
              onClick={handleClearAllRecents}
              className="text-[10px] uppercase tracking-widest font-bold text-gray-600 hover:text-white transition-colors cursor-pointer"
            >
              Limpar tudo
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 max-w-3xl min-h-[40px] items-center">
          <AnimatePresence mode="popLayout">
            {recentSearches.length === 0 ? (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-600 text-sm font-medium ml-1"
              >
                —
              </motion.div>
            ) : (
              recentSearches.map((term) => (
                <motion.div 
                  key={term}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="group flex items-center bg-[#1A1A1A] border border-white/5 rounded-full pl-4 pr-1.5 py-1.5 hover:border-white/20 transition-all shadow-sm"
                >
                  <button 
                    onClick={() => setValue(term)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm font-medium mr-2"
                  >
                    {term}
                  </button>
                  <button 
                    onClick={() => handleRemoveRecent(term)}
                    className="w-5 h-5 flex items-center justify-center rounded-full bg-white/5 text-gray-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        <div className="h-px bg-white/5 w-full max-w-3xl mt-4"></div>
      </div>
    </div>
  )
}
