import { Lightbulb } from "lucide-react"

export function ResultsGrid() {
  // Creating some placeholders
  const placeholders = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    title: `Ideia Gerada ${i + 1}`,
    description: "Esta é uma descrição de exemplo para a ideia que será gerada pela Inteligência Artificial. A ideia real aparecerá aqui com mais detalhes sobre a execução.",
  }))

  return (
    <section className="px-4 pb-24 mx-auto max-w-7xl">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Últimas Ideias</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholders.map((item) => (
          <div key={item.id} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative h-full p-6 bg-surface border border-white/5 rounded-2xl hover:border-primary/50 transition-colors duration-300 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-background border border-white/5 text-primary group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-500">#{String(item.id + 1).padStart(3, '0')}</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <button className="px-6 py-3 text-sm font-medium text-gray-400 bg-surface border border-white/5 rounded-xl hover:text-white hover:bg-white/5 transition-colors">
          Carregar mais ideias...
        </button>
      </div>
    </section>
  )
}
