import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useTodosQuery, useUsersQuery, todoKeys } from '../hooks/useTodosQuery'
import { DEFAULT_FILTERS } from '../constants'
import { parseParams, buildParams } from '../utils/todoUtils'
import TodoFilters    from '../components/todo/TodoFilters'
import TodoStats      from '../components/todo/TodoStats'
import TodoTable      from '../components/todo/TodoTable'
import TodoPagination from '../components/todo/TodoPagination'
import styles from '../styles/TodoList.module.css'

export default function TodoList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()

  // ── Restore last filters from React Query cache when URL has no params ────
  useEffect(() => {
    if (searchParams.has('page')) return
    const cached = queryClient.getQueryData(todoKeys.lastFilters())
    if (cached) setSearchParams(buildParams(cached), { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Parse typed values from URL ───────────────────────────────────────────
  const { userFilter, statusFilter, page, limit } = parseParams(searchParams)

  // ── Write every change back to the React Query cache (in-memory persistence)
  useEffect(() => {
    queryClient.setQueryData(todoKeys.lastFilters(), { userFilter, statusFilter, page, limit })
  }, [userFilter, statusFilter, page, limit, queryClient])

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data, isLoading, isError, error, isFetching, isPlaceholderData } =
    useTodosQuery({ page, limit, userFilter, statusFilter })

  const { data: users = [], isLoading: usersLoading } = useUsersQuery()

  const userMap = useMemo(
    () => users.reduce((acc, u) => ({ ...acc, [u.id]: u.name }), {}),
    [users]
  )

  const todos      = data?.todos ?? []
  const total      = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  // ── URL update helper (replace: true keeps history clean) ────────────────
  const setParams = (updates) =>
    setSearchParams(buildParams({ userFilter, statusFilter, page, limit, ...updates }), { replace: true })

  if (isError) {
    return (
      <div className={styles.errorBanner}>
        <AlertTriangle size={18} />
        <span>{error?.message ?? 'Failed to load todos.'}</span>
        <button onClick={() => window.location.reload()}>
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    )
  }

  const showSkeleton = isLoading || usersLoading

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Todo List</h1>
        <p>
          Live data from JSONPlaceholder API&nbsp;·&nbsp;
          {total > 0 && <strong>{total.toLocaleString()} matching todos</strong>}
          {isFetching && !isLoading && <span className={styles.refreshLabel}> · Refreshing…</span>}
        </p>
      </div>

      <TodoFilters
        users={users}
        usersLoading={usersLoading}
        userFilter={userFilter}
        statusFilter={statusFilter}
        onUserChange={val => setParams({ userFilter: val, page: 1 })}
        onStatusChange={val => setParams({ statusFilter: val, page: 1 })}
        onClear={() => setSearchParams(buildParams(DEFAULT_FILTERS), { replace: true })}
      />

      {!isLoading && (
        <TodoStats
          total={total}
          page={page}
          totalPages={totalPages}
          hasActiveFilters={!!(userFilter || statusFilter)}
        />
      )}

      <TodoTable
        todos={todos}
        userMap={userMap}
        limit={limit}
        isLoading={showSkeleton}
        isPlaceholderData={isPlaceholderData}
      />

      {!showSkeleton && total > 0 && (
        <TodoPagination
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          isFetching={isFetching}
          onPageChange={p => setParams({ page: p })}
          onLimitChange={val => setParams({ limit: Number(val), page: 1 })}
        />
      )}
    </div>
  )
}
