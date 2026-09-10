import GemstoneHero from "./components/GemstoneHero";
import GemstoneProducts from "./components/GemstoneProducts";

/**
 * Demo shell — a placeholder header/footer stand in for the EXISTING
 * Veda Structure site chrome so you can preview GemstoneHero in
 * context. Delete this file's header/footer bars when you merge
 * <GemstoneHero /> into the real site; only the component itself is
 * meant to ship.
 */
function App() {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-[#3A2417]/10 bg-[#FAF6F0] px-8 py-4 text-sm text-[#3A2417]/60">
      </div>

      <GemstoneHero />
      <GemstoneProducts />

    </div>
  );
}

export default App;