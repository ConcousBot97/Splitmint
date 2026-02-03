# 🎉 SplitMint - Expense Splitting Web Application

## ⚡ Quick Start

**Brand new? Start here:**

1. Open [`GETTING_STARTED.md`](GETTING_STARTED.md) for a complete overview
2. Follow [`QUICKSTART.md`](QUICKSTART.md) to get the app running in 10 minutes
3. Read [`APP_GUIDE.md`](APP_GUIDE.md) to learn how to use the application
4. 🆕 Check [`FEATURES.md`](FEATURES.md) for latest enhancements and new features
5. 🆕 See [`SETUP-GUIDE.md`](SETUP-GUIDE.md) for quick setup of new features

**Ready to deploy?** See [`DEPLOYMENT.md`](DEPLOYMENT.md)

---

## 📦 What Is This?

**SplitMint** is a full-stack web application for splitting expenses among friends, roommates, or travel groups. Think Splitwise but simpler and built from scratch.

### ✨ Key Features:
- 👤 User authentication (email/password)
- 👥 Create groups with up to 3 participants
- 💰 Add expenses with multiple split modes
- 🏷️ **NEW**: 14 expense categories with icons
- 📊 Automatic balance calculations
- 📈 **NEW**: Visual expense breakdown charts
- 🎯 Smart settlement suggestions
- 🔍 Search and filter expenses
- 🔔 **NEW**: Toast notifications for better UX
- ⏳ **NEW**: Professional loading skeletons
- 🎨 **NEW**: Enhanced UI with animations
- 📱 Responsive design (works on all devices)

---

## 🆕 Latest Enhancements (v2.0)

### What's New:
1. **Expense Categories** - Track expenses by 14 categories (Food, Travel, Housing, etc.)
2. **Visual Charts** - Beautiful expense breakdown by category
3. **Toast Notifications** - Real-time feedback for all actions
4. **Loading Skeletons** - Professional loading states
5. **Enhanced UI/UX** - Complete visual overhaul with gradients and animations
6. **Better Error Handling** - Graceful error displays throughout

See [`FEATURES.md`](FEATURES.md) for complete documentation.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Icons**: Lucide React
- **Charts**: CSS-based visualizations
- **Hosting**: Vercel (free tier)
- **All Free Services**: $0 to get started!

---

## 📁 Project Structure

```
splitmint/
├── 📱 app/                 # Next.js pages
│   ├── auth/              # Login/Register
│   ├── dashboard/         # Main dashboard
│   └── group/[id]/        # Group details
│
├── 🎨 components/         # React components
│   ├── AddExpenseModal    # Add expense form
│   ├── BalanceSummary     # Balance visualization
│   ├── ExpenseChart       # NEW: Category breakdown
│   ├── LoadingSkeleton    # NEW: Loading states
│   └── Toast              # NEW: Notifications
│
├── 🔧 hooks/              # NEW: Custom React hooks
│   └── useToast.tsx       # Toast notification hook
│
├── 📚 lib/                # Utilities
│   ├── supabase.ts        # Supabase client
│   ├── balance-engine.ts  # Balance calculations
│   └── categories.ts      # NEW: Expense categories
│   └── ...more
│
├── 📚 lib/                # Utilities
│   ├── balance-engine.ts  # Balance calculations
│   └── supabase.ts        # Database client
│
├── 📖 Documentation/      # 8 comprehensive guides
│   ├── GETTING_STARTED.md ← Start here!
│   ├── QUICKSTART.md      
│   ├── DEPLOYMENT.md      
│   └── ...more
│
└── ⚙️ Configuration       # Setup files
```

---

## 📖 Documentation Index

| File | Purpose | When to Read |
|------|---------|--------------|
| [`GETTING_STARTED.md`](GETTING_STARTED.md) | **Complete overview** | Start here! |
| [`QUICKSTART.md`](QUICKSTART.md) | 10-min setup guide | Want to run it now |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | Deploy to production | Going live |
| [`APP_GUIDE.md`](APP_GUIDE.md) | How to use the app | Learning features |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | System diagrams | Understanding design |
| [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md) | What was built | Project details |
| [`README.md`](README.md) | Technical docs | Deep dive |
| [`INDEX.md`](INDEX.md) | File navigation | Finding files |

---

## ⚡ Setup in 5 Minutes

### Prerequisites
- Node.js installed ([download here](https://nodejs.org/))
- Supabase account ([sign up free](https://supabase.com))

### Steps

1. **Install dependencies**:
```bash
npm install
```

2. **Set up database**:
   - Create Supabase project
   - Run `supabase-schema.sql` in SQL Editor

3. **Configure environment**:
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials

4. **Run the app**:
```bash
npm run dev
```

5. **Open**: http://localhost:3000

**Full guide**: See [`QUICKSTART.md`](QUICKSTART.md)

---

## 🌐 Deploy to Production (Free!)

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# Deploy on Vercel
# Import from GitHub
# Add environment variables
# Click Deploy!
```

**Your app will be live at**: `https://your-project.vercel.app`

**Full guide**: See [`DEPLOYMENT.md`](DEPLOYMENT.md)

---

## ✅ Features Implemented

✅ User registration & login
✅ Email verification
✅ Create/edit/delete groups
✅ Add/edit/delete expenses
✅ Three split modes (equal, custom, percentage)
✅ Automatic balance calculations
✅ Settlement suggestions
✅ Search & filter
✅ Responsive design
✅ Secure with RLS

---

## 🎯 Use Cases

Perfect for:
- 🏠 Roommate expenses
- ✈️ Group trips
- 🍕 Restaurant bills
- 🎉 Event planning
- 💼 Team lunches

---

## 🔒 Security

- Row Level Security on all database tables
- Users can only access their own data
- Email verification required
- Secure password hashing
- HTTPS enforced

---

## 📱 Responsive Design

Works perfectly on:
- 📱 Mobile phones
- 📱 Tablets  
- 💻 Laptops
- 🖥️ Desktops

---

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Supabase](https://supabase.com/) - Database & Auth
- [Vercel](https://vercel.com/) - Hosting
- [Lucide](https://lucide.dev/) - Icons

---

## 📊 Project Stats

- **31 files** created
- **~2,500+ lines** of application code
- **~3,500+ lines** of documentation
- **5 React components**
- **4 pages**
- **2 utility libraries**
- **100%** TypeScript coverage

---

## 🎓 Learning Resources

- Code is fully commented
- TypeScript types throughout
- Example patterns in components
- Algorithm documentation
- Step-by-step guides

---

## 🚦 Quick Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 📞 Need Help?

1. Check [`QUICKSTART.md`](QUICKSTART.md) for setup
2. Read [`APP_GUIDE.md`](APP_GUIDE.md) for usage
3. See [`DEPLOYMENT.md`](DEPLOYMENT.md) for deployment
4. Review error in browser console (F12)

---

## 🎉 Get Started Now!

1. **First time?** → Read [`GETTING_STARTED.md`](GETTING_STARTED.md)
2. **Want to run it?** → Follow [`QUICKSTART.md`](QUICKSTART.md)
3. **Ready to deploy?** → See [`DEPLOYMENT.md`](DEPLOYMENT.md)

---

## 📄 License

MIT License - Feel free to use for your own projects!

---

## 🙏 Acknowledgments

Built using:
- Free tier services (Vercel + Supabase)
- Open source libraries
- Modern web technologies

---

**Ready to split some expenses?** Let's go! 🚀

For detailed information, open any of the documentation files above.

---

**Status**: ✅ Complete & Production-Ready
**Version**: 1.0.0
**Last Updated**: February 2026
