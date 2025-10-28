import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GameProvider } from './contexts/gameContext';
import AOS from 'aos';
import './styles/index.css'
import 'aos/dist/aos.css';
const queryClient = new QueryClient()
AOS.init();
createRoot(document.getElementById('root')!).render(
  <GameProvider>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>

    </QueryClientProvider>
  </GameProvider>
)
