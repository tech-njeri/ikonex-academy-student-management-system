// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

'use client'

import { useEffect, useState } from 'react'

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [toast, setToast] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [successId, setSuccessId] = useState(null)
  const [buttonPop, setButtonPop] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    fetchSubjects()
  }, [])

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  function triggerButtonPop() {
    setButtonPop(true)
    setTimeout(() => setButtonPop(false), 200)
  }

  async function fetchSubjects() {
    try {
      const res = await fetch('/api/subjects')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSubjects(Array.isArray(data) ? data : [])
    } catch {
      setSubjects([])
    }
  }

  async function createSubject() {
    if (!name.trim()) {
      setFormError('Subject name is required.')
      return
    }
    setFormError(null)
    triggerButtonPop()
    setLoading(true)
    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      })
      if (!res.ok) throw new Error()
      const newSubject = await res.json()
      setName('')
      await fetchSubjects()
      setSuccessId(newSubject.id)
      setTimeout(() => setSuccessId(null), 1000)
      showToast(`"${name.trim()}" added successfully`)
    } catch {
      showToast('Failed to add subject', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function updateSubject() {
    if (!name.trim()) {
      setFormError('Subject name is required.')
      return
    }
    setFormError(null)
    triggerButtonPop()
    setLoading(true)
    try {
      const res = await fetch('/api/subjects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingSubject.id, name: name.trim() })
      })
      if (!res.ok) throw new Error()
      showToast(`Subject updated to "${name.trim()}"`)
      setName('')
      setEditingSubject(null)
      await fetchSubjects()
    } catch {
      showToast('Failed to update subject', 'error')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(subject) {
    setEditingSubject(subject)
    setName(subject.name)
    setFormError(null)
  }

  function cancelEdit() {
    setEditingSubject(null)
    setName('')
    setFormError(null)
  }

  async function deleteSubject(id, subjectName) {
    setDeletingId(id)
    try {
      const res = await fetch('/api/subjects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!res.ok) throw new Error()
      showToast(`"${subjectName}" deleted`)
      await fetchSubjects()
    } catch {
      showToast('Failed to delete subject', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>

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
        .subject-item { animation: popIn 0.2s ease; }
        .deleting { animation: fadeOut 0.3s ease forwards; }
        .success-flash {
          border-color: #4caf82 !important;
          box-shadow: 0 0 0 2px #4caf8244;
        }
        .action-btn {
          background: transparent;
          border: none;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: background 0.15s;
        }
      `}</style>

      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
        Subjects
      </h1>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="e.g. Mathematics"
            value={name}
            onChange={(e) => { setName(e.target.value); setFormError(null) }}
            onKeyDown={(e) => e.key === 'Enter' && (editingSubject ? updateSubject() : createSubject())}
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
            onClick={editingSubject ? updateSubject : createSubject}
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
            {loading ? 'Saving...' : editingSubject ? 'Update' : 'Add Subject'}
          </button>
          {editingSubject && (
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

        {formError && (
          <p style={{ color: '#e2534a', fontSize: '13px', margin: 0 }}>{formError}</p>
        )}
      </div>

      {/* Subjects List */}
      {subjects.length === 0 ? (
        <p style={{ color: '#5a5a7a', fontSize: '14px' }}>No subjects yet. Add one above.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {subjects.map((subject) => (
            <li
              key={subject.id}
              className={`subject-item ${deletingId === subject.id ? 'deleting' : ''} ${successId === subject.id ? 'success-flash' : ''}`}
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
              <span style={{ fontWeight: 600, color: '#fff', fontSize: '15px' }}>
                {subject.name}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="action-btn"
                  onClick={() => startEdit(subject)}
                  style={{ color: '#7c5cfc' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#7c5cfc18'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Edit
                </button>
                <button
                  className="action-btn"
                  onClick={() => deleteSubject(subject.id, subject.name)}
                  disabled={deletingId === subject.id}
                  style={{
                    color: '#e2534a',
                    opacity: deletingId === subject.id ? 0.5 : 1,
                    cursor: deletingId === subject.id ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e2534a18'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {deletingId === subject.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}