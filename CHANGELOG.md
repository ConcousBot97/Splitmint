# 📝 Changelog

All notable changes to SplitMint will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [2.0.0] - 2026-02-03

### 🎉 Major Release - Feature-Rich Update

### ✨ Added
- **Expense Categories System**
  - 14 predefined categories with unique icons and colors
  - Category selection in expense creation form
  - Visual category indicators on expense cards
  - Categories: Food, Groceries, Transportation, Housing, Travel, Entertainment, Health, Shopping, Utilities, Internet, Education, Medical, Gifts, Other

- **Visual Analytics**
  - Expense breakdown chart by category
  - Top 5 categories display with progress bars
  - Color-coded category visualization
  - Percentage and amount breakdown
  - Smooth animations on load

- **Toast Notification System**
  - Success notifications (green)
  - Error alerts (red)
  - Info messages (blue)
  - Warning notifications (yellow)
  - Auto-dismiss with customizable duration
  - Non-intrusive top-right placement
  - Close button for manual dismissal
  - `useToast` custom hook for easy integration

- **Loading Skeletons**
  - Professional loading states throughout app
  - Skeleton screens matching actual layout
  - Pulse animations
  - Better perceived performance

- **Enhanced Components**
  - New `ExpenseChart` component
  - New `Toast` component
  - New `LoadingSkeleton` component
  - New `useToast` custom hook
  - Updated category library (`lib/categories.ts`)

### 🎨 Enhanced
- **Complete UI/UX Overhaul**
  - Modern gradient backgrounds
  - Smooth hover effects and transitions
  - Backdrop blur effects on modals and headers
  - Enhanced shadow system (soft, medium, glow)
  - Improved spacing and typography
  - Consistent color scheme across app
  - Staggered animations for lists

- **Design System**
  - New color palette: Primary (Blue), Accent (Purple), Success (Green), Danger (Red)
  - 5 custom animations: fade-in, slide-up, slide-down, scale-in, shimmer
  - Utility classes: btn-primary, btn-secondary, card, input-field, gradient-bg
  - Consistent component styling

- **Auth Page**
  - Gradient background with backdrop blur
  - Animated icon containers
  - Icon-prefixed input fields
  - Enhanced error messages with icons
  - Better loading states

- **Dashboard**
  - Sticky header with backdrop blur
  - Staggered card animations
  - Improved empty state with large icon
  - Welcome message with emoji
  - Professional loading skeleton

- **Group Detail Page**
  - Animated summary cards with gradient text
  - Improved balance cards with hover effects
  - Enhanced search/filter inputs with icons
  - Better visual hierarchy
  - Expense chart integration

- **Modals**
  - Backdrop blur overlays
  - Scale-in animations
  - Better form field styling
  - Enhanced loading states with spinners
  - Improved button states

- **Expense Cards**
  - Category icon display
  - Larger, more prominent design
  - Better split mode badges
  - Improved date and payer display
  - Animated delete button on hover

- **Balance Components**
  - Larger avatar circles with shadows
  - Color-coded balance badges
  - Animated settlement flows with pulse effect
  - Better empty states

### 🗄️ Database
- **Schema Updates**
  - Added `category` column to `expenses` table (TEXT, default: 'other')
  - Added `notes` column to `expenses` table (TEXT, nullable)
  - Added index on `category` column for performance
  - Migration file for existing databases

### 🐛 Fixed
- Proper loading states throughout application
- Better error handling and user feedback
- Form validation improvements
- Responsive design issues on mobile
- Animation timing and delays
- TypeScript type safety improvements

### 🔧 Technical
- Custom React hooks for shared functionality
- Better code organization with new lib files
- Improved component reusability
- Performance optimizations (animations, rendering)
- Database query optimizations with indexes

### 📚 Documentation
- Added `FEATURES.md` - Complete feature documentation
- Added `SETUP-GUIDE.md` - Quick setup guide for new features
- Updated `START_HERE.md` - Reflects all new features
- Added `CHANGELOG.md` - This file
- Added `migration-add-categories.sql` - Database migration script

---

## [1.0.0] - 2026-02-01

### 🎉 Initial Release

### ✨ Added
- User authentication (email/password)
- Create and manage expense groups
- Add participants to groups (up to 3)
- Add expenses with multiple split modes:
  - Equal split
  - Custom amounts
  - Percentage-based
- Automatic balance calculations
- Settlement suggestions
- Search and filter expenses
- Responsive design
- Row-level security (RLS)

### 🎨 UI Features
- Clean, modern design
- Mobile-responsive layout
- Intuitive navigation
- Basic animations

### 🗄️ Database
- Users (via Supabase Auth)
- Groups table
- Participants table
- Expenses table
- Expense splits table
- Full RLS policies

### 📚 Documentation
- Complete setup guide
- Deployment instructions
- Database schema
- API documentation
- User guide

---

## Semantic Versioning

This project adheres to [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

---

## Upgrade Guide

### From v1.0.0 to v2.0.0

1. **Install new dependencies** (if any new packages were added):
   ```bash
   npm install
   ```

2. **Update database schema**:
   - Run `migration-add-categories.sql` in Supabase SQL Editor
   - This adds `category` and `notes` columns to expenses

3. **Update environment variables** (if needed):
   - No new environment variables required

4. **Test new features**:
   - Clear browser cache
   - Test expense categories
   - Test toast notifications
   - Test loading states

5. **Deploy**:
   - Push to your git repository
   - Vercel will auto-deploy
   - Or run `npm run build` for local build

### Breaking Changes
- None! This is a backwards-compatible update
- Existing expenses will default to "Other" category
- All previous functionality remains unchanged

---

## Future Roadmap

### v2.1.0 (Planned)
- Dark mode toggle
- Edit expense functionality
- Expense notes/comments
- Group settings page
- User profile page

### v2.2.0 (Planned)
- Export to CSV/PDF
- Receipt image uploads
- Email notifications
- Group invitations via email

### v3.0.0 (Planned)
- Multi-currency support
- Recurring expenses
- Settlement history
- Advanced analytics
- Mobile app (React Native)

---

## Support

For issues, questions, or suggestions:
- Check documentation in `docs/` folder
- Review `FEATURES.md` for feature details
- See `SETUP-GUIDE.md` for setup help

---

**Happy Expense Tracking! 🎉**
