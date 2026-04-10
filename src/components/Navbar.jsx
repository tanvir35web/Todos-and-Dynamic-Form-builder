import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Zap, ClipboardList, Settings, Eye, Menu, X } from 'lucide-react'
import styles from '../styles/Navbar.module.css'

const NAV_LINKS = [
  { to: '/todos',        label: 'Todo List',    Icon: ClipboardList },
  { to: '/form-builder', label: 'Form Builder', Icon: Settings },
  { to: '/form-preview', label: 'Form Preview', Icon: Eye },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location                = useLocation()
  const menuRef                 = useRef(null)

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <nav className={styles.navbar} ref={menuRef}>
      <div className={styles.inner}>
        <span className={styles.brand}>
          <Zap size={18} strokeWidth={2.5} />
          ReactApp
        </span>

        {/* Desktop links */}
        <div className={styles.desktopNav}>
          {NAV_LINKS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <Icon size={15} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Hamburger — mobile only */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`${styles.mobileDrawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.mobileNav}>
          {NAV_LINKS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
              }
            >
              <Icon size={20} className={styles.mobileIcon} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {menuOpen && (
        <div className={styles.backdrop} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}
    </nav>
  )
}
