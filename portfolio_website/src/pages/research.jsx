import Navbar from "../components/navbar";
import Footer from "../components/footer";
import NeuralBackground from "../components/background";

export default function Research() {
  const researchAreas = [
    {
      title: "[Research Area 1]",
      description: "[Description of your research interest - e.g., Natural Language Processing, Computer Vision, Machine Learning, etc.]",
      icon: "🧠",
      details: "[More detailed explanation of what you're working on or interested in within this area]"
    },
    {
      title: "[Research Area 2]",
      description: "[Another research area you're passionate about]",
      icon: "🔬",
      details: "[Details about your work or interests in this field]"
    },
    {
      title: "[Research Area 3]",
      description: "[Third research interest or specialization]",
      icon: "⚡",
      details: "[Specific details about this research area]"
    }
  ];

  const publications = [
    {
      title: "[Publication Title 1]",
      authors: "[Your Name], [Co-authors]",
      venue: "[Conference/Journal Name]",
      year: "[Year]",
      status: "Published",
      link: "https://example.com/paper1",
      description: "[Brief description of the research contribution]"
    },
    {
      title: "[Publication Title 2]",
      authors: "[Your Name], [Co-authors]",
      venue: "[Conference/Journal Name]",
      year: "[Year]",
      status: "Under Review",
      link: null,
      description: "[Description of ongoing research]"
    }
  ];

  const projects = [
    {
      title: "[Research Project 1]",
      description: "[Description of your research project - what you're investigating, methodology, expected outcomes]",
      status: "Ongoing",
      timeline: "[Start Date] - [Expected End Date]",
      supervisor: "[Professor/Advisor Name]",
      technologies: ["[Tool 1]", "[Tool 2]", "[Framework]"]
    },
    {
      title: "[Research Project 2]",
      description: "[Another research project you're working on]",
      status: "Completed",
      timeline: "[Start Date] - [End Date]",
      supervisor: "[Professor/Advisor Name]",
      technologies: ["[Tool 1]", "[Tool 2]"]
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col">
      <NeuralBackground />
      
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Research & <span className="text-blue-600">Innovation</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Exploring the frontiers of artificial intelligence and machine learning
            </p>
          </div>
        </section>

        {/* Research Interests */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Research Interests</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {researchAreas.map((area, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{area.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{area.title}</h3>
                  <p className="text-gray-600 mb-4">{area.description}</p>
                  <p className="text-sm text-gray-500">{area.details}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Publications */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Publications</h2>
            <div className="space-y-6">
              {publications.map((pub, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 md:mb-0">{pub.title}</h3>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        pub.status === 'Published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {pub.status}
                      </span>
                      <span className="text-gray-500">{pub.year}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{pub.authors}</p>
                  <p className="text-blue-600 font-medium mb-3">{pub.venue}</p>
                  <p className="text-gray-700 mb-4">{pub.description}</p>
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span>📄</span>
                      <span>Read Paper</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Research Projects */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Research Projects</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      project.status === 'Ongoing' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Timeline:</span> {project.timeline}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Supervisor:</span> {project.supervisor}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Academic Background */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Academic Background</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Education</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-blue-600">University of California, Irvine</h4>
                      <p className="text-gray-600">Bachelor of Science in Computer Science</p>
                      <p className="text-sm text-gray-500">[Expected Graduation Year]</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-600">Research Focus</h4>
                      <p className="text-gray-600">[Your specific research focus or specialization]</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Research Experience</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-blue-600">[Research Position/Title]</h4>
                      <p className="text-gray-600">[Lab/Department Name]</p>
                      <p className="text-sm text-gray-500">[Duration]</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-600">[Another Research Experience]</h4>
                      <p className="text-gray-600">[Organization/Lab]</p>
                      <p className="text-sm text-gray-500">[Duration]</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Interested in my research?</h2>
            <p className="text-lg text-gray-600 mb-8">
              I'm always excited to discuss research ideas, collaborate on projects, or share insights about AI and machine learning.
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Let's Collaborate
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
