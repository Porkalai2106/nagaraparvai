import { getComplaints } from '../../utils/storage'
import { FileText, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const complaints = getComplaints()
  const counts = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    assigned: complaints.filter(c => c.status === 'Assigned').length,
    inprogress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    escalated: complaints.filter(c => c.status === 'Escalated').length,
  }

  const byCat = ['Road', 'Water', 'Waste', 'Electricity'].map(cat => ({
    cat,
    count: complaints.filter(c => c.category === cat).length,
  }))

  return (
    <div>
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <p>System-wide overview of all complaints</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total', value: counts.total, color: 'var(--accent)', icon: FileText, bg: 'rgba(249,115,22,0.15)' },
          { label: 'Pending', value: counts.pending, color: 'var(--yellow)', icon: Clock, bg: 'rgba(234,179,8,0.15)' },
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

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Complaints by Category</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {byCat.map(({ cat, count }) => (
            <div key={cat}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className={`badge badge-${cat.toLowerCase()}`}>{cat}</span>
                <span style={{ color: 'var(--text2)', fontSize: 13 }}>{count} complaints</span>
              </div>
              <div style={{ background: 'var(--surface2)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: counts.total ? `${(count / counts.total) * 100}%` : '0%',
                  background: 'var(--accent)',
                  borderRadius: 4,
                  transition: 'width .5s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
