import logoSgm from '../assets/logosgm.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)

const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const IconEyeOff = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
)

const IconShield = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ usuario: '', senha: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      await login(form.usuario, form.senha)
      navigate('/dashboard')
    } catch {
      setErro('Usuário ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* ── LEFT PANEL – Branding ── */}
      <aside className="hidden lg:flex flex-col w-1/2 min-w-[420px] bg-slate-950 relative overflow-hidden"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        <div className="relative z-10 flex flex-col justify-between h-full px-12 py-10">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 bg-white/[0.04] rounded-full px-4 py-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse flex-shrink-0" />
            <span className="text-xs text-white/40 whitespace-nowrap">Todos os sistemas operacionais</span>
          </div>

          {/* Logo */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <img src={logoSgm} alt="SGM" className="w-36 object-contain" />
              <div className="flex flex-col gap-2">
                <span className="text-7xl tracking-wide text-white leading-none" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: '0.15em' }}>SGM</span>
                <span className="text-2xl text-white/45 tracking-wide">Gerenciamento de Mercearia</span>
              </div>
            </div>
          </div>

          <div />
        </div>
      </aside>

      {/* ── RIGHT PANEL – Form ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 bg-white relative min-h-screen">
        <div className="w-full max-w-sm flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight m-0">Acesso ao painel</h2>
            <p className="text-sm text-slate-500 m-0 leading-snug">Entre com seu usuário e senha para continuar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Usuário */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.8125rem] font-medium text-slate-800 tracking-tight">Usuário</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                  <IconUser />
                </span>
                <input
                  type="text"
                  value={form.usuario}
                  onChange={e => setForm({ ...form, usuario: e.target.value })}
                  className="w-full h-[2.625rem] pl-[2.375rem] pr-3.5 text-sm bg-white text-slate-900 border border-slate-200 rounded-lg transition-all duration-150 placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
                  placeholder="usuário"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.8125rem] font-medium text-slate-800 tracking-tight">Senha</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                  <IconLock />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.senha}
                  onChange={e => setForm({ ...form, senha: e.target.value })}
                  className="w-full h-[2.625rem] pl-[2.375rem] pr-10 text-sm bg-white text-slate-900 border border-slate-200 rounded-lg transition-all duration-150 placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
                  placeholder="senha"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-none border-none p-0 flex items-center"
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {erro && (
              <div className="flex items-center gap-2 px-3.5 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[0.8125rem] leading-snug">
                <IconAlert />
                {erro}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-1 rounded-lg bg-blue-600 text-white text-[0.9375rem] font-semibold tracking-tight cursor-pointer border-none transition-all duration-150 hover:bg-blue-700 hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)] active:bg-blue-600 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                  <span>Entrando…</span>
                </>
              ) : (
                <span>Entrar</span>
              )}
            </button>
          </form>
        </div>

      </main>
    </div>
  )
}
