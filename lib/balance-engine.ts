export interface Balance {
  participantId: string
  participantName: string
  netBalance: number // positive means owed to them, negative means they owe
}

export interface OwedAmount {
  from: string
  fromName: string
  to: string
  toName: string
  amount: number
}

export interface Settlement {
  from: string
  fromName: string
  to: string
  toName: string
  amount: number
}

/**
 * Calculate net balances for all participants
 */
export function calculateBalances(
  participants: { id: string; name: string }[],
  expenses: Array<{
    payer_id: string
    splits: Array<{ participant_id: string; amount: number }>
  }>
): Balance[] {
  const balances: Record<string, number> = {}

  // Initialize balances
  participants.forEach(p => {
    balances[p.id] = 0
  })

  // Calculate balances
  expenses.forEach(expense => {
    expense.splits.forEach(split => {
      if (expense.payer_id === split.participant_id) {
        // Payer paid for themselves, net zero
        balances[split.participant_id] += split.amount - split.amount
      } else {
        // Payer paid for someone else
        balances[expense.payer_id] += split.amount
        balances[split.participant_id] -= split.amount
      }
    })
  })

  return participants.map(p => ({
    participantId: p.id,
    participantName: p.name,
    netBalance: Math.round(balances[p.id] * 100) / 100,
  }))
}

/**
 * Generate who owes whom (detailed breakdown)
 */
export function calculateOwedAmounts(balances: Balance[]): OwedAmount[] {
  const owedAmounts: OwedAmount[] = []
  
  for (let i = 0; i < balances.length; i++) {
    for (let j = i + 1; j < balances.length; j++) {
      const balance1 = balances[i]
      const balance2 = balances[j]
      
      if (balance1.netBalance > 0 && balance2.netBalance < 0) {
        const amount = Math.min(balance1.netBalance, Math.abs(balance2.netBalance))
        if (amount > 0.01) {
          owedAmounts.push({
            from: balance2.participantId,
            fromName: balance2.participantName,
            to: balance1.participantId,
            toName: balance1.participantName,
            amount: Math.round(amount * 100) / 100,
          })
        }
      } else if (balance1.netBalance < 0 && balance2.netBalance > 0) {
        const amount = Math.min(Math.abs(balance1.netBalance), balance2.netBalance)
        if (amount > 0.01) {
          owedAmounts.push({
            from: balance1.participantId,
            fromName: balance1.participantName,
            to: balance2.participantId,
            toName: balance2.participantName,
            amount: Math.round(amount * 100) / 100,
          })
        }
      }
    }
  }
  
  return owedAmounts
}

/**
 * Generate minimal settlement suggestions using greedy algorithm
 */
export function generateSettlements(balances: Balance[]): Settlement[] {
  const settlements: Settlement[] = []
  
  // Create working copies
  const workingBalances = balances.map(b => ({ ...b }))
  
  while (true) {
   // Safety check for empty balances
   if (workingBalances.length === 0) break
    
   // Find max creditor (person owed most)
   const maxCreditor = workingBalances.reduce((max, curr) => 
     curr.netBalance > max.netBalance ? curr : max
   , workingBalances[0])
   
   // Find max debtor (person who owes most)
   const maxDebtor = workingBalances.reduce((max, curr) => 
     curr.netBalance < max.netBalance ? curr : max
   , workingBalances[0])
    
    // If all balanced, stop
    if (Math.abs(maxCreditor.netBalance) < 0.01 && Math.abs(maxDebtor.netBalance) < 0.01) {
      break
    }
    
    // Calculate settlement amount
    const amount = Math.min(maxCreditor.netBalance, Math.abs(maxDebtor.netBalance))
    
    if (amount < 0.01) break
    
    // Record settlement
    settlements.push({
      from: maxDebtor.participantId,
      fromName: maxDebtor.participantName,
      to: maxCreditor.participantId,
      toName: maxCreditor.participantName,
      amount: Math.round(amount * 100) / 100,
    })
    
    // Update working balances
    maxCreditor.netBalance = Math.round((maxCreditor.netBalance - amount) * 100) / 100
    maxDebtor.netBalance = Math.round((maxDebtor.netBalance + amount) * 100) / 100
  }
  
  return settlements
}

/**
 * Split amount equally among participants with consistent rounding
 */
export function splitEqually(amount: number, participantCount: number): number[] {
  const baseAmount = Math.floor((amount * 100) / participantCount) / 100
  const remainder = Math.round((amount - baseAmount * participantCount) * 100) / 100
  
  const splits: number[] = new Array(participantCount).fill(baseAmount)
  
  // Distribute remainder (in cents) to first participants
  let remainingCents = Math.round(remainder * 100)
  for (let i = 0; i < participantCount && remainingCents > 0; i++) {
    splits[i] = Math.round((splits[i] + 0.01) * 100) / 100
    remainingCents--
  }
  
  return splits
}

/**
 * Validate custom split amounts
 */
export function validateCustomSplit(amount: number, splits: number[]): boolean {
  const total = splits.reduce((sum, s) => sum + s, 0)
  return Math.abs(Math.round((total - amount) * 100)) < 1 // Allow 1 cent difference for rounding
}

/**
 * Validate percentage splits
 */
export function validatePercentageSplit(percentages: number[]): boolean {
  const total = percentages.reduce((sum, p) => sum + p, 0)
  return Math.abs(total - 100) < 0.01
}

/**
 * Calculate amounts from percentages
 */
export function calculateFromPercentages(amount: number, percentages: number[]): number[] {
  const splits = percentages.map(p => Math.round((amount * p) / 100 * 100) / 100)
  
  // Adjust for rounding errors
  const total = splits.reduce((sum, s) => sum + s, 0)
  const diff = Math.round((amount - total) * 100) / 100
  
  if (Math.abs(diff) > 0) {
    splits[0] = Math.round((splits[0] + diff) * 100) / 100
  }
  
  return splits
}
