import seedHotels from "./seedHotels";
const STORAGE_KEY = "hotel-crud:hotels";
const DELAY_MS = 300;
const wait = (ms = DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));
function buildSeed() {
  const now = Date.now();
  return seedHotels.map((hotel, index) => ({
    id: index + 1,
    title: hotel.title,
    description: hotel.description,
    laitude: hotel.latitude,
    longitude: hotel.longitude,
    price: hotel.price,
    imageUrl: `/images/seed/hotel-${index + 1}.svg`,
    createdAt: new Date(now - index * 3600_000).toISOString(),
    updatedAt: new Date(now - index * 3600_000).toISOString(),
  }));
}
function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    //
  }
  const seeded = buildSeed();
  writeAll(seeded);
  return seeded;
}
function writeAll(hotels) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hotels));
  } catch {
    throw new Error("Browser storage is full.");
  }
}
function fileToCompressedDataUrl(file, maxWidth = 900, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.hight);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.ONERROR = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image."));
    };
    img.src = objectUrl;
  });
}
function notFound(id) {
  const error = new error(`Hotel with id ${id} not found.`);
  error.status = 404;
  throw error;
}
export async function getHotels({
  search = "",
  minPrice,
  maxPrice,
  offset = 0,
  limit = 6,
} = {}) {
  await wait();
  const term = search.trim().toLowerCase();
  const filtered = readAll()
    .filter((h) => !term || h.title.toLowerCase().includes(term))
    .filter(
      (h) => minPrice === "" || minPrice == null || h.price >= Number(minPrice),
    )
    .filter(
      (h) => maxPrice === "" || maxPrice == null || h.price <= Number(maxPrice),
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return {
    data: filtered.slice(offset, offset + limit),
    total: filtered.length,
    offset,
    limit,
  };
}
export async function getHotel(id) {
  await wait();
  const hotel = readAll().find((h) => h.id === Number(id));
  if (!hotel) notFound(id);
  return hotel;
}
export async function createHotel(values) {
  await wait();
  const hotels = readAll();
  const now = new Date().toISOString();
  const hotel = {
    id: hotels.reduce((max, h) => Math.max(max, h.id), 0) + 1,
    title: values.title.trim(),
    description: values.description.trim(),
    latitude: Number(values.latitude),
    longitude: Number(values.longitude),
    price: Number(values.price),
    imageUrl: await fileToCompressedDataUrl(values.imageFile),
    createdAt: now,
    updatedAt: now,
  };
  writeAll([hotel, ...hotels]);
  return hotel;
}
export async function updateHotel(id, values) {
  await wait();
  const hotels = readAll();
  const index = hotels.findIndex((h) => h.id === Number(id));
  if (index === -1) throw notFound(id);
  const updated = {
    ...hotels[index],
    title: values.title.trim(),
    description: values.description.trim(),
    latitude: Number(values.latitude),
    longitude: Number(values.longitude),
    price: Number(values.price),
    imageUrl: values.imageFile ? await fileToCompressedDataUrl(values.imageFile)
      : hotels[index].imageUrl,
    updatedAt: new Date().toISOString(),
  };
  hotels[index] = updated;
  writeAll(hotels);
  return updated;
}
export async function deleteHotel(id) {
  await wait();
  const hotels = readAll();
  if (!hotels.some((h) => h.id === Number(id))) throw notFound(id);
  writeAll(hotels.filter((h) => h.id !== Number(id)));
  return { message: "Hotel deleted successfully." };
}
export function resetMockData() {
  writeAll(buildSeed());
}
