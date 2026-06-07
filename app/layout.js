import { Poppins } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import NavLinks from './components/NavLinks'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata = {
  title: 'Ikonex Academy',
  description: 'Student Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body style={{ margin: 0, background: '#0a0a0f', minHeight: '100vh', fontFamily: 'var(--font-poppins), sans-serif' }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          height: '56px',
          background: '#0f0f1a',
          borderBottom: '1px solid #1e1e30',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          overflowX: 'auto',
        }}>
          <Link href="/" style={{
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#fff',
            textTransform: 'uppercase',
            marginRight: '2rem',
            flexShrink: 0,
            textDecoration: 'none',
          }}>
            Ikonex<span style={{ color: '#7c5cfc' }}>.</span>
          </Link>
          <NavLinks />
        </nav>
        <main style={{ color: '#e8e6f0' }}>
          {children}
        </main>
      </body>
    </html>
  )
}