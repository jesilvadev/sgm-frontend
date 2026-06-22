import { useEffect, useState } from 'react'
import api from '../api'

const fmt = v => `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

const STATUS_COLOR = {
  Pendente: 'bg-yellow-100 text-yellow-700',
  Paga: 'bg-green-100 text-green-700',
  Renegociada: 'bg-blue-100 text-blue-700',
}
function formatarCPF(valor) {
  return valor
    .replace(/\D/g, '') 
    .slice(0, 11) 
    .replace(/(\d{3})(\d)/, '$1.$2') 
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2') 
}
function DetalheCliente({ clienteId, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/cliente/${clienteId}`)
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [clienteId])

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{loading ? '...' : data?.nome}</h3>
            {data && <p className="text-sm text-gray-500">{data.celular || 'Sem celular'} · {data.endereco || 'Sem endereço'}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
        </div>

        {loading ? (
          <div className="p-6 text-gray-500 text-sm">Carregando...</div>
        ) : (
          <div className="overflow-auto p-6 space-y-4">
            {/* Info do cliente */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Nível</p>
                <p className="font-medium text-gray-800">{data.nivel || 'Novo'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Limite</p>
                <p className="font-medium text-gray-800">{fmt(data.limite || 0)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">CPF</p>
                <p className="font-medium text-gray-800">{data.cpf || '-'}</p>
              </div>
            </div>

            {/* Dívidas */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                Dívidas ({data.dividas?.length || 0})
              </h4>
              {data.dividas?.length === 0 ? (
                <p className="text-sm text-gray-400">Nenhuma dívida registrada.</p>
              ) : (
                <div className="space-y-3">
                  {data.dividas.map(d => (
                    <div key={d.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                      {/* Cabeçalho da dívida */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{d.descricao || 'Sem descrição'}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Vence em {new Date(d.vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                            {d.parcelado && ` · ${d.num_parcelas}x`}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[d.status] || 'bg-gray-100 text-gray-600'}`}>
                            {d.status}
                          </span>
                          <p className="text-sm font-bold text-red-600 mt-1">{fmt(d.saldo)}</p>
                          <p className="text-xs text-gray-400">de {fmt(d.valor_original)}</p>
                        </div>
                      </div>

                      {/* Parcelas */}
                      {d.parcelado && d.parcelas?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Parcelas</p>
                          <div className="space-y-1">
                            {d.parcelas.map(p => (
                              <div key={p.numero} className="flex justify-between text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <span>Parcela {p.numero_parcela}</span>
                                <span>{new Date(p.data_vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                                <span className={p.status === 'Paga' ? 'text-green-600 font-medium' : ''}>{p.status}</span>
                                <span>{fmt(p.valor_parcela)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pagamentos */}
                      {d.pagamentos?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Pagamentos</p>
                          <div className="space-y-1">
                            {d.pagamentos.map(p => (
                              <div key={p.id} className="flex justify-between text-xs text-gray-600 bg-green-50 px-3 py-1.5 rounded-lg">
                                <span>{new Date(p.data + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                                <span>{p.meio}</span>
                                <span className="font-medium text-green-700">{fmt(p.valor)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Renegociações */}
                      {d.renegociacoes?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Renegociações</p>
                          <div className="space-y-1">
                            {d.renegociacoes.map(r => (
                              <div key={r.id} className="flex justify-between text-xs text-gray-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                                <span>{new Date(r.data + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                                <span>Novo venc.: {new Date(r.nova_data_venc + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                                <span>{r.juros}% juros</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ nome: '', cpf: '', celular: '', endereco: '', nivel: 'Novo', limite: 200 })
  const [showForm, setShowForm] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState(null)

  function carregar(q = '') {
    api.get('/clientes', { params: { q } })
      .then(r => setClientes(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { carregar() }, [])

  function handleBusca(e) {
    setBusca(e.target.value)
    carregar(e.target.value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      await api.post('/clientes', { ...form, limite: Number(form.limite) })
      setShowForm(false)
      setForm({ nome: '', cpf: '', celular: '', endereco: '', nivel: 'Novo', limite: 200 })
      carregar()
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao salvar cliente.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleApagar(e, id, nome) {
    e.stopPropagation()
    if (!confirm(`Apagar o cliente "${nome}" e todos os dados associados?`)) return
    try {
      await api.delete(`/clientes/${id}`)
      carregar()
    } catch {
      alert('Erro ao apagar cliente.')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Clientes</h2>
        <button onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + Novo cliente
        </button>
      </div>

      <input type="text" placeholder="Buscar por nome..."
        value={busca} onChange={handleBusca}
        className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

      {/* Modal cadastro */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-semibold text-gray-800 mb-4">Novo Cliente</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <input value={form.cpf} onChange={e => setForm({...form, cpf: formatarCPF(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                <input value={form.celular} onChange={e => setForm({...form, celular: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input value={form.endereco} onChange={e => setForm({...form, endereco: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
                  <select value={form.nivel} onChange={e => setForm({...form, nivel: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Novo</option><option>Bronze</option><option>Prata</option><option>Ouro</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Limite R$</label>
                  <input type="number" value={form.limite} onChange={e => setForm({...form, limite: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
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

      {/* Modal detalhe do cliente */}
      {clienteSelecionado && (
        <DetalheCliente clienteId={clienteSelecionado} onClose={() => setClienteSelecionado(null)} />
      )}

      {/* Tabela */}
      {loading ? <p className="text-gray-500 text-sm">Carregando...</p> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Celular</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nível</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Limite</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientes.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Nenhum cliente encontrado.</td></tr>
              ) : clientes.map(c => (
                <tr key={c.id} onClick={() => setClienteSelecionado(c.id)}
                  className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 font-medium text-blue-600 hover:underline">{c.nome}</td>
                  <td className="px-4 py-3 text-gray-500">{c.celular || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{c.nivel || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{fmt(c.limite || 0)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={e => handleApagar(e, c.id, c.nome)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium">
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
