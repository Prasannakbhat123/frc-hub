import { Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
// === LANDING_ONLY: restore inventory + backend pages - uncomment block below ===
// import { Navigate } from 'react-router-dom'
// import { MarketsPage } from './pages/MarketsPage'
// import { MarketDetailPage } from './pages/MarketDetailPage'
// import { InventoryIdRedirect } from './components/Layout'
// === /LANDING_ONLY ===

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Catch-all: keep visitors on landing while inventory is offline */}
      <Route path="*" element={<LandingPage />} />

      {/* === LANDING_ONLY: restore inventory + backend pages - uncomment block below ===
      <Route path="/inventory" element={<MarketsPage />} />
      <Route path="/inventory/:id" element={<MarketDetailPage />} />
      <Route path="/markets" element={<Navigate to="/inventory" replace />} />
      <Route path="/markets/:id" element={<InventoryIdRedirect />} />
      === /LANDING_ONLY === */}
    </Routes>
  )
}
