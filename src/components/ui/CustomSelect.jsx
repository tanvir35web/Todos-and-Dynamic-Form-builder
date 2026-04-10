import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import styles from './CustomSelect.module.css'

/**
 * Fully custom dropdown — replaces native <select> everywhere in the app.
 * Supports keyboard navigation, accessibility attributes, and smooth animations.
 *
 * Props:
 *   value      – currently selected value (string)
 *   onChange   – called with the raw value string (not an Event)
 *   options    – [{ value: string, label: string }]
 *   placeholder – text shown when nothing is selected
 *   disabled   – disables the trigger
 *   compact    – smaller padding variant for the page-size selector
 *   className  – extra class passed to the wrapper
 */
export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select…',
  disabled = false,
  compact = false,
  dropUp = false,
  className = '',
}) {
  const [open, setOpen]           = useState(false)
  const [focusedIdx, setFocusedIdx] = useState(0)
  const wrapperRef = useRef(null)
  const menuRef    = useRef(null)

  const selectedOption = options.find(o => String(o.value) === String(value))

  // ── Close on outside click ─────────────────────────────────────
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // ── Initialise focused index & scroll selected into view ───────
  useEffect(() => {
    if (!open) return
    const idx = options.findIndex(o => String(o.value) === String(value))
    setFocusedIdx(idx >= 0 ? idx : 0)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Scroll focused option into view on keyboard nav ───────────
  useEffect(() => {
    if (!open || !menuRef.current) return
    const items = menuRef.current.querySelectorAll('[data-option]')
    items[focusedIdx]?.scrollIntoView({ block: 'nearest' })
  }, [focusedIdx, open])

  // ── Keyboard handler ──────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIdx(i => Math.min(i + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIdx(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (options[focusedIdx]) {
          onChange(options[focusedIdx].value)
          setOpen(false)
        }
        break
      case 'Escape':
      case 'Tab':
        setOpen(false)
        break
      default:
        break
    }
  }, [open, focusedIdx, options, onChange])

  const select = (val) => { onChange(val); setOpen(false) }

  return (
    <div
      className={`${styles.wrapper} ${compact ? styles.wrapperCompact : ''} ${className}`}
      ref={wrapperRef}
    >
      {/* ── Trigger ────────────────────────────────────────────── */}
      <button
        type="button"
        className={[
          styles.trigger,
          compact  ? styles.compact   : '',
          open     ? styles.triggerOpen : '',
          disabled ? styles.disabled  : '',
        ].join(' ')}
        onClick={() => !disabled && setOpen(p => !p)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        <span className={selectedOption ? styles.selectedLabel : styles.placeholder}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={compact ? 13 : 15}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
        />
      </button>

      {/* ── Menu ───────────────────────────────────────────────── */}
      {open && (
        <ul
          className={`${styles.menu} ${dropUp ? styles.menuUp : ''}`}
          ref={menuRef}
          role="listbox"
          aria-label="Options"
        >
          {options.map((option, idx) => {
            const isSelected = String(option.value) === String(value)
            const isFocused  = idx === focusedIdx
            return (
              <li
                key={option.value}
                data-option
                role="option"
                aria-selected={isSelected}
                className={[
                  styles.option,
                  isSelected ? styles.optionSelected : '',
                  isFocused  ? styles.optionFocused  : '',
                ].join(' ')}
                onMouseEnter={() => setFocusedIdx(idx)}
                onClick={() => select(option.value)}
              >
                <span className={styles.optionLabel}>{option.label}</span>
                {isSelected && <Check size={13} className={styles.checkIcon} strokeWidth={2.5} />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
