'use client'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { useGameStore } from '@/store/gameStore'

export default function StockChart() {
  const { stockHistory, company } = useGameStore()
  const color = company?.color ?? '#6366f1'

  const min = Math.min(...stockHistory.map(d => d.price))
  const max = Math.max(...stockHistory.map(d => d.price))
  const first = stockHistory[0]?.price ?? 1
  const last = stockHistory[stockHistory.length - 1]?.price ?? 1
  const change = ((last - first) / first * 100).toFixed(1)
  const isUp = last >= first

  return (
    <div className="bg-gray-900 rounded-2xl p-5">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-3xl font-black text-white">
            ¥{last.toLocaleString()}
          </div>
          <div className={`text-sm font-semibold mt-0.5 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(last - first).toLocaleString()}円
            ({isUp ? '+' : ''}{change}%) IPO比
          </div>
        </div>
        <div className="text-right text-xs text-gray-500">
          <div>高値 ¥{max.toLocaleString()}</div>
          <div>安値 ¥{min.toLocaleString()}</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={stockHistory} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `¥${v.toLocaleString()}`}
            width={70}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#9ca3af', fontSize: 12 }}
            formatter={(v) => [`¥${Number(v).toLocaleString()}`, '株価']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2.5}
            fill="url(#colorGrad)"
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
