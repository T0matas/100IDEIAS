import { motion } from "framer-motion"

export function SkeletonGrid() {
  return (
    <div className="px-4 pt-16 pb-24 mx-auto max-w-4xl w-full flex flex-col items-start">
      {/* Skeleton Header matching IdeaSwiper */}
      <div className="w-10 h-1 bg-white rounded-full mb-6 opacity-30 animate-pulse" />
      <div className="mb-10 text-left w-full">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-tight leading-tight">
          Exemplo do que virá
        </h1>
        <p className="text-gray-400 text-sm max-w-xl">
          Aqui é o que vai aparecer de exemplo
        </p>
      </div>

      {/* Skeleton Stack mimicking IdeaSwiper */}
      <div className="relative w-full max-w-lg h-[400px] mb-12 self-center">
        {[0, 1, 2].map((i) => (
          <motion.div 
            key={i} 
            initial={{ 
              opacity: 1 - (i * 0.3),
              scale: 1 - (i * 0.04),
              y: i * 12
            }}
            animate={{ 
              opacity: [1 - (i * 0.3), 0.8 - (i * 0.3), 1 - (i * 0.3)],
              scale: 1 - (i * 0.04),
              y: i * 12
            }}
            transition={{ 
              opacity: {
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.2
              }
            }}
            style={{
              zIndex: 10 - i,
              transformOrigin: "bottom"
            }}
            className="absolute inset-0 bg-[#1A1A1A] border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-2xl"
          >
            {/* Skeleton Card Internal Structure */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
                <div className="w-16 h-3 bg-white/5 rounded-full"></div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-20 h-6 bg-white/5 rounded-md opacity-50"></div>
                <div className="w-8 h-8 bg-white/5 rounded-lg"></div>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-5">
              <div className="w-4/5 h-10 bg-white/10 rounded-xl"></div>
              <div className="space-y-3">
                <div className="w-full h-3 bg-white/5 rounded-full"></div>
                <div className="w-full h-3 bg-white/5 rounded-full"></div>
                <div className="w-2/3 h-3 bg-white/5 rounded-full"></div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/20"></div>
              <div className="w-32 h-2 bg-white/5 rounded-full"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Skeleton Buttons */}
      <div className="flex items-center space-x-8 self-center">
        <div className="w-20 h-20 rounded-full bg-white/10 border border-white/10 animate-pulse"></div>
        <div className="w-20 h-20 rounded-full bg-white/10 border border-white/10 animate-pulse"></div>
      </div>
    </div>
  )
}
