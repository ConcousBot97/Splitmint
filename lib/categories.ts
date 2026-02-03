import { 
  ShoppingCart, 
  UtensilsCrossed, 
  Car, 
  Home, 
  Plane, 
  Film, 
  Heart, 
  ShoppingBag,
  Wifi,
  Zap,
  GraduationCap,
  Stethoscope,
  Gift,
  DollarSign
} from 'lucide-react'

export interface ExpenseCategory {
  id: string
  name: string
  icon: any
  color: string
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'food', name: 'Food & Dining', icon: UtensilsCrossed, color: '#F59E0B' },
  { id: 'groceries', name: 'Groceries', icon: ShoppingCart, color: '#10B981' },
  { id: 'transportation', name: 'Transportation', icon: Car, color: '#3B82F6' },
  { id: 'housing', name: 'Housing', icon: Home, color: '#8B5CF6' },
  { id: 'travel', name: 'Travel', icon: Plane, color: '#06B6D4' },
  { id: 'entertainment', name: 'Entertainment', icon: Film, color: '#EC4899' },
  { id: 'health', name: 'Health', icon: Heart, color: '#EF4444' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: '#F97316' },
  { id: 'utilities', name: 'Utilities', icon: Zap, color: '#FBBF24' },
  { id: 'internet', name: 'Internet', icon: Wifi, color: '#6366F1' },
  { id: 'education', name: 'Education', icon: GraduationCap, color: '#8B5CF6' },
  { id: 'medical', name: 'Medical', icon: Stethoscope, color: '#DC2626' },
  { id: 'gifts', name: 'Gifts', icon: Gift, color: '#DB2777' },
  { id: 'other', name: 'Other', icon: DollarSign, color: '#6B7280' },
]

export function getCategoryById(id: string): ExpenseCategory {
  return EXPENSE_CATEGORIES.find(cat => cat.id === id) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
}

export function getCategoryColor(id: string): string {
  return getCategoryById(id).color
}

export function getCategoryIcon(id: string) {
  return getCategoryById(id).icon
}
