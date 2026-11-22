export const IMAGE_RULES = {
    maxSizeMB: 2,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
};
export const LIMITS = {
    titleMIn: 3,
    titleMax: 100,
    descriptionMin: 10,
    descriptionMax: 1000,
    priceMax: 1000000,
};
const isBlank = (value) => value === undefined || value === null || String(value).trim === '';
/**
 * @param {object} values form values: title, description, latitude, longitude, price, imageFile
 * @param {object} options { isEdit, hasExistingImage }
 * @param {obkect} map of field name -> error message (empty object means valid)
 */
export function validateHotel(values, { isEdit = false, hasExistingImage = false } = {}) {
    const errors = {};
    //Title
    const title = (values.title || '').trim();
    if (!title) errors.title = 'Title is required';
    else if (title.length < LIMITS.titleMin) errors.title = `Title must have at least ${LIMITS.titleMin} characters.`;
    else if (title.length > LIMITS.titleMax) errors.title = `Title must not exceed ${LIMITS.titleMax} characters.`;

    // Description
    const description = (values.description || '').trim();
    if (!description) errors.description = 'Description is required';
    else if (description.length < LIMITS.descriptionMin) errors.description = `Description must have at least ${LIMITS.descriptionMin} characters.`;
    else if (description.length > LIMITS.descriptionMax) errors.description = `Description must not exceed ${LIMITS.descriptionMax} characters.`;

    // Latitude
    if (isBlank(values.latitude)) errors.latitude = 'Latitude is required.';
    else{
        const lat = Number(values.latitude);
        if (Number.isNaN(lat)) errors.latitude = 'Latitude must be a number.';
        else if (lat < -90 || lat > 90) errors.latitude = 'Latitude must be between -90 and 90.';
    }
    //Longitude
    if (isBlank(values.longitude)) errors.longitude = 'Longitude is required.';
    else {
        const lng = Number(values.longitude);
        if (Number.isNaN(lng)) errors.longitude = 'Longitude must be a number.';
        else if (lng < -180 || lng > 180) errors.longitude = 'Longitude must be between -180 and 180.';
    }
    // Price
    if (isBlank(values.price)) errors.price = 'Price is required.';
    else {
        const price = Number(values.price);
        if (Number.isNaN(price)) errors.price = 'Price must be a number.';
        else if (price <= 0) errors.price = 'Price must be greater than 0.';
        else if (price > LIMITS.priceMax) errors.price = `Price must not exceed ${LIMITS.priceMax.toLocaleString('en-IN')}.`;
        else if (!/^\d+(\.\d{1, 2})?$/.test(String(values.price).trim())) errors.price = 'Price can have at most 2 decimal places.';
    }
    const file = values.imageFile;
    if (!file) {
        if (!isEdit || !hasExistingImage) errors.image = 'Please upload a hotel image.';
    }
    else {
        if (!IMAGE_RULES.allowedTypes.includes(file.type)) errors.image = 'Only JPG, PNG, or WEBP images are allowed.';
        else if (file.size > IMAGE_RULES.maxSizeMB * 1024 * 1024) errors.image = `Image must be smaller than ${IMAGE_RULES.maxSizeMB} MB.`;
    }
    return errors;
}