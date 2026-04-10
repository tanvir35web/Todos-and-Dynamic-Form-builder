import { Plus, X } from 'lucide-react'
import styles from '../../styles/FormBuilder.module.css'

/**
 * Options list editor for select, checkbox, and radio field types.
 * Renders a row per option with an inline remove button, plus an "Add Option" row.
 */
export default function OptionsEditor({ fieldId, options, onAdd, onUpdate, onRemove }) {
  return (
    <div className={styles.optionsSection}>
      <label>Options</label>

      {options.map((opt, idx) => (
        <div key={idx} className={styles.optionRow}>
          <input
            type="text"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={e => onUpdate(fieldId, idx, e.target.value)}
          />
          <button
            className={styles.removeOptionBtn}
            onClick={() => onRemove(fieldId, idx)}
            title="Remove option"
            type="button"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      ))}

      <button
        className={styles.addOptionBtn}
        onClick={() => onAdd(fieldId)}
        type="button"
      >
        <Plus size={14} /> Add Option
      </button>
    </div>
  )
}
