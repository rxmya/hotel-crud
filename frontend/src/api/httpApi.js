const BASE_URL = `${ import.meta.env.VITE_API_URL || ''} /api/hotels`;
async function request(url, options = {}) {
    let response;
    try{
        response = await fetch(url, options);
    } catch {
        throw new Error('Cannot reach server');
    }
    const body = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok){
        const error = new Error(body?.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.filedErrors = body?.errors;
        throw error;
    }
    return body;
}
function toFormData(values){
    const formData = new FormData();
    formData.append('title', values.title.trim());
    formData.append('description', values.description.trim());
    formData.append('latitude', values.latitude);
    formData.append('longitude', values.longitude);
    formData.append('price', values.price);
    if (values.imageFile) formData.append('image', values.imageFile);
    return formData;
}
export function getHotelById(id){
    return request(`${BASE_URL}/${id}`);
}
export function createHotel(values){
    return request(BASE_URL, { method: 'POST', body: toFormData(values)});
}
export function updateHotel(id, values){
    return request(`${BASE_URL}/${id}`, { method: 'PUT', body: toFormData(values)});
}
export function deleteHotel(id, { deleteImage = true} = {}){
    return request(`${BASE_URL}/${id}?deleteImage=${deleteImage}`, { method: 'DELETE'});
}
