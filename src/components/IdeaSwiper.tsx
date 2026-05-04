import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Lightbulb, Bookmark, Search, Edit2, Check, X, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button3D } from './ui/Button3D';

const INITIAL_IDEAS = [
  { id: 1, title: 'Assistente Virtual de Compras', description: 'Uma IA que analisa seu estilo e orçamento, encontrando as melhores roupas em lojas parceiras.' },
  { id: 2, title: 'App de Receitas com Sobras', description: 'Tire uma foto da sua geladeira e o app sugere receitas criativas e deliciosas para evitar o desperdício.' },
  { id: 3, title: 'Plataforma de Troca de Habilidades', description: 'Aprenda violão ensinando inglês. Uma rede social onde a moeda é o seu conhecimento.' },
  { id: 4, title: 'Gamificação de Hábitos de Leitura', description: 'Transforme sua rotina de leitura num RPG onde seu personagem evolui a cada capítulo lido.' },
  { id: 5, title: 'Marketplace de Assinaturas Compartilhadas', description: 'Sistema seguro para dividir custos de streaming e softwares de forma automatizada.' },
];

function SwipeCard({ 
  idea, 
  onSwipe, 
  isFront, 
  index, 
  isFavorite,
  onToggleFavorite,
  onUpdateIdea 
}: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(idea.title);
  const [editedDescription, setEditedDescription] = useState(idea.description);

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
  
  // Opacidade dinâmica para os selos de "Gostei" e "Passo"
  const likeOpacity = useTransform(x, [10, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-10, -100], [0, 1]);

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
        "absolute w-full h-[380px] p-8 bg-[#1A1A1A] border border-white/10 rounded-[2.5rem] shadow-2xl origin-bottom flex flex-col justify-center",
        isFront && !isEditing ? "cursor-grab active:cursor-grabbing" : "",
        !isFront && "pointer-events-none"
      )}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ 
        scale: isFront ? 1 : 1 - (index * 0.04), 
        opacity: isFront ? 1 : 0.4, 
        y: isFront ? 0 : index * 12,
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
      <motion.div style={{ opacity: likeOpacity }} className="absolute top-6 left-6 border-4 border-green-500 text-green-500 rounded-xl px-3 py-0.5 text-2xl font-bold uppercase rotate-[-15deg] z-10 pointer-events-none">
        Gostei
      </motion.div>
      <motion.div style={{ opacity: nopeOpacity }} className="absolute top-6 right-6 border-4 border-red-500 text-red-500 rounded-xl px-3 py-0.5 text-2xl font-bold uppercase rotate-[15deg] z-10 pointer-events-none">
        Passo
      </motion.div>
      <div className="flex flex-col h-full pointer-events-none select-none relative z-0">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black shadow-lg">
              <Lightbulb className="w-4.5 h-4.5" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              100<span className="text-gray-500">ideias</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/5 h-fit">
              Sugestão IA
            </div>
            
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                "p-2 rounded-xl border transition-all cursor-pointer active:scale-90",
                isEditing 
                  ? "bg-white/20 border-white/30 text-white" 
                  : "bg-white/[0.03] border-white/5 text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/10"
              )}
              title="Editar Ideia"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            
            <button 
              onClick={onToggleFavorite}
              className={cn(
                "p-2 rounded-xl border transition-all cursor-pointer active:scale-90",
                isFavorite 
                  ? "bg-white/20 border-white/30 text-white" 
                  : "bg-white/[0.03] border-white/5 text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/10"
              )}
              title={isFavorite ? "Remover dos Favoritos" : "Favoritar Ideia"}
            >
              <motion.div
                initial={false}
                animate={{ scale: isFavorite ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <Bookmark className={cn("w-4 h-4 transition-colors", isFavorite && "fill-current")} />
              </motion.div>
            </button>
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
            <>
              <h3 className="mb-4 text-3xl font-bold text-white leading-tight tracking-tight">
                {idea.title}
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed max-w-[90%]">
                {idea.description}
              </p>
            </>
          )}
        </div>

        <div className="mt-auto pt-6 flex items-center gap-2 text-[11px] font-medium text-gray-500 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
          Ideia Pronta para Executar
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
  onReset,
  onIncrementUsage
}: any) {
  const [ideas, setIdeas] = useState(INITIAL_IDEAS);
  const [reloadKey, setReloadKey] = useState(0);

  const handleSwipe = (id: number, direction: 'left' | 'right') => {
    if (direction === 'right') {
      const idea = ideas.find(i => i.id === id);
      if (idea) {
        setLikedIdeas((prev: any) => {
          if (!prev.some((p: any) => p.id === idea.id)) {
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
    setIdeas(INITIAL_IDEAS);
    setLikedIdeas([]);
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
        return [...prev, idea];
      }
    });
  };

  const forceSwipe = (direction: 'left' | 'right') => {
    if (ideas.length === 0) return;
    handleSwipe(ideas[0].id, direction);
  }

  return (
    <section className="px-4 pb-24 mx-auto max-w-4xl w-full flex flex-col items-start">
      <div className="w-10 h-1 bg-white rounded-full mb-6 opacity-80" />
      <div className="mb-10 text-left">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-tight leading-tight">
          Avalie as Ideias
        </h1>
        <p className="text-gray-400 text-sm max-w-xl">
          Arraste para a direita as que você curtiu e para a esquerda as que não fazem sentido agora.
        </p>
      </div>

      <div className="relative w-full max-w-lg h-[400px] mb-12 self-center">
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
                <Button3D onClick={handleReload} color="white" className="px-8 py-3.5 w-full">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  <span>Gerar Mais (Mesmo Tema)</span>
                </Button3D>
                <Button3D onClick={onReset} color="gray" className="px-8 py-3.5 w-full">
                  <Search className="w-5 h-5 mr-2" />
                  <span>Nova Pesquisa (Limpar Tudo)</span>
                </Button3D>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {ideas.length > 0 && (
        <div className="flex items-center space-x-8 self-center">
          <button 
            onClick={() => forceSwipe('left')}
            className="flex items-center justify-center w-20 h-20 rounded-full bg-surface border border-white/5 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 transition-all active:scale-90 shadow-xl"
            title="Não gostei"
          >
            <ThumbsDown className="w-10 h-10" />
          </button>
          <button 
            onClick={() => forceSwipe('right')}
            className="flex items-center justify-center w-20 h-20 rounded-full bg-surface border border-white/5 text-green-500 hover:bg-green-500/10 hover:border-green-500/50 transition-all active:scale-90 shadow-xl"
            title="Gostei"
          >
            <ThumbsUp className="w-10 h-10" />
          </button>
        </div>
      )}
    </section>
  );
}
