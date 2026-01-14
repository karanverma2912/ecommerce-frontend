import { Suspense } from "react";
import { ProductGrid } from "./components/ProductGrid";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-black text-white selection:bg-cyan-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-8">
        {/* Hero Section */}
        <header className="mb-8 text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium text-cyan-300 mb-4">
            The Future of Shopping
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-neutral-500 tracking-tight">
            NextGen Ecommerce
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Experience the next evolution of digital retail.
            Curated products for the modern lifestyle.
          </p>
        </header>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4">
        <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center"><div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>}>
          <ProductGrid />
        </Suspense>
      </div>
    </main>
  );
}
