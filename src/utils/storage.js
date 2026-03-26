// ── Keys ──────────────────────────────────────────────
const KEYS = {
  USERS: 'np_users',
  COMPLAINTS: 'np_complaints',
  CURRENT_USER: 'np_current_user',
}

// ── Helpers ───────────────────────────────────────────
const get = (key) => JSON.parse(localStorage.getItem(key) || 'null')
const set = (key, val) => localStorage.setItem(key, JSON.stringify(val))

// ── Users ─────────────────────────────────────────────
export const getUsers = () => get(KEYS.USERS) || []
export const saveUsers = (users) => set(KEYS.USERS, users)

export const addUser = (user) => {
  const users = getUsers()
  users.push({ ...user, id: Date.now().toString() })
  saveUsers(users)
}

export const findUser = (email, password) =>
  getUsers().find(u => u.email === email && u.password === password)

export const getUsersByRole = (role) =>
  getUsers().filter(u => u.role === role)

// ── Session ───────────────────────────────────────────
export const getCurrentUser = () => get(KEYS.CURRENT_USER)
export const setCurrentUser = (user) => set(KEYS.CURRENT_USER, user)
export const clearCurrentUser = () => localStorage.removeItem(KEYS.CURRENT_USER)

// ── Complaints ────────────────────────────────────────
export const getComplaints = () => get(KEYS.COMPLAINTS) || []
export const saveComplaints = (c) => set(KEYS.COMPLAINTS, c)

export const addComplaint = (complaint) => {
  const list = getComplaints()
  const newItem = {
    ...complaint,
    id: Date.now().toString(),
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedOfficerId: null,
    assignedOfficerName: null,
    remarks: [],
  }
  list.push(newItem)
  saveComplaints(list)
  return newItem
}

export const updateComplaint = (id, updates) => {
  const list = getComplaints()
  const idx = list.findIndex(c => c.id === id)
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() }
    saveComplaints(list)
    return list[idx]
  }
}

export const getComplaintsByUser = (userId) =>
  getComplaints().filter(c => c.submittedBy === userId)

export const getComplaintsByOfficer = (officerId) =>
  getComplaints().filter(c => c.assignedOfficerId === officerId)

export const getEscalatedComplaints = () =>
  getComplaints().filter(c => c.status === 'Escalated')
