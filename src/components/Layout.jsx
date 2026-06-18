import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-800">SGM</h1>
          <p className="text-xs text-gray-500">Mercearia</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavLink to="/dashboard" className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`
          }>
            Dashboard
          </NavLink>
          <NavLink to="/clientes" className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`
          }>
            Clientes
          </NavLink>
          <NavLink to="/dividas" className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`
          }>
            Dívidas
          </NavLink>
          <NavLink to="/extrato" className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`
          }>
            Extrato
          </NavLink>
          {user?.tipo === 'Administrador' && (
            <NavLink to="/usuarios" className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`
            }>
              Usuários
            </NavLink>
          )}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">{user?.nome}</p>
          <p className="text-xs text-gray-400 mb-3">{user?.tipo}</p>
          <button
            onClick={handleLogout}
            className="w-full text-sm text-red-600 hover:text-red-700 text-left px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
