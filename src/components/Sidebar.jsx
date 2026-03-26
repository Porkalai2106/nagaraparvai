import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, FileText, PlusCircle, Eye, Shield,
  UserCheck, AlertTriangle, LogOut, MapPin, Menu, X
} from 'lucide-react'
import { useState } from 'react'
import './Sidebar.css'

const NAV = {
  Public: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/submit', icon: PlusCircle, label: 'Submit Complaint' },
    { to: '/my-complaints', icon: FileText, label: 'My Complaints' },
  ],
  Admin: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/all-complaints', icon: FileText, label: 'All Complaints' },
    { to: '/assign', icon: UserCheck, label: 'Assign Complaints' },
  ],
  Officer: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/assigned', icon: Eye, label: 'Assigned to Me' },
  ],
  'Higher Authority': [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/escalated', icon: AlertTriangle, label: 'Escalated Issues' },
  ],
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const links = NAV[user?.role] || []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <button className="hamburger" onClick={() => setOpen(true)}>
        <Menu size={20} />
      </button>

      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <MapPin size={20} className="brand-icon" />
            <div>
              <div className="brand-name">Nagaraparvai</div>
              <div className="brand-sub">Issue Reporting</div>
            </div>
          </div>
          <button className="close-btn" onClick={() => setOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
