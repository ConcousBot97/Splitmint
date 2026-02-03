'use client'

import { EXPENSE_CATEGORIES, getCategoryById } from '@/lib/categories'

interface ExpenseChartProps {
  expenses: Array<{
    id: string
    amount: number
    category?: string
  }>
}

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  // Calculate total per category
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category || 'other'
    acc[category] = (acc[category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  
  if (total === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No expenses to display
      </div>
    )
  }

  // Sort categories by amount
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5) // Top 5 categories

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Expense Breakdown</h3>
      
      {sortedCategories.map(([categoryId, amount], index) => {
        const category = getCategoryById(categoryId)
        const percentage = (amount / total) * 100
        const Icon = category.icon

        return (
          <div key={categoryId} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="p-1.5 rounded-lg"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: category.color }} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{category.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">${amount.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: category.color,
                }}
              ></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
