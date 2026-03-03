import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900">
      <Navbar />
      <Hero />
      <Footer />
      <div className="absolute top-16 sm:top-24 md:top-32 left-4 sm:left-10 md:left-20 w-40 sm:w-72 h-40 sm:h-72 bg-pink-200 rounded-full blur-3xl opacity-40 -z-10" />
      <div className="absolute bottom-4 sm:bottom-10 md:bottom-20 right-4 sm:right-10 md:right-20 w-40 sm:w-72 h-40 sm:h-72 bg-purple-200 rounded-full blur-3xl opacity-40 -z-10" />
    </div>
  );
}
