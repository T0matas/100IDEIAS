import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button3D } from "./ui/Button3D"
import { API_URL } from "../config"

interface ResetPasswordModalProps {
  token: string | null
  onClose: () => void
}

export function ResetPasswordModal({ token, onClose }: ResetPasswordModalProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!password || !confirmPassword) {
      setError("Por favor, preencha todos os campos.")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao redefinir senha.');
        return;
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        // Limpar o token da URL
        window.history.replaceState({}, document.title, "/")
      }, 3000)
    } catch (err) {
      console.error(err);
      setError('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[400] flex items-center justify-center bg-black/95 backdrop-blur-2xl px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-[#0A0A0A] border border-white/10 p-8 rounded-[32px] w-full max-w-md shadow-2xl relative overflow-hidden"
        >
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            {success ? (
              <div className="text-center py-8 space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">Senha Redefinida!</h2>
                <p className="text-gray-400">Sua senha foi atualizada com sucesso. A fechar em instantes...</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Nova Senha</h2>
                  <p className="text-gray-500 text-sm">Defina uma senha forte para proteger a sua conta.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl text-center">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nova senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-white/30 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirmar nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:border-white/30 transition-all"
                    />
                  </div>

                  <Button3D
                    type="submit"
                    disabled={isLoading}
                    color="white"
                    className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 mt-6"
                  >
                    {isLoading ? "A processar..." : "Redefinir Senha"}
                    {!isLoading && <ArrowRight size={18} />}
                  </Button3D>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full text-center text-xs text-gray-600 hover:text-gray-400 mt-4 transition-colors"
                  >
                    Cancelar e voltar
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
