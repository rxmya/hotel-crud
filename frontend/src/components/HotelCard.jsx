import { Link, useNavigate } from 'react-router-dom';
import { formatPrice, resolveImageUrl, truncate } from '../utils/format';
export default function HotelCard({ hotel, onDelete}) {
    const navigate = useNavigate();
    return (
        <article className = "hotel-card" onClick = {() => navigate(`/hotels/${hotel.id}`)}>
            <img className = "hotel-card-img" src = {resolveImageUrl(hotel.imageUrl)} alt = {hotel.title} loading = "lazy" />
            <div className = "hotel-card-body">
                <h2>{hotel.title}</h2>
                <p className = "muted">
                    {Number(hotel.latitude).toFixed(4)}, {Number(hotel.longitude).toFixed(4)}
                </p>
                <p>{truncate(hotel.description, 150)}</p>
            </div>
            <div className = "hotel-card-side">
                <p className = "price">
                    {formatPrice(hotel.price)} <span>/ night</span>
                </p>
                <div className = "card-actions" onClick = {(e) => e.stopPropagation()}>
                    <Link to = {`/hotel/${hotel.id}/edit`} className= "btn btn-primary"> Edit
                    </Link>
                    <button className = "btn btn-danger" onClick ={() => onDelete(hotel)}> Delete
                    </button>
                </div>
            </div>
        </article>
    );
}