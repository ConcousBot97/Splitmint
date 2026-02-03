# SplitMint - Architecture & Flow Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      USER BROWSER                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Next.js Frontend (React + TypeScript)     │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌───────────┐ │  │
│  │  │   Pages    │  │ Components  │  │  Libraries │ │  │
│  │  │            │  │             │  │           │ │  │
│  │  │ - Auth     │  │ - GroupCard │  │ - Supabase│ │  │
│  │  │ - Dashboard│  │ - Modals    │  │ - Balance │ │  │
│  │  │ - Group    │  │ - Lists     │  │   Engine  │ │  │
│  │  └────────────┘  └─────────────┘  └───────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
│                           ↕                              │
│              Supabase Client (API Calls)                 │
└─────────────────────────────────────────────────────────┘
                           ↕
                    HTTPS / REST API
                           ↕
┌─────────────────────────────────────────────────────────┐
│                  SUPABASE BACKEND                        │
│  ┌──────────────────┐         ┌────────────────────┐   │
│  │  Authentication  │         │    PostgreSQL DB   │   │
│  │                  │         │                    │   │
│  │  - Sign Up       │────────▶│  - profiles        │   │
│  │  - Login         │         │  - groups          │   │
│  │  - Email Verify  │         │  - participants    │   │
│  │  - Sessions      │         │  - expenses        │   │
│  └──────────────────┘         │  - expense_splits  │   │
│                                │                    │   │
│  ┌──────────────────┐         │  Row Level         │   │
│  │  Storage         │         │  Security (RLS)    │   │
│  │  (Future)        │         │  Enabled           │   │
│  └──────────────────┘         └────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           ↕
                      DEPLOYMENT
                           ↕
┌─────────────────────────────────────────────────────────┐
│                    VERCEL HOSTING                        │
│  - Automatic deployments from Git                        │
│  - Serverless functions                                  │
│  - CDN for static assets                                 │
│  - Environment variables                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow Diagrams

### 1. Registration & Login Flow

```
START
  │
  ├─→ Visit App (/)
  │     │
  │     └─→ Redirect to /auth
  │           │
  │           ├─→ [Choose Register]
  │           │     │
  │           │     ├─→ Enter email + password
  │           │     │
  │           │     ├─→ Submit form
  │           │     │
  │           │     ├─→ Supabase creates user
  │           │     │
  │           │     ├─→ Send verification email
  │           │     │
  │           │     ├─→ User checks email
  │           │     │
  │           │     ├─→ Click verification link
  │           │     │
  │           │     └─→ Account verified ✅
  │           │
  │           └─→ [Choose Login]
  │                 │
  │                 ├─→ Enter email + password
  │                 │
  │                 ├─→ Supabase verifies credentials
  │                 │
  │                 ├─→ Create session
  │                 │
  │                 └─→ Redirect to /dashboard ✅
  │
END
```

### 2. Group & Expense Management Flow

```
/dashboard
  │
  ├─→ [Create Group]
  │     │
  │     ├─→ Open modal
  │     ├─→ Enter group name
  │     ├─→ Add participants (1-3)
  │     ├─→ Submit
  │     ├─→ Create group in DB
  │     ├─→ Create participants in DB
  │     └─→ Show new group card ✅
  │
  ├─→ [Click Group Card]
  │     │
  │     └─→ Navigate to /group/[id]
  │           │
  │           ├─→ Load group data
  │           ├─→ Load participants
  │           ├─→ Load expenses
  │           ├─→ Calculate balances
  │           ├─→ Generate settlements
  │           │
  │           ├─→ Display summary cards
  │           ├─→ Display balance table
  │           ├─→ Display settlements
  │           └─→ Display expense list
  │
  └─→ [Add Expense] (from group page)
        │
        ├─→ Open modal
        ├─→ Enter description
        ├─→ Enter amount
        ├─→ Select date
        ├─→ Select payer
        ├─→ Choose split mode
        │     │
        │     ├─→ [Equal]
        │     │     └─→ Auto-calculate splits
        │     │
        │     ├─→ [Custom]
        │     │     └─→ Enter amount for each
        │     │
        │     └─→ [Percentage]
        │           └─→ Enter percentage for each
        │
        ├─→ Select participants
        ├─→ Validate inputs
        ├─→ Calculate splits
        ├─→ Create expense in DB
        ├─→ Create splits in DB
        ├─→ Refresh group data
        └─→ Update balances ✅
```

---

## 💾 Database Schema Diagram

```
┌──────────────────┐
│   auth.users     │ (Managed by Supabase)
│                  │
│ - id (UUID) PK   │
│ - email          │
│ - encrypted_pwd  │
└──────────────────┘
         │
         │ (1:1)
         ↓
┌──────────────────┐
│    profiles      │
│                  │
│ - id (UUID) PK   │──────┐
│ - email          │      │
│ - created_at     │      │
└──────────────────┘      │
                          │ (1:N)
                          ↓
                 ┌──────────────────┐
                 │     groups       │
                 │                  │
                 │ - id (UUID) PK   │──────┐
                 │ - name           │      │
                 │ - user_id FK     │      │
                 │ - created_at     │      │
                 └──────────────────┘      │
                          │                │
                          │ (1:N)          │ (1:N)
                          ↓                ↓
                 ┌──────────────────┐  ┌──────────────────┐
                 │  participants    │  │    expenses      │
                 │                  │  │                  │
                 │ - id (UUID) PK   │  │ - id (UUID) PK   │
                 │ - group_id FK    │  │ - group_id FK    │
                 │ - name           │  │ - description    │
                 │ - color          │  │ - amount         │
                 │ - avatar         │  │ - date           │
                 │ - created_at     │  │ - payer_id FK    │───┐
                 └──────────────────┘  │ - split_mode     │   │
                          │            │ - created_at     │   │
                          │            └──────────────────┘   │
                          │                     │             │
                          │ (1:N)               │ (1:N)       │
                          └─────────────────────┼─────────────┘
                                                ↓
                                       ┌──────────────────┐
                                       │ expense_splits   │
                                       │                  │
                                       │ - id (UUID) PK   │
                                       │ - expense_id FK  │
                                       │ - participant_id │
                                       │ - amount         │
                                       │ - created_at     │
                                       └──────────────────┘
```

**Relationships**:
- One User → Many Groups
- One Group → Many Participants
- One Group → Many Expenses
- One Participant → Many Expenses (as payer)
- One Expense → Many Expense Splits
- One Participant → Many Expense Splits

**Cascade Deletes**:
- Delete Group → Deletes all Participants and Expenses
- Delete Expense → Deletes all Expense Splits
- Delete Participant → Handled by app logic

---

## ⚙️ Balance Calculation Algorithm

```
Input: List of Expenses with Splits
Output: Net Balance per Participant

┌─────────────────────────────────────┐
│  Step 1: Initialize Balances        │
│                                     │
│  For each participant:              │
│    balance[participant] = 0         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Step 2: Process Each Expense       │
│                                     │
│  For each expense:                  │
│    For each split:                  │
│      if payer == split.participant: │
│        balance[payer] += 0          │
│        (paid for themselves)        │
│      else:                          │
│        balance[payer] += split.amt  │
│        (credit for paying)          │
│        balance[participant] -= amt  │
│        (debit for owing)            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Step 3: Calculate Net Balances     │
│                                     │
│  For each participant:              │
│    net_balance = sum of all         │
│                  credits - debits   │
│                                     │
│  Positive = Owed to them            │
│  Negative = They owe                │
│  Zero = Settled                     │
└─────────────────────────────────────┘
              ↓
         OUTPUT
```

### Example Calculation:

```
Expense: $100 paid by Alice, split equally among Alice, Bob, Carol

Initial:
  Alice = 0, Bob = 0, Carol = 0

Process Splits:
  Split 1: Alice owes $33.33
    Alice pays for herself → Alice += 0
  
  Split 2: Bob owes $33.33
    Alice paid for Bob → Alice += $33.33
    Bob owes → Bob -= $33.33
  
  Split 3: Carol owes $33.34 (rounding)
    Alice paid for Carol → Alice += $33.34
    Carol owes → Carol -= $33.34

Final Balances:
  Alice = 0 + 33.33 + 33.34 = +$66.67 (is owed)
  Bob = -$33.33 (owes)
  Carol = -$33.34 (owes)

Verification: 66.67 - 33.33 - 33.34 = 0 ✅
```

---

## 🎯 Settlement Optimization Algorithm

```
Input: List of Balances
Output: Minimal list of settlements

┌─────────────────────────────────────┐
│  Step 1: Separate Creditors/Debtors│
│                                     │
│  creditors = participants with      │
│              positive balance       │
│  debtors = participants with        │
│            negative balance         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Step 2: Match Max Debtor to        │
│          Max Creditor               │
│                                     │
│  While (any unresolved balances):   │
│    max_debtor = person owing most   │
│    max_creditor = person owed most  │
│                                     │
│    amount = min(|debtor.balance|,   │
│                 creditor.balance)   │
│                                     │
│    Create settlement:               │
│      debtor → creditor: amount      │
│                                     │
│    Update balances:                 │
│      debtor.balance += amount       │
│      creditor.balance -= amount     │
└─────────────────────────────────────┘
              ↓
         OUTPUT
```

### Example Optimization:

```
Balances:
  Alice: +$100 (owed)
  Bob: -$40 (owes)
  Carol: -$60 (owes)

Without Optimization (naive):
  Bob pays Alice: $40
  Carol pays Alice: $60
  Total: 2 transactions

With Optimization (greedy):
  Step 1: Find max creditor (Alice: +$100)
          Find max debtor (Carol: -$60)
          Settlement: Carol → Alice: $60
          Updated: Alice: +$40, Carol: $0

  Step 2: Find max creditor (Alice: +$40)
          Find max debtor (Bob: -$40)
          Settlement: Bob → Alice: $40
          Updated: Alice: $0, Bob: $0

Result: 2 transactions (same in this case)

More Complex Example:
  Alice: +$50
  Bob: -$30
  Carol: +$20
  Dave: -$40

Naive: 4 transactions
Optimized:
  Dave → Alice: $40
  Dave → Carol: $0 (already settled)
  Bob → Alice: $10
  Bob → Carol: $20
Result: 3 transactions ✅
```

---

## 🔐 Security Flow (Row Level Security)

```
┌─────────────────────────────────────────────────┐
│         User Makes Database Request             │
│  (e.g., SELECT * FROM groups)                   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│      Supabase Checks JWT Token                  │
│  - Is token valid?                              │
│  - Is token expired?                            │
│  - Extract user_id from token                   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│      Apply Row Level Security Policies          │
│                                                 │
│  Policy: "Users can view own groups"            │
│  WHERE group.user_id = auth.uid()               │
│                                                 │
│  Automatically filters results to only          │
│  rows where user_id matches logged in user      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│         Return Filtered Results                 │
│  Only data user is authorized to see            │
└─────────────────────────────────────────────────┘

Example:
  User A (id: 123) requests all groups
  
  Database has:
    Group 1 (user_id: 123)
    Group 2 (user_id: 456)
    Group 3 (user_id: 123)
  
  RLS applies: WHERE user_id = 123
  
  Returns:
    Group 1 ✅
    Group 3 ✅
  
  User never knows Group 2 exists! 🔒
```

---

## 📱 Component Hierarchy

```
App Root (layout.tsx)
│
├── / (page.tsx) → Redirects to /auth
│
├── /auth (auth/page.tsx)
│   └── Auth Form Component
│       ├── Login Tab
│       └── Register Tab
│
├── /dashboard (dashboard/page.tsx)
│   ├── Header
│   │   └── Logout Button
│   ├── Welcome Section
│   ├── Create Group Button
│   └── Groups Grid
│       └── GroupCard (x N)
│           ├── Group Info
│           └── Delete Button
│   └── CreateGroupModal (conditional)
│       ├── Group Name Input
│       └── Participant Inputs (1-3)
│
└── /group/[id] (group/[id]/page.tsx)
    ├── Header
    │   └── Back Button
    ├── Summary Cards (3)
    │   ├── Total Spent Card
    │   ├── You Are Owed Card
    │   └── You Owe Card
    ├── BalanceSummary
    │   ├── Balance Table
    │   │   └── Participant Row (x N)
    │   └── Settlements Panel
    │       └── Settlement Card (x N)
    ├── Expenses Section
    │   ├── Search Bar
    │   ├── Filter Dropdown
    │   ├── Add Expense Button
    │   └── ExpenseList
    │       └── Expense Item (x N)
    │           ├── Description
    │           ├── Amount
    │           ├── Date
    │           └── Delete Button
    └── AddExpenseModal (conditional)
        ├── Description Input
        ├── Amount Input
        ├── Date Picker
        ├── Payer Select
        ├── Split Mode Buttons (3)
        └── Participant Checkboxes
            └── Custom/% Input (conditional)
```

---

## 🔄 Data Flow

### Read Flow (Viewing Group)

```
User → /group/123
   ↓
Next.js Page Component
   ↓
useEffect(() => fetchGroupData())
   ↓
Supabase Client
   ↓
API Request with JWT
   ↓
Supabase Server
   ├→ Check Authentication
   ├→ Apply RLS Policies
   └→ Query Database
   ↓
Return Data
   ↓
Update React State
   ↓
Calculate Balances (local)
   ↓
Render UI
```

### Write Flow (Adding Expense)

```
User → Fill Form → Click Submit
   ↓
Form Validation (client-side)
   ↓
Calculate Splits (local)
   ↓
Supabase Client
   ├→ INSERT expense
   │    ↓
   │  Supabase validates RLS
   │    ↓
   │  Write to expenses table
   │
   └→ INSERT expense_splits (batch)
        ↓
     Supabase validates RLS
        ↓
     Write to expense_splits table
        ↓
Return Success
   ↓
Close Modal
   ↓
Refresh Group Data
   ↓
Recalculate Balances
   ↓
Update UI
```

---

## 🎨 Styling Architecture

```
Tailwind CSS
   ↓
tailwind.config.js
   ├→ Primary colors defined
   ├→ Custom theme extensions
   └→ Responsive breakpoints
   ↓
globals.css
   ├→ @tailwind base
   ├→ @tailwind components
   └→ @tailwind utilities
   ↓
Component Files
   └→ className="utility classes"
       ├→ Layout: flex, grid
       ├→ Spacing: p-4, m-2
       ├→ Colors: bg-primary-600
       ├→ Typography: text-xl font-bold
       ├→ Responsive: sm:text-lg md:grid-cols-2
       └→ Interactive: hover:bg-gray-100
```

---

## 🚀 Deployment Flow

```
Local Development
   ↓
git add .
git commit -m "message"
git push origin main
   ↓
GitHub Repository
   ↓
Vercel (connected to GitHub)
   ↓
Automatic Build Trigger
   ├→ npm install
   ├→ npm run build
   │    ├→ TypeScript compilation
   │    ├→ Optimize bundles
   │    └→ Generate static pages
   ├→ Inject environment variables
   └→ Deploy to edge network
   ↓
Live at: your-app.vercel.app
   ↓
User Access
   ├→ CDN serves static assets
   ├→ Serverless functions for API routes
   └→ Connects to Supabase for data
```

---

These diagrams provide a visual understanding of how SplitMint works at every level! 🎉
