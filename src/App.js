import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home/LogoPage";
import LangSelector from "./pages/LanguageSelector/LanguagesPage";
import HomeCategories from "./pages/Categories/HomeCategories";
function App() {
  return (
    <div className="App">
      {" "}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app-lang" element={<LangSelector />} />
          <Route path="/home" element={<HomeCategories />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
