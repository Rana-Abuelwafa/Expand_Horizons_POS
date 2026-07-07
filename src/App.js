import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import Home from "./pages/Home/LogoPage";
import LangSelector from "./pages/LanguageSelector/LanguagesPage";
import MainDestinations from "./pages/Destinations/MainDestinations";
import SubDestinations from "./pages/Destinations/SubDestinations";
import ExcursionPage from "./pages/Trips/ExcursionPage";
import DivingPage from "./pages/Trips/DivingPage";
import TransfersPage from "./pages/Trips/TransfersPage";
import BookingPage from "./pages/BookingPage/BookingPage";
import BookingConfirm from "./pages/BookingConfirmPage/BookingConfirm";
import PrintTicketPage from "./pages/BookingConfirmPage/PrintTicketPage";
import AvailabilityPage from "./pages/AvailabilityPage/AvailabilityPage";
import CarCategoriesPage from "./pages/CarCategories/CarCategoriesPage";
import BookingMapPage from "./pages/MapPage/BookingMapPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-popup-alert/dist/index.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import "./styles/main.scss";

// Defines POS route map and page composition.
function App() {
  return (
    <div className="App">
      {" "}
      <Router basename="/pos">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app-lang" element={<LangSelector />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Destinations" element={<MainDestinations />} />
          <Route path="/Destinations/:location" element={<SubDestinations />} />
          <Route path="/excursions/:location" element={<ExcursionPage />} />
          <Route path="/Diving" element={<DivingPage />} />
          <Route path="/car-categories" element={<CarCategoriesPage />} />
          <Route path="/Transfers" element={<TransfersPage />} />
          <Route path="/trip/:tripName" element={<AvailabilityPage />} />
          <Route path="/checkout" element={<BookingPage />} />
          <Route path="/bookingConfirmation" element={<BookingConfirm />} />
          <Route path="/bookingConfirmation/print" element={<PrintTicketPage />} />
          <Route path="/BookingMap" element={<BookingMapPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
