import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GV - Marketplace',
  description: 'Global Venue Marketplace Platform',
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
