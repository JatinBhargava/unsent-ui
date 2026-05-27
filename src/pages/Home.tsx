import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] text-gray-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.85),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(209,250,229,0.35),transparent_35%)]" />
      <Navbar />
      <Hero />
      <Footer />
      <div className="pointer-events-none absolute top-16 sm:top-24 md:top-32 left-4 sm:left-10 md:left-20 h-40 w-40 sm:h-72 sm:w-72 rounded-full bg-amber-200/50 blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-4 sm:bottom-10 md:bottom-20 right-4 sm:right-10 md:right-20 h-40 w-40 sm:h-72 sm:w-72 rounded-full bg-cyan-200/45 blur-3xl -z-10" />
    </div>
  );
}
