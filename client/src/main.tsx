import ReactDOM from 'react-dom/client'
import App from './app/App'

const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />)
} else {
  console.error('Элемент с идентификатором "root" не найден')
}