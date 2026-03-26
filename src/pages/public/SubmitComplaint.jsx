import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addComplaint } from '../../utils/storage'
import { useAuth } from '../../context/AuthContext'
import { useGeolocation } from '../../hooks/useGeolocation'
import { MapPin, Loader, CheckCircle } from 'lucide-react'

const CATEGORIES = ['Road', 'Water', 'Waste', 'Electricity']

export default function SubmitComplaint() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { location, error: geoError, loading: geoLoading, capture } = useGeolocation()
  const [form, setForm] = useState({ title: '', description: '', category: 'Road' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    addComplaint({
      ...form,
      submittedBy: user.id,
      submittedByName: user.name,
      lat: location?.lat || null,
      lng: location?.lng || null,
    })
    setSubmitted(true)
    setTimeout(() => navigate('/my-complaints'), 1500)
  }

  if (submitted) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
      <CheckCircle size={56} color="var(--green)" />
      <h2>Complaint Submitted!</h2>
      <p style={{ color: 'var(--text2)' }}>Redirecting to your complaints…</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="page-header">
        <h2>Submit a Complaint</h2>
        <p>Report an issue in your area</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" placeholder="Brief title of the issue"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea rows={4} placeholder="Describe the issue in detail…"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              required style={{ resize: 'vertical' }} />
          </div>

          <div className="form-group">
            <label>Location</label>
            {!location ? (
              <button type="button" className="btn-secondary" onClick={capture} disabled={geoLoading}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {geoLoading ? <Loader size={15} className="spin" /> : <MapPin size={15} />}
                {geoLoading ? 'Getting location…' : 'Capture My Location'}
              </button>
            ) : (
              <div className="location-box">
                <MapPin size={15} color="var(--accent)" />
                <span>Lat: {location.lat}, Lng: {location.lng}</span>
                <a href={`https://maps.google.com/?q=${location.lat},${location.lng}`} target="_blank" rel="noreferrer">
                  View on Maps ↗
                </a>
              </div>
            )}
            {geoError && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 4 }}>{geoError}</p>}
            <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
              Location is optional but helps officers find the issue faster
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn-primary">Submit Complaint</button>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>

      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
