import { useDispatch } from "react-redux";
import HotelForm from "./components/HotelForm";
import { createHotel } from "./store/hotelSlice";

const sampleHotel = {
  id: 1,
  title: "Lakeview Residency",
  description: "A calm business hotel close to the city centre.",
  latitude: 11.0168,
  longitude: 76.9558,
  price: 3200,
  imageUrl: "/images/seed/hotel-1.svg",
};

export default function App() {
  const dispatch = useDispatch();

  const handleCreate = async (values) => {
    const hotel = await dispatch(createHotel(values)).unwrap();
    alert(`Created hotel #${hotel.id}: ${hotel.title}`);
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 500 }}>
      <h2>Add mode</h2>
      <HotelForm onSubmit={handleCreate} submitLabel="Add hotel" />

      <hr />

      <h2>Edit mode</h2>
      <HotelForm
        initialValues={sampleHotel}
        onSubmit={(v) => console.log("Edit values:", v)}
        submitLabel="Save changes"
      />
    </div>
  );
}
