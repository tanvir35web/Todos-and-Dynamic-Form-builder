import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

// ─── Query Key Factory ────────────────────────────────────────────────────────
//
// Centralised factory keeps keys consistent and grep-friendly.
// todoKeys.lastFilters() is the key used to persist the user's most recent
// filter selection inside the React Query cache — not for actual data fetching,
// purely as an in-memory persistence store that survives in-app navigation but
// resets on a full page refresh (matching the spec: "until refresh").
//
export const todoKeys = {
  all:         () => ['todos'],
  list:        (filters) => ['todos', 'list', filters],
  users:       () => ['users'],
  lastFilters: () => ['todos', 'lastFilters'],   // ← persistence cache key
}

// ─── Default filter values ────────────────────────────────────────────────────
export const DEFAULT_FILTERS = {
  userFilter:   '',
  statusFilter: '',
  page:         1,
  limit:        10,
}

// ─── API Fetchers ─────────────────────────────────────────────────────────────

/**
 * Fetches a paginated, filtered page of todos from JSONPlaceholder.
 *
 * API params sent:
 *   _page, _limit   → server-side pagination
 *   userId          → filter by user (sent only when non-empty)
 *   completed       → filter by status: true | false (sent only when selected)
 *
 * JSONPlaceholder returns the total filtered count in X-Total-Count header,
 * which drives the pagination UI without needing a separate count request.
 *
 * @returns {{ todos: Todo[], total: number }}
 */
async function fetchTodos({ page, limit, userFilter, statusFilter }) {
  const params = new URLSearchParams({
    _page:  String(page),
    _limit: String(limit),
  })

  if (userFilter)                     params.append('userId',    userFilter)
  if (statusFilter === 'completed')   params.append('completed', 'true')
  if (statusFilter === 'pending')     params.append('completed', 'false')

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos?${params.toString()}`
  )

  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)

  const todos = await res.json()
  const total = parseInt(res.headers.get('X-Total-Count') ?? '0', 10)

  return { todos, total }
}

/**
 * Fetches all users — only 10 records, no pagination needed.
 */
async function fetchUsers() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users')
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.json()
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Primary data hook for the Todo List page.
 *
 * placeholderData keeps the previous page visible while the next one loads,
 * eliminating blank-screen flashes during filter/page changes.
 *
 * The next page is prefetched in the background as soon as current data lands,
 * making "Next page" clicks feel instant.
 */
export function useTodosQuery({ page, limit, userFilter, statusFilter }) {
  const queryClient = useQueryClient()
  const queryParams = { page, limit, userFilter, statusFilter }

  const query = useQuery({
    queryKey:        todoKeys.list(queryParams),
    queryFn:         () => fetchTodos(queryParams),
    placeholderData: (previousData) => previousData,
    staleTime:       60 * 1000,
  })

  // Prefetch next page in the background
  useEffect(() => {
    if (!query.data) return
    const totalPages = Math.ceil(query.data.total / limit)
    if (page >= totalPages) return

    queryClient.prefetchQuery({
      queryKey: todoKeys.list({ ...queryParams, page: page + 1 }),
      queryFn:  () => fetchTodos({ ...queryParams, page: page + 1 }),
      staleTime: 60 * 1000,
    })
  }, [query.data, page, limit, userFilter, statusFilter, queryClient])

  return query
}

/**
 * Hook for the user filter dropdown.
 * 10-minute staleTime — user list doesn't change within a session.
 */
export function useUsersQuery() {
  return useQuery({
    queryKey: todoKeys.users(),
    queryFn:  fetchUsers,
    staleTime: 10 * 60 * 1000,
  })
}
