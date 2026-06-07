// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

'use client'

import { useEffect, useState } from 'react'

export default function StreamSubjectsPage() {
  const [streams, setStreams] = useState([])
  const [subjects, setSubjects] = useState([])
  const [assignments, setAssignments] = useState([])
  const [selectedStream, setSelectedStream] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [successId, setSuccessId] = useState(null)
  const [buttonPop, setButtonPop] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    fetchStreams()
    fetchSubjects()
  }, [])

  useEffect(() => {
    if (selectedStream) {
      fetchAssignments()
      setFormError(null)
    }
  }, [selectedStream])

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
      if (!res.ok) throw new Error()
      const data = await res.json()
      setStreams(Array.isArray(data) ? data : [])
    } catch { setStreams([]) }
  }

  async function fetchSubjects() {
    try {
      const res = await fetch('/api/subjects')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSubjects(Array.isArray(data) ? data : [])
    } catch { setSubjects([]) }
  }

  async function fetchAssignments() {
    try {
      const res = await fetch(`/api/stream-subjects?streamId=${selectedStream}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setAssignments(Array.isArray(data) ? data : [])
    } catch { setAssignments([]) }
  }

  async function assignSubject() {
    if (!selectedStream || !selectedSubject) {
      setFormError('Please select both a stream and a subject.')
      return
    }
    setFormError(null)
    triggerButtonPop()
    setLoading(true)
    try {
      const res = await fetch('/api/stream-subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamId: parseInt(selectedStream),
          subjectId: parseInt(selectedSubject)
        })
      })
      if (!res.ok) throw new Error()
      const newAssignment = await res.json()
      setSelectedSubject('')
      await fetchAssignments()
      setSuccessId(newAssignment.id)
      setTimeout(() => setSuccessId(null), 1000)
      showToast('Subject assigned successfully')
    } catch {
      showToast('Failed to assign subject', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function removeAssignment(id, subjectName) {
    setDeletingId(id)
    try {
      const res = await fetch('/api/stream-subjects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!res.ok) throw new Error()
      showToast(`"${subjectName}" removed`)
      await fetchAssignments()
    } catch {
      showToast('Failed to remove assignment', 'error')
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
        .assignment-item { animation: popIn 0.2s ease; }
        .deleting { animation: fadeOut 0.3s ease forwards; }
        .success-flash {
          border-color: #4caf82 !important;
          box-shadow: 0 0 0 2px #4caf8244;
        }
        .form-select {
          background: #0f0f1a;
          border: 1px solid #1e1e30;
          border-radius: 8px;
          padding: 10px 16px;
          color: #fff;
          font-size: 14px;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .form-select:focus { border-color: #7c5cfc; }
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
        Assign Subjects to Streams
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {/* Stream selector */}
        <select
          className="form-select"
          value={selectedStream}
          onChange={(e) => {
            setSelectedStream(e.target.value)
            setSelectedSubject('')
            setFormError(null)
          }}
        >
          <option value="">Select a Stream</option>
          {streams.map((stream) => (
            <option key={stream.id} value={stream.id}>{stream.name}</option>
          ))}
        </select>

        {/* Subject selector + assign button */}
        {selectedStream && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <select
                className="form-select"
                style={{ flex: 1, width: 'auto' }}
                value={selectedSubject}
                onChange={(e) => { setSelectedSubject(e.target.value); setFormError(null) }}
              >
                <option value="">Select a Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
              <button
                onClick={assignSubject}
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
                  flexShrink: 0,
                }}
              >
                {loading ? 'Assigning...' : 'Assign'}
              </button>
            </div>

            {formError && (
              <p style={{ color: '#e2534a', fontSize: '13px', margin: 0 }}>{formError}</p>
            )}
          </div>
        )}
      </div>

      {/* Assignments List */}
      {selectedStream && (
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Assigned Subjects
          </h2>
          {assignments.length === 0 ? (
            <p style={{ color: '#5a5a7a', fontSize: '14px' }}>No subjects assigned yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {assignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className={`assignment-item ${deletingId === assignment.id ? 'deleting' : ''} ${successId === assignment.id ? 'success-flash' : ''}`}
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
                    {assignment.subject?.name ?? 'Unknown'}
                  </span>
                  <button
                    className="action-btn"
                    onClick={() => removeAssignment(assignment.id, assignment.subject?.name)}
                    disabled={deletingId === assignment.id}
                    style={{
                      color: '#e2534a',
                      opacity: deletingId === assignment.id ? 0.5 : 1,
                      cursor: deletingId === assignment.id ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e2534a18'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {deletingId === assignment.id ? 'Removing...' : 'Remove'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}