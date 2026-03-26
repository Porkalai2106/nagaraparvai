import { getEscalatedComplaints } from '../../utils/storage'
import { AlertTriangle } from 'lucide-react'

export default function AuthorityDashboard() {
  const escalated = getEscalatedComplaints()

  return (
    <div>
      <div className="page-header">
        <h2>Higher Authority Dashboard</h2>
        <p>Review and action escalated complaints</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)' }}>
            <AlertTriangle size={18} color="var(--red)" />
          </div>
          <div className="stat-label">Escalated Complaints</div>
          <div className="stat-value" style={{ color: 'var(--red)' }}>{escalated.length}</div>
        </div>
      </div>

      {escalated.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>
          <AlertTriangle size={36} style={{ opacity: 0.3, marginBottom: 12 }} />
          <p>No escalated complaints at this time.</p>
        </div>
      )}
    </div>
  )
}
