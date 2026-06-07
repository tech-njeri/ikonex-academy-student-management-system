'use client'

import { useEffect, useState } from 'react'

export default function StreamsPage() {
  const [streams, setStreams] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingStream, setEditingStream] = useState(null)
  const [toast, setToast] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [successId, setSuccessId] = useState(null)
  const [buttonPop, setButtonPop] = useState(false)

  useEffect(() => {
    fetchStreams()
  }, [])

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  function triggerButtonPop() {
    setButtonPop(true)
    setTimeout(() => setButtonPop(false), 200)
  }

  async function fetchStreams() {
    try {
      const res = await fetch('/api/streams')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setStreams(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setStreams([])
    }
  }

  async function createStream() {
    if (!name) return
    triggerButtonPop()
    setLoading(true)
    try {
      const res = await fetch('/api/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })
      if (!res.ok) throw new Error('Failed to create')
      const newStream = await res.json()
      setName('')
      await fetchStreams()
      setSuccessId(newStream.id)
      setTimeout(() => setSuccessId(null), 1000)
      showToast(`Stream "${name}" created successfully`)
    } catch {
      showToast('Failed to create stream', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function updateStream() {
    if (!name) return
    triggerButtonPop()
    setLoading(true)
    try {
      const res = await fetch('/api/streams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingStream.id, name })
      })
      if (!res.ok) throw new Error('Failed to update')
      showToast(`Stream updated to "${name}"`)
      setName('')
      setEditingStream(null)
      await fetchStreams()
    } catch {
      showToast('Failed to update stream', 'error')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(stream) {
    setEditingStream(stream)
    setName(stream.name)
  }

  function cancelEdit() {
    setEditingStream(null)
    setName('')
  }

  async function deleteStream(id, streamName) {
    setDeletingId(id)
    try {
      const res = await fetch('/api/streams', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!res.ok) throw new Error('Failed to delete')
      showToast(`Stream "${streamName}" deleted`)
      await fetchStreams()
    } catch {
      showToast('Failed to delete stream', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto', fontFamily: 'inherit' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          background: toast.type === 'error' ? '#e2534a' : '#4caf82',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 500,
          zIndex: 999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.25s ease',
        }}>
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.95); }
        }
        .stream-item {
          animation: popIn 0.2s ease;
        }
        .deleting {
          animation: fadeOut 0.3s ease forwards;
        }
        .success-flash {
          border-color: #4caf82 !important;
          box-shadow: 0 0 0 2px #4caf8244;
          transition: all 0.3s ease;
        }
      `}</style>

      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
        Class Streams
      </h1>

      {/* Form */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="e.g. Form 1A"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (editingStream ? updateStream() : createStream())}
          style={{
            flex: 1,
            background: '#0f0f1a',
            border: '1px solid #1e1e30',
            borderRadius: '8px',
            padding: '10px 16px',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#7c5cfc'}
          onBlur={e => e.target.style.borderColor = '#1e1e30'}
        />
        <button
          onClick={editingStream ? updateStream : createStream}
          disabled={loading}
          style={{
            background: '#7c5cfc',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transform: buttonPop ? 'scale(0.95)' : 'scale(1)',
            transition: 'transform 0.15s, opacity 0.2s',
          }}
        >
          {loading ? 'Saving...' : editingStream ? 'Update' : 'Create Stream'}
        </button>
        {editingStream && (
          <button
            onClick={cancelEdit}
            style={{
              background: 'transparent',
              color: '#7a7a9a',
              border: '1px solid #1e1e30',
              borderRadius: '8px',
              padding: '10px 16px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Streams List */}
      {streams.length === 0 ? (
        <p style={{ color: '#5a5a7a', fontSize: '14px' }}>No streams yet. Create one above.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {streams.map((stream) => (
            <li
              key={stream.id}
              className={`stream-item ${deletingId === stream.id ? 'deleting' : ''} ${successId === stream.id ? 'success-flash' : ''}`}
              style={{
                background: '#0f0f1a',
                border: '1px solid #1e1e30',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'border-color 0.3s',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '15px' }}>{stream.name}</div>
                <div style={{ fontSize: '12px', color: '#5a5a7a', marginTop: '2px' }}>
                  {stream.students.length} student(s)
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  onClick={() => startEdit(stream)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#7c5cfc',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#7c5cfc18'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteStream(stream.id, stream.name)}
                  disabled={deletingId === stream.id}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#e2534a',
                    fontSize: '13px',
                    cursor: deletingId === stream.id ? 'not-allowed' : 'pointer',
                    fontWeight: 500,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    transition: 'background 0.15s',
                    opacity: deletingId === stream.id ? 0.5 : 1,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e2534a18'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {deletingId === stream.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}