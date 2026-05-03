import { Menu, Lightbulb } from "lucide-react"

interface MobileHeaderProps {
  onMenuClick: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="h-14 bg-[#0A0A0A] border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">100Ideias</span>
        </div>
      </div>
    </header>
  )
}
