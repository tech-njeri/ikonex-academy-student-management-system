// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 12, color: '#555', marginBottom: 20 },
  section: { marginBottom: 16 },
  label: { fontSize: 10, color: '#888' },
  value: { fontSize: 12, marginBottom: 4 },
  table: { marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 6 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', paddingVertical: 6 },
  col1: { width: '40%', fontSize: 10, paddingHorizontal: 4 },
  col2: { width: '20%', fontSize: 10, paddingHorizontal: 4 },
  col3: { width: '20%', fontSize: 10, paddingHorizontal: 4 },
  col4: { width: '20%', fontSize: 10, paddingHorizontal: 4 },
  summary: { marginTop: 20, padding: 10, backgroundColor: '#f9fafb' },
  summaryText: { fontSize: 12, marginBottom: 4 },
  grade: { fontSize: 20, fontWeight: 'bold', color: '#2563eb', marginTop: 4 },
  footer: { marginTop: 40, fontSize: 9, color: '#aaa', textAlign: 'center' }
})

function getGrade(avg) {
  if (avg >= 80) return 'A'
  if (avg >= 60) return 'B'
  if (avg >= 50) return 'C'
  if (avg >= 40) return 'D'
  return 'E'
}

function ReportCard({ student }) {
  const total = student.scores.reduce((sum, s) => sum + s.examScore + s.catScore, 0)
  const average = student.scores.length > 0 ? (total / student.scores.length).toFixed(2) : 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Ikonex Academy</Text>
          <Text style={styles.subtitle}>Student Report Card</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Student Name</Text>
          <Text style={styles.value}>{student.name}</Text>
          <Text style={styles.label}>Admission Number</Text>
          <Text style={styles.value}>{student.admissionNo}</Text>
          <Text style={styles.label}>Class Stream</Text>
          <Text style={styles.value}>{student.stream.name}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Subject</Text>
            <Text style={styles.col2}>Exam</Text>
            <Text style={styles.col3}>CAT</Text>
            <Text style={styles.col4}>Total</Text>
          </View>
          {student.scores.map((score, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.col1}>{score.subject?.name ?? 'Unknown'}</Text>
              <Text style={styles.col2}>{score.examScore}</Text>
              <Text style={styles.col3}>{score.catScore}</Text>
              <Text style={styles.col4}>{score.examScore + score.catScore}</Text>
            </View>
          ))}
        </View>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Total Marks: {total}</Text>
          <Text style={styles.summaryText}>Average: {average}</Text>
          <Text style={styles.summaryText}>Grade:</Text>
          <Text style={styles.grade}>{getGrade(average)}</Text>
        </View>
        <Text style={styles.footer}>
          © 2026 Joy Njeri — Ikonex Academy Student Management System
        </Text>
      </Page>
    </Document>
  )
}

export default function ReportPage() {
  const { studentId } = useParams()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [downloaded, setDownloaded] = useState(false)

  useEffect(() => {
    if (!studentId) return
    async function fetchStudent() {
      try {
        const res = await fetch(`/api/students/${studentId}`)
        if (!res.ok) throw new Error('Student not found.')
        const data = await res.json()
        setStudent(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStudent()
  }, [studentId])

  if (loading) return (
    <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            height: '48px',
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
    </div>
  )

  if (error) return (
    <div style={{ padding: '2rem', color: '#e2534a', fontSize: '14px' }}>{error}</div>
  )

  if (!student || !student.stream) return (
    <div style={{ padding: '2rem', color: '#5a5a7a', fontSize: '14px' }}>
      Student data incomplete.
    </div>
  )

  const total = student.scores.reduce((sum, s) => sum + s.examScore + s.catScore, 0)
  const average = student.scores.length > 0
    ? parseFloat((total / student.scores.length).toFixed(2))
    : 0

  return (
    <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .score-row {
          animation: popIn 0.2s ease both;
        }
      `}</style>

      {/* Downloaded toast */}
      {downloaded && (
        <div style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          background: '#4caf82',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 500,
          zIndex: 999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.25s ease',
        }}>
          Report card downloaded!
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
          Report Card
        </h1>
        <p style={{ fontSize: '14px', color: '#5a5a7a', margin: 0 }}>
          {student.name} — {student.stream.name}
        </p>
      </div>

      {/* Student info card */}
      <div style={{
        background: '#0f0f1a',
        border: '1px solid #1e1e30',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1rem',
        display: 'flex',
        gap: '2rem',
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#5a5a7a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Student</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginTop: '4px' }}>{student.name}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#5a5a7a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Adm No</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginTop: '4px' }}>{student.admissionNo}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#5a5a7a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Stream</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginTop: '4px' }}>{student.stream.name}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#5a5a7a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Grade</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#7c5cfc', marginTop: '4px' }}>{getGrade(average)}</div>
        </div>
      </div>

      {/* Scores */}
      <div style={{
        background: '#0f0f1a',
        border: '1px solid #1e1e30',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '1.5rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto',
          padding: '10px 16px',
          borderBottom: '1px solid #1e1e30',
          fontSize: '11px',
          color: '#5a5a7a',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          <span>Subject</span>
          <span style={{ width: '60px', textAlign: 'center' }}>Exam</span>
          <span style={{ width: '60px', textAlign: 'center' }}>CAT</span>
          <span style={{ width: '60px', textAlign: 'center' }}>Total</span>
        </div>

        {student.scores.length === 0 ? (
          <div style={{ padding: '1.5rem', color: '#5a5a7a', fontSize: '14px' }}>
            No scores recorded yet.
          </div>
        ) : (
          student.scores.map((score, i) => (
            <div
              key={score.id}
              className="score-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto',
                padding: '12px 16px',
                borderBottom: i < student.scores.length - 1 ? '1px solid #1e1e30' : 'none',
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <span style={{ fontSize: '14px', color: '#c8c6d8', fontWeight: 500 }}>
                {score.subject?.name ?? 'Unknown'}
              </span>
              <span style={{ width: '60px', textAlign: 'center', fontSize: '14px', color: '#9a98b0' }}>
                {score.examScore}
              </span>
              <span style={{ width: '60px', textAlign: 'center', fontSize: '14px', color: '#9a98b0' }}>
                {score.catScore}
              </span>
              <span style={{ width: '60px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                {score.examScore + score.catScore}
              </span>
            </div>
          ))
        )}

        {/* Summary row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto',
          padding: '12px 16px',
          borderTop: '1px solid #1e1e30',
          background: '#0a0a0f',
        }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Summary</span>
          <span style={{ width: '60px' }} />
          <span style={{ width: '60px', textAlign: 'center', fontSize: '13px', color: '#7c5cfc', fontWeight: 600 }}>
            Avg: {average}
          </span>
          <span style={{ width: '60px', textAlign: 'center', fontSize: '13px', color: '#4caf82', fontWeight: 700 }}>
            {total}
          </span>
        </div>
      </div>

      {/* Download button */}
      <PDFDownloadLink
        document={<ReportCard student={student} />}
        fileName={`${student.name}-report-card.pdf`}
        onClick={() => {
          setDownloaded(true)
          setTimeout(() => setDownloaded(false), 3000)
        }}
        style={{
          display: 'inline-block',
          background: '#7c5cfc',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'opacity 0.2s',
        }}
      >
        {({ loading: pdfLoading }) => pdfLoading ? 'Preparing PDF...' : 'Download Report Card PDF'}
      </PDFDownloadLink>
    </div>
  )
}