function isNumberBetween(value, min, max){
    if (value === undefined || value === '') return false;
    const number = Number(value);
    return !Number.isNaN(number) && number >= min && number <= max;
}
export function validateHotel(bosy, { file, requireImage }){
    const errors = {};
    const title = (body.title || '').trim();
    if (title.length < 3 || title.length > 100){
        errors.title = 'Title must be between 3 and 100 characters.';
    }
    const description = (body.description || '').trim();
    if (description.length < 10 || description.length > 1000){
        errors.description = 'Description must be between 10 and 1000 characters.';
    }
    if (!isNumberBetween(body.latitude, -90, 90)){
        errors.latitude = 'Latitude must be between -90 and 90.';
    }
    if (!isNumberBetween(body.longitude, -180, 180)) {
      errors.longitude = "Longitude must be between -180 and 180.";
    }
    if (!isNumberBetween(body.price, 0.01, 1000000)) {
      errors.price = "Price must be between 0.01 and 1000000.";
    }
    if (requireImage && !file) {
      errors.image = "Hotel image is required.";
    }
    return errors;
}