import { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'

const STATUS_COLOR = {
  Pendente: 'bg-yellow-100 text-yellow-700',
  Paga: 'bg-green-100 text-green-700',
  Renegociada: 'bg-blue-100 text-blue-700',
}

const fmt = v => `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

function ModalPagamento({ divida, onClose, onSuccess }) {
  const [valor, setValor] = useState('')
  const [meio, setMeio] = useState('Dinheiro')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSalvando(true)
    setErro('')
    try {
      await api.post('/pagamentos', { divida_id: divida.id, valor: Number(valor), meio })
      onSuccess()
      onClose()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao registrar pagamento.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="font-semibold text-gray-800 mb-1">Registrar Pagamento</h3>
        <p className="text-sm text-gray-500 mb-4">{divida.cliente_nome} — saldo {fmt(divida.saldo_devedor)}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
            <input required type="number" step="0.01" max={divida.saldo_devedor} value={valor}
              onChange={e => setValor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meio de pagamento</label>
            <select value={meio} onChange={e => setMeio(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Dinheiro</option>
              <option>Pix</option>
              <option>Cartão</option>
              <option>Cheque</option>
            </select>
          </div>
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={salvando}
              className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {salvando ? 'Salvando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalRenegociar({ divida, onClose, onSuccess }) {
  const [prazo, setPrazo] = useState(30)
  const [juros, setJuros] = useState(0)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSalvando(true)
    setErro('')
    try {
      await api.post(`/dividas/${divida.id}/renegociar`, { prazo_dias: Number(prazo), juros: Number(juros) })
      onSuccess()
      onClose()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao renegociar.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="font-semibold text-gray-800 mb-1">Renegociar Dívida</h3>
        <p className="text-sm text-gray-500 mb-4">{divida.cliente_nome} — saldo {fmt(divida.saldo_devedor)}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Novo prazo (dias)</label>
            <input required type="number" min="1" value={prazo} onChange={e => setPrazo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Juros (%)</label>
            <input type="number" step="0.01" min="0" value={juros} onChange={e => setJuros(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={salvando}
              className="flex-1 bg-orange-500 text-white text-sm py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50">
              {salvando ? 'Salvando...' : 'Renegociar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModalApagarDivida({ divida, userTipo, onClose, onSuccess }) {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSalvando(true)
    setErro('')
    try {
      await api.delete(`/dividas/${divida.id}`, {
        data: userTipo !== 'Administrador' ? { usuario, senha } : undefined
      })
      onSuccess()
      onClose()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao apagar dívida.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="font-semibold text-gray-800 mb-1">Apagar Dívida</h3>
        <p className="text-sm text-gray-500 mb-4">{divida.cliente_nome} — {fmt(divida.saldo_devedor)}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          {userTipo !== 'Administrador' && (
            <>
              <p className="text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">Informe as credenciais de um administrador para confirmar.</p>
              <input required placeholder="Usuário admin" value={usuario} onChange={e => setUsuario(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <input required type="password" placeholder="Senha admin" value={senha} onChange={e => setSenha(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </>
          )}
          {userTipo === 'Administrador' && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">Esta ação é irreversível. Todos os pagamentos e renegociações serão apagados.</p>
          )}
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={salvando}
              className="flex-1 bg-red-600 text-white text-sm py-2 rounded-lg hover:bg-red-700 disabled:opacity-50">
              {salvando ? 'Apagando...' : 'Apagar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Dividas() {
  const { user } = useAuth()
  const [dividas, setDividas] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [modalPagamento, setModalPagamento] = useState(null)
  const [modalRenegociar, setModalRenegociar] = useState(null)
  const [modalApagar, setModalApagar] = useState(null)
  const [form, setForm] = useState({ cliente_id: '', valor: '', descricao: '', prazo: 30, num_parcelas: 1, juros_parcelamento: 0 })

  function carregar() {
    api.get('/dividas').then(r => setDividas(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => {
    carregar()
    api.get('/clientes').then(r => setClientes(r.data))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      await api.post('/dividas', {
        cliente_id: Number(form.cliente_id),
        valor: Number(form.valor),
        descricao: form.descricao,
        prazo: Number(form.prazo),
        num_parcelas: Number(form.num_parcelas),
        juros_parcelamento: Number(form.juros_parcelamento),
      })
      setShowForm(false)
      setForm({ cliente_id: '', valor: '', descricao: '', prazo: 30, num_parcelas: 1, juros_parcelamento: 0 })
      carregar()
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao registrar dívida.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Dívidas</h2>
        <button onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + Nova dívida
        </button>
      </div>

      {/* Modal nova dívida */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-semibold text-gray-800 mb-4">Nova Dívida</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <select required value={form.cliente_id} onChange={e => setForm({...form, cliente_id: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Selecione...</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor R$ *</label>
                <input required type="number" step="0.01" value={form.valor}
                  onChange={e => setForm({...form, valor: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prazo (dias)</label>
                  <input type="number" value={form.prazo} onChange={e => setForm({...form, prazo: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parcelas</label>
                  <input type="number" min="1" value={form.num_parcelas} onChange={e => setForm({...form, num_parcelas: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              {Number(form.num_parcelas) > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Juros parcelamento (%)</label>
                  <input type="number" step="0.01" value={form.juros_parcelamento}
                    onChange={e => setForm({...form, juros_parcelamento: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={salvando}
                  className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalPagamento && (
        <ModalPagamento divida={modalPagamento} onClose={() => setModalPagamento(null)} onSuccess={carregar} />
      )}
      {modalRenegociar && (
        <ModalRenegociar divida={modalRenegociar} onClose={() => setModalRenegociar(null)} onSuccess={carregar} />
      )}
      {modalApagar && (
        <ModalApagarDivida divida={modalApagar} userTipo={user?.tipo} onClose={() => setModalApagar(null)} onSuccess={carregar} />
      )}

      {loading ? <p className="text-gray-500 text-sm">Carregando...</p> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Cliente</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Descrição</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Saldo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Vencimento</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dividas.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Nenhuma dívida encontrada.</td></tr>
              ) : dividas.map(d => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{d.cliente_nome}</td>
                  <td className="px-4 py-3 text-gray-500">{d.descricao || '-'}</td>
                  <td className="px-4 py-3 font-medium text-red-600">{fmt(d.saldo_devedor)}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(d.data_vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[d.status] || 'bg-gray-100 text-gray-600'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      {d.status !== 'Paga' && (
                        <>
                          <button onClick={() => setModalPagamento(d)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                            Pagar
                          </button>
                          <button onClick={() => setModalRenegociar(d)}
                            className="text-orange-500 hover:text-orange-700 text-xs font-medium">
                            Renegociar
                          </button>
                        </>
                      )}
                      <button onClick={() => setModalApagar(d)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium">
                        Apagar
                      </button>
                    </div>
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
