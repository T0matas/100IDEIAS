import { Send, Shuffle, History, AlertCircle, X, RefreshCw } from "lucide-react"
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
  externalValue,
  onValueChange,
  usageCount,
  isPremium,
  isUpgradeModalOpen,
  setIsUpgradeModalOpen
}: {
  onGenerate: (ideas?: any[]) => void,
  externalValue?: string,
  onValueChange?: (val: string) => void,
  usageCount: number,
  isPremium?: boolean,
  isUpgradeModalOpen: boolean,
  setIsUpgradeModalOpen: (open: boolean) => void
}) {
  const [internalValue, setInternalValue] = useState("")
  const value = externalValue !== undefined ? externalValue : internalValue
  const setValue = (val: string) => {
    if (onValueChange) onValueChange(val)
    else setInternalValue(val)
  }

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [warningType, setWarningType] = useState<'blocked' | 'empty' | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isFlying, setIsFlying] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)

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

  const handleUpgrade = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsUpgradeModalOpen(false);
    }, 1500);
  }

  const handleGenerateClick = () => {
    if (!value.trim()) {
      setWarningType('empty');
      setTimeout(() => setWarningType(null), 3000);
      return;
    }

    if (isCooldown) {
      setWarningType('blocked');
      setTimeout(() => setWarningType(null), 1500);
      return;
    }

    if (usageCount >= 5) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsFlying(true);
    setIsCooldown(true);

    setTimeout(() => {
      setIsFlying(false);
      setIsCooldown(false);
    }, 1000);

    if (!recentSearches.includes(value.trim())) {
      setRecentSearches((prev: string[]) => [value.trim(), ...prev].slice(0, 4))
    }

    onGenerate();
  }

  return (
    <div className="max-w-2xl pt-2 md:pt-10 pb-6 px-5 md:px-8 relative z-20">
      <div className="w-8 h-1 bg-white rounded-full mb-6 opacity-80" />
      <h1 className="text-xl md:text-3xl font-bold text-white mb-2 tracking-tight leading-[1.1] min-h-[50px] md:min-h-[70px]">
        O que você quer <br />
        <span className="text-gray-500"><TypewriterText /></span>
      </h1>
      <p className="text-gray-400 mb-6 md:mb-8 mt-1 md:mt-2 text-xs max-w-lg">
        Digite qualquer tema e nossa IA gerará 5 cards de ideias incríveis para você avaliar.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl mt-6">
        <div className="flex-1 relative flex items-center shadow-[0_6px_0_rgb(15,15,15)] rounded-2xl bg-[#1A1A1A] border border-white/5 transition-all focus-within:border-white/20 focus-within:shadow-[0_6px_0_rgb(25,25,25)] overflow-hidden h-[52px] sm:h-[48px]">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (warningType) setWarningType(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGenerateClick();
            }}
            placeholder="Ex: negócios sustentáveis..."
            className="w-full bg-transparent pl-5 md:pl-6 pr-[105px] py-0 text-sm md:text-base text-white placeholder-gray-600 outline-none h-full"
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
          onMouseUp={(e) => e.currentTarget.blur()}
          color="white"
          className="px-8 rounded-2xl group overflow-hidden h-[52px] sm:h-[48px] flex-shrink-0"
        >
          <span className="font-bold text-sm">Gerar Ideias</span>
          <Send className={cn(
            "w-4 h-4 ml-2 transition-all duration-500 ease-out",
            isFlying && "translate-x-12 -translate-y-12 opacity-0"
          )} />
        </Button3D>
      </div>

      {true && (
        <div className="mt-5 flex items-center space-x-3 px-1 max-w-2xl">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: isPremium ? '100%' : `${Math.min((usageCount / 5) * 100, 100)}%` }}
              className={cn(
                "h-full transition-all duration-700 ease-out",
                isPremium ? "bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)]" :
                  usageCount >= 5 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" :
                    usageCount >= 3 ? "bg-amber-500" : "bg-white/30"
              )}
            />
          </div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] whitespace-nowrap">
            {isPremium ? "Acesso Ilimitado" : (
              <>{usageCount}/5 <span className="hidden xs:inline">gerações grátis</span></>
            )}
          </span>
        </div>
      )}

      <AnimatePresence>
        {warningType && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.95 }}
            className="fixed top-20 md:top-8 left-1/2 z-[300] w-[90%] sm:w-auto max-w-sm"
          >
            <div className="bg-[#1A1A1A] border border-red-500/30 text-white px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl shadow-2xl flex items-center space-x-3 md:space-x-4 backdrop-blur-xl">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xs md:text-sm leading-tight">
                  {warningType === 'blocked' ? "Ação Bloqueada" : "Campo Vazio"}
                </p>
                <p className="text-[11px] md:text-xs text-gray-400 mt-0.5 leading-snug">
                  {warningType === 'blocked' ? "Conclua ou limpe a pesquisa atual primeiro!" : "Insira algo primeiro para gerar ideias!"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={isProcessingPayment ? undefined : () => setIsUpgradeModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0F0F0F] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden"
            >
              {/* Premium Background Glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 blur-[100px] rounded-full" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-white/5 blur-[100px] rounded-full" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-black shadow-xl mb-8">
                  {isProcessingPayment ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="w-10 h-10" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Shuffle className="w-10 h-10" />
                    </motion.div>
                  )}
                </div>

                <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                  {isProcessingPayment ? "Aguarde um momento..." : "Limite Atingido!"}
                </h2>
                <p className="text-gray-400 mb-10 leading-relaxed text-sm md:text-base">
                  {isProcessingPayment
                    ? "Estamos preparando seu acesso ilimitado. Não feche esta janela enquanto processamos seu pedido."
                    : "Você já explorou suas 5 ideias gratuitas de hoje. Desbloqueie o acesso ilimitado para continuar criando sem barreiras."}
                </p>

                <Button3D
                  onClick={handleUpgrade}
                  color="white"
                  className="w-full rounded-2xl group overflow-hidden mb-6 h-[52px] sm:h-[48px]"
                  disabled={isProcessingPayment}
                >
                  <span className="font-bold text-base">
                    {isProcessingPayment ? "Processando..." : "Plano IDEIA — R$ 7,99"}
                  </span>
                </Button3D>

                {!isProcessingPayment && (
                  <button
                    onClick={() => setIsUpgradeModalOpen(false)}
                    className="text-gray-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-[0.2em]"
                  >
                    Talvez mais tarde
                  </button>
                )}
              </div>
            </motion.div>
          </div>
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
