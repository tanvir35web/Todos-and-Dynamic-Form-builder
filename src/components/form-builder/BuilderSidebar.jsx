import { Plus, Save, Eye, Trash2, CheckCircle2, LayoutList, Asterisk, Tag } from 'lucide-react'
import styles from '../../styles/FormBuilder.module.css'

/**
 * Sticky sidebar with action buttons and a live summary of the current field schema.
 */
export default function BuilderSidebar({
  fields,
  savedAt,
  onAdd,
  onSave,
  onSaveAndPreview,
  onClear,
}) {
  const requiredCount = fields.filter(f => f.required).length
  const labeledCount  = fields.filter(f => f.label.trim()).length
  const hasFields     = fields.length > 0

  return (
    <aside className={styles.sidebar}>
      {/* Actions card */}
      <div className={styles.sideCard}>
        <h3>Form Actions</h3>
        <div className={styles.sideActions}>
          <button
            className={`${styles.btnPrimary} ${styles.btnFull}`}
            onClick={onAdd}
            type="button"
          >
            <Plus size={15} /> Add Field
          </button>
          <button
            className={`${styles.btnSecondary} ${styles.btnFull}`}
            onClick={onSave}
            disabled={!hasFields}
            type="button"
          >
            <Save size={15} /> Save Form
          </button>
          <button
            className={`${styles.btnPrimary} ${styles.btnFull}`}
            onClick={onSaveAndPreview}
            disabled={!hasFields}
            type="button"
          >
            <Eye size={15} /> Save &amp; Preview
          </button>
          <button
            className={`${styles.btnDanger} ${styles.btnFull}`}
            onClick={onClear}
            disabled={!hasFields}
            type="button"
          >
            <Trash2 size={15} /> Clear All
          </button>
        </div>
      </div>

      {/* Summary card */}
      <div className={styles.sideCard}>
        <h3>Summary</h3>
        <div className={styles.summaryList}>
          <div className={styles.summaryRow}>
            <LayoutList size={14} className={styles.summaryIcon} />
            Fields defined
            <strong>{fields.length}</strong>
          </div>
          <div className={styles.summaryRow}>
            <Asterisk size={14} className={styles.summaryIcon} />
            Required
            <strong>{requiredCount}</strong>
          </div>
          <div className={styles.summaryRow}>
            <Tag size={14} className={styles.summaryIcon} />
            Labeled
            <strong>{labeledCount}</strong>
          </div>
        </div>
      </div>

      {/* Saved notice */}
      {savedAt && (
        <div className={styles.savedNotice}>
          <CheckCircle2 size={14} />
          Saved at {savedAt.toLocaleTimeString()}
        </div>
      )}
    </aside>
  )
}
