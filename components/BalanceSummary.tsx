'use client'

import { Users, TrendingUp, ArrowRight } from 'lucide-react'
import type { Balance, Settlement } from '@/lib/balance-engine'

interface BalanceSummaryProps {
  participants: Array<{ id: string; name: string; color?: string }>
  balances: Balance[]
  settlements: Settlement[]
}

export default function BalanceSummary({ participants, balances, settlements }: BalanceSummaryProps) {
  const getParticipantColor = (id: string) => {
    return participants.find(p => p.id === id)?.color || '#6366F1'
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Balance Table */}
      <div className="card animate-slide-up">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl text-white">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Balance Summary</h3>
        </div>

        <div className="space-y-3">
          {balances.map((balance, index) => {
            const color = getParticipantColor(balance.participantId)
            const isPositive = balance.netBalance > 0
            const isNegative = balance.netBalance < 0

            return (
              <div 
                key={balance.participantId} 
                className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-soft transition-all duration-300 bg-white animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-soft"
                    style={{ backgroundColor: color }}
                  >
                    {balance.participantName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-900">{balance.participantName}</span>
                </div>

                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    isPositive ? 'text-success' : 
                    isNegative ? 'text-danger' : 
                    'text-gray-600'
                  }`}>
                    {isPositive && '+'}${Math.abs(balance.netBalance).toFixed(2)}
                  </p>
                  <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isPositive ? 'bg-green-100 text-green-700' : 
                    isNegative ? 'bg-red-100 text-red-700' : 
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {isPositive ? 'is owed' : isNegative ? 'owes' : 'settled'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {balances.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full mb-3">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-gray-500 font-medium">No participants yet</p>
          </div>
        )}
      </div>

      {/* Settlement Suggestions */}
      <div className="card animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-gradient-to-br from-success to-emerald-600 rounded-xl text-white">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Suggested Settlements</h3>
        </div>

        {settlements.length > 0 ? (
          <div className="space-y-4">
            {settlements.map((settlement, index) => {
              const fromColor = getParticipantColor(settlement.from)
              const toColor = getParticipantColor(settlement.to)

              return (
                <div 
                  key={index} 
                  className="p-5 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-red-50/50 via-yellow-50/50 to-green-50/50 hover:shadow-soft transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-soft"
                        style={{ backgroundColor: fromColor }}
                      >
                        {settlement.fromName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{settlement.fromName}</p>
                        <p className="text-xs text-gray-600 font-medium">pays</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center mx-4">
                      <p className="text-2xl font-bold bg-gradient-to-r from-danger to-success bg-clip-text text-transparent">
                        ${settlement.amount.toFixed(2)}
                      </p>
                      <ArrowRight className="w-5 h-5 text-primary-600 mt-1 animate-pulse" />
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-bold text-gray-900 text-right">{settlement.toName}</p>
                        <p className="text-xs text-gray-600 font-medium text-right">receives</p>
                      </div>
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-soft"
                        style={{ backgroundColor: toColor }}
                      >
                        {settlement.toName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success/20 to-emerald-600/20 rounded-full mb-4 animate-pulse">
              <TrendingUp className="w-10 h-10 text-success" />
            </div>
            <p className="text-gray-900 font-bold text-lg">All Settled! 🎉</p>
            <p className="text-gray-500 text-sm mt-1">Everyone's balance is zero</p>
          </div>
        )}
      </div>
    </div>
  )
}
