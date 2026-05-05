import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Lightbulb, Bookmark, Search, Edit2, Check, X, RefreshCw, ThumbsUp, ThumbsDown, ChevronRight, Copy } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button3D } from './ui/Button3D';
import { IdeaDetailModal } from './IdeaDetailModal';

const INITIAL_IDEAS = [
  { 
    id: 1, 
    title: 'SaaS de Otimização de Logística Reversa Circular', 
    description: 'Plataforma B2B que utiliza ML para prever o ciclo de vida de produtos e automatizar a logística de devolução para reciclagem ou revenda.',
    details: [
      "Integração com ERPs para rastreamento de SKU desde a venda até o descarte.",
      "Algoritmo preditivo de 'Taxa de Devolução' baseado em dados sazonais e de comportamento.",
      "Modelo de negócio: SaaS tiered pricing + Taxa por transação de crédito de carbono gerado.",
      "Dica: O diferencial único é a geração automática de certificados de conformidade ESG para as empresas parceiras."
    ]
  },
  { 
    id: 2, 
    title: 'Marketplace de "Digital Twin" para Real Estate de Luxo', 
    description: 'Plataforma para corretores de luxo que oferece gêmeos digitais interativos com simulação de iluminação solar e design de interiores dinâmico via IA.',
    details: [
      "Renderização em tempo real via Cloud GPU para visualização em qualquer dispositivo.",
      "IA que sugere modificações estruturais baseadas em tendências arquitetônicas do bairro.",
      "Monetização: Assinatura para corretores + Marketplace de fornecedores de móveis (afiliados).",
      "Dica: Foque no mercado de pré-lançamento, onde o comprador precisa 'sentir' o imóvel antes da construção."
    ]
  },
  { 
    id: 3, 
    title: 'Protocolo de Verificação de "Deepfake" para Jornalismo', 
    description: 'Ferramenta forense digital que utiliza blockchain e análise de metadados para garantir a autenticidade de vídeos e áudios em tempo real.',
    details: [
      "Sistema de 'ancoragem' de metadados na blockchain no momento da gravação original.",
      "Rede neural adversarial (GAN) que detecta inconsistências de compressão e luz.",
      "Público-alvo: Agências de notícias, tribunais e departamentos de compliance corporativo.",
      "Dica: Posicione-se como o 'Selo de Confiança' obrigatório para mídias digitais em anos eleitorais."
    ]
  },
  { 
    id: 4, 
    title: 'Bio-Plataforma de Nutrição Personalizada via Bio-Sensores', 
    description: 'App que cruza dados de CGM (Monitores de Glicose) e biometria em tempo real para criar dietas dinâmicas que previnem picos de insulina.',
    details: [
      "Conexão direta com dispositivos wearables de grau médico via Bluetooth Low Energy.",
      "Motor de recomendação que ajusta a próxima refeição baseada na resposta metabólica da anterior.",
      "Modelo: Assinatura mensal + venda direta de sensores de marca própria.",
      "Dica: O valor único é a eliminação do 'adivinho' na dieta; é ciência aplicada ao prato do usuário."
    ]
  },
  { 
    id: 5, 
    title: 'Ecossistema de Micro-Investimento em Propriedade Intelectual (PI)', 
    description: 'Plataforma que tokeniza royalties de músicas, patentes e códigos-fonte, permitindo que criadores captem recursos com sua audiência.',
    details: [
      "Smart contracts em redes de baixo custo (como Polygon) para distribuição automática de royalties.",
      "Dashboard analítico de performance de PI em plataformas como Spotify, Steam e portais de patentes.",
      "Monetização: 5% de taxa de captação + 1% sobre transações no mercado secundário.",
      "Dica: Comece com desenvolvedores independentes de games, um nicho com alta necessidade de capital e fãs engajados."
    ]
  },
];

function SwipeCard({ 
  idea, 
  onSwipe, 
  isFront, 
  index, 
  isFavorite,
  onToggleFavorite,
  onUpdateIdea,
  onOpenDetails
}: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(idea.title);
  const [editedDescription, setEditedDescription] = useState(idea.description);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${idea.title}\n\n${idea.description}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleSave = () => {
    onUpdateIdea(idea.id, { title: editedTitle, description: editedDescription });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(idea.title);
    setEditedDescription(idea.description);
    setIsEditing(false);
  };
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  
  // Opacidade, escala e rotação dinâmica para os selos de "Gostei" e "Passo"
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const likeScale = useTransform(x, [20, 120], [0.6, 1.1]);
  const likeRotate = useTransform(x, [20, 120], [-15, -10]);

  const nopeOpacity = useTransform(x, [-20, -120], [0, 1]);
  const nopeScale = useTransform(x, [-20, -120], [0.6, 1.1]);
  const nopeRotate = useTransform(x, [-20, -120], [15, 10]);

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      onSwipe(idea.id, 'right');
    } else if (offset < -100 || velocity < -500) {
      onSwipe(idea.id, 'left');
    }
  };

  return (
    <motion.div
      style={{ x, rotate }}
      drag={isFront && !isEditing ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={isFront && !isEditing ? handleDragEnd : undefined}
      className={cn(
        "absolute w-full h-[280px] md:h-[310px] p-5 md:p-6 bg-[#1A1A1A] border border-white/10 rounded-[1.5rem] md:rounded-[1.8rem] shadow-2xl origin-bottom flex flex-col justify-center",
        isFront && !isEditing ? "cursor-grab active:cursor-grabbing" : "",
        !isFront && "pointer-events-none"
      )}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ 
        scale: isFront ? 1 : 1 - (index * 0.05), 
        opacity: isFront ? 1 : 0.4, 
        y: isFront ? 0 : index * 8,
        zIndex: 100 - index
      }}
      exit={{ 
        x: x.get() > 0 ? 500 : -500, 
        opacity: 0, 
        scale: 0.8,
        rotate: x.get() > 0 ? 25 : -25,
        transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } 
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Selos de Tinder */}
      <motion.div 
        style={{ opacity: likeOpacity, scale: likeScale, rotate: likeRotate }} 
        className="absolute top-16 left-12 border-[6px] border-green-500 text-green-500 rounded-2xl px-6 py-2 text-4xl font-black uppercase z-20 pointer-events-none shadow-[0_0_30px_rgba(34,197,94,0.2)]"
      >
        Gostei
      </motion.div>
      <motion.div 
        style={{ opacity: nopeOpacity, scale: nopeScale, rotate: nopeRotate }} 
        className="absolute top-16 right-12 border-[6px] border-red-500 text-red-500 rounded-2xl px-6 py-2 text-4xl font-black uppercase z-20 pointer-events-none shadow-[0_0_30px_rgba(239,68,68,0.2)]"
      >
        Passo
      </motion.div>
      <div className={cn("flex flex-col h-full pointer-events-none select-none relative z-0 transition-opacity duration-200", !isFront && "opacity-0")}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center text-black shadow-lg">
              <Lightbulb className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
            </div>
            <span className="text-xs md:text-sm font-bold text-white tracking-tight">
              100<span className="text-gray-500">ideias</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/5 h-fit">
              Sugestão IA
            </div>
            
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button 
                  onClick={handleCopy}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all active:scale-90 relative"
                  title="Copiar ideia"
                >
                  <AnimatePresence mode="wait">
                    {isCopied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <Check className="w-4 h-4 text-green-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <Copy className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              )}
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-90",
                  isEditing ? "bg-white text-black" : "bg-white/5 text-gray-500 hover:text-white hover:bg-white/10"
                )}
                title={isEditing ? "Confirmar" : "Editar Ideia"}
              >
                {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(idea);
                }}
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-90",
                  isFavorite ? "bg-white text-black shadow-lg" : "bg-white/5 text-gray-500 hover:text-white hover:bg-white/10"
                )}
                title={isFavorite ? "Remover dos Favoritos" : "Favoritar Ideia"}
              >
                <Bookmark className={cn("w-4 h-4", isFavorite && "fill-current")} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {isEditing ? (
            <div className="space-y-4 pointer-events-auto">
              <input 
                autoFocus
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white font-bold text-xl outline-none focus:border-white/40 transition-all"
                placeholder="Título da ideia"
              />
              <textarea 
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-gray-200 text-sm outline-none focus:border-white/40 transition-all resize-none h-24"
                placeholder="Descrição da ideia"
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-white text-black font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <Check className="w-3 h-3" /> Salvar
                </button>
                <button 
                  onClick={handleCancel}
                  className="flex-1 bg-white/10 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                >
                  <X className="w-3 h-3" /> Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="group cursor-pointer pointer-events-auto" 
              onClick={() => {
                // Only open if the card hasn't been dragged significantly
                if (Math.abs(x.get()) < 10) {
                  onOpenDetails();
                }
              }}
            >
              <h3 className="mb-2 md:mb-2.5 text-lg md:text-xl font-bold text-white leading-tight tracking-tight group-hover:text-white/90 transition-colors">
                {idea.title}
              </h3>
              <p className="text-gray-400 text-[10px] md:text-xs leading-relaxed max-w-[95%] group-hover:text-gray-300 transition-colors">
                {idea.description}
              </p>
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
            Ideia Pronta para Executar
          </div>
          
          {!isEditing && (
            <button 
              onClick={() => {
                if (Math.abs(x.get()) < 10) {
                  onOpenDetails();
                }
              }}
              className="pointer-events-auto text-[10px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1 group/btn"
            >
              Ver Detalhes
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.div>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function IdeaSwiper({ 
  likedIdeas, 
  setLikedIdeas, 
  favoriteIdeas,
  setFavoriteIdeas,
  aiIdeas,
  onReset,
  onIncrementUsage
}: any) {
  const [ideas, setIdeas] = useState<any[]>(() => 
    (aiIdeas && aiIdeas.length > 0 ? aiIdeas : INITIAL_IDEAS).map((idea: any) => ({ ...idea, id: idea.id + Math.floor(Math.random() * 1000000) }))
  );
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);

  // Sync ideas when aiIdeas changes
  useEffect(() => {
    if (aiIdeas && aiIdeas.length > 0) {
      setIdeas(aiIdeas.map((idea: any) => ({ ...idea, id: idea.id + Math.floor(Math.random() * 1000000) })));
    }
  }, [aiIdeas]);

  const handleSwipe = (id: number, direction: 'left' | 'right') => {
    if (direction === 'right') {
      const idea = ideas.find(i => i.id === id);
      if (idea) {
        setLikedIdeas((prev: any) => {
          if (!prev.some((p: any) => p.id === idea.id)) {
            if (prev.length >= 100) return prev;
            return [...prev, idea];
          }
          return prev;
        });
      }
    }
    setIdeas(prev => prev.filter(i => i.id !== id));
  };



  const handleReload = () => {
    if (onIncrementUsage && !onIncrementUsage()) {
      return; // blocked by usage limit
    }
    setReloadKey(prev => prev + 1);
    setIdeas(() => INITIAL_IDEAS.map(idea => ({ ...idea, id: idea.id + Math.floor(Math.random() * 1000000) })));
  };

  const handleUpdateIdea = (id: number, updates: any) => {
    setIdeas(prev => prev.map(idea => idea.id === id ? { ...idea, ...updates } : idea));
    setLikedIdeas((prev: any) => prev.map((idea: any) => idea.id === id ? { ...idea, ...updates } : idea));
    setFavoriteIdeas((prev: any) => prev.map((idea: any) => idea.id === id ? { ...idea, ...updates } : idea));
  };

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

  const forceSwipe = (direction: 'left' | 'right') => {
    if (ideas.length === 0) return;
    handleSwipe(ideas[0].id, direction);
  }

  return (
    <section className="px-4 pb-24 mx-auto max-w-3xl w-full flex flex-col items-start">
      <div className="w-10 h-1 bg-white rounded-full mb-6 opacity-80" />
      <div className="mb-6 text-left">
        <h1 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight leading-tight">
          Avalie as Ideias
        </h1>
        <p className="text-gray-400 text-xs max-w-xl">
          Arraste para a direita as que você curtiu e para a esquerda as que não fazem sentido agora.
        </p>
      </div>

      <div className="relative w-full max-w-lg h-[360px] mb-8 self-center">
        <AnimatePresence>
          {ideas.length > 0 ? (
            // Reversing so that index 0 is rendered last (on top)
            [...ideas].reverse().map((idea, index) => {
              const isFront = index === ideas.length - 1;
              
              return (
                <SwipeCard
                  key={`${reloadKey}-${idea.id}`}
                  idea={idea}
                  index={ideas.length - 1 - index}
                  isFront={isFront}
                  isFavorite={favoriteIdeas.some((p: any) => p.id === idea.id)}
                  onToggleFavorite={() => handleToggleFavorite(idea)}
                  onSwipe={handleSwipe}
                  onUpdateIdea={handleUpdateIdea}
                  onOpenDetails={() => setSelectedIdea(idea)}
                />
              );
            })
          ) : (
            <motion.div 
              key="end-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-surface/50 border border-white/5 rounded-[2.5rem] text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Você avaliou todas!</h3>
              <p className="text-gray-400 mb-8">
                Você curtiu {likedIdeas.length} de {INITIAL_IDEAS.length} ideias.
              </p>
              <div className="w-full space-y-3">
                <Button3D onClick={handleReload} color="white" className="px-8 h-[50px] sm:h-[46px] w-full">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  <span>Gerar Mais (Mesmo Tema)</span>
                </Button3D>
                <Button3D onClick={onReset} color="gray" className="px-8 h-[50px] sm:h-[46px] w-full">
                  <Search className="w-5 h-5 mr-2" />
                  <span>Nova Pesquisa (Limpar Tudo)</span>
                </Button3D>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {ideas.length > 0 && (
        <div className="flex items-center space-x-6 md:space-x-8 self-center">
          <button 
            onClick={() => forceSwipe('left')}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-surface border border-white/5 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 transition-all active:scale-90 shadow-xl"
            title="Não gostei"
          >
            <ThumbsDown className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button 
            onClick={() => forceSwipe('right')}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-surface border border-white/5 text-green-500 hover:bg-green-500/10 hover:border-green-500/50 transition-all active:scale-90 shadow-xl"
            title="Gostei"
          >
            <ThumbsUp className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      )}

      <IdeaDetailModal 
        idea={selectedIdea} 
        onClose={() => setSelectedIdea(null)} 
      />
    </section>
  );
}
