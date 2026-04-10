import { useMemo } from 'react'
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react'
import { PAGE_SIZE_OPTIONS } from '../../constants'
import CustomSelect from '../ui/CustomSelect'
import styles from '../../styles/TodoList.module.css'

/**
 * Full pagination footer — "Showing X–Y of Z" info, page-size selector,
 * and page number controls with smart ellipsis.
 */
export default function TodoPagination({
  page,
  limit,
  total,
  totalPages,
  isFetching,
  onPageChange,
  onLimitChange,
}) {
  const pageNumbers = useMemo(() => {
    const delta = 2
    const left  = Math.max(1, page - delta)
    const right = Math.min(totalPages, page + delta)
    const range = []
    for (let i = left; i <= right; i++) range.push(i)
    return range
  }, [page, totalPages])

  const from = (page - 1) * limit + 1
  const to   = Math.min(page * limit, total)

  const pageSizeOptions = PAGE_SIZE_OPTIONS.map(s => ({
    value: String(s),
    label: `${s} / page`,
  }))

  return (
    <div className={styles.pagination}>
      {/* Info + page-size selector */}
      <div className={styles.pageInfo}>
        Showing{' '}
        <strong>{from}–{to}</strong>
        {' '}of{' '}
        <strong>{total.toLocaleString()}</strong>
        {' '}·{' '}
        <CustomSelect
          compact
          dropUp
          value={String(limit)}
          onChange={val => onLimitChange(Number(val))}
          options={pageSizeOptions}
          aria-label="Items per page"
        />
      </div>

      {/* Page number controls */}
      {totalPages > 1 && (
        <div className={styles.pageControls}>
          <button className={styles.pageBtn} onClick={() => onPageChange(1)}
            disabled={page === 1} aria-label="First page">
            <ChevronsLeft size={14} />
          </button>
          <button className={styles.pageBtn} onClick={() => onPageChange(page - 1)}
            disabled={page === 1} aria-label="Previous page">
            <ChevronLeft size={14} />
          </button>

          {pageNumbers[0] > 1 && (
            <>
              <button className={styles.pageBtn} onClick={() => onPageChange(1)}>1</button>
              {pageNumbers[0] > 2 && <span className={styles.ellipsis}>…</span>}
            </>
          )}

          {pageNumbers.map(n => (
            <button
              key={n}
              className={`${styles.pageBtn} ${n === page ? styles.activePage : ''}`}
              onClick={() => onPageChange(n)}
              aria-current={n === page ? 'page' : undefined}
            >{n}</button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className={styles.ellipsis}>…</span>
              )}
              <button className={styles.pageBtn} onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </button>
            </>
          )}

          <button className={styles.pageBtn} onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages} aria-label="Next page">
            <ChevronRight size={14} />
          </button>
          <button className={styles.pageBtn} onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages} aria-label="Last page">
            <ChevronsRight size={14} />
          </button>

          {isFetching && <span className={styles.fetchingDot} title="Fetching…" />}
        </div>
      )}
    </div>
  )
}
