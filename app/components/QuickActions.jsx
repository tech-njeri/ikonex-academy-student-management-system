'use client'

import Link from 'next/link'
import { useState } from 'react'

const quickActions = [
  { href: '/streams',         label: 'Manage Streams',    desc: 'Create and manage class streams',       icon: '⊞' },
  { href: '/students',        label: 'Students',          desc: 'Register and manage students',          icon: '👤' },
  { href: '/subjects',        label: 'Subjects',          desc: 'Add and manage subjects',               icon: '📚' },
  { href: '/stream-subjects', label: 'Assign Subjects',   desc: 'Link subjects to streams',              icon: '🔗' },
  { href: '/scores',          label: 'Record Scores',     desc: 'Enter exam and CAT scores',             icon: '✏️' },
  { href: '/results',         label: 'View Results',      desc: 'See rankings, grades and report cards', icon: '📊' },
]

function ActionCard({ href, label, desc, icon }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#0f0f1a',
        border: `1px solid ${hovered ? '#7c5cfc55' : '#1e1e30'}`,
        borderRadius: '12px',
        padding: '1.5rem',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'border-color 0.2s, transform 0.15s',
      }}
    >
      <div style={{ fontSize: '24px' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontSize: '13px', color: '#5a5a7a', lineHeight: 1.5 }}>
          {desc}
        </div>
      </div>
    </Link>
  )
}

export default function QuickActions() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1rem',
    }}>
      {quickActions.map((action) => (
        <ActionCard key={action.href} {...action} />
      ))}
    </div>
  )
}