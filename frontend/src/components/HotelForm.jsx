import { useState } from 'react';
import { validateHotel } from '../utils/ValidateHotel';
import { resolveImageUrl } from '../utils/format';
const emptyForm = { title: '', description: '', latitude: '', longitude: '', price: ''};
export default function HotelForm({ initialValues, onSubmit, submitting = false, submitLabel = 'Save' }) {
    const isEdit = Boolean(initialValues);
    const [values, setValues] = useState(
        isEdit ? {
            title: initialValues.title,
            description: initialValues.description,
            latitude: String(initialValues.latitude),
            longitude: String(initialValues.longitude),
            price: String(initialValues.price),
        }
        : emptyForm,
    );
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(isEdit ? resolveImageUrl(initialValues.imageUrl) : '');
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
        setErrors({ ...errors, [name]: ''});
    };
    const handleImageChange = (e) => {
        const file = e.target.fiels[0];
        if (!file) return;
        const imageError = validateHotel({ ...values, imageFile: file}).image;
        if (imageError){
            setErrors({ ...errors, image: imageError });
            return;
        }
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
        setErrors({ ...errors, image: ''});
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const formValues = { ...values, imageFile };
        const validationErrors = validateHotel(formValues, { isEdit, hasExistingImage: isEdit});
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0){
            onSubmit(formValues);
        }
    };
    return (
        <form className = "hotel-form" onSubmit = { handleSubmit} noValidate>
            <div className = "form-group">
                <label htmlFor = "image">Hotel image *</label>
                {preview ? (
                    <img src = {preview} alt = "Hotel preview" className = "image-preview" />
                ) : (
                    <div className = "image-placeholder"> No image selected </div>
                )}
                <input id = "image" type = "file" accept = "images/jpeg, images/png, image/webp" onChange = {handleImageChange} />
                <small className = "muted">
                    JPG, PNG or WEBP, max 2 MB { isEdit && ' (leave empty to keep the current image)'}
                </small>
                {errors.image && <p className = "error">{errors.image} </p>}
            </div>
            <div className = "form-group">
                <label htmlFor = "title"> Title *</label>
                <input id = "title" name = "title" value = { values.title} onChange = {handleChange} />
                {errors.title && <p className = "error"> {errors.title}</p>}
            </div>
            <div className ="form-group">
                <label htmlFor = "description"> Description *</label>
                <textarea id = "description" name = "description" rows = "5" value = {values.description} onChange = {handleChange} />
                {errors.description && <p className = "error"> {errors.descrption}</p>}
            </div>
            <div className = "form-row">
                <div className = "form-group">
                    <label htmlFor = "latitude">Latitude *</label>
                    <input id = "latitude" name = "latitude" type = "number" step = "any" value = {values.latitude} onChange = {handleChange} />
                    {errors.latitude && <p className = "error">{errors.latitude}</p>} 
                </div>
                <div className = "form-group">
                    <label htmlFor = "longitude">Longitude *</label>
                    <input id = "longitude" name = "longitude" type = "number" step = "any" value = {values.longitude} onChange = {handleChange} />
                    {errors.longitude && <p className = "error">{errors.longitude}</p>} 
                </div>                
            </div>
            <div className = "form-group">
                <label htmlFor = "price">Price per night *</label>
                <input id = "price" name = "price" type = "number" step = "0.01" value = {values.price} onChange = {handleChange} />
                {errors.price && <p className = "error">{errors.price}</p>}
            </div>
            <button type = "submit" className = "btn brn-primary" disabled = {submitting}>
                {submitting ? 'saving...' : submitLabel}
            </button>
        </form>
    );
}