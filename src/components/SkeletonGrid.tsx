import { motion } from "framer-motion"

export function SkeletonGrid() {
  return (
    <div className="px-12 mt-12 w-full max-w-5xl mx-auto">
      <p className="text-center text-gray-600 mb-10 text-sm font-medium">Suas ideias aparecerão aqui</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.15
            }}
            className="bg-[#111111] border border-white/5 rounded-2xl p-6 h-36 flex flex-col justify-center shadow-[0_4px_0_rgb(15,15,15)]"
          >
            <div className="w-16 h-2 bg-[#222222] rounded-full mb-5"></div>
            <div className="w-full h-2 bg-[#222222] rounded-full mb-3"></div>
            <div className="w-3/4 h-2 bg-[#222222] rounded-full"></div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
