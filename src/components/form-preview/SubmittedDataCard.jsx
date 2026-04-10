import { PartyPopper, RotateCcw } from 'lucide-react'
import styles from '../../styles/FormPreview.module.css'

/**
 * Success state shown after a valid form submission.
 * Displays submitted values and a "Fill Again" action.
 */
export default function SubmittedDataCard({ data, onFillAgain }) {
  return (
    <div className={styles.successCard}>
      <PartyPopper size={52} className={styles.successIcon} strokeWidth={1.5} />
      <h2>Form Submitted!</h2>
      <p>Data printed to the browser console. Open DevTools → Console to inspect.</p>

      <div className={styles.submittedData}>
        <h4>Submitted Data</h4>
        {Object.entries(data).map(([key, val]) => (
          <div key={key} className={styles.dataItem}>
            <span className={styles.dataKey}>{key}:</span>
            <span className={styles.dataValue}>
              {Array.isArray(val) ? val.join(', ') || '—' : val || '—'}
            </span>
          </div>
        ))}
      </div>

      <button className={styles.fillAgainBtn} onClick={onFillAgain}>
        <RotateCcw size={15} /> Fill Again
      </button>
    </div>
  )
}
