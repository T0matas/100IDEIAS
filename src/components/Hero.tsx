import { Sparkles, Send, Paperclip, Mic } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Hero() {
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [value])

  return (
    <section className="flex flex-col items-center justify-center px-4 py-20 text-center sm:py-28 relative z-10">
      <div className="inline-flex items-center px-4 py-1.5 mb-8 space-x-2 text-sm font-medium rounded-full bg-surface text-primary border border-white/5 shadow-sm">
        <Sparkles className="w-4 h-4" />
        <span>Inteligência Artificial Generativa</span>
      </div>
      
      <h1 className="max-w-4xl mb-6 text-5xl font-extrabold tracking-tight sm:text-7xl text-white">
        Sua próxima grande ideia está a um <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">clique</span>
      </h1>
      
      <p className="max-w-2xl mb-12 text-lg text-gray-400 sm:text-xl">
        Descreva um tema, nicho ou problema e nossa IA conversacional vai gerar 100 ideias prontas para serem executadas.
      </p>
      
      <div className="w-full max-w-3xl relative">
        {/* Glow effect behind the input */}
        <div className={cn(
          "absolute inset-[-2px] bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl blur-xl transition-all duration-500 opacity-20 pointer-events-none",
          isFocused ? "opacity-50 blur-2xl" : "hover:opacity-40"
        )}></div>
        
        {/* The AI Chat Input Box */}
        <div className="relative bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 flex flex-col">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Sobre o que você quer criar? (Ex: App de produtividade gamificado)"
            className="w-full bg-transparent text-white placeholder-gray-500 px-6 py-6 text-lg outline-none resize-none min-h-[80px] max-h-[200px]"
          />
          
          <div className="flex items-center justify-between px-4 pb-4 pt-2">
            <div className="flex items-center space-x-2 text-gray-400">
              <button className="p-2 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer">
                <Mic className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              className={cn(
                "flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 cursor-pointer",
                value.trim().length > 0 
                  ? "bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:bg-primary/90" 
                  : "bg-white/5 text-gray-500"
              )}
            >
              <span>Gerar 100 Ideias</span>
              <Send className={cn("w-4 h-4 ml-1 transition-transform", value.trim().length > 0 && "translate-x-1")} />
            </button>
          </div>
        </div>
        
        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button 
            onClick={() => setValue("SaaS B2B para Clínicas Médicas")}
            className="px-4 py-1.5 text-sm text-gray-400 bg-surface border border-white/5 rounded-full hover:text-white hover:border-white/20 transition-colors cursor-pointer"
          >
            SaaS B2B
          </button>
          <button 
            onClick={() => setValue("E-commerce de nicho sustentável")}
            className="px-4 py-1.5 text-sm text-gray-400 bg-surface border border-white/5 rounded-full hover:text-white hover:border-white/20 transition-colors cursor-pointer"
          >
            E-commerce de Nicho
          </button>
          <button 
            onClick={() => setValue("Ferramenta de automação para Desenvolvedores")}
            className="px-4 py-1.5 text-sm text-gray-400 bg-surface border border-white/5 rounded-full hover:text-white hover:border-white/20 transition-colors cursor-pointer"
          >
            Ferramentas para Devs
          </button>
        </div>
      </div>
    </section>
  )
}
