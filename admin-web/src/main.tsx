import { createRoot } from 'react-dom/client'
import Router from './routes/routes.tsx'

createRoot(document.getElementById('root')!).render(
    <Router />
)
