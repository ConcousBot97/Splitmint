'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { X } from 'lucide-react'
import { splitEqually, calculateFromPercentages } from '@/lib/balance-engine'
import { EXPENSE_CATEGORIES } from '@/lib/categories'

interface AddExpenseModalProps {
  groupId: string
  participants: Array<{ id: string; name: string }>
  onClose: () => void
  onSuccess: () => void
}

export default function AddExpenseModal({ groupId, participants, onClose, onSuccess }: AddExpenseModalProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [payerId, setPayerId] = useState(participants[0]?.id || '')
  const [category, setCategory] = useState('other')
  const [splitMode, setSplitMode] = useState<'equal' | 'custom' | 'percentage'>('equal')
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(participants.map(p => p.id))
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const expenseAmount = parseFloat(amount)
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      setError('Invalid amount')
      return
    }

    if (selectedParticipants.length === 0) {
      setError('Select at least one participant')
      return
    }

    setLoading(true)

    try {
      // Calculate splits
      let splits: { participant_id: string; amount: number }[] = []

      if (splitMode === 'equal') {
        const splitAmounts = splitEqually(expenseAmount, selectedParticipants.length)
        splits = selectedParticipants.map((id, index) => ({
          participant_id: id,
          amount: splitAmounts[index],
        }))
      } else if (splitMode === 'custom') {
        splits = selectedParticipants.map(id => ({
          participant_id: id,
          amount: parseFloat(customSplits[id] || '0'),
        }))
        
        const total = splits.reduce((sum, s) => sum + s.amount, 0)
        if (Math.abs(total - expenseAmount) > 0.01) {
          setError(`Custom splits must add up to ${expenseAmount.toFixed(2)}`)
          setLoading(false)
          return
        }
      } else if (splitMode === 'percentage') {
        const percentages = selectedParticipants.map(id => 
          parseFloat(customSplits[id] || '0')
        )
        const totalPercentage = percentages.reduce((sum, p) => sum + p, 0)
        
        if (Math.abs(totalPercentage - 100) > 0.01) {
          setError('Percentages must add up to 100')
          setLoading(false)
          return
        }
        
        const amounts = calculateFromPercentages(expenseAmount, percentages)
        splits = selectedParticipants.map((id, index) => ({
          participant_id: id,
          amount: amounts[index],
        }))
      }

      // Create expense
      const { data: expense, error: expenseError } = await supabase
        .from('expenses')
        .insert([{
          group_id: groupId,
          description,
          amount: expenseAmount,
          date,
          payer_id: payerId,
          split_mode: splitMode,
          category,
        }])
        .select()
        .single()

      if (expenseError) throw expenseError

      // Create splits
      const splitsData = splits.map(split => ({
        expense_id: expense.id,
        participant_id: split.participant_id,
        amount: split.amount,
      }))

      const { error: splitsError } = await supabase
        .from('expense_splits')
        .insert(splitsData)

      if (splitsError) throw splitsError

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleParticipant = (id: string) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(selectedParticipants.filter(p => p !== id))
    } else {
      setSelectedParticipants([...selectedParticipants, id])
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-glow w-full max-w-2xl my-8 animate-scale-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Add Expense
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:rotate-90">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                placeholder="e.g., Dinner at restaurant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
                required
              >
                {EXPENSE_CATEGORIES.map(cat => {
                  const Icon = cat.icon
                  return (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  )
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Paid By *
              </label>
              <select
                value={payerId}
                onChange={(e) => setPayerId(e.target.value)}
                className="input-field"
                required
              >
                {participants.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Split Mode *
            </label>
            <div className="flex gap-3">
              {(['equal', 'custom', 'percentage'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSplitMode(mode)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    splitMode === mode
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft transform scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Split Between *
            </label>
            <div className="space-y-2">
              {participants.map(participant => {
                const isSelected = selectedParticipants.includes(participant.id)
                return (
                  <div key={participant.id} className={`flex items-center gap-3 p-3 border-2 rounded-xl transition-all duration-300 ${
                    isSelected 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleParticipant(participant.id)}
                      className="w-5 h-5 text-primary-600 rounded-lg focus:ring-primary-500"
                    />
                    <span className="flex-1 font-semibold">{participant.name}</span>
                    
                    {isSelected && splitMode !== 'equal' && (
                      <input
                        type="number"
                        step="0.01"
                        value={customSplits[participant.id] || ''}
                        onChange={(e) => setCustomSplits({
                          ...customSplits,
                          [participant.id]: e.target.value,
                        })}
                        placeholder={splitMode === 'percentage' ? '%' : '$'}
                        className="w-24 px-3 py-2 border-2 border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white font-semibold"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-danger/10 border-2 border-danger/20 text-danger rounded-xl text-sm font-medium flex items-center gap-2 animate-slide-down">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </span>
              ) : (
                'Add Expense'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
