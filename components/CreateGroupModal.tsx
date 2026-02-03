'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { X, UserPlus } from 'lucide-react'

interface CreateGroupModalProps {
  onClose: () => void
  onSuccess: () => void
}

const AVATAR_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
  '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'
]

export default function CreateGroupModal({ onClose, onSuccess }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('')
  const [participants, setParticipants] = useState<string[]>([''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddParticipant = () => {
    if (participants.length < 3) {
      setParticipants([...participants, ''])
    }
  }

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index))
  }

  const handleParticipantChange = (index: number, value: string) => {
    const updated = [...participants]
    updated[index] = value
    setParticipants(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!groupName.trim()) {
      setError('Group name is required')
      return
    }

    const validParticipants = participants.filter(p => p.trim())
    if (validParticipants.length === 0) {
      setError('At least one participant is required')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create group
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert([{ name: groupName, user_id: user.id }])
        .select()
        .single()

      if (groupError) throw groupError

      // Add participants
      const participantsData = validParticipants.map((name, index) => ({
        group_id: group.id,
        name: name.trim(),
        color: AVATAR_COLORS[index % AVATAR_COLORS.length],
      }))

      const { error: participantsError } = await supabase
        .from('participants')
        .insert(participantsData)

      if (participantsError) throw participantsError

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-strong w-full max-w-md animate-scale-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Group</h2>
            <p className="text-sm text-gray-500 mt-1">Organize your shared expenses</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="input-field"
              placeholder="e.g., Weekend Trip, Roommates, Office Lunch"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Participants * (max 3)
            </label>
            <div className="space-y-3">
              {participants.map((participant, index) => (
                <div key={index} className="flex gap-2 animate-slide-down">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={participant}
                      onChange={(e) => handleParticipantChange(index, e.target.value)}
                      className="input-field pl-10"
                      placeholder={`Participant ${index + 1}`}
                    />
                    <div 
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
                      style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
                    ></div>
                  </div>
                  {participants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveParticipant(index)}
                      className="p-2.5 text-danger-600 hover:bg-danger-50 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {participants.length < 3 && (
              <button
                type="button"
                onClick={handleAddParticipant}
                className="mt-3 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm px-3 py-2 hover:bg-primary-50 rounded-lg transition-all duration-300"
              >
                <UserPlus className="w-4 h-4" />
                Add Another Participant
              </button>
            )}
          </div>

          {error && (
            <div className="p-4 bg-danger-50 text-danger-700 rounded-xl text-sm font-medium border border-danger-200 animate-slide-down">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
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
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Group'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
