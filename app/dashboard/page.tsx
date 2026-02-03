'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { PlusCircle, Users, LogOut, TrendingUp } from 'lucide-react'
import GroupCard from '@/components/GroupCard'
import CreateGroupModal from '@/components/CreateGroupModal'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { useToast } from '@/hooks/useToast'

interface Group {
  id: string
  name: string
  participant_count?: number
  total_expenses?: number
}

export default function Dashboard() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { showToast, ToastContainer } = useToast()

  useEffect(() => {
    checkUser()
    fetchGroups()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth')
    } else {
      setUser(user)
    }
  }

  const fetchGroups = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          participants(count),
          expenses(amount)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const groupsWithStats = data?.map((group: any) => ({
        id: group.id,
        name: group.name,
        participant_count: group.participants?.[0]?.count || 0,
        total_expenses: group.expenses?.reduce((sum: number, e: any) => sum + Number(e.amount), 0) || 0,
      })) || []

      setGroups(groupsWithStats)
    } catch (err) {
      console.error('Error fetching groups:', err)
      showToast('Failed to load groups', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    showToast('Logged out successfully', 'success')
    router.push('/auth')
  }

  const handleGroupCreated = () => {
    setShowCreateModal(false)
    fetchGroups()
    showToast('Group created successfully!', 'success')
  }

  const handleGroupDeleted = () => {
    fetchGroups()
    showToast('Group deleted', 'info')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/30">
        <header className="bg-white/80 backdrop-blur-xl shadow-soft border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-10 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/30">
      <ToastContainer />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-soft border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-2.5 rounded-xl shadow-md">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  SplitMint
                </h1>
                <p className="text-xs text-gray-500">Expense Manager</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300 font-medium group"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Manage your expense groups and track balances
          </p>
        </div>

        {/* Create Group Button */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <PlusCircle className="w-5 h-5" />
            Create New Group
          </button>
        </div>

        {/* Groups Grid */}
        {groups.length === 0 ? (
          <div className="card p-12 text-center animate-scale-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full mb-6">
              <Users className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No groups yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first group to start tracking shared expenses with friends, roommates, or travel buddies
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <PlusCircle className="w-5 h-5" />
              Create Your First Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group, index) => (
              <div
                key={group.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <GroupCard group={group} onUpdate={handleGroupDeleted} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleGroupCreated}
        />
      )}
    </div>
  )
}
