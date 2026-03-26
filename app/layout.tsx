import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthWrapper from './components/AuthWrapper'
import ToastProvider from './components/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://markzy.ai'),
  title: 'Markzy - AI-Powered Marketing Tools',
  description: 'Transform your marketing with AI-powered tools that generate high-converting content and boost your business growth.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>
      <body className={`${inter.className} m-0 p-0 min-h-screen w-full overflow-x-hidden`}>
        <AuthWrapper>
          {children}
        </AuthWrapper>
        <ToastProvider />
      </body>
    </html>
  )
}
