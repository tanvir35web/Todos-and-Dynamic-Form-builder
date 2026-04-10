import { List, BookOpen, SlidersHorizontal } from 'lucide-react'
import styles from '../../styles/TodoList.module.css'

/**
 * Stats bar below the filter row — total count, current page, active filter indicator.
 */
export default function TodoStats({ total, page, totalPages, hasActiveFilters }) {
  return (
    <div className={styles.statsBar}>
      <div className={styles.stat}>
        <List size={13} />
        <strong>{total.toLocaleString()}</strong> todos
      </div>
      <div className={styles.stat}>
        <BookOpen size={13} />
        Page <strong>{page}</strong> / <strong>{totalPages}</strong>
      </div>
      {hasActiveFilters && (
        <div className={`${styles.stat} ${styles.statActive}`}>
          <SlidersHorizontal size={13} />
          Filters active
        </div>
      )}
    </div>
  )
}
