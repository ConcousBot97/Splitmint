# SplitMint - Expense Splitting Application

**Your Gateway to Fair Expenses**

SplitMint is a comprehensive expense-splitting web application that helps you track shared expenses with friends, roommates, or travel groups. Split bills fairly and keep track of who owes what!

## 🚀 Features

### ✅ Implemented Features

1. **Authentication**
   - User registration and login
   - Secure authentication with Supabase
   - Email-based account management

2. **Groups Management**
   - Create groups with up to 3 participants + primary user
   - Edit group names
   - Delete groups with cascade handling
   - View group-level statistics and summaries

3. **Participants**
   - Add participants to groups
   - Color-coded avatars for easy identification
   - Manage participant details

4. **Expenses**
   - Add expenses with description, amount, date, and payer
   - Multiple split modes:
     - **Equal Split**: Automatically divides equally
     - **Custom Amount**: Specify exact amounts for each participant
     - **Percentage**: Split by percentage
   - Edit and delete expenses
   - Automatic balance recalculation
   - Consistent rounding for uneven splits

5. **Balance Engine**
   - Real-time balance calculation
   - Net balance per participant
   - Minimal settlement suggestions using greedy algorithm
   - Directional owed amounts

6. **Visualizations**
   - Summary cards showing:
     - Total spent
     - Amount you are owed
     - Amount you owe
   - Color-coded balance table
   - Settlement suggestions with visual flow
   - Transaction history

7. **Search & Filters**
   - Search expenses by description
   - Filter by participant
   - Clean, intuitive interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (React) with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier available)

## 🔧 Setup Instructions

### 1. Install Node.js

Download and install Node.js from [nodejs.org](https://nodejs.org/)

### 2. Install Dependencies

```bash
cd splitmint
npm install
```

### 3. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > API
4. Copy your project URL and anon key

### 4. Run Database Schema

1. In Supabase dashboard, go to SQL Editor
2. Copy the contents of `supabase-schema.sql`
3. Run the SQL to create all tables and policies

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

Your app will be live at `https://your-project.vercel.app`

## 📖 Usage Guide

### Getting Started

1. **Register**: Create an account with your email
2. **Create a Group**: Click "Create New Group"
   - Enter a group name (e.g., "Weekend Trip")
   - Add up to 3 participants
3. **Add Expenses**: Click "Add Expense"
   - Enter description (e.g., "Dinner at restaurant")
   - Enter amount
   - Select who paid
   - Choose split mode (equal, custom, or percentage)
   - Select participants to split between
4. **View Balances**: See who owes what and get settlement suggestions

### Split Modes Explained

- **Equal Split**: Amount divided equally among selected participants
- **Custom Amount**: Manually enter exact amount for each participant
- **Percentage**: Specify percentage for each participant (must total 100%)

## 🏗️ Project Structure

```
splitmint/
├── app/
│   ├── auth/              # Authentication page
│   ├── dashboard/         # Main dashboard
│   ├── group/[id]/        # Group detail page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (redirects to auth)
│   └── globals.css        # Global styles
├── components/
│   ├── AddExpenseModal.tsx      # Add expense form
│   ├── BalanceSummary.tsx       # Balance visualization
│   ├── CreateGroupModal.tsx     # Create group form
│   ├── ExpenseList.tsx          # Expense list component
│   └── GroupCard.tsx            # Group card component
├── lib/
│   ├── balance-engine.ts  # Balance calculation logic
│   └── supabase.ts        # Supabase client
├── supabase-schema.sql    # Database schema
└── package.json           # Dependencies
```

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Authentication required for all operations
- Secure password handling via Supabase Auth

## 🎨 Design Features

- Responsive design (mobile, tablet, desktop)
- Clean, modern UI with Tailwind CSS
- Color-coded participants for easy tracking
- Intuitive navigation and interactions
- Real-time balance updates

## 📝 Database Schema

The application uses PostgreSQL with the following main tables:

- **profiles**: User profiles
- **groups**: Expense groups
- **participants**: Group participants
- **expenses**: Expense records
- **expense_splits**: How expenses are split

See `supabase-schema.sql` for complete schema with indexes and RLS policies.

## 🤝 Contributing

This is a demo application built for evaluation purposes. Feel free to fork and customize!

## 📄 License

MIT License - feel free to use this code for your own projects.

## 🐛 Known Limitations

- Maximum 3 participants per group (can be easily increased in the code)
- No mobile app (web-only)
- No real-time collaboration (would require WebSocket implementation)
- No expense categories/tags
- No recurring expenses
- No file attachments for receipts

## 🚀 Future Enhancements

Potential features to add:

- AI-powered expense categorization (MintSense)
- Natural language expense input
- Export to CSV/PDF
- Multi-currency support
- Recurring expenses
- Receipt photo uploads
- Email notifications
- Mobile app (React Native)
- Group invitations via email
- Split by shares/ratios
- Expense categories and tags

## 📞 Support

For issues or questions, please check the code comments or create an issue in the repository.

---

Built with ❤️ using Next.js and Supabase
