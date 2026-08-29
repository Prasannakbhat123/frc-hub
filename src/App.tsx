import { Navigate, Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { MarketsPage } from './pages/MarketsPage'
// === LIST_ONLY: detail page off ===
// import { MarketDetailPage } from './pages/MarketDetailPage'
// import { InventoryIdRedirect } from './components/Layout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/inventory" element={<MarketsPage />} />
      {/* === LIST_ONLY: detail page off ===
      <Route path="/inventory/:id" element={<MarketDetailPage />} />
      */}
      <Route path="/inventory/:id" element={<Navigate to="/inventory" replace />} />
      <Route path="/markets" element={<Navigate to="/inventory" replace />} />
      <Route path="/markets/:id" element={<Navigate to="/inventory" replace />} />
      {/* === LIST_ONLY was: <Route path="/markets/:id" element={<InventoryIdRedirect />} /> */}
    </Routes>
  )
}
