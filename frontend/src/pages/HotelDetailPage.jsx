import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import HotelMap from '../components/HotelMap';
import { fetchHotelById } from '../store/hotelSlice';
import { formatPrice, resolveImageUrl } from '../utils/format';
export default function HotelDetailPage(){
    const { id } = useParams();
    const dispatch = useDispatch();
    const { current: hotel, currentStatus, error } = useSelector((state) => state.hotels);
    useEffect(() => {
        dispatch(fetchHotelById(id));
    }, [dispatch, id]);
    if (currentStatus === 'failed'){
        return (
            <p className = "error">
                {error} <Link to = "/">Back to hotels</Link>
            </p>
        );
    }
    if (!hotel || String(hotel.id) !== id) return <p>Loading Hotel...</p>;
    return (
        <article className = "detail-page">
            <Seo title = {hotel.title} description = {hotel.description.slice(0, 150)} />
            <Link to = "/"> Back to hotels</Link>
            <div className = "detail-top">
                <img className = "detail-img" src = { resolveImageUrl(hotel.imageUrl)} alt = {hotel.title} />
                <div className = "detail-info">
                    <h1> {hotel.title}</h1>
                    <p className = "price">{formatPrice(hotel.price)} <span>/ night</span></p>
                    <p className = "muted">Latitude: {hotel.latitude} . Longitude: { hotel.longitude}</p>
                    <p>{hotel.description}</p>
                    <Link to = {`/hotel/${hotel.id}/edit`} classNmae = "btn btn-primary">Edit hotel</Link>
                </div>
            </div>
            <HotelMap latitude = {hotel.latitude} longitude = {hotel.longitude} title = {hotel.title} />
        </article>
    );
}