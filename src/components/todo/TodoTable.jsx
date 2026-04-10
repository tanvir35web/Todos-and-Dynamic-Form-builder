import { Search } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import SkeletonRow from '../ui/SkeletonRow'
import styles from '../../styles/TodoList.module.css'

function UserCell({ name }) {
  return (
    <>
      <span className={styles.userInitial}>{name?.[0] ?? '?'}</span>
      <span className={styles.userName}>{name}</span>
    </>
  )
}

/**
 * Scrollable data table for todos.
 * Handles three visual states: skeleton loading, empty result, and populated rows.
 */
export default function TodoTable({ todos, userMap, limit, isLoading, isPlaceholderData }) {
  return (
    <div className={`${styles.tableWrapper} ${isPlaceholderData ? styles.dimmed : ''}`}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Status</th>
              <th scope="col">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: limit }, (_, i) => <SkeletonRow key={i} />)
              : todos.length === 0
                ? (
                  <tr>
                    <td colSpan={4} className={styles.emptyCell}>
                      <div className={styles.empty}>
                        <Search size={36} strokeWidth={1.5} />
                        <p>No todos match your current filters.</p>
                      </div>
                    </td>
                  </tr>
                )
                : todos.map(todo => (
                  <tr key={todo.id}>
                    <td><span className={styles.todoId}>#{todo.id}</span></td>
                    <td>
                      <span className={`${styles.todoTitle} ${todo.completed ? styles.done : ''}`}>
                        {todo.title}
                      </span>
                    </td>
                    <td><StatusBadge completed={todo.completed} /></td>
                    <td>
                      <UserCell name={userMap[todo.userId] ?? `User ${todo.userId}`} />
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
