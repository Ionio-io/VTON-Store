import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Westside — Fashion That Fits You',
  description: 'Discover fashion personalized to your body type and skin tone with AI-powered try-on.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
