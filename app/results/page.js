// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

'use client'

import { useEffect, useState } from 'react'

export default function ResultsPage() {
  const [streams, setStreams] = useState([])
  const [selectedStream, setSelectedStream] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [buttonPop, setButtonPop] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

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
      if (!res.ok) throw new Error()
      const data = await res.json()
      setStreams(Array.isArray(data) ? data : [])
    } catch {
      setStreams([])
    }
  }

  async function fetchResults() {
    if (!selectedStream) return
    triggerButtonPop()
    setLoading(true)
    setResults([])
    setHasSearched(false)
    try {
      const res = await fetch(`/api/results?streamId=${selectedStream}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
      setHasSearched(true)
      if (data.length > 0) {
        showToast(`${data.length} result${data.length !== 1 ? 's' : ''} loaded`)
      }
    } catch {
      showToast('Failed to load results', 'error')
    } finally {
      setLoading(false)
    }
  }

  function getGradeColor(grade) {
    if (grade === 'A') return '#4caf82'
    if (grade === 'B') return '#7c5cfc'
    if (grade === 'C') return '#f59e0b'
    if (grade === 'D') return '#f97316'
    return '#e2534a'
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>

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
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .result-row {
          animation: popIn 0.2s ease both;
        }
        .result-row:hover td {
          background: #1a1a2e !important;
        }
        .form-select {
          background: #0f0f1a;
          border: 1px solid #1e1e30;
          border-radius: 8px;
          padding: 10px 16px;
          color: #fff;
          font-size: 14px;
          outline: none;
          flex: 1;
          transition: border-color 0.2s;
        }
        .form-select:focus { border-color: #7c5cfc; }
      `}</style>

      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
        Results
      </h1>

      {/* Stream selector */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <select
          className="form-select"
          value={selectedStream}
          onChange={(e) => {
            setSelectedStream(e.target.value)
            setResults([])
            setHasSearched(false)
          }}
        >
          <option value="">Select Stream</option>
          {streams.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <button
          onClick={fetchResults}
          disabled={loading || !selectedStream}
          style={{
            background: '#7c5cfc',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading || !selectedStream ? 'not-allowed' : 'pointer',
            opacity: loading || !selectedStream ? 0.6 : 1,
            transform: buttonPop ? 'scale(0.95)' : 'scale(1)',
            transition: 'transform 0.15s, opacity 0.2s',
            flexShrink: 0,
          }}
        >
          {loading ? 'Loading...' : 'View Results'}
        </button>
      </div>

      {/* Loading shimmer */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: '52px',
              background: 'linear-gradient(90deg, #0f0f1a 25%, #1a1a2e 50%, #0f0f1a 75%)',
              backgroundSize: '200% 100%',
              borderRadius: '8px',
              animation: `shimmer 1.2s ${i * 0.1}s infinite`,
            }} />
          ))}
          <style>{`
            @keyframes shimmer {
              0%   { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </div>
      )}

      {/* Results Table */}
      {!loading && results.length > 0 && (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #1e1e30' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f0f1a' }}>
                {['Position', 'Name', 'Adm No', 'Total', 'Average', 'Grade', 'Report'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#5a5a7a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    borderBottom: '1px solid #1e1e30',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((result, i) => (
                <tr
                  key={result.id}
                  className="result-row"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {[
                    <td key="pos" style={tdStyle}>
                      <span style={{
                        background: i === 0 ? '#f59e0b22' : i === 1 ? '#9ca3af22' : i === 2 ? '#cd7f3222' : 'transparent',
                        color: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#cd7f32' : '#7a7a9a',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        fontSize: '13px',
                      }}>
                        {result.position}
                      </span>
                    </td>,
                    <td key="name" style={{ ...tdStyle, fontWeight: 600, color: '#fff' }}>{result.name}</td>,
                    <td key="adm" style={tdStyle}>{result.admissionNo}</td>,
                    <td key="total" style={tdStyle}>{result.total}</td>,
                    <td key="avg" style={tdStyle}>{result.average}</td>,
                    <td key="grade" style={tdStyle}>
                      <span style={{
                        color: getGradeColor(result.grade),
                        fontWeight: 700,
                        fontSize: '15px',
                      }}>
                        {result.grade}
                      </span>
                    </td>,
                    <td key="report" style={tdStyle}>
                      
                      <a  href={`/reports/${result.id}`}
                        style={{
                          color: '#7c5cfc',
                          fontSize: '13px',
                          textDecoration: 'none',
                          fontWeight: 500,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid #7c5cfc44',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#7c5cfc18'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        View →
                      </a>
                    </td>
                  ]}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {!loading && hasSearched && results.length === 0 && (
        <p style={{ color: '#5a5a7a', fontSize: '14px' }}>
          No results found. Make sure students have scores recorded.
        </p>
      )}
    </div>
  )
}

const tdStyle = {
  padding: '14px 16px',
  fontSize: '14px',
  color: '#9a98b0',
  borderBottom: '1px solid #1e1e30',
  background: '#0a0a0f',
  transition: 'background 0.15s',
}