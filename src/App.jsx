import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import TodoList from './pages/TodoList'
import FormBuilder from './pages/FormBuilder'
import FormPreview from './pages/FormPreview'
import styles from './styles/App.module.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.appContainer}>
        <Navbar />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Navigate to="/todos" replace />} />
            <Route path="/todos" element={<TodoList />} />
            <Route path="/form-builder" element={<FormBuilder />} />
            <Route path="/form-preview" element={<FormPreview />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
