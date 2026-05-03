import { useState, useEffect } from 'react'
import Header from './components/Header'
import Composer from './components/Composer'
import Filters from './components/Filters'
import TaskList from './components/TaskList'
import Toast from './components/Toast'

const API = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '')

export default function App() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [status, setStatus] = useState('connecting')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 1800)
  }

  async function fetchTasks() {
    try {
      const res = await fetch(`${API}/tasks`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setTasks(data)
      setStatus('online')
    } catch {
      setStatus('offline')
    }
  }

  async function addTask(title, description, date) {
    try {
      const res = await fetch(`${API}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, date }),
      })
      if (!res.ok) throw new Error()
      const created = await res.json()
      setTasks(prev => [...prev, created])
      showToast('task added')
    } catch {
      showToast('error adding task')
    }
  }

  async function deleteTask(id) {
    try {
      await fetch(`${API}/task?id=${id}`, { method: 'DELETE' })
      setTasks(prev => prev.filter(t => t.id !== id))
      showToast('task removed')
    } catch {
      showToast('error deleting task')
    }
  }

  async function updateTask(id, patch) {
    try {
      const current = tasks.find(t => t.id === id)
      await fetch(`${API}/task?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...current, ...patch }),
      })
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t))
    } catch {
      showToast('error updating task')
    }
  }

  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'done') return t.completed
    return true
  })

  const activeCount = tasks.filter(t => !t.completed).length

  return (
    <>
      <Header status={status} />
      <Composer onAdd={addTask} />
      <Filters filter={filter} onFilter={setFilter} activeCount={activeCount} total={tasks.length} />
      <TaskList tasks={filtered} onDelete={deleteTask} onUpdate={updateTask} />
      <Toast message={toast} />
    </>
  )
}
