// ─── Form Builder ─────────────────────────────────────────────────────────────

export const FORM_STORAGE_KEY = 'form_builder_config'

export const INPUT_TYPES = [
  { value: 'text',     label: 'Text Input' },
  { value: 'email',    label: 'Email Input' },
  { value: 'number',   label: 'Number Input' },
  { value: 'tel',      label: 'Phone Number' },
  { value: 'url',      label: 'URL Input' },
  { value: 'password', label: 'Password' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select',   label: 'Dropdown (Select)' },
  { value: 'checkbox', label: 'Checkbox Group' },
  { value: 'radio',    label: 'Radio Group' },
  { value: 'date',     label: 'Date Picker' },
  { value: 'time',     label: 'Time Picker' },
  { value: 'range',    label: 'Range Slider' },
]

/** Types that require an options list (select, checkbox, radio) */
export const OPTION_TYPES = ['select', 'checkbox', 'radio']

// ─── Todo List ────────────────────────────────────────────────────────────────

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

export const DEFAULT_FILTERS = {
  userFilter:   '',
  statusFilter: '',
  page:         1,
  limit:        10,
}
