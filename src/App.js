import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home/LogoPage";
import LangSelector from "./pages/LanguageSelector/index";
function App() {
  return (
    <div className="App">
      {" "}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app-lang" element={<LangSelector />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
