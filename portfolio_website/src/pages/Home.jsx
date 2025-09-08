// export const Home = () => {
//     <section className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-blue-50 to-white">
//       <h1 className="text-5xl font-bold mb-4">
//         Hi, I’m <span className="text-blue-600">Arnav Dhariya</span>
//       </h1>
//       <p className="text-xl text-gray-700 mb-6">
//         Computer Science Major @ UC Irvine · Aspiring AI Researcher
//       </p>
//       <div className="space-x-4">
//         <a
//           href="#projects"
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
//         >
//           View Projects
//         </a>
//         <a
//           href="#contact"
//           className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300"
//         >
//           Contact Me
//         </a>
//       </div>
//     </section>
// }
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import NeuralBackground from "../components/background";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <NeuralBackground /> {/* 👈 Animated background */}

      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Hi, I'm <span className="text-blue-600">Arnav</span>
        </h1>
        <p className="text-lg md:text-2xl text-white-700 mb-6">
          CS Major @ UC Irvine · Aspiring AI Researcher
        </p>
        <div className="space-x-4">
          <a
            href="#projects"
            className="px-5 py-3 bg-blue-600 text-black rounded-lg shadow hover:bg-700"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-5 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300"
          >
            Contact Me
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
