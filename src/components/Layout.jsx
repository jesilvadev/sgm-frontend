import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoSgm from '../assets/logosgm.png'

const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const IconClientes = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconDividas = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)

const IconExtrato = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
)

const IconUsuarios = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-[0.45rem] rounded-lg text-[0.84rem] font-medium transition-all duration-150 ${
    isActive
      ? 'bg-blue-500/10 text-blue-400 font-semibold'
      : 'text-slate-400 hover:text-slate-100'
  }`

const navLinkStyle = ({ isActive }) =>
  isActive ? {} : { background: undefined }

function NavItem({ to, icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-[0.45rem] rounded-lg text-[0.84rem] font-medium transition-all duration-150 ${
          isActive
            ? 'bg-blue-500/10 text-blue-400 font-semibold'
            : 'text-slate-400 hover:text-slate-100'
        }`
      }
      style={({ isActive }) =>
        !isActive
          ? { background: undefined }
          : {}
      }
    >
      {({ isActive }) => (
        <>
          <span className={`flex-shrink-0 transition-opacity duration-150 ${isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'}`}>
            {icon}
          </span>
          <span>{label}</span>
          {isActive && <span className="ml-auto w-1 h-4 rounded-full bg-blue-400 opacity-70" />}
        </>
      )}
    </NavLink>
  )
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const initials = user?.nome
    ? user.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col shrink-0 overflow-hidden"
        style={{ background: 'hsl(224 10% 7%)', borderRight: '1px solid hsl(220 8% 14%)' }}>

        {/* Logo */}
        <div className="flex items-center px-4 shrink-0" style={{ minHeight: '4rem', borderBottom: '1px solid hsl(220 8% 14%)' }}>
          <img src={logoSgm} alt="SGM" className="h-8 object-contain" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-5">
          <div className="space-y-0.5">
            <span className="block text-[0.67rem] font-semibold uppercase tracking-[0.08em] text-slate-600 px-3 pb-1">
              Visão geral
            </span>
            <NavItem to="/dashboard" end icon={<IconDashboard />} label="Dashboard" />
          </div>

          <div className="space-y-0.5">
            <span className="block text-[0.67rem] font-semibold uppercase tracking-[0.08em] text-slate-600 px-3 pb-1">
              Gestão
            </span>
            <NavItem to="/clientes" icon={<IconClientes />} label="Clientes" />
            <NavItem to="/dividas" icon={<IconDividas />} label="Dívidas" />
            <NavItem to="/extrato" icon={<IconExtrato />} label="Extrato" />
          </div>

          {user?.tipo === 'Administrador' && (
            <div className="space-y-0.5">
              <span className="block text-[0.67rem] font-semibold uppercase tracking-[0.08em] text-slate-600 px-3 pb-1">
                Administração
              </span>
              <NavItem to="/usuarios" icon={<IconUsuarios />} label="Usuários" />
            </div>
          )}
        </nav>

        {/* User section */}
        <div className="shrink-0 px-3 py-3" style={{ borderTop: '1px solid hsl(220 8% 14%)' }}>
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg group">
            <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-blue-400">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate leading-tight">{user?.nome}</p>
              <p className="text-xs text-slate-500 truncate leading-tight">{user?.tipo}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sair"
              className="flex-shrink-0 p-1.5 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150"
            >
              <IconLogout />
            </button>
          </div>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
