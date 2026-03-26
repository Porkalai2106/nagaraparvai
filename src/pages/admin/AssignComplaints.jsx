import { useState } from 'react'
import { getComplaints, getUsersByRole, updateComplaint } from '../../utils/storage'
import { UserCheck } from 'lucide-react'

const STATUS_CLASS = {
  Pending: 'badge-pending', Assigned: 'badge-assigned',
  'In Progress': 'badge-inprogress', Resolved: 'badge-resolved', Escalated: 'badge-escalated',
}

export default function AssignComplaints() {
  const [complaints, setComplaints] = useState(getComplaints)
  const officers = getUsersByRole('Officer')
  const [selected, setSelected] = useState({})
  const [msg, setMsg] = useState('')

  const unassigned = complaints.filter(c => c.status === 'Pending' || c.status === 'Assigned')

  const handleAssign = (complaintId) => {
    const officerId = selected[complaintId]
    if (!officerId) return
    const officer = officers.find(o => o.id === officerId)
    updateComplaint(complaintId, {
      status: 'Assigned',
      assignedOfficerId: officer.id,
      assignedOfficerName: officer.name,
    })
    setComplaints(getComplaints())
    setMsg(`Assigned to ${officer.name}`)
    setTimeout(() => setMsg(''), 2000)
  }

  return (
    <div>
      <div className="page-header">
        <h2>Assign Complaints</h2>
        <p>Assign pending complaints to officers</p>
      </div>

      {msg && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: 'var(--green)', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          ✓ {msg}
        </div>
      )}

      {officers.length === 0 && (
        <div style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: 'var(--yellow)', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          ⚠ No officers registered. Ask officers to create accounts with the "Officer" role.
        </div>
      )}

      <div className="table-wrap">
        <div className="table-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserCheck size={15} color="var(--text2)" />
            <span style={{ color: 'var(--text2)', fontSize: 13 }}>{unassigned.length} complaint(s) to assign</span>
          </div>
        </div>

        {unassigned.length === 0 ? (
          <div className="empty-state"><p>All complaints are assigned ✓</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Current Officer</th>
                  <th>Assign To</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {unassigned.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)' }}>{c.submittedByName}</div>
                    </td>
                    <td><span className={`badge badge-${c.category.toLowerCase()}`}>{c.category}</span></td>
                    <td><span className={`badge ${STATUS_CLASS[c.status]}`}>{c.status}</span></td>
                    <td style={{ fontSize: 13, color: 'var(--text2)' }}>{c.assignedOfficerName || '—'}</td>
                    <td>
                      <select
                        style={{ width: 160 }}
                        value={selected[c.id] || ''}
                        onChange={e => setSelected(s => ({ ...s, [c.id]: e.target.value }))}>
                        <option value="">Select officer…</option>
                        {officers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </select>
                    </td>
                    <td>
                      <button className="btn-blue" onClick={() => handleAssign(c.id)}
                        disabled={!selected[c.id]}>
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
