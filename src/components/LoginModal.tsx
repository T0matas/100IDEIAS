import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Lightbulb } from "lucide-react"
import { cn } from "../lib/utils"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
}

type View = 'login' | 'signup'

function BrandingPanel({ compact = false }: { compact?: boolean }) {

  return (
    <div className={cn(
      "flex flex-col bg-[#111111] relative overflow-hidden h-full justify-center",
      compact ? "p-8 gap-8" : "p-12 gap-10"
    )}>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/[0.04] rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.03] rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10">
        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-black shadow-lg flex-shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">
          100<span className="text-gray-500">ideias</span>
        </span>
      </div>

      <div className="relative z-10 space-y-4">
        <h2 className={cn(
          "font-bold text-white leading-tight tracking-tight",
          compact ? "text-2xl" : "text-3xl lg:text-4xl"
        )}>
          Transforme<br />
          <span className="text-gray-500">qualquer tema</span><br />
          em oportunidade
        </h2>
      </div>
    </div>
  )
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [view, setView] = useState<View>('login')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (view === 'login') {
      if (!email || !password) {
        setError("Por favor, preencha todos os campos obrigatórios.")
        return
      }
    } else {
      if (!name || !email || !password) {
        setError("Por favor, preencha todos os campos obrigatórios.")
        return
      }
    }

    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setIsLoading(false)
    onLogin()
    onClose()
  }

  const switchView = (next: View) => {
    setView(next)
    setEmail("")
    setPassword("")
    setName("")
    setError(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl px-4 py-6 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="relative w-full max-w-[920px] my-auto"
          >
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 z-20 w-8 h-8 flex items-center justify-center rounded-xl bg-[#1a1a1a] border border-white/10 text-gray-500 hover:text-white transition-all shadow-lg"
            >
              ✕
            </button>

            <div className="hidden md:flex rounded-[28px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] border border-white/[0.06]">
              <div className="w-[45%] flex-shrink-0">
                <BrandingPanel />
              </div>
              <FormPanel
                view={view}
                email={email} setEmail={setEmail}
                password={password} setPassword={setPassword}
                name={name} setName={setName}
                showPassword={showPassword} setShowPassword={setShowPassword}
                isLoading={isLoading}
                error={error}
                onSubmit={handleSubmit}
                onSwitch={switchView}
              />
            </div>

            <div className="flex md:hidden flex-col rounded-[24px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] border border-white/[0.06]">
              <BrandingPanel compact />
              <FormPanel
                view={view}
                email={email} setEmail={setEmail}
                password={password} setPassword={setPassword}
                name={name} setName={setName}
                showPassword={showPassword} setShowPassword={setShowPassword}
                isLoading={isLoading}
                error={error}
                onSubmit={handleSubmit}
                onSwitch={switchView}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function FormPanel({
  view, email, setEmail, password, setPassword,
  name, setName, showPassword, setShowPassword,
  isLoading, error, onSubmit, onSwitch
}: {
  view: View
  email: string; setEmail: (v: string) => void
  password: string; setPassword: (v: string) => void
  name: string; setName: (v: string) => void
  showPassword: boolean; setShowPassword: (v: boolean) => void
  isLoading: boolean
  error: string | null
  onSubmit: (e: React.FormEvent) => void
  onSwitch: (v: View) => void
}) {
  return (
    <div className="flex-1 bg-[#0A0A0A] flex flex-col justify-center p-7 md:p-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-1.5">
            {view === 'login' ? 'Bem-vindo de volta' : 'Criar conta gratuita'}
          </h1>
          <p className="text-sm text-gray-500">
            {view === 'login' ? 'Aceda à sua conta para continuar' : 'Comece a gerar ideias hoje mesmo'}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3 mb-5">
        <SocialBtn label="Google" icon={<GoogleSVG />} />
        <SocialBtn label="GitHub" icon={<GitHubSVG />} />
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-[11px] text-gray-700 uppercase tracking-widest font-medium">ou</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] rounded-xl p-3 text-center mb-3 font-medium">
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {view === 'signup' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <FloatingInput id="name" label="Nome completo" type="text" value={name} onChange={setName} />
            </motion.div>
          )}
        </AnimatePresence>

        <FloatingInput
          id="email" label="Endereço de email" type="email"
          value={email} onChange={setEmail}
          icon={<Mail className="w-4 h-4" />}
        />

        <div className="relative">
          <FloatingInput
            id="password" label="Senha" type={showPassword ? "text" : "password"}
            value={password} onChange={setPassword}
            icon={<Lock className="w-4 h-4" />}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {view === 'login' && (
          <div className="text-right">
            <button type="button" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Esqueceu a senha?
            </button>
          </div>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-sm bg-white text-black hover:bg-gray-50 transition-all shadow-[0_4px_0_rgba(255,255,255,0.15)] disabled:opacity-50"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <LoadingDots /><span>A processar...</span>
              </motion.div>
            ) : (
              <motion.div key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <span>{view === 'login' ? 'Entrar na plataforma' : 'Criar conta grátis'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </form>

      <p className="text-center text-xs text-gray-600 mt-5">
        {view === 'login' ? 'Ainda não tem conta? ' : 'Já tem conta? '}
        <button
          onClick={() => onSwitch(view === 'login' ? 'signup' : 'login')}
          className="text-white font-semibold hover:underline underline-offset-2 transition-all"
        >
          {view === 'login' ? 'Criar conta gratuita' : 'Entrar'}
        </button>
      </p>

      <p className="text-center text-[10px] text-gray-700 mt-3 leading-relaxed">
        Ao continuar, aceita os{' '}
        <span className="text-gray-500 cursor-pointer hover:text-white transition-colors">Termos de Serviço</span>
        {' '}e a{' '}
        <span className="text-gray-500 cursor-pointer hover:text-white transition-colors">Política de Privacidade</span>
      </p>
    </div>
  )
}

function FloatingInput({
  id, label, type, value, onChange, icon
}: {
  id: string; label: string; type: string
  value: string; onChange: (v: string) => void
  icon?: React.ReactNode
}) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0

  return (
    <div className="relative">
      <div className={cn(
        "relative flex items-center rounded-2xl border transition-all duration-200",
        focused
          ? "bg-white/[0.05] border-white/20 ring-1 ring-white/10"
          : "bg-white/[0.025] border-white/[0.06]"
      )}>
        {icon && (
          <span className={cn("absolute left-4 transition-colors duration-200", focused ? "text-gray-400" : "text-gray-600")}>
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=" "
          style={{ fontSize: '16px' }}
          className={cn(
            "w-full bg-transparent pt-5 pb-2 text-white outline-none",
            icon ? "pl-11 pr-4" : "px-4"
          )}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute transition-all duration-200 pointer-events-none text-gray-500 select-none",
            icon ? "left-11" : "left-4",
            lifted
              ? "top-2 text-[10px] font-semibold uppercase tracking-wider text-gray-600"
              : "top-1/2 -translate-y-1/2 text-sm"
          )}
        >
          {label}
        </label>
      </div>
    </div>
  )
}

function SocialBtn({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.07] text-white text-sm font-medium hover:bg-white/[0.08] hover:border-white/15 transition-all"
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  )
}

function LoadingDots() {
  return (
    <div className="flex gap-1 items-center">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 bg-black rounded-full"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.5, delay: i * 0.12, repeat: Infinity }}
        />
      ))}
    </div>
  )
}

function GoogleSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function GitHubSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}
