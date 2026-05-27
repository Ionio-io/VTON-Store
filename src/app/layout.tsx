import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ionio — Fashion That Fits You',
  description: 'Discover fashion personalised to your body type and skin tone.',
  icons: {
    icon: '/ionio-logo.png',
    apple: '/ionio-logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
