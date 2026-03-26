import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { findUser } from '../../utils/storage'
import { useAuth } from '../../context/AuthContext'
import { MapPin, Eye, EyeOff } from 'lucide-react'
import './Auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const user = findUser(form.email.trim(), form.password)
    if (!user) { setError('Invalid email or password'); return }
    login(user)
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

        <h2 className="auth-title">Sign In</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="pw-wrap">
              <input type={showPw ? 'text' : 'password'} placeholder="Password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 4 }}>
            Sign In
          </button>
        </form>

        <p className="auth-switch">
          No account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  )
}
