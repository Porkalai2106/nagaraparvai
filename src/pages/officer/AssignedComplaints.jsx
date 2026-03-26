import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getComplaintsByOfficer, updateComplaint } from '../../utils/storage'
import { MapPin, MessageSquare, ArrowUpCircle, CheckCircle, Play } from 'lucide-react'

const STATUS_CLASS = {
  Pending: 'badge-pending', Assigned: 'badge-assigned',
  'In Progress': 'badge-inprogress', Resolved: 'badge-resolved', Escalated: 'badge-escalated',
}

export default function AssignedComplaints() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState(() => getComplaintsByOfficer(user.id))
  const [remark, setRemark] = useState({})
  const [msg, setMsg] = useState('')

  const refresh = () => setComplaints(getComplaintsByOfficer(user.id))

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500) }

  const addRemark = (id) => {
    const text = remark[id]?.trim()
    if (!text) return
    const c = complaints.find(x => x.id === id)
    updateComplaint(id, { remarks: [...(c.remarks || []), { text, at: new Date().toISOString(), by: user.name }] })
    setRemark(r => ({ ...r, [id]: '' }))
    refresh()
    flash('Remark added')
  }

  const setStatus = (id, status) => {
    updateComplaint(id, { status })
    refresh()
    flash(`Status updated to ${status}`)
  }

  return (
    <div>
      <div className="page-header">
        <h2>Assigned Complaints</h2>
        <p>{complaints.length} complaint{complaints.length !== 1 ? 's' : ''} assigned to you</p>
      </div>

      {msg && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: 'var(--green)', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          ✓ {msg}
        </div>
      )}

      {complaints.length === 0 ? (
        <div className="empty-state card"><p>No complaints assigned to you yet</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {complaints.map(c => (
            <div key={c.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className={`badge badge-${c.category.toLowerCase()}`}>{c.category}</span>
                  <span className={`badge ${STATUS_CLASS[c.status]}`}>{c.status}</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>

              <h3 style={{ fontSize: 15, marginBottom: 4 }}>{c.title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 10 }}>{c.description}</p>
              <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10 }}>
                Submitted by: <strong style={{ color: 'var(--text)' }}>{c.submittedByName}</strong>
              </p>

              {c.lat && (
                <div className="location-box" style={{ marginBottom: 14 }}>
                  <MapPin size={13} color="var(--accent)" />
                  <span>{c.lat}, {c.lng}</span>
                  <a href={`https://maps.google.com/?q=${c.lat},${c.lng}`} target="_blank" rel="noreferrer">Maps ↗</a>
                </div>
              )}

              {/* Remarks */}
              {c.remarks?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6 }}>Remarks:</p>
                  {c.remarks.map((r, i) => (
                    <p key={i} style={{ fontSize: 13, background: 'var(--surface2)', borderRadius: 6, padding: '6px 10px', marginBottom: 4 }}>
                      {r.text}
                    </p>
                  ))}
                </div>
              )}

              {c.status !== 'Resolved' && c.status !== 'Escalated' && (
                <>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <input
                      placeholder="Add a remark…"
                      value={remark[c.id] || ''}
                      onChange={e => setRemark(r => ({ ...r, [c.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addRemark(c.id)}
                      style={{ flex: 1 }}
                    />
                    <button className="btn-secondary" style={{ whiteSpace: 'nowrap', padding: '10px 14px' }} onClick={() => addRemark(c.id)}>
                      <MessageSquare size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {c.status !== 'In Progress' && (
                      <button className="btn-blue" style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                        onClick={() => setStatus(c.id, 'In Progress')}>
                        <Play size={13} /> Mark In Progress
                      </button>
                    )}
                    <button className="btn-success" style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                      onClick={() => setStatus(c.id, 'Resolved')}>
                      <CheckCircle size={13} /> Mark Resolved
                    </button>
                    <button className="btn-danger" style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                      onClick={() => setStatus(c.id, 'Escalated')}>
                      <ArrowUpCircle size={13} /> Escalate
                    </button>
                  </div>
                </>
              )}

              {(c.status === 'Resolved' || c.status === 'Escalated') && (
                <p style={{ fontSize: 13, color: c.status === 'Resolved' ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                  {c.status === 'Resolved' ? '✓ Resolved' : '⚠ Escalated to Higher Authority'}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
