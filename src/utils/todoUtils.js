import { DEFAULT_FILTERS } from '../constants'

/**
 * Reads and coerces all filter values from a URLSearchParams instance.
 * Single source of truth for URL → typed value conversion.
 *
 * @param {URLSearchParams} searchParams
 * @returns {{ userFilter: string, statusFilter: string, page: number, limit: number }}
 */
export function parseParams(searchParams) {
  return {
    userFilter:   searchParams.get('userFilter')   ?? DEFAULT_FILTERS.userFilter,
    statusFilter: searchParams.get('statusFilter') ?? DEFAULT_FILTERS.statusFilter,
    page:         Number(searchParams.get('page'))  || DEFAULT_FILTERS.page,
    limit:        Number(searchParams.get('limit')) || DEFAULT_FILTERS.limit,
  }
}

/**
 * Serialises filter state to a plain object for setSearchParams.
 * Empty strings are omitted so the URL stays clean (no ?userFilter=&statusFilter=).
 *
 * @param {{ userFilter: string, statusFilter: string, page: number, limit: number }} filters
 * @returns {Record<string, string>}
 */
export function buildParams({ userFilter, statusFilter, page, limit }) {
  const params = {
    page:  String(page),
    limit: String(limit),
  }
  if (userFilter)   params.userFilter   = userFilter
  if (statusFilter) params.statusFilter = statusFilter
  return params
}

/**
 * Formats a display range string for pagination.
 * e.g. "1–10 of 200"
 *
 * @param {number} page
 * @param {number} limit
 * @param {number} total
 * @returns {string}
 */
export function formatPageRange(page, limit, total) {
  const from = (page - 1) * limit + 1
  const to   = Math.min(page * limit, total)
  return `${from}–${to} of ${total.toLocaleString()}`
}
