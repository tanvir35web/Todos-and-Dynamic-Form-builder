import { useState } from 'react'
import { FORM_STORAGE_KEY } from '../constants'

// Re-export so existing imports of INPUT_TYPES from this file still work
export { INPUT_TYPES } from '../constants'

const STORAGE_KEY = FORM_STORAGE_KEY

function createField(overrides = {}) {
  return {
    id: `field_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    label: '',
    type: 'text',
    placeholder: '',
    required: false,
    options: [], // for select, checkbox, radio
    ...overrides,
  }
}

export function useFormBuilder() {
  const [fields, setFields] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [savedAt, setSavedAt] = useState(null)

  const addField = () => {
    setFields(prev => [...prev, createField()])
  }

  const updateField = (id, updates) => {
    setFields(prev =>
      prev.map(f => f.id === id ? { ...f, ...updates } : f)
    )
  }

  const removeField = (id) => {
    setFields(prev => prev.filter(f => f.id !== id))
  }

  const saveForm = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fields))
      setSavedAt(new Date())
    } catch (e) {
      console.error('Failed to save form config:', e)
    }
  }

  const clearForm = () => {
    setFields([])
    localStorage.removeItem(STORAGE_KEY)
    setSavedAt(null)
  }

  const loadSavedForm = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  }

  // Add/remove options for select, checkbox, radio
  const addOption = (fieldId) => {
    updateField(fieldId, {
      options: [
        ...(fields.find(f => f.id === fieldId)?.options || []),
        ''
      ]
    })
  }

  const updateOption = (fieldId, optionIndex, value) => {
    const field = fields.find(f => f.id === fieldId)
    if (!field) return
    const newOptions = [...field.options]
    newOptions[optionIndex] = value
    updateField(fieldId, { options: newOptions })
  }

  const removeOption = (fieldId, optionIndex) => {
    const field = fields.find(f => f.id === fieldId)
    if (!field) return
    const newOptions = field.options.filter((_, i) => i !== optionIndex)
    updateField(fieldId, { options: newOptions })
  }

  return {
    fields,
    savedAt,
    addField,
    updateField,
    removeField,
    saveForm,
    clearForm,
    loadSavedForm,
    addOption,
    updateOption,
    removeOption,
  }
}
