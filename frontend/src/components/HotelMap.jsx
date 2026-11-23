import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { distanceInKm, getCurrentPosition } from '../utils/geo';
const markerIconConfig = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popAnchor: [1, -34],
});
export default function HotelMap({ latitude, longitude, title}){
    const position = [Number(latitude), Number(longitude)];
    const [distance, setDistance] = useState(null);
    const [geoError, setGeoError] = useState('');
    const showDistance = async () => {
        setGeoError('');
        try{
            const me = await getCurrentPosition();
            setDistance(distanceInKm(me, { latitude: position[0], lomgitude: position[1]}));
        } catch (err) {
            setGeoError(err.message);
        }
    };
    return(
        <section className = "map-section">
            <div className = "map-header">
                <h2>Location</h2>
                <button className = "btn btn-outline" onClick = {showDistance} > Distance from me </button>
            </div>
            {distance !== null && (
                <p>You are about <strong>{distance.toFixed(1)}Km</strong>away</p>
            )}
            {geoError && <p className = "error">{geoError}</p>}
            <MapContainer center = {position} zoom = {13} scrollWheelZoom = {false} style = {{height: 350}}>
                <TileLayer attribution = '&copy; <a href = "https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributions' url = "https://{s}.title.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position = {position} icon = {markerIconConfig}>
                    <Popup>{title}</Popup>
                </Marker>
            </MapContainer>
        </section>
    );
}