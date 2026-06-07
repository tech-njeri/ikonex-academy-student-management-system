import QuickActions from './components/QuickActions'

export default function Home() {
  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          color: '#fff',
          margin: '0 0 8px',
          letterSpacing: '-0.01em',
        }}>
          Welcome to Ikonex Academy
        </h1>
        <p style={{ fontSize: '15px', color: '#5a5a7a', margin: 0 }}>
          Student Management System — select an action to get started.
        </p>
      </div>
      <QuickActions />
    </div>
  )
}