import { useEffect, useState } from 'react'
import api from '../api'

function KPICard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard')
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-500">Carregando...</p>
  if (!data) return <p className="text-red-500">Erro ao carregar dashboard.</p>

  const fmt = v => `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total a Receber" value={fmt(data.total_a_receber)} color="text-blue-600" />
        <KPICard label="Total Vencido" value={fmt(data.total_vencido)} color="text-red-600" />
        <KPICard label="Dívidas Abertas" value={data.qtd_abertas} color="text-yellow-600" />
        <KPICard label="Dívidas Pagas" value={data.qtd_pagas} color="text-green-600" />
      </div>

      {/* Top devedores + Dívidas vencidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Top 5 Devedores</h3>
          {data.top_devedores.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum devedor.</p>
          ) : (
            <ul className="space-y-2">
              {data.top_devedores.map((d, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">{d.nome}</span>
                  <span className="font-medium text-red-600">{fmt(d.valor)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Dívidas Vencidas</h3>
          {data.dividas_vencidas.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhuma dívida vencida.</p>
          ) : (
            <ul className="space-y-2">
              {data.dividas_vencidas.slice(0, 5).map(d => (
                <li key={d.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{d.cliente_nome}</span>
                  <span className="font-medium text-red-600">{fmt(d.saldo)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
