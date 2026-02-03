import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SplitMint - Expense Splitting Made Easy',
  description: 'Split expenses fairly with your friends and family',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
