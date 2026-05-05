import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Lightbulb, Shuffle, Calendar, Download, Target, CheckCircle2, ChevronRight, RefreshCw } from "lucide-react"
import { Button3D } from "./ui/Button3D"

interface IdeaDetailModalProps {
  idea: any | null
  onClose: () => void
}

export function IdeaDetailModal({ idea, onClose }: IdeaDetailModalProps) {
  const [view, setView] = useState<'details' | 'roadmap'>('details')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (idea) {
      setView('details')
      setIsGenerating(false)
    }
  }, [idea])

  const handleGenerateRoadmap = () => {
    setIsGenerating(true)
    // Simulate generation with a bit more ceremony
    setTimeout(() => {
      setIsGenerating(false)
      setView('roadmap')
    }, 1000)
  }

  const roadmapData = [
    { week: 1, title: "Fundação e Validação", tasks: ["Definição da Proposta de Valor Única", "Pesquisa quantitativa com 20 potenciais clientes", "Esboço do MVP e stack tecnológica"] },
    { week: 2, title: "Prototipagem e Feedback", tasks: ["Criação de Landing Page de alta conversão", "Teste A/B de precificação e copy", "Coleta de e-mails/leads qualificados"] },
    { week: 3, title: "Desenvolvimento e Ajuste", tasks: ["Construção da funcionalidade core (MVP)", "Integração de sistemas de pagamento", "Testes de usabilidade Beta"] },
    { week: 4, title: "Lançamento e Tração", tasks: ["Lançamento no Product Hunt/Redes Sociais", "Primeira campanha de tráfego pago", "Análise de métricas de retenção iniciais"] }
  ]

  return (
    <AnimatePresence>
      {idea && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[480px] bg-[#111111] border border-white/10 rounded-[2rem] md:rounded-[2.2rem] overflow-hidden shadow-2xl"
          >
            {/* Header Gradient */}
            <div className="h-20 md:h-24 bg-gradient-to-br from-white/10 to-transparent p-5 md:p-6 flex items-end">
              <div className="w-9 h-9 md:w-11 md:h-11 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-black shadow-xl">
                <Lightbulb className="w-4.5 h-4.5 md:w-5 md:h-5" />
              </div>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-5 md:p-7 pt-4 md:pt-5">
              <h2 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-2.5 tracking-tight">
                {idea.title}
              </h2>
              <p className="text-gray-400 mb-5 md:mb-6 text-[11px] md:text-xs leading-relaxed">
                {idea.description}
              </p>

              <AnimatePresence mode="wait">
                {view === 'details' ? (
                  <motion.div
                    key="details-view"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 md:mb-3 flex items-center gap-2">
                        <Target className="w-3 h-3" />
                        Componentes da Ideia
                      </h4>
                      <ul className="space-y-3 md:space-y-4">
                        {idea.details ? idea.details.map((detail: string, i: number) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[10px] font-bold text-white">{i + 1}</span>
                            </div>
                            <span className="text-[10px] md:text-xs text-gray-300 leading-relaxed">
                              {detail}
                            </span>
                          </motion.li>
                        )) : (
                          <p className="text-gray-500 text-[10px] md:text-xs italic">Nenhum detalhe disponível.</p>
                        )}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-3 pt-3">
                      <Button3D 
                        onClick={handleGenerateRoadmap} 
                        color="white" 
                        className="w-full h-[50px] sm:h-[46px] rounded-xl md:rounded-xl relative overflow-hidden group"
                        disabled={isGenerating}
                      >
                        <AnimatePresence mode="wait">
                          {isGenerating ? (
                            <motion.div 
                              key="generating"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center justify-center gap-2"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </motion.div>
                              <span className="font-bold">Analisando Mercado...</span>
                              
                              {/* Progress bar effect */}
                              <motion.div 
                                className="absolute bottom-0 left-0 h-1 bg-black"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                              />
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="static"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center justify-center gap-2"
                            >
                              <Calendar className="w-4 h-4" />
                              <span className="font-bold tracking-tight">Gerar Plano de Execução</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button3D>
                      <button 
                        className="flex items-center justify-center gap-2 text-[9px] md:text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors py-1.5 md:py-2 group"
                        onClick={() => alert('Exportando One-Pager em PDF...')}
                      >
                        <Download className="w-2.5 h-2.5 md:w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
                        Exportar One-Pager
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="roadmap-view"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 md:space-y-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Shuffle className="w-3 h-3" />
                        Roadmap: Primeiros 30 Dias
                      </h4>
                      <button 
                        onClick={() => setView('details')}
                        className="text-[9px] md:text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest"
                      >
                        Voltar
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[250px] md:max-h-[280px] overflow-y-auto pr-3 custom-scrollbar relative">
                      {/* Timeline Line */}
                      <div className="absolute left-[26px] top-6 bottom-6 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent pointer-events-none" />

                      {roadmapData.map((week, i) => (
                        <div key={i} className="relative pl-10 md:pl-12">
                          {/* Dot */}
                          <div className="absolute left-[21px] top-2 w-2 h-2 md:w-2 md:h-2 rounded-full bg-white border-[2px] md:border-[2px] border-[#111111] z-10 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                          
                          <div className="bg-white/[0.03] border border-white/5 rounded-[1.5rem] md:rounded-[1.6rem] p-3.5 md:p-4 hover:bg-white/[0.05] transition-colors group">
                            <div className="flex items-center justify-between mb-2 md:mb-2.5">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] md:text-[10px] font-black text-black bg-white px-1.5 md:px-2 py-0.5 rounded uppercase">Sem {week.week}</span>
                                <span className="text-xs md:text-sm font-bold text-white tracking-tight">{week.title}</span>
                              </div>
                              <CheckCircle2 className="w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors" />
                            </div>
                            <ul className="space-y-1.5 md:space-y-2.5">
                              {week.tasks.map((task, j) => (
                                <li key={j} className="flex items-start gap-2 text-[10px] md:text-xs text-gray-400 leading-relaxed">
                                  <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white/20 mt-1.5 md:mt-1 shrink-0" />
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Button3D 
                        onClick={onClose} 
                        color="white" 
                        className="w-full h-[50px] sm:h-[46px] rounded-xl md:rounded-xl"
                      >
                        <span className="font-bold flex items-center gap-2">
                          Começar Jornada <ChevronRight className="w-4 h-4" />
                        </span>
                      </Button3D>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
