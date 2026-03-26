import { useState } from 'react'
import { getComplaints } from '../../utils/storage'
import { MapPin, Filter } from 'lucide-react'

const STATUS_CLASS = {
  Pending: 'badge-pending', Assigned: 'badge-assigned',
  'In Progress': 'badge-inprogress', Resolved: 'badge-resolved', Escalated: 'badge-escalated',
}

export default function AllComplaints() {
  const [catFilter, setCatFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const complaints = getComplaints()

  const filtered = complaints.filter(c =>
    (catFilter === 'All' || c.category === catFilter) &&
    (statusFilter === 'All' || c.status === statusFilter)
  )

  return (
    <div>
      <div className="page-header">
        <h2>All Complaints</h2>
        <p>{filtered.length} of {complaints.length} complaints</p>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={15} color="var(--text2)" />
            <span style={{ fontSize: 13, color: 'var(--text2)' }}>Filters</span>
          </div>
          <div className="filters">
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              {['All', 'Road', 'Water', 'Waste', 'Electricity'].map(v => <option key={v}>{v}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {['All', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Escalated'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state"><p>No complaints match filters</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Submitted By</th>
                  <th>Officer</th>
                  <th>Location</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{c.description.slice(0, 60)}{c.description.length > 60 ? '…' : ''}</div>
                    </td>
                    <td><span className={`badge badge-${c.category.toLowerCase()}`}>{c.category}</span></td>
                    <td><span className={`badge ${STATUS_CLASS[c.status]}`}>{c.status}</span></td>
                    <td style={{ color: 'var(--text2)', fontSize: 13 }}>{c.submittedByName}</td>
                    <td style={{ color: 'var(--text2)', fontSize: 13 }}>{c.assignedOfficerName || '—'}</td>
                    <td>
                      {c.lat ? (
                        <a href={`https://maps.google.com/?q=${c.lat},${c.lng}`} target="_blank" rel="noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent)', fontSize: 12, textDecoration: 'none' }}>
                          <MapPin size={12} />{c.lat}, {c.lng}
                        </a>
                      ) : <span style={{ color: 'var(--text3)', fontSize: 12 }}>—</span>}
                    </td>
                    <td style={{ color: 'var(--text3)', fontSize: 12 }}>{new Date(c.createdAt).toLocaleDateString()}</td>
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
