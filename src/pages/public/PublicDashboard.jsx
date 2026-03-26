import { useAuth } from '../../context/AuthContext'
import { getComplaintsByUser } from '../../utils/storage'
import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle, AlertTriangle, PlusCircle } from 'lucide-react'

export default function PublicDashboard() {
  const { user } = useAuth()
  const complaints = getComplaintsByUser(user.id)

  const counts = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    escalated: complaints.filter(c => c.status === 'Escalated').length,
  }

  return (
    <div>
      <div className="page-header">
        <h2>Welcome, {user.name} 👋</h2>
        <p>Track and manage your complaints here</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(249,115,22,0.15)' }}>
            <FileText size={18} color="var(--accent)" />
          </div>
          <div className="stat-label">Total Complaints</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{counts.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(234,179,8,0.15)' }}>
            <Clock size={18} color="var(--yellow)" />
          </div>
          <div className="stat-label">Pending</div>
          <div className="stat-value" style={{ color: 'var(--yellow)' }}>{counts.pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)' }}>
            <CheckCircle size={18} color="var(--green)" />
          </div>
          <div className="stat-label">Resolved</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>{counts.resolved}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)' }}>
            <AlertTriangle size={18} color="var(--red)" />
          </div>
          <div className="stat-label">Escalated</div>
          <div className="stat-value" style={{ color: 'var(--red)' }}>{counts.escalated}</div>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <PlusCircle size={40} color="var(--accent)" style={{ marginBottom: 12 }} />
        <h3 style={{ marginBottom: 8 }}>Report a New Issue</h3>
        <p style={{ color: 'var(--text2)', marginBottom: 20 }}>
          Submit road, water, waste or electricity complaints in seconds
        </p>
        <Link to="/submit">
          <button className="btn-primary">Submit Complaint</button>
        </Link>
      </div>
    </div>
  )
}
