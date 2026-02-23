import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home/LogoPage";
import LangSelector from "./pages/LanguageSelector/LanguagesPage";
import HomeCategories from "./pages/Categories/HomeCategories";
import MainDestinations from "./pages/Destinations/MainDestinations";
import SubDestinations from "./pages/Destinations/SubDestinations";

function App() {
  return (
    <div className="App">
      {" "}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app-lang" element={<LangSelector />} />
          <Route path="/home" element={<HomeCategories />} />
          <Route path="/Destinations" element={<MainDestinations />} />
          <Route
                path="/Destinations/:location"
                element={<SubDestinations />}
              />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
