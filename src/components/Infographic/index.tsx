import { useState } from 'react'
import { format } from 'date-fns'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { DetailedForecastResponse } from '../../types/api-response'

type Props = {
  data: DetailedForecastResponse
}

const Infographic = ({ data }: Props) => {
  const [type, setType] = useState<'probability' | 'amount'>('amount')

  const chartData = data.hourly.time.map((time, index) => ({
    time: format(new Date(time), 'HH:mm'),
    probability: data.hourly.precipitation_probability[index],
    amount: Math.round(data.hourly.precipitation[index]), // <-- arredondado aqui
  }))

  const rawValues = chartData.map((d) => d.amount)
  const above10 = [...new Set(rawValues.filter((v) => v > 10))].sort((a, b) => a - b)
  const fixedTicks = [0, 2, 4, 6, 8, 10]
  const allTicks = type === 'amount' ? [...fixedTicks, ...above10] : undefined

  return (
    <div>
      <div className="shadow-txmuted w-full rounded-lg bg-white/10 p-4 shadow-sm">
        <div className="mb-4 flex justify-center gap-4">
          <button
            onClick={() => setType('amount')}
            className={`rounded px-3 py-1 text-sm font-medium ${
              type === 'amount'
                ? 'bg-blue-500 text-white'
                : 'text-txmain bg-white/10 hover:bg-white/20'
            }`}
          >
            Quantidade de Chuva
          </button>
          <button
            onClick={() => setType('probability')}
            className={`rounded px-3 py-1 text-sm font-medium ${
              type === 'probability'
                ? 'bg-blue-500 text-white'
                : 'text-txmain bg-white/10 hover:bg-white/20'
            }`}
          >
            Probabilidade de Chuva
          </button>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid className="stroke-txmuted" strokeDasharray="3 3" />
              <XAxis dataKey="time" className="stroke-txmain" />
              <YAxis
                domain={type === 'probability' ? [0, 100] : undefined}
                ticks={type === 'amount' ? allTicks : undefined}
                tickFormatter={(v) => (type === 'probability' ? `${v}%` : `${v} mm`)}
                className="stroke-txmain"
              />

              <Tooltip
                formatter={(value: number) =>
                  type === 'probability' ? `${value}%` : `${value} mm`
                }
              />
              <Line
                type="monotone"
                dataKey={type}
                className="stroke-txmain"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Infographic
