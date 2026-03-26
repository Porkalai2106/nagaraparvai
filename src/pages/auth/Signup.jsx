import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addUser, getUsers } from '../../utils/storage'
import { useAuth } from '../../context/AuthContext'
import { MapPin } from 'lucide-react'
import './Auth.css'

const ROLES = ['Public', 'Officer', 'Admin', 'Higher Authority']

export default function Signup() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Public' })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const existing = getUsers().find(u => u.email === form.email.trim())
    if (existing) { setError('Email already registered'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    const newUser = { ...form, email: form.email.trim(), id: Date.now().toString() }
    addUser(newUser)
    login(newUser)
    navigate('/dashboard')
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <MapPin size={28} className="auth-icon" />
          <h1>Nagaraparvai</h1>
          <p>Public Issue Reporting System</p>
        </div>

        <h2 className="auth-title">Create Account</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Your name" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 4 }}>
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
