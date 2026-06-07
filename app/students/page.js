'use client'

import { useEffect, useState } from 'react'

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [streams, setStreams] = useState([])
  const [name, setName] = useState('')
  const [admissionNo, setAdmissionNo] = useState('')
  const [streamId, setStreamId] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [toast, setToast] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [successId, setSuccessId] = useState(null)
  const [buttonPop, setButtonPop] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    fetchStudents()
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

  async function fetchStudents() {
    try {
      const res = await fetch('/api/students')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setStudents(Array.isArray(data) ? data : [])
    } catch {
      setStudents([])
    }
  }

  async function fetchStreams() {
    try {
      const res = await fetch('/api/streams')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setStreams(Array.isArray(data) ? data : [])
    } catch {
      setStreams([])
    }
  }

  async function createStudent() {
    if (!name || !admissionNo || !streamId) {
      setFormError('Please fill all fields.')
      return
    }
    setFormError(null)
    triggerButtonPop()
    setLoading(true)
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, admissionNo, streamId: parseInt(streamId) })
      })
      if (!res.ok) throw new Error()
      const newStudent = await res.json()
      setName('')
      setAdmissionNo('')
      setStreamId('')
      await fetchStudents()
      setSuccessId(newStudent.id)
      setTimeout(() => setSuccessId(null), 1000)
      showToast(`${name} registered successfully`)
    } catch {
      showToast('Failed to register student', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function updateStudent() {
    if (!name || !admissionNo || !streamId) {
      setFormError('Please fill all fields.')
      return
    }
    setFormError(null)
    triggerButtonPop()
    setLoading(true)
    try {
      const res = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingStudent.id, name, admissionNo, streamId: parseInt(streamId) })
      })
      if (!res.ok) throw new Error()
      showToast(`${name} updated successfully`)
      setName('')
      setAdmissionNo('')
      setStreamId('')
      setEditingStudent(null)
      await fetchStudents()
    } catch {
      showToast('Failed to update student', 'error')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(student) {
    setEditingStudent(student)
    setName(student.name)
    setAdmissionNo(student.admissionNo)
    setStreamId(student.streamId)
    setFormError(null)
  }

  function cancelEdit() {
    setEditingStudent(null)
    setName('')
    setAdmissionNo('')
    setStreamId('')
    setFormError(null)
  }

  async function deleteStudent(id, studentName) {
    setDeletingId(id)
    try {
      const res = await fetch('/api/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!res.ok) throw new Error()
      showToast(`${studentName} removed`)
      await fetchStudents()
    } catch {
      showToast('Failed to delete student', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '720px', margin: '0 auto' }}>

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
        .student-item { animation: popIn 0.2s ease; }
        .deleting { animation: fadeOut 0.3s ease forwards; }
        .success-flash {
          border-color: #4caf82 !important;
          box-shadow: 0 0 0 2px #4caf8244;
        }
        .form-input {
          width: 100%;
          background: #0f0f1a;
          border: 1px solid #1e1e30;
          border-radius: 8px;
          padding: 10px 16px;
          color: #fff;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #7c5cfc; }
        .form-select {
          width: 100%;
          background: #0f0f1a;
          border: 1px solid #1e1e30;
          border-radius: 8px;
          padding: 10px 16px;
          color: #fff;
          font-size: 14px;
          outline: none;
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
        Students
      </h1>

      {/* Form */}
      <div style={{
        background: '#0f0f1a',
        border: '1px solid #1e1e30',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0 }}>
          {editingStudent ? 'Edit Student' : 'Register New Student'}
        </h2>

        <input
          className="form-input"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => { setName(e.target.value); setFormError(null) }}
        />
        <input
          className="form-input"
          type="text"
          placeholder="Admission Number e.g. ADM001"
          value={admissionNo}
          onChange={(e) => { setAdmissionNo(e.target.value); setFormError(null) }}
        />
        <select
          className="form-select"
          value={streamId}
          onChange={(e) => { setStreamId(e.target.value); setFormError(null) }}
        >
          <option value="">Select Stream</option>
          {streams.map((stream) => (
            <option key={stream.id} value={stream.id}>{stream.name}</option>
          ))}
        </select>

        {formError && (
          <p style={{ color: '#e2534a', fontSize: '13px', margin: 0 }}>{formError}</p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={editingStudent ? updateStudent : createStudent}
            disabled={loading}
            style={{
              flex: 1,
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
            {loading ? 'Saving...' : editingStudent ? 'Update Student' : 'Register Student'}
          </button>
          {editingStudent && (
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
      </div>

      {/* Students List */}
      {students.length === 0 ? (
        <p style={{ color: '#5a5a7a', fontSize: '14px' }}>No students yet. Register one above.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {students.map((student) => (
            <li
              key={student.id}
              className={`student-item ${deletingId === student.id ? 'deleting' : ''} ${successId === student.id ? 'success-flash' : ''}`}
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
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '15px' }}>{student.name}</div>
                <div style={{ fontSize: '12px', color: '#5a5a7a', marginTop: '2px' }}>
                  {student.admissionNo} — {student.stream?.name ?? 'No stream'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="action-btn"
                  onClick={() => startEdit(student)}
                  style={{ color: '#7c5cfc' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#7c5cfc18'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Edit
                </button>
                <button
                  className="action-btn"
                  onClick={() => deleteStudent(student.id, student.name)}
                  disabled={deletingId === student.id}
                  style={{
                    color: '#e2534a',
                    opacity: deletingId === student.id ? 0.5 : 1,
                    cursor: deletingId === student.id ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e2534a18'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {deletingId === student.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}