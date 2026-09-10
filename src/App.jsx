import { Routes, Route } from "react-router-dom";
import GemstoneHero from "./components/GemstoneHero";
import GemstoneProducts from "./components/GemstoneProducts";
import GemstoneDetailPage from "./pages/GemstoneDetailPage";

/**
 * Demo shell — a placeholder header/footer stand in for the EXISTING
 * Veda Structure site chrome so you can preview things in context.
 * Delete this file's header/footer bars when you merge into the real
 * site; only the routed pages below are meant to ship.
 */
function HomePage() {
  return (
    <div>
      <GemstoneHero />
      {/* Home grid: no price, no Quick View, no Add to Cart — the card
          is purely a navigation tile to that gemstone's own page. */}
      <GemstoneProducts showPrice={false} showQuickView={false} showAddToCart={false} linkToDetail />
    </div>
  );
}

function App() {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-[#3A2417]/10 bg-[#FAF6F0] px-8 py-4 text-sm text-[#3A2417]/60">
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* ONE shared dynamic page for every gemstone — content changes
            based on :id, no separate page created per gemstone. */}
        <Route path="/gemstone/:id" element={<GemstoneDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;