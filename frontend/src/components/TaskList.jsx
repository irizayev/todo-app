import { useState } from 'react'
import styles from './TaskList.module.css'

function formatDate(date) {
  if (!date) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const d = new Date(date + 'T00:00:00')
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  return date
}

function TaskItem({ task, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(task.title)
  const [draftDesc, setDraftDesc] = useState(task.description || '')

  function startEdit() {
    setDraftTitle(task.title)
    setDraftDesc(task.description || '')
    setEditing(true)
  }

  function commitEdit() {
    const trimmed = draftTitle.trim()
    setEditing(false)
    if (!trimmed) return
    onUpdate(task.id, { title: trimmed, description: draftDesc.trim() })
  }

  return (
    <li className={`${styles.task} ${task.completed ? styles.done : ''}`}>
      <div
        className={styles.checkbox}
        onClick={() => onUpdate(task.id, { completed: !task.completed })}
      >
        <svg viewBox="0 0 24 24"><polyline points="4 12 10 18 20 6" /></svg>
      </div>

      <div className={styles.body}>
        {editing ? (
          <>
            <input
              className={styles.editInput}
              value={draftTitle}
              autoFocus
              onChange={e => setDraftTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') commitEdit()
                if (e.key === 'Escape') setEditing(false)
              }}
            />
            <input
              className={styles.editInputDesc}
              value={draftDesc}
              placeholder="description…"
              onChange={e => setDraftDesc(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') commitEdit()
                if (e.key === 'Escape') setEditing(false)
              }}
              onBlur={commitEdit}
            />
          </>
        ) : (
          <div className={styles.text} onDoubleClick={startEdit}>
            {task.title}
          </div>
        )}
        <div className={styles.metaRow}>
          <span className={styles.id}>#{task.id}</span>
          {task.description && <>&nbsp;·&nbsp;{task.description}</>}
          {task.date && <>&nbsp;·&nbsp;{formatDate(task.date)}</>}
          &nbsp;·&nbsp;{task.completed ? 'done' : 'pending'}
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={startEdit}>edit</button>
        <button
          className={styles.del}
          onClick={() => {
            if (confirm(`delete "${task.title}"?`)) onDelete(task.id)
          }}
        >
          del
        </button>
      </div>
    </li>
  )
}

export default function TaskList({ tasks, onDelete, onUpdate }) {
  if (tasks.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyBig}>empty.</div>
        <div className={styles.emptySmall}>add your first task above</div>
      </div>
    )
  }

  return (
    <ul className={styles.list}>
      {tasks.map(t => (
        <TaskItem key={t.id} task={t} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </ul>
  )
}
