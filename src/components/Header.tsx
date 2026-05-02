import { Sparkles } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">100Ideias</span>
      </div>
      <nav>
        <a href="#como-funciona" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">
          Como funciona
        </a>
      </nav>
    </header>
  )
}
