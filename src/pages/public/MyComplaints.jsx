import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getComplaintsByUser } from '../../utils/storage'
import { MapPin, MessageSquare } from 'lucide-react'

const STATUS_CLASS = {
  Pending: 'badge-pending',
  Assigned: 'badge-assigned',
  'In Progress': 'badge-inprogress',
  Resolved: 'badge-resolved',
  Escalated: 'badge-escalated',
}

export default function MyComplaints() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('All')
  const all = getComplaintsByUser(user.id)
  const statuses = ['All', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Escalated']
  const complaints = filter === 'All' ? all : all.filter(c => c.status === filter)

  return (
    <div>
      <div className="page-header">
        <h2>My Complaints</h2>
        <p>{all.length} complaint{all.length !== 1 ? 's' : ''} submitted</p>
      </div>

      <div className="filters" style={{ marginBottom: 20 }}>
        {statuses.map(s => (
          <button key={s}
            className={filter === s ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '7px 14px', fontSize: 12 }}
            onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      {complaints.length === 0 ? (
        <div className="empty-state card">
          <MessageSquare size={40} />
          <p>No complaints found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {complaints.map(c => (
            <div key={c.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                    <span className={`badge badge-${c.category.toLowerCase()}`}>{c.category}</span>
                    <span className={`badge ${STATUS_CLASS[c.status]}`}>{c.status}</span>
                  </div>
                  <h3 style={{ fontSize: 15, marginBottom: 4 }}>{c.title}</h3>
                  <p style={{ color: 'var(--text2)', fontSize: 13 }}>{c.description}</p>

                  {c.lat && (
                    <div className="location-box" style={{ marginTop: 10 }}>
                      <MapPin size={13} color="var(--accent)" />
                      <span>{c.lat}, {c.lng}</span>
                      <a href={`https://maps.google.com/?q=${c.lat},${c.lng}`} target="_blank" rel="noreferrer">Maps ↗</a>
                    </div>
                  )}

                  {c.assignedOfficerName && (
                    <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 8 }}>
                      👮 Assigned to: <strong style={{ color: 'var(--text)' }}>{c.assignedOfficerName}</strong>
                    </p>
                  )}

                  {c.remarks?.length > 0 && (
                    <div style={{ marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                      <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>Officer Remarks:</p>
                      {c.remarks.map((r, i) => (
                        <p key={i} style={{ fontSize: 13, color: 'var(--text)', background: 'var(--surface2)', borderRadius: 6, padding: '6px 10px', marginBottom: 4 }}>
                          {r.text} <span style={{ color: 'var(--text3)', fontSize: 11 }}>— {new Date(r.at).toLocaleString()}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 11, color: 'var(--text3)' }}>{new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
