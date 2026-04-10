import { useNavigate } from 'react-router-dom'
import { FileX2 } from 'lucide-react'
import styles from '../styles/FormBuilder.module.css'
import { useFormBuilder } from '../hooks/useFormBuilder'
import FieldCard      from '../components/form-builder/FieldCard'
import BuilderSidebar from '../components/form-builder/BuilderSidebar'

export default function FormBuilder() {
  const navigate = useNavigate()
  const {
    fields,
    savedAt,
    addField,
    updateField,
    removeField,
    saveForm,
    clearForm,
    addOption,
    updateOption,
    removeOption,
  } = useFormBuilder()

  const handleSaveAndPreview = () => {
    saveForm()
    navigate('/form-preview')
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1>Dynamic Form Builder</h1>
          <p>Add fields below to build your form structure, then preview &amp; submit it.</p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Field list */}
        <div className={styles.fieldsList}>
          {fields.length === 0 ? (
            <div className={styles.emptyState}>
              <FileX2 size={44} className={styles.emptyIcon} strokeWidth={1.5} />
              <h3>No fields yet</h3>
              <p>Click "Add Field" to start building your form.</p>
            </div>
          ) : (
            fields.map((field, index) => (
              <FieldCard
                key={field.id}
                field={field}
                index={index}
                onUpdate={updateField}
                onRemove={removeField}
                onAddOption={addOption}
                onUpdateOption={updateOption}
                onRemoveOption={removeOption}
              />
            ))
          )}
        </div>

        {/* Sidebar */}
        <BuilderSidebar
          fields={fields}
          savedAt={savedAt}
          onAdd={addField}
          onSave={saveForm}
          onSaveAndPreview={handleSaveAndPreview}
          onClear={clearForm}
        />
      </div>
    </div>
  )
}
