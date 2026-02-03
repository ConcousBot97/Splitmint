# 📂 SplitMint - Complete File Index

## 🎯 Quick Navigation

**New to the project?** Start here:
1. Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Overview of what was built
2. Follow [QUICKSTART.md](QUICKSTART.md) - Get up and running in 10 minutes
3. Check [APP_GUIDE.md](APP_GUIDE.md) - Learn how the app works

**Ready to deploy?**
- Follow [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to Vercel

**Want details?**
- See [README.md](README.md) - Complete technical documentation

---

## 📁 File Structure

### 📄 Root Configuration Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `package.json` | Dependencies and scripts | Add new npm packages |
| `tsconfig.json` | TypeScript configuration | Change compiler settings |
| `tailwind.config.js` | Tailwind CSS configuration | Add custom colors/themes |
| `next.config.js` | Next.js configuration | Add environment variables, redirects |
| `vercel.json` | Vercel deployment config | Change build settings |
| `.gitignore` | Git ignore rules | Add files to exclude from Git |
| `.env.example` | Environment variable template | Never edit (copy to .env.local) |

### 📚 Documentation Files

| File | Description | Audience |
|------|-------------|----------|
| `PROJECT_SUMMARY.md` | Project overview and what was built | Everyone - start here |
| `README.md` | Complete technical documentation | Developers |
| `QUICKSTART.md` | Fast setup guide (10 min) | New users |
| `DEPLOYMENT.md` | Step-by-step deployment guide | Deploying to production |
| `APP_GUIDE.md` | How the application works | Users & developers |
| `INDEX.md` | This file - file structure guide | Finding your way around |

### 🚀 Setup Scripts

| File | Platform | Purpose |
|------|----------|---------|
| `setup.bat` | Windows | Automated setup for Windows |
| `setup.sh` | Mac/Linux | Automated setup for Unix systems |

**Usage**:
```bash
# Windows
setup.bat

# Mac/Linux
chmod +x setup.sh
./setup.sh
```

### 🗄️ Database

| File | Purpose |
|------|---------|
| `supabase-schema.sql` | Complete database schema with tables, indexes, and RLS policies |

**Contains**:
- Table definitions (profiles, groups, participants, expenses, expense_splits)
- Indexes for performance
- Row Level Security policies
- Foreign key constraints
- Cascade delete rules

### 📱 Application Code

#### `/app` - Next.js App Directory

```
app/
├── layout.tsx              # Root layout, includes <html> and global styles
├── page.tsx                # Home page (redirects to /auth)
├── globals.css             # Global CSS styles (Tailwind imports)
│
├── auth/
│   └── page.tsx            # Login/Register page
│
├── dashboard/
│   └── page.tsx            # Main dashboard with group list
│
└── group/
    └── [id]/
        └── page.tsx        # Group detail page with expenses and balances
```

**File Details**:

- **`layout.tsx`**: Root layout component
  - Sets up HTML structure
  - Imports global CSS
  - Applies to all pages

- **`page.tsx`**: Home page
  - Redirects to `/auth`
  - Entry point

- **`auth/page.tsx`**: Authentication page
  - Login and register forms
  - Tab switching
  - Email/password validation
  - Supabase auth integration

- **`dashboard/page.tsx`**: Main dashboard
  - Lists all user's groups
  - Create group modal
  - Group statistics
  - Logout functionality

- **`group/[id]/page.tsx`**: Group detail page
  - Summary cards (total spent, owed, owes)
  - Balance summary table
  - Settlement suggestions
  - Expense list
  - Search and filter
  - Add expense modal

#### `/components` - React Components

```
components/
├── GroupCard.tsx           # Group card on dashboard
├── CreateGroupModal.tsx    # Modal for creating new group
├── AddExpenseModal.tsx     # Modal for adding expense
├── ExpenseList.tsx         # List of expenses with delete
└── BalanceSummary.tsx      # Balance table and settlements
```

**Component Details**:

- **`GroupCard.tsx`**:
  - Displays group info
  - Shows participant count and total expenses
  - Delete button with confirmation
  - Click to navigate to group detail

- **`CreateGroupModal.tsx`**:
  - Form for creating groups
  - Dynamic participant inputs (up to 3)
  - Color assignment for participants
  - Validation and error handling

- **`AddExpenseModal.tsx`**:
  - Complex form for adding expenses
  - Three split modes (equal/custom/percentage)
  - Dynamic participant selection
  - Amount validation
  - Split calculation

- **`ExpenseList.tsx`**:
  - Displays list of expenses
  - Formatted dates
  - Shows payer and participants
  - Delete functionality
  - Empty state

- **`BalanceSummary.tsx`**:
  - Two-column layout
  - Left: Balance table with avatars
  - Right: Settlement suggestions
  - Color-coded balances
  - Visual settlement flow

#### `/lib` - Utility Libraries

```
lib/
├── supabase.ts             # Supabase client and TypeScript types
└── balance-engine.ts       # Balance calculation algorithms
```

**Library Details**:

- **`supabase.ts`**:
  - Supabase client initialization
  - TypeScript interfaces:
    - User, Group, Participant, Expense, ExpenseSplit
  - Type-safe database access

- **`balance-engine.ts`**:
  - `calculateBalances()`: Net balance per participant
  - `calculateOwedAmounts()`: Who owes whom
  - `generateSettlements()`: Minimal settlement suggestions
  - `splitEqually()`: Equal split with rounding
  - `validateCustomSplit()`: Validate custom amounts
  - `validatePercentageSplit()`: Validate percentages
  - `calculateFromPercentages()`: Convert % to amounts

---

## 🔧 NPM Scripts

Defined in `package.json`:

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run dev` | Start development server | During development |
| `npm run build` | Build for production | Before deployment |
| `npm start` | Run production build | After building |
| `npm run lint` | Run ESLint | Check code quality |

---

## 🌳 Complete File Tree

```
splitmint/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies
│   ├── package-lock.json         # Dependency lock file (auto-generated)
│   ├── tsconfig.json             # TypeScript config
│   ├── tailwind.config.js        # Tailwind config
│   ├── next.config.js            # Next.js config
│   ├── vercel.json               # Vercel config
│   ├── .gitignore                # Git ignore
│   └── .env.example              # Env template
│
├── 📚 Documentation
│   ├── PROJECT_SUMMARY.md        # ⭐ Start here
│   ├── QUICKSTART.md             # ⚡ Quick setup
│   ├── DEPLOYMENT.md             # 🚀 Deploy guide
│   ├── README.md                 # 📖 Full docs
│   ├── APP_GUIDE.md              # 📱 App usage
│   └── INDEX.md                  # 📂 This file
│
├── 🔧 Setup Scripts
│   ├── setup.bat                 # Windows setup
│   └── setup.sh                  # Mac/Linux setup
│
├── 🗄️ Database
│   └── supabase-schema.sql       # Database schema
│
├── 📱 Application Code
│   ├── app/
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   ├── globals.css           # Global styles
│   │   ├── auth/
│   │   │   └── page.tsx          # Auth page
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard
│   │   └── group/
│   │       └── [id]/
│   │           └── page.tsx      # Group detail
│   │
│   ├── components/
│   │   ├── GroupCard.tsx         # Group card
│   │   ├── CreateGroupModal.tsx  # Create group
│   │   ├── AddExpenseModal.tsx   # Add expense
│   │   ├── ExpenseList.tsx       # Expense list
│   │   └── BalanceSummary.tsx    # Balance summary
│   │
│   └── lib/
│       ├── supabase.ts           # Supabase client
│       └── balance-engine.ts     # Balance logic
│
└── 📁 Generated Folders (not in Git)
    ├── node_modules/             # Dependencies
    ├── .next/                    # Build output
    └── .env.local                # Your environment vars
```

---

## 🎨 Key Technologies by File

### TypeScript Files (`.ts`, `.tsx`)
All application code is TypeScript for type safety:
- `app/**/*.tsx` - Next.js pages (TSX = TypeScript + JSX)
- `components/**/*.tsx` - React components
- `lib/**/*.ts` - Pure TypeScript utilities

### Styling
- `globals.css` - Tailwind imports
- `tailwind.config.js` - Tailwind customization
- Inline: `className="..."` - Tailwind classes in components

### Configuration
- `*.json` - JSON configs (package, tsconfig, vercel)
- `*.js` - JavaScript configs (next, tailwind)
- `.env.local` - Environment variables (create from .env.example)

---

## 🚦 Getting Started Checklist

- [ ] Read `PROJECT_SUMMARY.md`
- [ ] Install Node.js from nodejs.org
- [ ] Run setup script (`setup.bat` or `setup.sh`)
- [ ] Create Supabase account
- [ ] Run `supabase-schema.sql` in Supabase
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add Supabase credentials to `.env.local`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Register and test the app

---

## 📖 Reading Order for New Developers

1. **`PROJECT_SUMMARY.md`** - What is this?
2. **`QUICKSTART.md`** - Get it running
3. **`APP_GUIDE.md`** - How does it work?
4. **`app/auth/page.tsx`** - See authentication
5. **`app/dashboard/page.tsx`** - See main page
6. **`components/AddExpenseModal.tsx`** - See complex form
7. **`lib/balance-engine.ts`** - See algorithms
8. **`supabase-schema.sql`** - See database structure
9. **`README.md`** - Technical deep dive

---

## 🔍 Finding What You Need

| I want to... | Look at... |
|--------------|------------|
| Understand the project | `PROJECT_SUMMARY.md` |
| Set up locally | `QUICKSTART.md` |
| Deploy to production | `DEPLOYMENT.md` |
| Learn how to use the app | `APP_GUIDE.md` |
| Add a new feature | `README.md` + relevant component |
| Change colors/styling | `tailwind.config.js` + component files |
| Modify database | `supabase-schema.sql` |
| Fix authentication | `app/auth/page.tsx` + `lib/supabase.ts` |
| Change balance calculation | `lib/balance-engine.ts` |
| Add a new page | Create in `app/` directory |
| Add a new component | Create in `components/` directory |
| Change environment | `.env.local` (create from .env.example) |

---

## 🎓 Code Organization Principles

### Why This Structure?

**Next.js App Router**:
- File-based routing (`app/auth/page.tsx` → `/auth`)
- Server components by default
- Client components with `'use client'`

**Component Separation**:
- Pages in `/app` (routable)
- Reusable components in `/components`
- Utilities in `/lib`

**Type Safety**:
- TypeScript everywhere
- Interfaces in `lib/supabase.ts`
- Type checking prevents bugs

**Styling**:
- Tailwind utility classes
- No separate CSS files per component
- Consistent design tokens in `tailwind.config.js`

---

## 🛠️ Modification Guide

### To Add a New Feature

1. **New page**: Create `app/newpage/page.tsx`
2. **New component**: Create `components/NewComponent.tsx`
3. **New database table**: Update `supabase-schema.sql`
4. **New API call**: Add to relevant component or create service
5. **New type**: Add to `lib/supabase.ts`

### Common Modifications

**Change participant limit**:
- `components/CreateGroupModal.tsx`: Line with `participants.length < 3`

**Change colors**:
- `tailwind.config.js`: Update primary colors

**Add expense categories**:
1. Update `supabase-schema.sql`: Add category column
2. Update `lib/supabase.ts`: Add to Expense interface
3. Update `components/AddExpenseModal.tsx`: Add category field

**Add email notifications**:
1. Set up Supabase email functions
2. Add triggers in database
3. Configure email templates in Supabase dashboard

---

## 📦 Dependencies Overview

From `package.json`:

**Core Framework**:
- `next` - React framework
- `react` - UI library
- `react-dom` - React for web

**Database & Auth**:
- `@supabase/supabase-js` - Supabase client

**UI & Icons**:
- `lucide-react` - Icon library
- `date-fns` - Date formatting

**Development**:
- `typescript` - Type checking
- `eslint` - Code linting
- `tailwindcss` - Styling
- `autoprefixer` - CSS compatibility
- `postcss` - CSS processing

---

## 🎯 Summary

This project contains:
- **6 documentation files** - Guides and references
- **7 TypeScript pages/components** - Application UI
- **2 library files** - Utilities and logic
- **7 configuration files** - Project setup
- **1 database schema** - Data structure
- **2 setup scripts** - Automation

**Total**: ~25 source files + documentation

**Lines of Code**: ~2,500+ (excluding documentation)

**Time to Set Up**: 10-15 minutes with QUICKSTART.md

**Time to Deploy**: 15-20 minutes with DEPLOYMENT.md

---

## 🆘 Need Help?

1. **Setup Issues**: See `QUICKSTART.md`
2. **Deployment Issues**: See `DEPLOYMENT.md`
3. **Understanding Code**: See `APP_GUIDE.md`
4. **Technical Details**: See `README.md`
5. **Quick Overview**: See `PROJECT_SUMMARY.md`

---

**You're all set!** Pick a guide above and start exploring. Good luck! 🚀
