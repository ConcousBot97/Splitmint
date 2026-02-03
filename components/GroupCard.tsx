'use client'

import { Users, DollarSign, Trash2, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

interface GroupCardProps {
  group: {
    id: string
    name: string
    participant_count?: number
    total_expenses?: number
  }
  onUpdate: () => void
}

export default function GroupCard({ group, onUpdate }: GroupCardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Are you sure you want to delete "${group.name}"? This will delete all expenses and participants.`)) {
      return
    }

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', group.id)

      if (error) throw error
      onUpdate()
    } catch (err) {
      console.error('Error deleting group:', err)
      alert('Failed to delete group')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      onClick={() => router.push(`/group/${group.id}`)}
      className="card p-6 cursor-pointer group hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 mb-1">
            {group.name}
          </h3>
          <div className="h-1 w-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full"></div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2.5 text-danger-600 hover:bg-danger-50 rounded-xl transition-all duration-300 disabled:opacity-50 hover:scale-110 active:scale-95"
          title="Delete group"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Users className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Participants</p>
            <p className="font-semibold text-gray-900">
              {group.participant_count || 0} {group.participant_count === 1 ? 'person' : 'people'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
          <div className="p-2 bg-success-100 rounded-lg">
            <DollarSign className="w-5 h-5 text-success-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Expenses</p>
            <p className="font-semibold text-gray-900">
              ${(group.total_expenses || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-primary-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
          <span>View Details</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </div>
  )
}
