import { useState } from 'react'
import styles from './Composer.module.css'

export default function Composer({ onAdd }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd(trimmed, description.trim(), date)
    setTitle('')
    setDescription('')
    setDate(new Date().toISOString().split('T')[0])
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit} autoComplete="off">
      <textarea
        className={styles.textarea}
        placeholder="что нужно сделать…"
        rows={2}
        maxLength={200}
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            e.target.form.requestSubmit()
          }
        }}
      />
      <div className={styles.bar}>
        <input
          className={styles.descInput}
          placeholder="описание…"
          maxLength={300}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          className={styles.dateInput}
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <span className={styles.count}>{title.length} / 200</span>
        <button type="submit" disabled={!title.trim()}>+ add task</button>
      </div>
    </form>
  )
}
