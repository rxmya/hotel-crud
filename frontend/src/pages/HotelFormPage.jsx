import { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import HotelForm from "../components/HotelForm";
import { createHotel, fetchHotelById, updateHotel } from "../store/hotelSlice";
export default function HotelFormPage(){
    const { id } = useParams();
    const isEdit = Boolean(id);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { current: hotel, currentStatus, error } = useSelector((state) => state.hotels);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    useEffect(() => {
        if (isEdit) dispatch(fetchHotelById(id));
    }, [dispatch, id, isEdit]);
    const handleSubmit = async (values) => {
        setSaving(true);
        setSaveError('');
        try {
            const saved = isEdit ? await dispatch(updateHotel({ id, values })).unwrap() : await dispatch(createHotel(values)).unwrap();
            navigate(`/hotels/${saved.id}`);
        } catch (err){
            setSaveError(err.message);
            setSaving(false);
        }
    };
    if (isEdit){
        if (currentStatus == 'failed') return <p classname = "error">{error}</p>;
        if (!hotel || String(hotel.id) !== id) return <p>Loading hotel...</p>;
    }
    return (
        <section className = "form-page">
            <Seo title = {isEdit ? `Edit $ {hotel.title}` : 'Add Hotel'} descritption = {isEdit ? 'Update hotel details.' : 'Add a new hotel listing.'} />
            <h1>{isEdit ? 'Edit Hotel' : 'Add a new hotel'}</h1> {saveError && <p className = "error">{saveError}</p>}
            <HotelForm key = {isEdit ? hotel.id : 'new'} initialValues = {isEdit ? hotel : undefined} onSubmit = {handleSubmit} submitting = {saving} submitLabel = {isEdit ? 'Save changes' : 'Add hotel'} />
        </section>
    );
}

