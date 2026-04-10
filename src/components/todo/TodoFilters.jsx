import { Filter, X } from 'lucide-react'
import CustomSelect from '../ui/CustomSelect'
import styles from '../../styles/TodoList.module.css'

/**
 * Filter bar — user dropdown, status dropdown, clear button.
 * Completely stateless; all values and handlers come from the parent page.
 * onChange callbacks receive a plain value string (not a DOM Event).
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

  const userOptions = [
    { value: '', label: 'All Users' },
    ...users.map(u => ({ value: String(u.id), label: u.name })),
  ]

  const statusOptions = [
    { value: '',          label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending',   label: 'Pending' },
  ]

  return (
    <div className={styles.filters}>

      <div className={styles.filterGroup}>
        <label>User</label>
        <CustomSelect
          value={userFilter}
          onChange={onUserChange}
          options={userOptions}
          placeholder="All Users"
          disabled={usersLoading}
        />
      </div>

      <div className={styles.filterGroup}>
        <label>Status</label>
        <CustomSelect
          value={statusFilter}
          onChange={onStatusChange}
          options={statusOptions}
          placeholder="All Statuses"
        />
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
