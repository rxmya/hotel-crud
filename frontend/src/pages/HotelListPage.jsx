import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Seo from "../components/Seo";
import HotelCard from "../components/HotelCard";
import Pagination from "../components/Pagination";
import Popup from "../components/Popup";
import {
  PAGE_SIZE,
  clearFilters,
  deleteHotel,
  fetchHotels,
  setFilters,
  setPage,
} from "../store/hotelSlice";

export default function HotelListPage() {
  const dispatch = useDispatch();
  const { items, total, page, filters, status, error } = useSelector(
    (state) => state.hotels,
  );
  const [search, setSearch] = useState(filters.search);
  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
  const [priceError, setPriceError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch, page, filters]);
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: search.trim() }));
  };
  const handlePriceFilter = (e) => {
    e.preventDefault();
    if (
      minPrice !== "" &&
      maxPrice !== "" &&
      Number(minPrice) > Number(maxPrice)
    ) {
      setPriceError("Min price cannot be greater than max price.");
      return;
    }
    setPriceError("");
    dispatch(setFilters({ minPrice, maxPrice }));
  };
  const handleClear = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setPriceError("");
    dispatch(clearFilters());
  };

  const handleDelete = async (hotel) => {
    if (!window.confirm(`Delete "${hotel.title}"? This cannot be undone.`))
      return;
    try {
      await dispatch(deleteHotel(hotel.id)).unwrap();
      setMessage(`"${hotel.title}" was deleted successfully.`);
      if (items.length === 1 && page > 1) dispatch(setPage(page - 1));
      else dispatch(fetchHotels());
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };
  return (
    <>
      <Seo
        title="Find Hotels"
        description="Browse, search and filter hotels by price."
      />
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search hotels by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
      <div className="list-layout">
        <aside className="filter-box">
          <h3>Price per night (₹)</h3>
          <form onSubmit={handlePriceFilter}>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            {priceError && <p className="error">{priceError}</p>}
            <button type="submit" className="btn btn-outline">
              Apply
            </button>
          </form>
          <button className="btn btn-link" onClick={handleClear}>
            Clear all filters
          </button>
        </aside>
        <section className="list-results">
          <p className="muted">{total} hotels found</p>
          {status === "loading" && <p>Loading hotels…</p>}
          {status === "failed" && <p className="error">{error}</p>}
          {status === "succeeded" && items.length === 0 && (
            <p>No hotels match your search.</p>
          )}
          {items.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} onDelete={handleDelete} />
          ))}
          <Pagination
            page={page}
            totalPages={Math.ceil(total / PAGE_SIZE)}
            onPageChange={(p) => dispatch(setPage(p))}
          />
        </section>
      </div>
      <Popup message={message} onClose={() => setMessage("")} />
    </>
  );
}