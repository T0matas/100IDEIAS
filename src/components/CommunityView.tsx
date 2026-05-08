import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Users, Lightbulb, ThumbsUp, MessageSquare, Pencil, Trash2, Check, X } from "lucide-react"
import { cn } from "../lib/utils"
import { Button3D } from "./ui/Button3D"
import { API_URL } from "../config"
import { UserProfileModal } from "./UserProfileModal"

interface CommunityViewProps {
  isLoggedIn: boolean
  onLogin: () => void
  userEmail?: string
}

interface CommunityPost {
  id: string
  userId: string
  authorName: string
  createdAt: string
  updatedAt?: string
  category: string
  title: string
  description: string
  likes: number
  comments: number
  isLiked?: boolean
  commentList?: { id: string, text: string, userName: string, userInitials: string, likes: number, isLiked?: boolean, userId: string, createdAt?: string }[]
  matchTag?: string | null
}

const API = `${API_URL}/api`

export function CommunityView({ isLoggedIn, onLogin }: CommunityViewProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [_isLoading, setIsLoading] = useState(true)
  const [newPost, setNewPost] = useState("")
  const [postTitle, setPostTitle] = useState("")
  const [error, setError] = useState("")
  const [_isPublishing, setIsPublishing] = useState(false)
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null)
  const [commentValue, setCommentValue] = useState("")
  const [selectedMatchTag, setSelectedMatchTag] = useState<string | null>(null)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editCommentValue, setEditCommentValue] = useState("")
  const [selectedUserProfileId, setSelectedUserProfileId] = useState<string | null>(null)

  const currentUserId = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}").id } catch { return null }
  })()

  const matchTags = ["Busco Dev", "Busco Designer", "Busco Co-founder", "Busco Marketing"]

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
    if (diff < 60) return "Agora mesmo"
    if (diff < 3600) return `${Math.floor(diff/60)}min atrás`
    if (diff < 3600 * 6) return `${Math.floor(diff/3600)}h atrás`
    const timeStr = d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })
    const todayStart = new Date(now); todayStart.setHours(0,0,0,0)
    const yesterdayStart = new Date(todayStart); yesterdayStart.setDate(todayStart.getDate() - 1)
    if (d >= todayStart) return `Hoje, ${timeStr}`
    if (d >= yesterdayStart) return `Ontem, ${timeStr}`
    return d.toLocaleDateString("pt-PT", { day: "numeric", month: "short" }) + `, ${timeStr}`
  }

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API}/community`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        if (res.ok) {
          const data = await res.json()
          setPosts(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const handlePublish = async () => {
    if (!postTitle.trim() || !newPost.trim()) {
      setError("Por favor, preencha o título e a descrição da sua ideia.")
      return
    }
    setError("")
    setIsPublishing(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/community`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: postTitle, description: newPost, category: "Nova Ideia", tags: selectedMatchTag ? [selectedMatchTag] : [] })
      })
      if (res.ok) {
        const data = await res.json()
        setPosts(prev => [{ ...data, isLiked: false, commentList: [], comments: 0, matchTag: selectedMatchTag }, ...prev])
        setNewPost("")
        setPostTitle("")
        setSelectedMatchTag(null)
      } else {
        const data = await res.json()
        setError(data.error || "Erro ao publicar.")
      }
    } catch (e) {
      setError("Erro de conexão com o servidor.")
    } finally {
      setIsPublishing(false)
    }
  }

  const handleLike = async (postId: string) => {
    if (!isLoggedIn) { onLogin(); return }
    try {
      const token = localStorage.getItem("token")
      const post = posts.find(p => p.id === postId)
      if (!post) return
      
      const res = await fetch(`${API}/community/${postId}/like`, { 
        method: "POST", 
        headers: { Authorization: `Bearer ${token}` } 
      })
      
      if (res.ok) {
        const data = await res.json()
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, isLiked: data.isLiked, likes: data.likes } : p
        ))
      }
    } catch (e) { console.error(e) }
  }

  const handleAddComment = async (postId: string) => {
    if (!isLoggedIn) {
      onLogin()
      return
    }
    if (!commentValue.trim()) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/community/${postId}/comment`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ content: commentValue })
      })
      if (res.ok) {
        const newComment = await res.json()
        setPosts(prev => prev.map(post => post.id === postId ? {
          ...post,
          comments: post.comments + 1,
          commentList: [...(post.commentList || []), newComment]
        } : post))
        setCommentValue("")
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleCommentLike = async (postId: string, commentId: string) => {
    if (!isLoggedIn) {
      onLogin()
      return
    }
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/community/comment/${commentId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              commentList: post.commentList?.map(c => 
                c.id === commentId ? { ...c, likes: data.likes, isLiked: data.isLiked } : c
              )
            }
          }
          return post
        }))
      }
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Tens a certeza que queres eliminar esta ideia?")) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/community/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) setPosts(prev => prev.filter(p => p.id !== postId))
    } catch (e) { console.error(e) }
  }

  const handleStartEdit = (post: CommunityPost) => {
    setEditingPostId(post.id)
    setEditTitle(post.title)
    setEditDescription(post.description)
  }

  const handleSaveEdit = async (postId: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/community/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: editTitle, description: editDescription })
      })
      if (res.ok) {
        const updated = await res.json()
        setPosts(prev => prev.map(p => p.id === postId ? { 
          ...p, 
          title: updated.title, 
          description: updated.description,
          updatedAt: updated.updatedAt 
        } : p))
        setEditingPostId(null)
      }
    } catch (e) { console.error(e) }
  }

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!window.confirm("Tens a certeza que queres eliminar este comentário?")) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/community/comment/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments - 1,
              commentList: post.commentList?.filter(c => c.id !== commentId)
            }
          }
          return post
        }))
      }
    } catch (e) { console.error(e) }
  }

  const handleSaveEditComment = async (postId: string, commentId: string) => {
    if (!editCommentValue.trim()) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/community/comment/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: editCommentValue })
      })
      if (res.ok) {
        const updated = await res.json()
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              commentList: post.commentList?.map(c => 
                c.id === commentId ? { ...c, text: updated.text } : c
              )
            }
          }
          return post
        }))
        setEditingCommentId(null)
      }
    } catch (e) { console.error(e) }
  }


  return (
    <div className="max-w-2xl pt-6 md:pt-10 pb-24 px-5 md:px-8 w-full">
      {/* Header */}
      <div className="w-10 h-1 bg-white rounded-full mb-6 opacity-80" />
      <h1 className="text-2xl md:text-2xl font-bold text-white mb-1.5 tracking-tight">
        Comunidade
      </h1>
      <p className="text-gray-400 mb-6 text-xs">
        Compartilhe suas ideias e inspire outros empreendedores.
      </p>

      {/* Share Idea Card */}
      <div className="relative overflow-hidden group">
        <div className={cn(
          "bg-[#1A1A1A] border border-white/5 rounded-[1.5rem] md:rounded-[1.8rem] p-6 md:p-7 mb-8 shadow-xl transition-all",
          !isLoggedIn && "blur-[2px] pointer-events-none opacity-50"
        )}>
          <div className="flex items-center gap-2 mb-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <Lightbulb className="w-4 h-4" />
            <span>Compartilhar uma ideia</span>
          </div>
          <input
            type="text"
            value={postTitle}
            onChange={(e) => {
              setPostTitle(e.target.value)
              if (error) setError("")
            }}
            placeholder="Título da sua ideia..."
            className="w-full bg-transparent border-b border-white/5 text-white placeholder-gray-600 outline-none text-lg md:text-lg font-bold mb-4 pb-2"
          />
          <textarea
            value={newPost}
            onChange={(e) => {
              setNewPost(e.target.value)
              if (error) setError("")
            }}
            placeholder="Descreva sua ideia de negócio..."
            className="w-full bg-transparent border-none text-white placeholder-gray-600 outline-none resize-none min-h-[100px] text-sm md:text-base mb-6"
          />

          <div className="mb-8">
            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-3">Você precisa de ajuda com algo? (Opcional)</p>
            <div className="flex flex-wrap gap-2">
              {matchTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedMatchTag(selectedMatchTag === tag ? null : tag)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all",
                    selectedMatchTag === tag 
                      ? "bg-white border-white text-black" 
                      : "bg-white/5 border-white/10 text-gray-500 hover:border-white/30 hover:text-white"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-400 text-xs font-medium"
              >
                {error}
              </motion.p>
            )}
            <div className="flex-1 md:block hidden" />
            <Button3D
              onClick={handlePublish}
              color="white"
              className="px-8 rounded-2xl h-[50px] sm:h-[46px] w-full md:w-auto"
            >
              <Send className="w-4 h-4 mr-2" />
              <span className="font-bold text-sm">Publicar</span>
            </Button3D>
          </div>
        </div>

        {!isLoggedIn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 mb-10">
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] text-center max-w-sm shadow-2xl">
              <h3 className="text-white font-bold text-lg mb-2">Entre na Conversa</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Você precisa estar logado para compartilhar suas ideias com a comunidade.
              </p>
              <Button3D onClick={onLogin} color="white" className="w-full h-[50px] sm:h-[46px] rounded-xl">
                <span className="font-bold text-sm">Fazer Log in</span>
              </Button3D>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 mb-10 px-1">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Lightbulb className="w-4 h-4" />
          <span className="font-bold">{posts.length}</span>
          <span className="text-gray-600 font-medium">
            {posts.length === 1 ? "ideia partilhada" : "ideias partilhadas"}
          </span>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#141414] border border-white/5 rounded-[1.5rem] md:rounded-[1.8rem] p-6 md:p-7 hover:border-white/10 transition-all group relative overflow-hidden"
          >
            {/* Hover Glow */}
            <div className="absolute -inset-x-20 -inset-y-20 bg-white/[0.02] blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedUserProfileId(post.userId)}
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-white shadow-inner hover:bg-white/10 transition-all cursor-pointer"
                  >
                    {post.authorName.substring(0, 2).toUpperCase()}
                  </button>
                  <div className="text-left">
                    <button 
                      onClick={() => setSelectedUserProfileId(post.userId)}
                      className="text-base font-bold text-white leading-none mb-1.5 hover:text-white/80 transition-colors cursor-pointer block"
                    >
                      {post.authorName}
                    </button>
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">{formatDate(post.createdAt)}</p>
                      {post.updatedAt && new Date(post.updatedAt).getTime() - new Date(post.createdAt).getTime() > 1000 && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-700" />
                          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                            Editado
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {post.userId === currentUserId && editingPostId !== post.id && (
                    <>
                      <button
                        onClick={() => handleStartEdit(post)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                        title="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {editingPostId === post.id && (
                    <>
                      <button
                        onClick={() => handleSaveEdit(post.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all"
                        title="Guardar"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingPostId(null)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all"
                        title="Cancelar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {editingPostId !== post.id && (
                    <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-[0.15em]">
                      {post.category}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                {editingPostId === post.id ? (
                  <div className="space-y-3">
                    <input
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xl font-bold outline-none focus:border-white/20 transition-all"
                    />
                    <textarea
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 outline-none focus:border-white/20 transition-all resize-none"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg md:text-lg font-bold text-white mb-2 tracking-tight group-hover:text-white/90 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm md:text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                      {post.description}
                    </p>
                  </>
                )}
                
                {post.matchTag && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5 uppercase tracking-wider">
                      <Users className="w-3 h-3" />
                      {post.matchTag}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-8 pt-4 border-t border-white/5">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    "flex items-center gap-2.5 text-xs transition-all group/btn",
                    post.isLiked ? "text-white" : "text-gray-500 hover:text-white"
                  )}
                >
                  <motion.div
                    key={post.isLiked ? 'liked' : 'unliked'}
                    animate={post.isLiked ? { 
                      scale: [1, 1.25, 1],
                      rotate: [0, -15, 0]
                    } : { scale: 1, rotate: 0 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                      mass: 0.8
                    }}
                    className="flex items-center gap-2.5"
                  >
                    <ThumbsUp className={cn(
                      "w-4 h-4 transition-colors",
                      post.isLiked ? "fill-white text-white" : "group-hover/btn:-rotate-12"
                    )} />
                    <span className="font-bold tracking-tight">{post.likes}</span>
                  </motion.div>
                </button>
                <button 
                  onClick={() => {
                    if (!isLoggedIn) {
                      onLogin()
                    } else {
                      setActiveCommentPost(activeCommentPost === post.id ? null : post.id)
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2.5 text-xs transition-all group/btn",
                    activeCommentPost === post.id ? "text-white" : "text-gray-500 hover:text-white"
                  )}
                >
                  <MessageSquare className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  <span className="font-bold tracking-tight">{post.comments}</span>
                </button>
              </div>

              {/* Comment Section */}
              <AnimatePresence>
                {activeCommentPost === post.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 space-y-4">
                      {post.commentList && post.commentList.map((comment, i) => (
                        <div key={i} className="flex gap-3 items-start bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                            {comment.userInitials}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{comment.userName}</p>
                                {comment.userId === currentUserId && (
                                  <div className="flex items-center gap-1.5 ml-2">
                                    {comment.userId === currentUserId && editingCommentId !== comment.id && (
                                      <button 
                                        onClick={() => {
                                          setEditingCommentId(comment.id)
                                          setEditCommentValue(comment.text)
                                        }}
                                        className="text-gray-500 hover:text-white transition-colors"
                                      >
                                        <Pencil className="w-2.5 h-2.5" />
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => handleDeleteComment(post.id, comment.id)}
                                      className="text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                {comment.createdAt && (
                                  <span className="text-[10px] text-gray-600 font-medium">
                                    {formatDate(comment.createdAt)}
                                  </span>
                                )}
                                <button 
                                  onClick={() => handleCommentLike(post.id, comment.id)}
                                  className={cn(
                                    "flex items-center gap-1.5 text-[10px] transition-all",
                                    comment.isLiked ? "text-white" : "text-gray-500 hover:text-white"
                                  )}
                                >
                                  <ThumbsUp className={cn("w-3 h-3", comment.isLiked && "fill-white text-white")} />
                                  <span className="font-bold">{comment.likes || 0}</span>
                                </button>
                              </div>
                            </div>
                            
                            {editingCommentId === comment.id ? (
                              <div className="flex gap-2 mt-2">
                                <input 
                                  value={editCommentValue}
                                  onChange={e => setEditCommentValue(e.target.value)}
                                  autoFocus
                                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-white/20"
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') handleSaveEditComment(post.id, comment.id)
                                    if (e.key === 'Escape') setEditingCommentId(null)
                                  }}
                                />
                                <button 
                                  onClick={() => handleSaveEditComment(post.id, comment.id)}
                                  className="text-green-400 hover:text-green-300 transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setEditingCommentId(null)}
                                  className="text-gray-500 hover:text-white transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-300 leading-relaxed">{comment.text}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={commentValue}
                          onChange={(e) => setCommentValue(e.target.value)}
                          placeholder="Escreva um comentário..."
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-white/20 transition-all"
                        />
                        <button 
                          onClick={() => handleAddComment(post.id)}
                          className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}

        {/* Skeleton Placeholders (Examples) */}
        {[1, 2].map((i) => (
          <div
            key={`skeleton-${i}`}
            className="bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] p-8 md:p-10 opacity-30 select-none pointer-events-none grayscale"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5" />
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-white/5 rounded-md" />
                  <div className="w-16 h-2 bg-white/5 rounded-md" />
                </div>
              </div>
              <div className="w-20 h-6 bg-white/5 rounded-full" />
            </div>
            <div className="w-2/3 h-7 bg-white/5 rounded-lg mb-4" />
            <div className="space-y-3 mb-8">
              <div className="w-full h-3 bg-white/5 rounded-md" />
              <div className="w-full h-3 bg-white/5 rounded-md" />
              <div className="w-1/2 h-3 bg-white/5 rounded-md" />
            </div>
            <div className="flex gap-8">
              <div className="w-10 h-4 bg-white/5 rounded-md" />
              <div className="w-10 h-4 bg-white/5 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      <UserProfileModal 
        userId={selectedUserProfileId}
        onClose={() => setSelectedUserProfileId(null)}
      />
    </div>
  )
}
