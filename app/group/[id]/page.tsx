'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, PlusCircle, Users, DollarSign, TrendingUp, Search, Filter } from 'lucide-react'
import AddExpenseModal from '@/components/AddExpenseModal'
import ExpenseList from '@/components/ExpenseList'
import BalanceSummary from '@/components/BalanceSummary'
import ExpenseChart from '@/components/ExpenseChart'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { calculateBalances, generateSettlements } from '@/lib/balance-engine'

interface Participant {
  id: string
  name: string
  color?: string
}

interface Expense {
  id: string
  description: string
  amount: number
  date: string
  payer_id: string
  split_mode: string
  category?: string
  splits: { participant_id: string; amount: number }[]
}

export default function GroupPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.id as string

  const [group, setGroup] = useState<any>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterParticipant, setFilterParticipant] = useState<string>('')

  useEffect(() => {
    fetchGroupData()
  }, [groupId])

  const fetchGroupData = async () => {
    try {
      // Fetch group
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single()

      if (groupError) throw groupError
      setGroup(groupData)

      // Fetch participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true })

      if (participantsError) throw participantsError
      setParticipants(participantsData || [])

      // Fetch expenses with splits
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select(`
          *,
          expense_splits (
            participant_id,
            amount
          )
        `)
        .eq('group_id', groupId)
        .order('date', { ascending: false })

      if (expensesError) throw expensesError
      
      const formattedExpenses = expensesData?.map((expense: any) => ({
        id: expense.id,
        description: expense.description,
        amount: Number(expense.amount),
        date: expense.date,
        payer_id: expense.payer_id,
        split_mode: expense.split_mode,
        category: expense.category || 'other',
        splits: expense.expense_splits.map((split: any) => ({
          participant_id: split.participant_id,
          amount: Number(split.amount),
        })),
      })) || []

      setExpenses(formattedExpenses)
    } catch (err) {
      console.error('Error fetching group data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate balances
  const balances = calculateBalances(participants, expenses)
  const settlements = generateSettlements(balances)

  // Calculate summary stats
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const userBalance = balances.reduce((sum, b) => sum + Math.max(0, b.netBalance), 0)
  const userOwes = balances.reduce((sum, b) => sum + Math.max(0, -b.netBalance), 0)

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesParticipant = !filterParticipant || 
      expense.payer_id === filterParticipant ||
      expense.splits.some(s => s.participant_id === filterParticipant)
    return matchesSearch && matchesParticipant
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-accent-50/20">
        <header className="bg-white/80 backdrop-blur-xl shadow-soft border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton />
        </main>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Group not found</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-primary-600 hover:text-primary-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-accent-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-soft border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:-translate-x-1 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:text-primary-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
              <p className="text-sm text-gray-500">Group expense tracker</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card group hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl text-white shadow-soft">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600">Total Spent</h3>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              ${totalSpent.toFixed(2)}
            </p>
            <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="card group hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-success to-emerald-600 rounded-xl text-white shadow-soft">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600">You Are Owed</h3>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-success to-emerald-700 bg-clip-text text-transparent">
              ${userBalance.toFixed(2)}
            </p>
            <div className="h-1 bg-gradient-to-r from-success to-emerald-600 rounded-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="card group hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-danger to-red-600 rounded-xl text-white shadow-soft">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600">You Owe</h3>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-danger to-red-700 bg-clip-text text-transparent">
              ${userOwes.toFixed(2)}
            </p>
            <div className="h-1 bg-gradient-to-r from-danger to-red-600 rounded-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        {/* Balance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <BalanceSummary
              participants={participants}
              balances={balances}
              settlements={settlements}
            />
          </div>
          
          {/* Expense Chart */}
          <div className="card animate-slide-up" style={{ animationDelay: '150ms' }}>
            <ExpenseChart expenses={expenses} />
          </div>
        </div>

        {/* Expenses Section */}
        <div className="card mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              Expenses
            </h2>
            <button
              onClick={() => setShowAddExpense(true)}
              className="btn-primary flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Add Expense
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search expenses..."
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterParticipant}
                onChange={(e) => setFilterParticipant(e.target.value)}
                className="input-field pl-10 pr-8 appearance-none cursor-pointer"
              >
                <option value="">All Participants</option>
                {participants.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <ExpenseList
            expenses={filteredExpenses}
            participants={participants}
            onUpdate={fetchGroupData}
          />
        </div>
      </main>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <AddExpenseModal
          groupId={groupId}
          participants={participants}
          onClose={() => setShowAddExpense(false)}
          onSuccess={() => {
            setShowAddExpense(false)
            fetchGroupData()
          }}
        />
      )}
    </div>
  )
}
