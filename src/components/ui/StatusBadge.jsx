import { CheckCircle2, Clock } from 'lucide-react'
import styles from './StatusBadge.module.css'

/**
 * Reusable badge that shows "Completed" or "Pending" status with a Lucide icon.
 * @param {{ completed: boolean }} props
 */
export default function StatusBadge({ completed }) {
  return (
    <span className={`${styles.badge} ${completed ? styles.completed : styles.pending}`}>
      {completed
        ? <CheckCircle2 size={12} strokeWidth={2.5} />
        : <Clock size={12} strokeWidth={2.5} />
      }
      {completed ? 'Completed' : 'Pending'}
    </span>
  )
}
