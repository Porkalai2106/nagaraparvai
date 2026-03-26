import { useState } from 'react'
import { getEscalatedComplaints, getUsersByRole, updateComplaint } from '../../utils/storage'
import { MapPin, RotateCcw, CheckCircle } from 'lucide-react'

export default function EscalatedComplaints() {
  const [complaints, setComplaints] = useState(getEscalatedComplaints)
  const officers = getUsersByRole('Officer')
  const [selected, setSelected] = useState({})
  const [msg, setMsg] = useState('')

  const refresh = () => setComplaints(getEscalatedComplaints())
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500) }

  const reassign = (id) => {
    const officerId = selected[id]
    if (!officerId) return
    const officer = officers.find(o => o.id === officerId)
    updateComplaint(id, {
      status: 'Assigned',
      assignedOfficerId: officer.id,
      assignedOfficerName: officer.name,
    })
    refresh()
    flash(`Reassigned to ${officer.name}`)
  }

  const resolve = (id) => {
    updateComplaint(id, { status: 'Resolved' })
    refresh()
    flash('Marked as Resolved')
  }

  return (
    <div>
      <div className="page-header">
        <h2>Escalated Complaints</h2>
        <p>{complaints.length} complaint{complaints.length !== 1 ? 's' : ''} escalated</p>
      </div>

      {msg && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: 'var(--green)', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          ✓ {msg}
        </div>
      )}

      {complaints.length === 0 ? (
        <div className="empty-state card"><p>No escalated complaints</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {complaints.map(c => (
            <div key={c.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className={`badge badge-${c.category.toLowerCase()}`}>{c.category}</span>
                  <span className="badge badge-escalated">Escalated</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>

              <h3 style={{ fontSize: 15, marginBottom: 4 }}>{c.title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 10 }}>{c.description}</p>
              <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6 }}>
                Submitted by: <strong style={{ color: 'var(--text)' }}>{c.submittedByName}</strong>
              </p>
              {c.assignedOfficerName && (
                <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10 }}>
                  Previously assigned to: <strong style={{ color: 'var(--text)' }}>{c.assignedOfficerName}</strong>
                </p>
              )}

              {c.lat && (
                <div className="location-box" style={{ marginBottom: 14 }}>
                  <MapPin size={13} color="var(--accent)" />
                  <span>{c.lat}, {c.lng}</span>
                  <a href={`https://maps.google.com/?q=${c.lat},${c.lng}`} target="_blank" rel="noreferrer">Maps ↗</a>
                </div>
              )}

              {c.remarks?.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6 }}>Officer Remarks:</p>
                  {c.remarks.map((r, i) => (
                    <p key={i} style={{ fontSize: 13, background: 'var(--surface2)', borderRadius: 6, padding: '6px 10px', marginBottom: 4 }}>
                      {r.text}
                    </p>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                {officers.length > 0 && (
                  <>
                    <select style={{ width: 180 }} value={selected[c.id] || ''}
                      onChange={e => setSelected(s => ({ ...s, [c.id]: e.target.value }))}>
                      <option value="">Reassign to officer…</option>
                      {officers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                    <button className="btn-blue" style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                      onClick={() => reassign(c.id)} disabled={!selected[c.id]}>
                      <RotateCcw size={13} /> Reassign
                    </button>
                  </>
                )}
                <button className="btn-success" style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => resolve(c.id)}>
                  <CheckCircle size={13} /> Mark Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
