import styles from '../../styles/TodoList.module.css'

/**
 * A single animated skeleton row for the Todo table loading state.
 * Matches the real row column layout exactly to prevent layout shift.
 */
export default function SkeletonRow() {
  return (
    <tr className={styles.skeletonRow}>
      <td><span className={`${styles.skeleton} ${styles.skeletonSm}`} /></td>
      <td><span className={`${styles.skeleton} ${styles.skeletonLg}`} /></td>
      <td><span className={`${styles.skeleton} ${styles.skeletonMd}`} /></td>
      <td><span className={`${styles.skeleton} ${styles.skeletonMd}`} /></td>
    </tr>
  )
}
