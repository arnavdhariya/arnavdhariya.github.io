export default function Footer() {
  return (
    <footer className="bg-gray-700 shadow-md w-full">

      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center py-4">
        
        {/* Main text */}
        <p className="text-xs sm:text-sm md:text-base text-gray-600 break-words text-center sm:text-left">
          © {new Date().getFullYear()} Arnav Dhariya
        </p>

        {/* Social links */}
        <div className="flex flex-wrap justify-center gap-6 mt-3 sm:mt-0 text-sm sm:text-base text-gray-500">
          <a href="https://github.com/yourusername" target="_blank" className="hover:text-blue-600">
            GitHub
          </a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" className="hover:text-blue-600">
            LinkedIn
          </a>
          <a href="mailto:your@email.com" className="hover:text-blue-600">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
