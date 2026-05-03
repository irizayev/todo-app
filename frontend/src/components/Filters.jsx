import styles from './Filters.module.css'

const OPTIONS = [
  { key: 'all', label: 'все' },
  { key: 'active', label: 'активные' },
  { key: 'done', label: 'сделано' },
]

export default function Filters({ filter, onFilter, activeCount, total }) {
  return (
    <div className={styles.filters}>
      {OPTIONS.map(o => (
        <button
          key={o.key}
          className={filter === o.key ? styles.active : ''}
          onClick={() => onFilter(o.key)}
        >
          {o.label}
        </button>
      ))}
      <span className={styles.count}>{activeCount} active · {total} total</span>
    </div>
  )
}
