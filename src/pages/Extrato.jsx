import { useState } from 'react'
import api from '../api'

const fmt = v => `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

const STATUS_COLOR = {
  Pendente: 'bg-yellow-100 text-yellow-700',
  Paga: 'bg-green-100 text-green-700',
  Renegociada: 'bg-blue-100 text-blue-700',
}

export default function Extrato() {
  const [busca, setBusca] = useState('')
  const [clientes, setClientes] = useState([])
  const [extrato, setExtrato] = useState(null)
  const [loading, setLoading] = useState(false)
  const [buscando, setBuscando] = useState(false)

  async function handleBusca(e) {
    const q = e.target.value
    setBusca(q)
    setExtrato(null)
    if (q.length < 2) { setClientes([]); return }
    setBuscando(true)
    try {
      const r = await api.get('/clientes', { params: { q } })
      setClientes(r.data)
    } finally {
      setBuscando(false)
    }
  }

  async function handleSelecionar(cliente) {
    setBusca(cliente.nome)
    setClientes([])
    setLoading(true)
    try {
      const r = await api.get(`/relatorios/extrato`, { params: { cliente_id: cliente.id } })
      setExtrato(r.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">Extrato do Cliente</h2>

      {/* Busca */}
      <div className="relative w-full max-w-sm">
        <input
          type="text"
          placeholder="Digite o nome do cliente..."
          value={busca}
          onChange={handleBusca}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {buscando && <p className="absolute right-3 top-2.5 text-xs text-gray-400">Buscando...</p>}
        {clientes.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-auto">
            {clientes.map(c => (
              <button key={c.id} onClick={() => handleSelecionar(c)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                {c.nome}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && <p className="text-gray-500 text-sm">Carregando extrato...</p>}

      {extrato && (
        <div className="space-y-4">
          {/* Cabeçalho */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{extrato.cliente.nome}</h3>
                <p className="text-sm text-gray-500">{extrato.cliente.celular || 'Sem celular'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total devedor</p>
                <p className="text-2xl font-bold text-red-600">{fmt(extrato.total_devedor)}</p>
              </div>
            </div>
          </div>

          {/* Dívidas */}
          {extrato.dividas.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhuma dívida registrada.</p>
          ) : (
            <div className="space-y-3">
              {extrato.dividas.map(d => (
                <div key={d.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{d.descricao || 'Sem descrição'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Vence em {new Date(d.data_vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[d.status] || 'bg-gray-100 text-gray-600'}`}>
                        {d.status}
                      </span>
                      <p className="text-sm font-bold text-red-600 mt-1">{fmt(d.saldo_devedor)}</p>
                      <p className="text-xs text-gray-400">de {fmt(d.valor_original)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
