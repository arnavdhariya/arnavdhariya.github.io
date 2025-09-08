import Navbar from "../components/navbar";
import Footer from "../components/footer";
import NeuralBackground from "../components/background";

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "[Project Title 1]",
      description: "[Brief description of your project - what it does, what problem it solves, technologies used, etc.]",
      image: "/api/placeholder/400/300",
      technologies: ["[Tech 1]", "[Tech 2]", "[Tech 3]"],
      github: "https://github.com/yourusername/project1",
      demo: "https://your-demo-link.com",
      featured: true
    },
    {
      id: 2,
      title: "[Project Title 2]",
      description: "[Another project description - focus on different technologies or problem domain]",
      image: "/api/placeholder/400/300",
      technologies: ["[Tech 1]", "[Tech 2]", "[Tech 3]"],
      github: "https://github.com/yourusername/project2",
      demo: "https://your-demo-link.com",
      featured: true
    },
    {
      id: 3,
      title: "[Project Title 3]",
      description: "[Third project - maybe a smaller project or different type of application]",
      image: "/api/placeholder/400/300",
      technologies: ["[Tech 1]", "[Tech 2]"],
      github: "https://github.com/yourusername/project3",
      demo: null,
      featured: false
    },
    {
      id: 4,
      title: "[Project Title 4]",
      description: "[Fourth project - could be a class project, hackathon project, or personal experiment]",
      image: "/api/placeholder/400/300",
      technologies: ["[Tech 1]", "[Tech 2]", "[Tech 3]", "[Tech 4]"],
      github: "https://github.com/yourusername/project4",
      demo: "https://your-demo-link.com",
      featured: false
    }
  ];

  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  return (
    <div className="relative min-h-screen flex flex-col">
      <NeuralBackground />
      
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              My <span className="text-blue-600">Projects</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              A collection of my work, from web applications to AI experiments
            </p>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Featured Projects</h2>
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {featuredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Project Screenshot</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{project.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex space-x-4">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <span>🐙</span>
                        <span>GitHub</span>
                      </a>
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <span>🚀</span>
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Projects */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Other Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Project Screenshot</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{project.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex space-x-4">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        GitHub
                      </a>
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Interested in collaborating?</h2>
            <p className="text-lg text-gray-600 mb-8">
              I'm always excited to work on new projects and explore innovative ideas. Let's build something amazing together!
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
