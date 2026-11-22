import { useEffect, useState } from "react";
import hotelApi, { USE_MOCK_API } from "./api/hotelApi";

export default function App() {
  const [result, setResult] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    hotelApi.getHotels({ search, offset: 0, limit: 5 }).then(setResult);
  }, [search]);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <p>Mock mode: {String(USE_MOCK_API)}</p>
      <input
        placeholder="Search…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {!result ? (
        <p>Loading…</p>
      ) : (
        <>
          <p>
            Total matches: {result.total} (showing {result.data.length})
          </p>
          {result.data.map((h) => (
            <div
              key={h.id}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <img src={h.imageUrl} alt="" width="80" />
              <span>
                #{h.id} {h.title}: ₹{h.price}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
