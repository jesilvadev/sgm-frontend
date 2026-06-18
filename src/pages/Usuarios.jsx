import { useEffect, useState } from 'react'
import api from '../api'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState({ nome: '', cpf: '', email: '', tipo: 'Caixa', senha: '' })

  function carregar() {
    api.get('/usuarios').then(r => setUsuarios(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { carregar() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      await api.post('/usuarios', form)
      setShowForm(false)
      setForm({ nome: '', cpf: '', email: '', tipo: 'Caixa', senha: '' })
      carregar()
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao salvar usuário.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleApagar(id, nome) {
    if (!confirm(`Apagar o usuário "${nome}"?`)) return
    try {
      await api.delete(`/usuarios/${id}`)
      carregar()
    } catch {
      alert('Erro ao apagar usuário.')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Usuários</h2>
        <button onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
          + Novo usuário
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-semibold text-gray-800 mb-4">Novo Usuário</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Nome *" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <input placeholder="CPF" value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Caixa</option>
                <option>Administrador</option>
              </select>
              <input required type="password" placeholder="Senha *" value={form.senha} onChange={e => setForm({...form, senha: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-600 text-sm py-2 rounded-lg">Cancelar</button>
                <button type="submit" disabled={salvando}
                  className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg disabled:opacity-50">
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <p className="text-gray-500 text-sm">Carregando...</p> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{u.nome}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.tipo === 'Administrador' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleApagar(u.id, u.nome)}
                      className="text-red-500 hover:text-red-700 text-xs">
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
