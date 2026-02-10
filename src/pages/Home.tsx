import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900">
      <Navbar />
      <Hero />
      <Footer/>
      <div className="absolute top-32 left-20 w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-40 -z-10" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-40 -z-10" />
    </div>
  );
}