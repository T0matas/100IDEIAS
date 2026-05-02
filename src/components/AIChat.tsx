import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, X, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: 'Olá! Sou a IA do 100Ideias. Como posso ajudar você a lapidar ou expandir alguma das suas ideias hoje?' }
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput("");
    
    // Simulate AI thinking and responding
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'Excelente ponto de vista! Podemos adicionar um modelo de assinatura ou uma estratégia de gamificação para reter mais usuários nisso. O que acha?' 
      }]);
    }, 1200);
  }

  return (
    <>
      {/* Botão Flutuante */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-[0_0_30px_rgba(139,92,246,0.6)] z-50 flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Janela de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-[380px] h-[550px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] bg-surface/90 border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-background/40">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-inner border border-white/10">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">IA Copiloto</h3>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[11px] font-medium text-green-400">Online e pronto</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}
                >
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-primary text-white rounded-br-sm shadow-[0_4px_14px_rgba(139,92,246,0.3)]" 
                      : "bg-white/5 text-gray-200 border border-white/5 rounded-bl-sm"
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-background/60 border-t border-white/5">
              <div className="relative flex items-center group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pergunte sobre uma ideia..."
                  className="w-full bg-surface/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-all focus:bg-surface"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 p-1.5 rounded-lg text-gray-400 group-focus-within:text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
