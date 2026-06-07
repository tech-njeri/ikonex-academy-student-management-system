'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/streams',         label: 'Streams' },
  { href: '/students',        label: 'Students' },
  { href: '/subjects',        label: 'Subjects' },
  { href: '/stream-subjects', label: 'Assign Subjects' },
  { href: '/scores',          label: 'Scores' },
  { href: '/results',         label: 'Results' },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {navLinks.map(({ href, label }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: isActive ? '#fff' : '#7a7a9a',
              padding: '0 0.85rem',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              borderBottom: isActive ? '2px solid #7c5cfc' : '2px solid transparent',
              flexShrink: 0,
              letterSpacing: '0.02em',
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}