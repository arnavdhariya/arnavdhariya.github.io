// import {BrowserRouter} from "react-router-dom"
// function App() {
//   return 
//   <>
//     <BrowserRouter>
//       <Routes>
//         <Route index element={<Home />}/>
//         <Route path="*" element={<NotFound/>}/>
//       </Routes>
//     </BrowserRouter>
//   </>;
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Research from "./pages/Research";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/research" element={<Research />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}