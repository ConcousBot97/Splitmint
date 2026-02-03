# SplitMint - Application Guide

## 🎯 Application Overview

SplitMint is a web-based expense splitting application that helps groups of people track shared expenses and calculate fair settlements. Think of it as a digital version of keeping track of "who owes what" among friends.

## 📱 User Journey

### 1. Landing & Authentication

**URL**: `/` → redirects to `/auth`

**Features**:
- Login / Register tabs
- Email + Password authentication
- Email verification required
- Beautiful gradient background

**User Actions**:
- Register with email and password (min 6 chars)
- Receive verification email
- Click link to verify
- Login to access dashboard

---

### 2. Dashboard

**URL**: `/dashboard`

**What You See**:
- Header with app logo and logout button
- Welcome message
- "Create New Group" button
- Grid of existing groups (or empty state)

**Group Cards Show**:
- Group name
- Number of participants
- Total expenses amount
- Delete button
- Click to view details

**User Actions**:
- Create new group
- View existing groups
- Delete groups
- Click group to see details

---

### 3. Group Detail Page

**URL**: `/group/[id]`

**Layout Sections**:

#### A. Header
- Back button to dashboard
- Group name

#### B. Summary Cards (3 cards side-by-side)
1. **Total Spent**: Total of all expenses in the group
2. **You Are Owed**: How much others owe you (green)
3. **You Owe**: How much you owe others (red)

#### C. Balance Summary (2 columns)

**Left Column - Balance Summary**:
- Lists all participants
- Shows colored avatar circle
- Shows net balance for each person
  - Green (+) = they are owed money
  - Red (−) = they owe money
  - Gray (0) = settled up

**Right Column - Settlement Suggestions**:
- Shows minimal number of payments to settle all debts
- Format: "Alice pays $50 → Bob"
- Visual gradient from red (payer) to green (receiver)
- If everyone settled, shows "All Settled!" message

#### D. Expenses Section
- Search bar (search by description)
- Participant filter dropdown
- "Add Expense" button
- List of all expenses showing:
  - Description
  - Amount (large, bold)
  - Date
  - Who paid
  - Split mode (equal/custom/percentage)
  - Who's included in split
  - Delete button

**User Actions**:
- Add new expense
- Search expenses
- Filter by participant
- Delete expenses
- View balance details
- See settlement suggestions

---

## 💰 Adding an Expense

**Modal Form Fields**:

1. **Description** (required)
   - e.g., "Dinner at Italian restaurant"

2. **Amount** (required)
   - Dollar amount with cents
   - e.g., 120.00

3. **Date** (required)
   - Date picker
   - Defaults to today

4. **Paid By** (required)
   - Dropdown of all participants
   - Who actually paid the bill

5. **Split Mode** (required)
   - Three buttons to choose:

   **Equal**: Divides amount equally
   - Example: $100 / 4 people = $25 each
   - Handles rounding automatically

   **Custom**: Enter exact amounts
   - Enter specific dollar amount for each person
   - Must add up to total amount
   - Example: Alice $40, Bob $30, Carol $30

   **Percentage**: Enter percentages
   - Enter percentage for each person
   - Must add up to 100%
   - Example: Alice 40%, Bob 30%, Carol 30%
   - App calculates dollar amounts

6. **Split Between** (required)
   - Checkboxes for each participant
   - Select who shares this expense
   - Can select subset of group
   - If custom/percentage mode, shows input field next to each selected person

**Validation**:
- All required fields must be filled
- Amount must be positive number
- Custom splits must sum to total amount (within 1 cent)
- Percentages must sum to 100%
- At least one participant must be selected

---

## 🎨 UI Components Guide

### Colors

**Primary Theme** (Green):
- Primary buttons: Green (#22c55e)
- Success states: Green
- "Owed to you" amounts: Green

**Status Colors**:
- Positive balances: Green
- Negative balances: Red
- Neutral/Zero: Gray
- Info: Blue

### Participant Avatars
- Circular colored backgrounds
- Shows first letter of name in white
- Each participant gets unique color from palette:
  - Red, Orange, Green, Blue, Indigo, Purple, Pink, Teal

### Cards
- White background
- Rounded corners
- Subtle shadow
- Border on hover
- Clickable cards have cursor pointer

### Buttons

**Primary** (Green):
- "Create Group"
- "Add Expense"
- "Register" / "Login"
- Submit buttons

**Secondary** (Gray):
- "Cancel"
- Back navigation

**Danger** (Red):
- Delete actions
- Styled as icon buttons

---

## 🔧 How Balance Calculation Works

### Example Scenario

**Group**: Weekend Trip
**Participants**: Alice, Bob, Carol

**Expenses**:
1. Hotel: $300 paid by Alice, split equally 3 ways
   - Alice paid: $300
   - Each person owes: $100
   - Alice's balance: +$200 (paid $300, owes $100)
   - Bob's balance: -$100 (owes Alice)
   - Carol's balance: -$100 (owes Alice)

2. Dinner: $120 paid by Bob, split equally 3 ways
   - Bob paid: $120
   - Each person owes: $40
   - Alice's balance: +$200 - $40 = +$160
   - Bob's balance: -$100 + $80 = -$20
   - Carol's balance: -$100 - $40 = -$140

**Final Balances**:
- Alice: +$160 (is owed)
- Bob: -$20 (owes)
- Carol: -$140 (owes)

**Settlement Suggestions**:
- Carol pays Alice: $140
- Bob pays Alice: $20
- Done! Everyone settled.

### Balance Engine Algorithm

1. **Calculate Net Balances**:
   - For each expense:
     - Payer gets credited for amounts paid for others
     - Each split participant gets debited their share
   - Sum all credits and debits per person

2. **Generate Settlements**:
   - Find person who owes most (max debtor)
   - Find person who is owed most (max creditor)
   - Create payment from debtor to creditor
   - Amount = minimum of (what they owe, what they're owed)
   - Update balances
   - Repeat until everyone is at $0

3. **Result**: Minimum number of transactions needed to settle all debts

---

## 📊 Data Model

### Relationships

```
User (from Supabase Auth)
  └─ has many Groups
      └─ has many Participants
          └─ is payer for many Expenses
          └─ included in many Expense Splits
      └─ has many Expenses
          └─ has many Expense Splits
```

### Database Tables

**profiles**
- id (UUID, references auth.users)
- email
- created_at

**groups**
- id (UUID)
- name
- user_id (owner)
- created_at

**participants**
- id (UUID)
- group_id
- name
- color (hex code)
- avatar (optional)
- created_at

**expenses**
- id (UUID)
- group_id
- description
- amount (decimal)
- date
- payer_id (participant)
- split_mode (equal/custom/percentage)
- created_at

**expense_splits**
- id (UUID)
- expense_id
- participant_id
- amount (decimal)
- created_at

---

## 🔒 Security Features

### Row Level Security (RLS)

Every table has RLS policies:
- Users can only see/edit their own data
- Enforced at database level
- Even if someone hacks API, can't access other users' data

### Authentication
- Passwords hashed by Supabase
- Session tokens for API calls
- Email verification required
- Automatic session refresh

### API Keys
- Only public "anon" key exposed to frontend
- Secret key kept on Supabase servers
- RLS policies protect data even with anon key

---

## 🚀 Performance Features

### Database Optimization
- Indexes on foreign keys
- Cascade deletes (delete group → deletes participants & expenses)
- Efficient queries with joins

### Frontend Optimization
- Server-side rendering with Next.js
- Automatic code splitting
- Image optimization
- Fast page transitions

---

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px (single column)
- Tablet: 640px - 1024px (2 columns)
- Desktop: > 1024px (3 columns)

### Mobile Features
- Touch-friendly buttons
- Responsive navigation
- Stacked layouts
- Scrollable content

---

## 🎓 Key Concepts

### Split Modes Explained

**Equal Split**: Simplest option
- Use when everyone shares equally
- App handles all calculations
- Distributes extra cents to first people

**Custom Split**: Maximum control
- Use when people order different amounts
- Enter exact dollar amount for each person
- Example: At restaurant, track who ordered what

**Percentage Split**: Proportional sharing
- Use when sharing by ratio
- Enter percentage for each person
- Example: Rent split by bedroom size (40%, 30%, 30%)

### Settlement Optimization

Why minimize transactions?
- Fewer payments = less hassle
- Fewer transaction fees (if using payment apps)
- Easier to track

Example without optimization:
- Alice owes Bob $50
- Bob owes Carol $50
- Result: 2 transactions

With optimization:
- Alice pays Carol $50 directly
- Result: 1 transaction (same outcome)

---

## 🎯 Use Cases

### Perfect For:
✅ Roommates splitting rent and utilities
✅ Group trips and vacations
✅ Shared dinners and restaurants
✅ Office lunch orders
✅ Event planning (parties, gifts)
✅ Household expenses

### Not Designed For:
❌ Business accounting
❌ Tax tracking
❌ Invoicing clients
❌ Large organizations (> 4 people per group)
❌ Complex financial tracking

---

## 🆘 Common Questions

**Q: Can I have more than 3 participants?**
A: Currently limited to 3 (+ you = 4 total). Can be changed in code easily.

**Q: Can someone else in my group add expenses?**
A: No, only the group creator can manage it. This is a single-user app.

**Q: What if I delete an expense by mistake?**
A: No undo feature currently. Be careful! Balances will recalculate automatically.

**Q: Can I edit an expense after creation?**
A: Currently no edit feature. Delete and recreate if needed.

**Q: Is my data private?**
A: Yes! Only you can see your groups. RLS ensures data isolation.

**Q: Do participants need accounts?**
A: No! Only the person tracking expenses needs an account.

**Q: Can I export my data?**
A: Not currently. Would be a good future feature.

**Q: What if balances don't add up?**
A: Should always be mathematically correct. Report any bugs!

---

## 📈 Future Enhancement Ideas

- Mobile app version
- Push notifications
- Recurring expenses
- Multiple currencies
- Receipt photo uploads
- Export to CSV/PDF
- Email invitations
- Collaborative groups
- Expense categories
- Budget limits
- Analytics and charts
- AI expense categorization

---

This guide should help you understand every aspect of SplitMint! For technical setup, see QUICKSTART.md or DEPLOYMENT.md.
