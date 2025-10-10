import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Advanced Analytics Dashboard',
  description: 'Comprehensive interactive admin dashboard with advanced analytics',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}