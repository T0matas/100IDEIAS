import { motion, AnimatePresence } from "framer-motion"
import { X, Lightbulb, ThumbsUp, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { API_URL } from "../config"
import { cn } from "../lib/utils"

interface UserProfileModalProps {
  userId: string | null
  onClose: () => void
}

interface UserProfile {
  id: string
  name: string
  initials: string
  ideas: any[]
}

const API = `${API_URL}/api`

export function UserProfileModal({ userId, onClose }: UserProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchProfile = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API}/community/user/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  if (!userId) return null

  return (
    <AnimatePresence>
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
          className="relative w-full max-w-xl bg-[#0F0F0F] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col max-h-[85vh] shadow-2xl"
        >
          {/* Header/Profile Info */}
          <div className="p-8 md:p-10 border-b border-white/5 bg-white/[0.02]">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-500 hover:text-white transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {loading ? (
              <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-white/5" />
                <div className="w-32 h-6 bg-white/5 rounded-md" />
                <div className="w-48 h-4 bg-white/5 rounded-md" />
              </div>
            ) : profile ? (
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center text-2xl font-bold mb-4 shadow-xl">
                  {profile.initials}
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">
                  {profile.ideas.length} {profile.ideas.length === 1 ? "Ideia Compartilhada" : "Ideias Compartilhadas"}
                </p>
                
                <div className="flex items-center gap-8 py-4 px-8 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{profile.ideas.reduce((acc, curr) => acc + curr.likes, 0)}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Likes Totais</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{profile.ideas.reduce((acc, curr) => acc + curr.comments, 0)}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Comentários</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">Usuário não encontrado.</div>
            )}
          </div>

          {/* Ideas List */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 custom-scrollbar">
            {!loading && profile && profile.ideas.map((idea, idx) => (
              <div 
                key={idea.id}
                className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{idea.category}</span>
                  </div>
                  <span className="text-[9px] text-gray-600 font-medium">
                    {new Date(idea.createdAt).toLocaleDateString("pt-PT", { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <h3 className="text-white font-bold text-base mb-2">{idea.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">{idea.description}</p>
                
                <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                  <div className={cn(
                    "flex items-center gap-1.5 text-[10px] font-bold",
                    idea.isLiked ? "text-white" : "text-gray-500"
                  )}>
                    <ThumbsUp className={cn("w-3 h-3", idea.isLiked && "fill-current")} />
                    {idea.likes}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                    <MessageSquare className="w-3 h-3" />
                    {idea.comments}
                  </div>
                </div>
              </div>
            ))}
            
            {!loading && profile && profile.ideas.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-sm">Este usuário ainda não compartilhou ideias.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
