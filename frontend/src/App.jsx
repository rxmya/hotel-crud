import { Link, Route, Routes } from "react-router-dom";
import HotelListPage from "./pages/HotelListPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import HotelFormPage from "./pages/HotelFormPage";

export default function App() {
  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            StayFinder
          </Link>
          <Link to="/hotels/new" className="btn btn-primary">
            + Add Hotel
          </Link>
        </div>
      </header>

      <main className="container main">
        <Routes>
          <Route path="/" element={<HotelListPage />} />
          <Route path="/hotels/new" element={<HotelFormPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/hotels/:id/edit" element={<HotelFormPage />} />
          <Route
            path="*"
            element={
              <p>
                Page not found. <Link to="/">Go home</Link>
              </p>
            }
          />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container">StayFinder · Hotel CRUD assessment</div>
      </footer>
    </>
  );
}
