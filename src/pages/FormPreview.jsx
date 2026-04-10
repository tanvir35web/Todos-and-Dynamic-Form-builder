import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileSearch } from 'lucide-react'
import styles from '../styles/FormPreview.module.css'
import { FORM_STORAGE_KEY } from '../constants'
import PreviewFormField  from '../components/form-preview/PreviewFormField'
import SubmittedDataCard from '../components/form-preview/SubmittedDataCard'

function loadFields() {
  try {
    const saved = localStorage.getItem(FORM_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function initValues(fields) {
  return fields.reduce((acc, field) => {
    acc[field.id] = field.type === 'checkbox' ? [] : ''
    return acc
  }, {})
}

export default function FormPreview() {
  const navigate = useNavigate()
  const fields = loadFields()

  const [values, setValues]               = useState(() => initValues(fields))
  const [submitted, setSubmitted]         = useState(false)
  const [submittedData, setSubmittedData] = useState(null)
  const [errors, setErrors]               = useState({})

  // ── Validation ────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {}
    fields.forEach(field => {
      if (field.required) {
        const val = values[field.id]
        if (!val || (Array.isArray(val) && val.length === 0)) {
          newErrors[field.id] = `${field.label || 'This field'} is required`
        }
      }
    })
    return newErrors
  }

  // ── Handlers ──────────────────────────────────────────────────
  const handleChange = (fieldId, value) => {
    setValues(prev => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) setErrors(prev => { const n = { ...prev }; delete n[fieldId]; return n })
  }

  const handleCheckbox = (fieldId, option, checked) => {
    setValues(prev => {
      const current = prev[fieldId] || []
      return {
        ...prev,
        [fieldId]: checked ? [...current, option] : current.filter(v => v !== option),
      }
    })
    if (errors[fieldId]) setErrors(prev => { const n = { ...prev }; delete n[fieldId]; return n })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }

    const output = {}
    fields.forEach(field => { output[field.label || field.id] = values[field.id] })
    console.log('Form submitted:', output)
    setSubmittedData(output)
    setSubmitted(true)
  }

  const handleReset = () => { setValues(initValues(fields)); setErrors({}) }

  const handleFillAgain = () => {
    setValues(initValues(fields))
    setErrors({})
    setSubmitted(false)
    setSubmittedData(null)
  }

  // ── Success state ─────────────────────────────────────────────
  if (submitted && submittedData) {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate('/form-builder')}>
          <ArrowLeft size={15} /> Back to Builder
        </button>
        <SubmittedDataCard data={submittedData} onFillAgain={handleFillAgain} />
      </div>
    )
  }

  // ── Empty state ───────────────────────────────────────────────
  if (fields.length === 0) {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate('/form-builder')}>
          <ArrowLeft size={15} /> Back to Builder
        </button>
        <div className={styles.emptyState}>
          <FileSearch size={44} className={styles.emptyIcon} strokeWidth={1.5} />
          <h3>No form saved yet</h3>
          <p>Go to the Form Builder to create and save a form first.</p>
          <button className={styles.goBuilderBtn} onClick={() => navigate('/form-builder')}>
            Go to Form Builder
          </button>
        </div>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/form-builder')}>
        <ArrowLeft size={15} /> Back to Builder
      </button>

      <div className={styles.header}>
        <h1>Form Preview</h1>
        <p>This is how your form looks. Fill it out and submit!</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formCard}>
          <div className={styles.formCardHeader}>
            <h2>My Custom Form</h2>
            <p>Please fill in the fields below</p>
            <div className={styles.fieldCount}>
              {fields.length} field{fields.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className={styles.formBody}>
            {fields.map(field => (
              <PreviewFormField
                key={field.id}
                field={field}
                value={values[field.id]}
                error={errors[field.id]}
                onChange={handleChange}
                onCheckbox={handleCheckbox}
              />
            ))}
          </div>

          <div className={styles.formFooter}>
            <button type="button" className={styles.resetBtn} onClick={handleReset}>
              Reset
            </button>
            <button type="submit" className={styles.submitBtn}>
              Submit Form →
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
