import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GameProvider } from './contexts/gameContext';
import './styles/index.css'

const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <GameProvider>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>

    </QueryClientProvider>
  </GameProvider>
)
