import { AlertCircle } from 'lucide-react'
import CustomSelect from '../ui/CustomSelect'
import styles from '../../styles/FormPreview.module.css'

const ERROR_STYLE = {
  border: '1.5px solid var(--danger)',
  boxShadow: '0 0 0 3px rgba(239,68,68,0.12)',
}

/**
 * Renders a single form field for the preview page based on its type.
 * Handles all supported input types and shows an inline validation error.
 */
export default function PreviewFormField({ field, value, error, onChange, onCheckbox }) {
  const inputStyle = error ? ERROR_STYLE : {}

  const renderInput = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            className={styles.formTextarea}
            style={inputStyle}
            placeholder={field.placeholder}
            value={value}
            onChange={e => onChange(field.id, e.target.value)}
          />
        )

      case 'select': {
        const selectOptions = [
          { value: '', label: '— Select an option —' },
          ...field.options.filter(Boolean).map(opt => ({ value: opt, label: opt })),
        ]
        return (
          <div style={error ? { borderRadius: 'var(--radius-sm)', ...inputStyle, padding: 0, overflow: 'hidden' } : {}}>
            <CustomSelect
              value={value}
              onChange={val => onChange(field.id, val)}
              options={selectOptions}
              placeholder="— Select an option —"
            />
          </div>
        )
      }

      case 'checkbox':
        return (
          <div className={styles.checkboxGroup}>
            {field.options.filter(Boolean).length === 0
              ? <span className={styles.noOptions}>No options defined</span>
              : field.options.filter(Boolean).map((opt, i) => (
                <label key={i} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={(value || []).includes(opt)}
                    onChange={e => onCheckbox(field.id, opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))
            }
          </div>
        )

      case 'radio':
        return (
          <div className={styles.radioGroup}>
            {field.options.filter(Boolean).length === 0
              ? <span className={styles.noOptions}>No options defined</span>
              : field.options.filter(Boolean).map((opt, i) => (
                <label key={i} className={styles.radioItem}>
                  <input
                    type="radio"
                    name={field.id}
                    value={opt}
                    checked={value === opt}
                    onChange={() => onChange(field.id, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))
            }
          </div>
        )

      case 'range':
        return (
          <div className={styles.rangeWrapper}>
            <input
              type="range"
              className={styles.rangeInput}
              min={0}
              max={100}
              value={value || 50}
              onChange={e => onChange(field.id, e.target.value)}
            />
            <span className={styles.rangeValue}>Value: {value || 50}</span>
          </div>
        )

      default:
        return (
          <input
            type={field.type}
            className={styles.formInput}
            style={inputStyle}
            placeholder={field.placeholder}
            value={value}
            onChange={e => onChange(field.id, e.target.value)}
          />
        )
    }
  }

  return (
    <div className={styles.formField}>
      <label className={styles.fieldLabel}>
        {field.label
          ? field.label
          : <em className={styles.unlabeled}>Unlabeled field</em>
        }
        {field.required && <span className={styles.required}>*</span>}
      </label>

      {renderInput()}

      {error && (
        <span className={styles.fieldError}>
          <AlertCircle size={12} strokeWidth={2.5} />
          {error}
        </span>
      )}
    </div>
  )
}
