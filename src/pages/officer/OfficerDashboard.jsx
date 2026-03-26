import { useAuth } from '../../context/AuthContext'
import { getComplaintsByOfficer } from '../../utils/storage'
import { Eye, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react'

export default function OfficerDashboard() {
  const { user } = useAuth()
  const complaints = getComplaintsByOfficer(user.id)
  const counts = {
    total: complaints.length,
    inprogress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    escalated: complaints.filter(c => c.status === 'Escalated').length,
  }

  return (
    <div>
      <div className="page-header">
        <h2>Officer Dashboard</h2>
        <p>Welcome, {user.name} — manage your assigned complaints</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Assigned', value: counts.total, color: 'var(--blue)', icon: Eye, bg: 'rgba(59,130,246,0.15)' },
          { label: 'In Progress', value: counts.inprogress, color: 'var(--purple)', icon: TrendingUp, bg: 'rgba(168,85,247,0.15)' },
          { label: 'Resolved', value: counts.resolved, color: 'var(--green)', icon: CheckCircle, bg: 'rgba(34,197,94,0.15)' },
          { label: 'Escalated', value: counts.escalated, color: 'var(--red)', icon: AlertTriangle, bg: 'rgba(239,68,68,0.15)' },
        ].map(({ label, value, color, icon: Icon, bg }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon" style={{ background: bg }}>
              <Icon size={18} color={color} />
            </div>
            <div className="stat-label">{label}</div>
            <div className="stat-value" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {counts.total === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>
          <Eye size={36} style={{ opacity: 0.3, marginBottom: 12 }} />
          <p>No complaints assigned yet. Check back later.</p>
        </div>
      )}
    </div>
  )
}
