import { useState } from 'react'
import styles from './TaskList.module.css'

function formatDate(date) {
  if (!date) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const d = new Date(date + 'T00:00:00')
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  return date
}

function TaskItem({ task, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)

  function commitEdit() {
    const trimmed = draft.trim()
    setEditing(false)
    if (!trimmed || trimmed === task.title) return
    onUpdate(task.id, { title: trimmed })
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
          <input
            className={styles.editInput}
            value={draft}
            autoFocus
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => {
              if (e.key === 'Enter') commitEdit()
              if (e.key === 'Escape') { setDraft(task.title); setEditing(false) }
            }}
          />
        ) : (
          <div className={styles.text} onDoubleClick={() => setEditing(true)}>
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
        <button onClick={() => setEditing(true)}>edit</button>
        <button
          className={styles.del}
          onClick={() => {
            if (confirm(`удалить "${task.title}"?`)) onDelete(task.id)
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
        <div className={styles.emptyBig}>пусто.</div>
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
