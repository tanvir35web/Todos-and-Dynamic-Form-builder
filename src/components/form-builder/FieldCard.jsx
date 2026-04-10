import { Trash2 } from 'lucide-react'
import OptionsEditor from './OptionsEditor'
import CustomSelect from '../ui/CustomSelect'
import { INPUT_TYPES, OPTION_TYPES } from '../../constants'
import styles from '../../styles/FormBuilder.module.css'

/**
 * Card UI for a single form field definition.
 * Renders label, type selector, placeholder, required toggle,
 * and conditionally the options editor for select/checkbox/radio types.
 */
export default function FieldCard({
  field,
  index,
  onUpdate,
  onRemove,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}) {
  return (
    <div className={styles.fieldCard}>
      <div className={styles.fieldCardHeader}>
        <div className={styles.fieldIndex}>{index + 1}</div>
        <h3>{field.label || `Field ${index + 1}`}</h3>
        <span className={styles.typeTag}>{field.type}</span>
        <button
          className={styles.removeBtn}
          onClick={() => onRemove(field.id)}
          title="Remove field"
          type="button"
        >
          <Trash2 size={15} strokeWidth={2} />
        </button>
      </div>

      <div className={styles.fieldGrid}>
        <div className={styles.formGroup}>
          <label>Field Label / Name</label>
          <input
            type="text"
            placeholder="e.g. User Name, Email…"
            value={field.label}
            onChange={e => onUpdate(field.id, { label: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Input Type</label>
          <CustomSelect
            value={field.type}
            onChange={val => onUpdate(field.id, { type: val, options: [] })}
            options={INPUT_TYPES}
          />
        </div>

        {!OPTION_TYPES.includes(field.type) && (
          <div className={styles.formGroup}>
            <label>Placeholder</label>
            <input
              type="text"
              placeholder="Placeholder text…"
              value={field.placeholder}
              onChange={e => onUpdate(field.id, { placeholder: e.target.value })}
            />
          </div>
        )}

        <div className={styles.formGroup} style={{ justifyContent: 'flex-end' }}>
          <label>Validation</label>
          <label className={styles.requiredToggle}>
            <input
              type="checkbox"
              checked={field.required}
              onChange={e => onUpdate(field.id, { required: e.target.checked })}
            />
            <span>Required field</span>
          </label>
        </div>
      </div>

      {OPTION_TYPES.includes(field.type) && (
        <OptionsEditor
          fieldId={field.id}
          options={field.options}
          onAdd={onAddOption}
          onUpdate={onUpdateOption}
          onRemove={onRemoveOption}
        />
      )}
    </div>
  )
}
