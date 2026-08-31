import { Navigate, Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { MarketsPage } from './pages/MarketsPage'
import { MarketDetailPage } from './pages/MarketDetailPage'
import { InventoryIdRedirect } from './components/Layout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/inventory" element={<MarketsPage />} />
      <Route path="/inventory/:id" element={<MarketDetailPage />} />
      <Route path="/markets" element={<Navigate to="/inventory" replace />} />
      <Route path="/markets/:id" element={<InventoryIdRedirect />} />
    </Routes>
  )
}
