import Navbar from "../components/navbar";
import Footer from "../components/footer";
import NeuralBackground from "../components/background";

export default function About() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <NeuralBackground />
      
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-blue-600">Me</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Learn more about my journey, interests, and aspirations
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              {/* Profile Image Placeholder */}
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Your Photo Here</span>
                </div>
              </div>
              
              {/* About Text */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">My Story</h2>
                <p className="text-gray-700 leading-relaxed">
                  [Your personal story and background - where you're from, what inspired you to pursue computer science, your journey to UC Irvine, etc.]
                </p>
                <p className="text-gray-700 leading-relaxed">
                  [Your interests in AI research, what specific areas fascinate you, any early experiences with technology or programming, etc.]
                </p>
              </div>
            </div>

            {/* Education & Experience */}
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Education</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg text-blue-600">University of California, Irvine</h4>
                    <p className="text-gray-600">Bachelor of Science in Computer Science, Specialization in Intelligent Systems</p>
                    <p className="text-sm text-gray-500">2024-2027</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-blue-600">Relevant Coursework</h4>
                    <p className="text-gray-600">Data Structures and Algorithms, Computer Networks, Requirements Testing and Analysis, Probability Applications in CS, Intermediate Programming in C++, Intermediate Programming in Python, Discrete Mathematics.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Experience</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg text-blue-600">[Job/Internship Title]</h4>
                    <p className="text-gray-600">[Company/Organization Name]</p>
                    <p className="text-sm text-gray-500">[Duration]</p>
                    <p className="text-gray-600">[Brief description of your role and achievements]</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-blue-600">[Another Experience]</h4>
                    <p className="text-gray-600">[Organization]</p>
                    <p className="text-sm text-gray-500">[Duration]</p>
                    <p className="text-gray-600">[Description]</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Interests */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-16">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Skills & Interests</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-semibold text-lg text-blue-600 mb-3">Programming Languages</h4>
                  <p className="text-gray-600">[Python, JavaScript, Java, C++, etc.]</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-blue-600 mb-3">Technologies & Frameworks</h4>
                  <p className="text-gray-600">[React, Node.js, TensorFlow, PyTorch, etc.]</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-blue-600 mb-3">Research Interests</h4>
                  <p className="text-gray-600">[Machine Learning, Deep Learning, Computer Vision, NLP, etc.]</p>
                </div>
              </div>
            </div>

            {/* Personal Interests */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Beyond Code</h3>
              <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                [Your hobbies, interests outside of programming - sports, music, reading, travel, etc. This helps show your personality and makes you more relatable.]
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
