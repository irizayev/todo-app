import styles from './Header.module.css'

export default function Header({ status }) {
  const isOnline = status === 'online'

  return (
    <header className={styles.header}>
      <h1 className={styles.brand}>
        todo<span className={styles.dot}>.</span>
      </h1>
      <div className={`${styles.meta} ${!isOnline ? styles.offline : ''}`}>
        <div>
          <span className={styles.pulse} />
          <span>{status === 'connecting' ? 'connecting…' : status === 'online' ? 'connected' : 'offline'}</span>
        </div>
      </div>
    </header>
  )
}
