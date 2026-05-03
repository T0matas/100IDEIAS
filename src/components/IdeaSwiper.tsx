import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Lightbulb, ThumbsUp, ThumbsDown, RefreshCw, Heart, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button3D } from './ui/Button3D';

const INITIAL_IDEAS = [
  { id: 1, title: 'Assistente Virtual de Compras', description: 'Uma IA que analisa seu estilo e orçamento, encontrando as melhores roupas em lojas parceiras.' },
  { id: 2, title: 'App de Receitas com Sobras', description: 'Tire uma foto da sua geladeira e o app sugere receitas criativas e deliciosas para evitar o desperdício.' },
  { id: 3, title: 'Plataforma de Troca de Habilidades', description: 'Aprenda violão ensinando inglês. Uma rede social onde a moeda é o seu conhecimento.' },
  { id: 4, title: 'Gamificação de Hábitos de Leitura', description: 'Transforme sua rotina de leitura num RPG onde seu personagem evolui a cada capítulo lido.' },
  { id: 5, title: 'Marketplace de Assinaturas Compartilhadas', description: 'Sistema seguro para dividir custos de streaming e softwares de forma automatizada.' },
];

function SwipeCard({ idea, onSwipe, isFront, index, isLiked, onToggleLike }: any) {
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
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={isFront ? handleDragEnd : undefined}
      className={cn(
        "absolute w-full h-[360px] p-7 bg-surface border border-white/5 rounded-3xl shadow-2xl origin-bottom flex flex-col justify-center",
        isFront ? "cursor-grab active:cursor-grabbing hover:border-white/40 transition-colors" : "pointer-events-none"
      )}
      initial={{ scale: 0.9, opacity: 0, y: 50 }}
      animate={{ 
        scale: isFront ? 1 : 1 - (index * 0.05), 
        opacity: isFront ? 1 : 1 - (index * 0.2), 
        y: isFront ? 0 : index * 15,
        zIndex: 100 - index
      }}
      exit={{ 
        x: x.get() > 0 ? 300 : -300, 
        opacity: 0, 
        scale: 0.9,
        transition: { duration: 0.3 } 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Selos de Tinder */}
      <motion.div style={{ opacity: likeOpacity }} className="absolute top-6 left-6 border-4 border-green-500 text-green-500 rounded-xl px-3 py-0.5 text-2xl font-bold uppercase rotate-[-15deg] z-10 pointer-events-none">
        Gostei
      </motion.div>
      <motion.div style={{ opacity: nopeOpacity }} className="absolute top-6 right-6 border-4 border-red-500 text-red-500 rounded-xl px-3 py-0.5 text-2xl font-bold uppercase rotate-[15deg] z-10 pointer-events-none">
        Passo
      </motion.div>

      <div className={cn("absolute top-5 right-5 z-20 transition-opacity", isFront ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <button 
          onClick={onToggleLike}
          className={cn(
            "p-2.5 border rounded-full transition-all cursor-pointer active:scale-90 shadow-xl",
            isLiked 
              ? "bg-red-500/10 border-red-500/50 text-red-500" 
              : "bg-background/80 backdrop-blur-md border-white/10 text-gray-400 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10"
          )}
          title={isLiked ? "Remover dos Favoritos" : "Favoritar Ideia"}
        >
          <motion.div
            initial={false}
            animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart className={cn("w-4 h-4 transition-colors", isLiked && "fill-current")} />
          </motion.div>
        </button>
      </div>

      <div className="flex flex-col h-full items-center text-center justify-center pointer-events-none select-none relative z-0">
        <div className="p-3 mb-5 rounded-2xl bg-background border border-white/5 text-white">
          <Lightbulb className="w-8 h-8" />
        </div>
        <h3 className="mb-3 text-2xl font-bold text-white leading-tight">
          {idea.title}
        </h3>
        <p className="text-gray-400 text-base leading-relaxed">
          {idea.description}
        </p>
      </div>
    </motion.div>
  );
}

export function IdeaSwiper({ likedIdeas, setLikedIdeas, onReset }: any) {
  const [ideas, setIdeas] = useState(INITIAL_IDEAS);

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

  const handleToggleLike = (idea: any) => {
    setLikedIdeas((prev: any) => {
      const isAlreadyLiked = prev.some((p: any) => p.id === idea.id);
      if (isAlreadyLiked) {
        return prev.filter((p: any) => p.id !== idea.id);
      } else {
        return [...prev, idea];
      }
    });
  };

  const handleReload = () => {
    setIdeas(INITIAL_IDEAS);
    setLikedIdeas([]);
  };

  const forceSwipe = (direction: 'left' | 'right') => {
    if (ideas.length === 0) return;
    handleSwipe(ideas[0].id, direction);
  }

  return (
    <section className="px-4 pb-24 mx-auto max-w-lg flex flex-col items-center">
      <div className="w-10 h-1 bg-white rounded-full mb-6 opacity-20" />
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Avalie as Ideias</h2>
        <p className="text-gray-400 text-sm">Arraste para direita se curtiu, esquerda se não.</p>
      </div>

      <div className="relative w-full h-[360px] mb-10">
        <AnimatePresence>
          {ideas.length > 0 ? (
            // Reversing so that index 0 is rendered last (on top)
            [...ideas].reverse().map((idea, index) => {
              const isFront = index === ideas.length - 1;
              const isLiked = likedIdeas.some((p: any) => p.id === idea.id);
              
              return (
                <SwipeCard
                  key={idea.id}
                  idea={idea}
                  index={ideas.length - 1 - index}
                  isFront={isFront}
                  isLiked={isLiked}
                  onToggleLike={() => handleToggleLike(idea)}
                  onSwipe={handleSwipe}
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
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-surface/50 border border-white/5 rounded-3xl text-center"
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
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => forceSwipe('left')}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-surface border border-white/5 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 transition-all active:scale-95"
          >
            <ThumbsDown className="w-8 h-8" />
          </button>
          <button 
            onClick={() => forceSwipe('right')}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-surface border border-white/5 text-green-500 hover:bg-green-500/10 hover:border-green-500/50 transition-all active:scale-95"
          >
            <ThumbsUp className="w-8 h-8" />
          </button>
        </div>
      )}
    </section>
  );
}
