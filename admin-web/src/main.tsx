import { createRoot } from 'react-dom/client';
import Router from './routes/routes.tsx';
import './style.css';

createRoot(document.getElementById('root')!).render(
    <Router />
)
