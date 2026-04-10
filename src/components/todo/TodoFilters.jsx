import { Filter, X } from 'lucide-react'
import styles from '../../styles/TodoList.module.css'

/**
 * Filter bar — user dropdown, status dropdown, clear button.
 * Completely stateless; all values and handlers come from the parent page.
 */
export default function TodoFilters({
  users,
  usersLoading,
  userFilter,
  statusFilter,
  onUserChange,
  onStatusChange,
  onClear,
}) {
  const hasActiveFilters = userFilter || statusFilter

  return (
    <div className={styles.filters}>

      <div className={styles.filterGroup}>
        <label htmlFor="user-filter">User</label>
        <select
          id="user-filter"
          value={userFilter}
          onChange={onUserChange}
          disabled={usersLoading}
        >
          <option value="">All Users</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={onStatusChange}
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button className={styles.clearBtn} onClick={onClear}>
          <X size={13} strokeWidth={2.5} />
          Clear
        </button>
      )}
    </div>
  )
}
