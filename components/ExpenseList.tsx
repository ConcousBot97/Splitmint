'use client'

import { Trash2, Calendar, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { getCategoryById } from '@/lib/categories'

interface ExpenseListProps {
  expenses: Array<{
    id: string
    description: string
    amount: number
    date: string
    payer_id: string
    split_mode: string
    category?: string
    splits: { participant_id: string; amount: number }[]
  }>
  participants: Array<{ id: string; name: string; color?: string }>
  onUpdate: () => void
}

export default function ExpenseList({ expenses, participants, onUpdate }: ExpenseListProps) {
  const getParticipantName = (id: string) => {
    return participants.find(p => p.id === id)?.name || 'Unknown'
  }

  const handleDelete = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId)

      if (error) throw error
      onUpdate()
    } catch (err) {
      console.error('Error deleting expense:', err)
      alert('Failed to delete expense')
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full mb-4">
          <Calendar className="w-10 h-10 text-primary-600" />
        </div>
        <p className="text-gray-600 font-medium">No expenses yet</p>
        <p className="text-gray-400 text-sm mt-1">Add your first expense to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense, index) => {
        const payerName = getParticipantName(expense.payer_id)
        const splitParticipants = expense.splits.map(s => getParticipantName(s.participant_id))
        const category = getCategoryById(expense.category || 'other')
        const CategoryIcon = category.icon

        return (
          <div
            key={expense.id}
            className="group flex items-center justify-between p-5 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-soft bg-white transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Category Icon */}
              <div 
                className="p-3 rounded-xl flex-shrink-0"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <CategoryIcon className="w-6 h-6" style={{ color: category.color }} />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{expense.description}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <div className="p-1 bg-primary-100 rounded-lg">
                          <Calendar className="w-3.5 h-3.5 text-primary-600" />
                        </div>
                        {format(new Date(expense.date), 'MMM d, yyyy')}
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <div className="p-1 bg-accent-100 rounded-lg">
                          <User className="w-3.5 h-3.5 text-accent-600" />
                        </div>
                        Paid by <span className="font-semibold text-gray-900">{payerName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                      ${expense.amount.toFixed(2)}
                    </p>
                    <span className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      expense.split_mode === 'equal' 
                        ? 'bg-blue-100 text-blue-700'
                        : expense.split_mode === 'custom'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {expense.split_mode === 'equal' ? 'Equal' : 
                       expense.split_mode === 'custom' ? 'Custom' : 
                       'Percentage'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Split between:</span>
                  <span className="font-semibold text-gray-700">{splitParticipants.join(', ')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDelete(expense.id)}
              className="ml-4 p-2.5 text-danger hover:bg-danger/10 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
              title="Delete expense"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
