const BASE_URL = `${import.meta.env.VITE_API_URL || ""}/api/hotels`;

async function handleResponse(response) {
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(
      data?.message || `Request failed (status ${response.status}).`,
    );
    error.errors = data?.errors || {};
    throw error;
  }

  if (!data) {
    throw new Error(
      "The server did not return JSON. Is the backend running and the Vite proxy set up?",
    );
  }

  return data;
}

function toFormData(values) {
  const formData = new FormData();
  formData.append("title", values.title.trim());
  formData.append("description", values.description.trim());
  formData.append("latitude", String(values.latitude));
  formData.append("longitude", String(values.longitude));
  formData.append("price", String(values.price));
  if (values.imageFile) {
    formData.append("image", values.imageFile);
  }
  return formData;
}

export const httpApi = {
  async getHotels({
    search = "",
    minPrice = "",
    maxPrice = "",
    offset = 0,
    limit = 6,
  } = {}) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (minPrice !== "" && minPrice != null) params.set("minPrice", minPrice);
    if (maxPrice !== "" && maxPrice != null) params.set("maxPrice", maxPrice);
    params.set("offset", String(offset));
    params.set("limit", String(limit));

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    return handleResponse(response);
  },

  async getHotelById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    return handleResponse(response);
  },

  async createHotel(values) {
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: toFormData(values),
    });
    return handleResponse(response);
  },

  async updateHotel(id, values) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: toFormData(values),
    });
    return handleResponse(response);
  },

  async deleteHotel(id, deleteImage = true) {
    const response = await fetch(
      `${BASE_URL}/${id}?deleteImage=${deleteImage}`,
      {
        method: "DELETE",
      },
    );
    return handleResponse(response);
  },
};
