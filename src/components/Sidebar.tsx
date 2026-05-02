import { Lightbulb, Sparkles, Heart } from "lucide-react"

export function Sidebar({ onOpenFavorites }: { onOpenFavorites: () => void }) {
  return (
    <aside className="w-64 h-screen border-r border-white/5 bg-[#0F0F0F] flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 flex items-center space-x-3 mb-2">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black">
          <Lightbulb className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">
          100<span className="text-gray-500">ideias</span>
        </span>
      </div>

      <div className="px-4">
        <p className="text-[10px] font-bold text-gray-500 mb-3 px-2 tracking-wider">GERAL</p>
        <nav className="space-y-1">
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-white/5 text-white font-medium border border-white/5 shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
            <span>Gerador</span>
          </a>
          <button onClick={onOpenFavorites} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium cursor-pointer">
            <Heart className="w-4 h-4" />
            <span>Favoritas</span>
          </button>
        </nav>
      </div>

      <div className="mt-auto p-6">
        <p className="text-xs text-gray-600 leading-relaxed font-medium">
          Ideias geradas por IA.<br/>Resultados para inspiração.
        </p>
      </div>
    </aside>
  )
}
