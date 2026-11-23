import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotels, setPage, PAGE_SIZE } from "./store/hotelSlice";
import Seo from "./components/Seo";
import Popup from "./components/Popup";
import HotelCard from "./components/HotelCard";
import Pagination from "./components/Pagination";

export default function App() {
  const dispatch = useDispatch();
  const { items, total, page } = useSelector((state) => state.hotels);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch, page]);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <Seo title="Component test" description="Testing components" />

      {items.map((hotel) => (
        <HotelCard
          key={hotel.id}
          hotel={hotel}
          onDelete={(h) => setMessage(`Delete clicked: ${h.title}`)}
        />
      ))}

      <Pagination
        page={page}
        totalPages={Math.ceil(total / PAGE_SIZE)}
        onPageChange={(p) => dispatch(setPage(p))}
      />

      <Popup message={message} onClose={() => setMessage("")} />
    </div>
  );
}
